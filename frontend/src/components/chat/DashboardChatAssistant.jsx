"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { chatService } from '@/services/chatService';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function formatTime(value) {
  return new Date(value || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const USER_PROMPTS = [
  'Show my upcoming appointments',
  'Who is my therapist tomorrow?',
  'How do I cancel my session?',
  'Give me stress relief tips',
];

const THERAPIST_PROMPTS = [
  'How do I manage my schedule?',
  'Tips for client engagement',
  'Show my pending session requests',
  'Self-care strategies for therapists',
];

export function DashboardChatAssistant() {
  const { user, isTherapist } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const canUseChat = !!user;

  const welcome = useMemo(
    () => ({
      id: 'welcome',
      role: 'assistant',
      message:
        'Hi! I am your SoulSupport assistant. I can help with emotional wellbeing tips and dashboard tasks like appointments, therapists, and cancellations.',
      timestamp: new Date().toISOString(),
    }),
    []
  );

  useEffect(() => {
    if (!canUseChat) {
      setLoadingHistory(false);
      return;
    }

    let mounted = true;

    const load = async () => {
      setLoadingHistory(true);
      setError('');
      try {
        const data = await chatService.getHistory();
        if (!mounted) return;
        const serverMessages = Array.isArray(data?.messages) ? data.messages : [];
        setMessages(serverMessages.length ? serverMessages : [welcome]);
      } catch (err) {
        if (!mounted) return;
        setMessages([welcome]);
        setError(String(err?.message || err || 'Failed to load history'));
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [canUseChat, welcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const sendMessage = async (rawMessage) => {
    const text = String(rawMessage || input).trim();
    if (!text || sending || !canUseChat) {
      return;
    }

    setSending(true);
    setError('');

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      message: text,
      timestamp: new Date().toISOString(),
    };

    const assistantTempId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantTempId,
        role: 'assistant',
        message: '',
        timestamp: new Date().toISOString(),
        typing: true,
      },
    ]);

    setInput('');

    try {
      const finalText = await chatService.sendMessage(text, (tokenChunk, completeChunk) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== assistantTempId) return m;
            const nextMessage = completeChunk ? tokenChunk : `${m.message}${tokenChunk}`;
            return {
              ...m,
              message: nextMessage,
              typing: false,
              timestamp: new Date().toISOString(),
            };
          })
        );
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantTempId
            ? {
                ...m,
                message: finalText || m.message || 'I could not generate a response right now.',
                typing: false,
                timestamp: new Date().toISOString(),
              }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantTempId
            ? {
                ...m,
                message:
                  'Sorry, I ran into an issue while responding. Please try again in a moment.',
                typing: false,
              }
            : m
        )
      );
      setError(String(err?.message || err || 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  if (!canUseChat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Please log in to use the assistant.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>AI Wellness and Support Assistant</CardTitle>
        <CardDescription>
          Personalized help for wellbeing and dashboard tasks. Your chat is private to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[calc(100vh-16rem)] min-h-[420px] max-h-[760px] flex-col overflow-hidden rounded-xl border border-border bg-surface sm:h-[70vh] sm:min-h-[480px]">
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
            {loadingHistory ? (
              <p className="text-sm text-text-muted">Loading your chat history...</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[78%] ${
                      m.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-charcoal border border-border/80'
                    }`}
                  >
                    {m.typing && !m.message ? (
                      <span className="inline-flex items-center gap-1 text-text-muted">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:240ms]" />
                      </span>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                    )}
                    <p
                      className={`mt-1 text-[11px] ${
                        m.role === 'user' ? 'text-white/80' : 'text-text-muted'
                      }`}
                    >
                      {formatTime(m.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {(isTherapist ? THERAPIST_PROMPTS : USER_PROMPTS).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={sending}
                  className="max-w-full rounded-full border border-border bg-surface-alt px-3 py-1.5 text-left text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-charcoal disabled:opacity-60"
                >
                  <span className="line-clamp-2 break-words">{prompt}</span>
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex flex-col gap-2 sm:flex-row sm:items-end"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="Ask about your sessions, therapists, stress support, or how to use the platform..."
                className="min-h-[48px] flex-1 resize-none rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition-colors focus:border-primary"
                disabled={sending}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={sending || !input.trim()}>
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </form>

            {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
