import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { requireUserFromRequest } from '@/lib/server-auth';
import { ChatMessageModel } from '@/lib/server-models/ChatMessage';
import { SessionModel } from '@/lib/server-models/Session';
import { UserModel } from '@/lib/server-models/User';

export const runtime = 'nodejs';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
const HISTORY_LIMIT = 15;
const THERAPIST_LIMIT = 12;
const OPENROUTER_TIMEOUT_MS = 25000;
const FALLBACK_MESSAGE =
  'I am having trouble reaching the AI service right now. I can still help with your appointments and therapists if you ask that directly, or you can try again in a moment.';

function toReadableDate(dateValue) {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function dedupeNames(names) {
  return [...new Set(names.filter(Boolean).map((name) => String(name).trim()))];
}

function summarizeSessions(sessions, therapistNameMap, limit = 8) {
  return sessions.slice(0, limit).map((s) => {
    const therapistName = s?.therapist?.name || therapistNameMap.get(String(s.therapistId)) || 'Therapist';
    return `- ${toReadableDate(s.sessionDate)} with ${therapistName} (${s.status})`;
  });
}

function summarizeHistory(history) {
  return history.map((m) => {
    const speaker = m.role === 'assistant' ? 'Assistant' : 'User';
    const clipped = String(m.message || '').replace(/\s+/g, ' ').trim().slice(0, 220);
    return `- ${speaker}: ${clipped}`;
  });
}

function detectIntent(userMessage) {
  const normalized = userMessage.toLowerCase();

  if (/who are (the )?therapists|list (all )?therapists|available therapists|show therapists/.test(normalized)) {
    return 'THERAPIST_LIST';
  }

  if (
    /show my appointments|show my upcoming appointments|list my appointments|upcoming appointments|upcoming sessions|my sessions/.test(
      normalized
    )
  ) {
    return 'APPOINTMENTS';
  }

  if (/who is my therapist tomorrow|therapist tomorrow|session tomorrow/.test(normalized)) {
    return 'THERAPIST_TOMORROW';
  }

  if (/what is my name|what's my name|who am i/.test(normalized)) {
    return 'WHO_AM_I';
  }

  return null;
}

function buildIntentReply(intent, context) {
  if (!intent) return null;

  if (intent === 'WHO_AM_I') {
    return `Your name is ${context.userName}. Your account email is ${context.userEmail}.`;
  }

  if (intent === 'THERAPIST_LIST') {
    if (!context.therapists.length) {
      return 'I could not find therapists available right now. Please check the Therapists page in your dashboard.';
    }

    const list = context.therapists.slice(0, THERAPIST_LIMIT).map((therapist, idx) => {
      const title = therapist.specializations?.length
        ? `${therapist.fullName} - ${therapist.specializations.slice(0, 2).join(', ')}`
        : therapist.fullName;
      return `${idx + 1}. ${title}`;
    });

    return [
      'Here are the therapists currently available on the platform:',
      ...list,
      '',
      'You can open the Therapists page to view full profiles and book a session.',
    ].join('\n');
  }

  if (intent === 'APPOINTMENTS') {
    if (!context.upcomingSessions.length) {
      return 'You currently have no upcoming appointments. You can book one from Dashboard > Therapists.';
    }

    const lines = context.upcomingSessions.slice(0, 8).map((s, idx) => {
      const therapistName =
        s?.therapist?.name || context.therapistNameMap.get(String(s.therapistId)) || 'Therapist';
      return `${idx + 1}. ${toReadableDate(s.sessionDate)} with ${therapistName} (${s.status})`;
    });

    return ['Your upcoming appointments:', ...lines].join('\n');
  }

  if (intent === 'THERAPIST_TOMORROW') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toDateString();
    const tomorrowSessions = context.upcomingSessions.filter(
      (s) => new Date(s.sessionDate).toDateString() === tomorrowDate
    );

    if (!tomorrowSessions.length) {
      return 'You do not have a session scheduled for tomorrow.';
    }

    const therapistNames = dedupeNames(
      tomorrowSessions.map(
        (s) => s?.therapist?.name || context.therapistNameMap.get(String(s.therapistId)) || 'Therapist'
      )
    );

    return `Your therapist${therapistNames.length > 1 ? 's' : ''} tomorrow: ${therapistNames.join(', ')}.`;
  }

  return null;
}

