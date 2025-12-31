"use client";

const FEATURED_RESOURCES = [
  {
    icon: "🛠️",
    title: "Self-Help Tools",
    description: "Worksheets and exercises for thought tracking, sleep hygiene, and study stress.",
    links: [
      { label: "CCI Self-Help", href: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself" },
      { label: "Get Self Help (CBT)", href: "https://www.getselfhelp.co.uk/" },
    ],
  },
  {
    icon: "📞",
    title: "Crisis & Support",
    description: "If you or someone else is in danger or experiencing a crisis, get help right now.",
    links: [
      { label: "988 Lifeline", href: "https://988lifeline.org/" },
      { label: "Crisis Text Line", href: "https://www.crisistextline.org/" },
    ],
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "Campus & Community",
    description: "Connect with peers and schedule time with a professional when you're ready.",
    links: [
      { label: "Learn More", href: "/about" },
      { label: "Community Forum", href: "/forum" },
    ],
  },
];

const WELLNESS_ARTICLES = [
  {
    icon: "🧠",
    title: "NIMH — Stress: Coping With Everyday Problems",
    description: "National Institute of Mental Health on recognizing and managing stress.",
    href: "https://www.nimh.nih.gov/health/publications/stress",
  },
  {
    icon: "📚",
    title: "APA — Topics: Stress",
    description: "American Psychological Association resources on stress and coping.",
    href: "https://www.apa.org/topics/stress",
  },
  {
    icon: "❤️",
    title: "NHS — Tips to Reduce Stress",
    description: "Practical, evidence-based tips from the UK National Health Service.",
    href: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/tips-to-reduce-stress/",
  },
  {
    icon: "🏥",
    title: "CDC — Learn About Mental Health",
    description: "Core concepts and links to further resources from the CDC.",
    href: "https://www.cdc.gov/mentalhealth/learn/index.htm",
  },
  {
    icon: "🛏️",
    title: "Sleep Foundation — Sleep Hygiene",
    description: "How better sleep supports mental wellbeing and performance.",
    href: "https://www.sleepfoundation.org/sleep-hygiene",
  },
];

const MEDITATIONS = [
  {
    title: "Peaceful Meditation — Spotify",
    description: "Gentle ambient tracks for calm and focus.",
    embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZqd5JICZI0u?utm_source=generator",
    link: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
  },
  {
    title: "Ambient Relaxation — Spotify",
    description: "Relax and unwind with chill, ambient music.",
    embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source=generator",
    link: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY",
  },
  {
    title: "Nature Sounds — Spotify",
    description: "Sounds of birds, rain, and forest ambience.",
    embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8?utm_source=generator",
    link: "https://open.spotify.com/playlist/37i9dQZF1DX4PP3DA4J0N8",
  },
];

const VIDEOS = [
  {
    title: "5-Minute Meditation You Can Do Anywhere",
    description: "Quick breathing and presence practice to reduce stress.",
    embed: "https://www.youtube.com/embed/inpok4MKVLM",
    link: "https://www.youtube.com/watch?v=inpok4MKVLM",
  },
  {
    title: "Headspace | Mini Meditation: Breathe",
    description: "Guided mini-meditation to help pause and reset.",
    embed: "https://www.youtube.com/embed/YFSc7Ck0Ao0",
    link: "https://www.youtube.com/watch?v=YFSc7Ck0Ao0",
  },
  {
    title: "UCLA Mindful — 5-Minute Guided Meditation",
    description: "A brief, evidence-based mindfulness practice.",
    embed: "https://www.youtube.com/embed/ZToicYcHIOU",
    link: "https://www.youtube.com/watch?v=ZToicYcHIOU",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 pb-16 pt-20 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm dark:bg-teal-900 dark:text-teal-100">
              <span className="text-base">📚</span>
              <span>Resource Hub</span>
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl dark:text-white">
              Mental Health <span className="text-teal-600 dark:text-teal-400">Resources &amp; Tools</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Trusted, curated content to support your mental wellbeing journey. From self-help tools to crisis support.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Explore Curated Collections</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-400">Click any card to open the resource in a new tab</p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal-500" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_RESOURCES.map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-2xl text-teal-700 dark:bg-teal-900 dark:text-teal-200">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <div className="mt-4 space-y-2">
                  {item.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
                    >
                      {link.label} <span className="ml-1">→</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Articles */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Wellness Articles</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
              Trusted reading to deepen your understanding and toolkit
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal-500" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WELLNESS_ARTICLES.map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-2xl text-teal-700 dark:bg-teal-900 dark:text-teal-200">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
                >
                  Read Article <span className="ml-1">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guided Meditation Audios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Guided Meditation Audios</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
              Press play to start a session. Curated playlists from Spotify.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal-500" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {MEDITATIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <div className="mt-4 overflow-hidden rounded-xl">
                  <iframe
                    src={item.embed}
                    width="100%"
                    height="320"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="w-full border-0"
                    title={item.title}
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  If the player doesn't load, <a className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300" href={item.link} target="_blank" rel="noreferrer">open on Spotify</a>.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stress Management Videos */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Stress Management Videos</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
              Short, effective practices you can try right now
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-teal-500" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {VIDEOS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                <div className="mt-4 overflow-hidden rounded-xl">
                  <iframe
                    src={item.embed}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="aspect-video w-full border-0"
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  If the video doesn't load, <a className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-300" href={item.link} target="_blank" rel="noreferrer">watch on YouTube</a>.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