async function buildUserContext(user) {
  const now = new Date();

  const [upcomingSessions, cancelledSessions, recentHistory, therapists] = await Promise.all([
    SessionModel.find({
      userId: user._id,
      status: { $in: ['pending', 'confirmed'] },
      sessionDate: { $gte: now },
    })
      .sort({ sessionDate: 1 })
      .limit(8)
      .lean(),
    SessionModel.find({
      userId: user._id,
      status: { $in: ['cancelled_by_user', 'cancelled_by_therapist', 'expired'] },
    })
      .sort({ sessionDate: -1 })
      .limit(8)
      .lean(),
    ChatMessageModel.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(HISTORY_LIMIT)
      .lean(),
    UserModel.find({ userType: 'therapist', isActive: true })
      .select('fullName email bio')
      .sort({ fullName: 1 })
      .limit(THERAPIST_LIMIT)
      .lean(),
  ]);

  const therapistIds = [
    ...new Set([...upcomingSessions, ...cancelledSessions].map((s) => String(s.therapistId))),
  ];

  const therapistUsers = therapistIds.length
    ? await UserModel.find({ _id: { $in: therapistIds } })
        .select('fullName bio')
        .lean()
    : [];

  const therapistNameMap = new Map(therapistUsers.map((t) => [String(t._id), t.fullName]));
  const therapistDirectory = therapists.map((t) => ({
    fullName: t.fullName,
    email: t.email,
    specializations: [],
    bio: t.bio || '',
  }));

  const upcomingSummary = summarizeSessions(upcomingSessions, therapistNameMap);
  const cancelledSummary = summarizeSessions(cancelledSessions, therapistNameMap);

  const therapistSummary = therapistDirectory.map((t) => {
    const tags = t.specializations?.length ? ` (${t.specializations.slice(0, 2).join(', ')})` : '';
    return `- ${t.fullName}${tags}`;
  });

  const historySummary = summarizeHistory(recentHistory.slice().reverse());

  const platformCapabilities = [
    'Browse therapists and view profiles',
    'Book, reschedule, and cancel appointments',
    'View upcoming and cancelled sessions',
    'Participate in community forum and resources',
    'Manage profile and account settings',
  ];

  return {
    userName: user.fullName,
    userEmail: user.email,
    upcomingSessions,
    cancelledSessions,
    chatHistory: recentHistory.slice().reverse(),
    therapists: therapistDirectory,
    therapistNameMap,
    platformCapabilities,
    text: [
      `User profile: ${user.fullName} (${user.email}), role: ${user.userType}.`,
      `User name: ${user.fullName}`,
      `User email: ${user.email}`,
      `Upcoming sessions (${upcomingSessions.length}):`,
      ...(upcomingSummary.length ? upcomingSummary : ['- none']),
      `Cancelled/expired sessions (${cancelledSessions.length}):`,
      ...(cancelledSummary.length ? cancelledSummary : ['- none']),
      `Therapists on platform (${therapistSummary.length}):`,
      ...(therapistSummary.length ? therapistSummary : ['- none']),
      `Recent chat history (${recentHistory.length}):`,
      ...(historySummary.length ? historySummary : ['- none']),
      'Platform capabilities:',
      ...platformCapabilities.map((capability) => `- ${capability}`),
      'Do not provide medical diagnosis, prescriptions, or emergency crisis instructions beyond recommending professional/emergency support when needed.',
    ].join('\n'),
  };
}

function buildSystemMessage(contextText) {
  return [
    'You are SoulSupport AI, a personalized assistant for this mental health support platform.',
    'Help users with emotional wellbeing, therapy related questions, and platform usage.',
    'Be supportive, empathetic, clear, and practical.',
    'Always personalize the response using the provided user profile and platform data.',
    'When listing appointments or therapists, format with short headings and numbered bullets.',
    'Do not give medical diagnoses, medication instructions, or claims of being a licensed clinician.',
    'If user describes immediate danger or self-harm intent, advise contacting emergency services or local crisis hotline immediately.',
    'When asked about appointments, cancellations, therapist schedule, or account activity, rely only on the provided user context.',
    'If details are missing, say what is missing and suggest the exact dashboard path to check.',
    '',
    'User Context:',
    contextText,
  ].join('\n');
}

function maybeHandleSmartIntent(userMessage, context) {
  const normalized = userMessage.toLowerCase();

  if (/how do i cancel my session|cancel my session|cancel appointment/.test(normalized)) {
    return 'To cancel a session: open Dashboard > Sessions, find the booking, click cancel, and add a reason if prompted. If cancellation is blocked near start time, contact support through Resources or your therapist in advance.';
  }

  if (/stress relief tips|anxiety tips|calm down/.test(normalized)) {
    return [
      'Here are quick stress-relief steps you can use right now:',
      '1. Breathe slowly: inhale 4 sec, hold 4 sec, exhale 6 sec for 2 minutes.',
      '2. Grounding: name 5 things you see, 4 feel, 3 hear, 2 smell, 1 taste.',
      '3. Body reset: unclench jaw, drop shoulders, stretch neck for 60 seconds.',
      '4. Reduce overload: pick one small next task and do only that for 10 minutes.',
      '5. If this feels persistent, schedule a therapist session from your dashboard for personalized support.',
    ].join('\n');
  }

  return null;
}

async function saveMessage(userId, role, message) {
  if (!message?.trim()) return;
  await ChatMessageModel.create({
    userId,
    role,
    message: message.trim(),
    timestamp: new Date(),
  });
}

export async function GET(request) {
  const auth = await requireUserFromRequest(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (auth.user.userType !== 'user') {
    return NextResponse.json({ error: 'Chatbot is only available for user dashboard accounts' }, { status: 403 });
  }

  await connectToDatabase();

  const messages = await ChatMessageModel.find({ userId: auth.user._id })
    .sort({ timestamp: -1 })
    .limit(HISTORY_LIMIT)
    .lean();

  return NextResponse.json({
    messages: messages.reverse().map((m) => ({
      id: String(m._id),
      role: m.role,
      message: m.message,
      timestamp: m.timestamp,
    })),
  });
}

export async function POST(request) {
  const auth = await requireUserFromRequest(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (auth.user.userType !== 'user') {
    return NextResponse.json({ error: 'Chatbot is only available for user dashboard accounts' }, { status: 403 });
  }

  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterApiKey) {
    return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY on server' }, { status: 500 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const userMessage = String(payload?.message || '').trim();
  if (!userMessage) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  if (userMessage.length > 2000) {
    return NextResponse.json({ error: 'Message is too long (max 2000 characters)' }, { status: 400 });
  }

  await connectToDatabase();

  const recentHistory = await ChatMessageModel.find({ userId: auth.user._id })
    .sort({ timestamp: -1 })
    .limit(HISTORY_LIMIT)
    .lean();

  await saveMessage(auth.user._id, 'user', userMessage);

  const context = await buildUserContext(auth.user);
  const intent = detectIntent(userMessage);
  const intentReply = buildIntentReply(intent, context);

  if (intentReply) {
    await saveMessage(auth.user._id, 'assistant', intentReply);
    return NextResponse.json({
      message: intentReply,
      streamed: false,
      source: 'intent-db',
    });
  }

  const smartReply = maybeHandleSmartIntent(userMessage, context);

  if (smartReply) {
    await saveMessage(auth.user._id, 'assistant', smartReply);
    return NextResponse.json({
      message: smartReply,
      streamed: false,
      source: 'smart-intent',
    });
  }

  const llmMessages = [
    { role: 'system', content: buildSystemMessage(context.text) },
    ...recentHistory
      .reverse()
      .map((m) => ({ role: m.role, content: m.message }))
      .filter((m) => m.content),
    { role: 'user', content: userMessage },
  ];

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), OPENROUTER_TIMEOUT_MS);

  let openRouterResponse;
  try {
    openRouterResponse = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'SoulSupport Dashboard Assistant',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: llmMessages,
        stream: true,
        temperature: 0.5,
        max_tokens: 700,
      }),
      signal: abortController.signal,
    });
  } catch {
    await saveMessage(auth.user._id, 'assistant', FALLBACK_MESSAGE);
    return NextResponse.json({ message: FALLBACK_MESSAGE, streamed: false, source: 'fallback' });
  } finally {
    clearTimeout(timeout);
  }

  if (!openRouterResponse.ok || !openRouterResponse.body) {
    const errorBody = await openRouterResponse.text().catch(() => '');
    await saveMessage(auth.user._id, 'assistant', FALLBACK_MESSAGE);
    return NextResponse.json({
      message: FALLBACK_MESSAGE,
      streamed: false,
      source: 'fallback',
      details: errorBody || openRouterResponse.statusText,
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = openRouterResponse.body.getReader();

  let assistantText = '';
  let buffer = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let providerDone = false;
        while (true) {
          if (providerDone) break;
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) {
              continue;
            }

            const data = trimmed.slice(5).trim();
            if (!data) {
              continue;
            }

            if (data === '[DONE]') {
              providerDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const token = parsed?.choices?.[0]?.delta?.content || '';
              if (token) {
                assistantText += token;
                controller.enqueue(encoder.encode(token));
              }
            } catch {
              // Skip malformed provider chunks and continue stream.
            }
          }
        }

        // Flush any remaining bytes from the decoder.
        buffer += decoder.decode();
        if (buffer.includes('data:')) {
          const trailingLine = buffer.trim();
          const trailingData = trailingLine.startsWith('data:') ? trailingLine.slice(5).trim() : '';
          if (trailingData && trailingData !== '[DONE]') {
            try {
              const parsed = JSON.parse(trailingData);
              const token = parsed?.choices?.[0]?.delta?.content || '';
              if (token) {
                assistantText += token;
                controller.enqueue(encoder.encode(token));
              }
            } catch {
              // Ignore trailing malformed JSON.
            }
          }
        }

        const finalMessage = assistantText.trim() || FALLBACK_MESSAGE;
        await saveMessage(auth.user._id, 'assistant', finalMessage);

        // If provider returned no tokens, send fallback token stream so UI does not look stuck.
        if (!assistantText.trim()) {
          controller.enqueue(encoder.encode(FALLBACK_MESSAGE));
        }

        controller.close();
      } catch (error) {
        if (!assistantText.trim()) {
          try {
            controller.enqueue(encoder.encode(FALLBACK_MESSAGE));
          } catch {
            // no-op
          }
        }
        await saveMessage(auth.user._id, 'assistant', assistantText.trim() || FALLBACK_MESSAGE);
        controller.close();
      } finally {
        try {
          await reader.cancel();
        } catch {
          // no-op
        }
      }
    },
    async cancel() {
      try {
        await reader.cancel();
      } catch {
        // no-op
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
