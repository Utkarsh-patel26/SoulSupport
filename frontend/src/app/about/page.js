import Link from "next/link";

export const metadata = { title: "About - SoulSupport" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-charcoal">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-soft to-background pb-16 pt-20">
        <div className="absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              <span className="text-base">✨</span>
              <span>About SoulSupport</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Our mission is your <span className="text-primary">healing</span>
            </h1>
            <p className="text-lg text-gray-600">
              SoulSupport connects people with licensed therapists and a supportive community to make mental wellness
              accessible, confidential, and deeply human.
            </p>
          </div>
        </div>
      </section>

      {/* Stats + Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Why people trust us
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {[{ label: "Users Worldwide", value: "50K+" }, { label: "Sessions Completed", value: "3L+" }, { label: "Average Rating", value: "4.9★" }, { label: "Licensed Therapists", value: "100+" }].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Who we are</h3>
                <p className="mt-3 text-sm text-gray-600">
                  We are clinicians, technologists, and community builders committed to making quality mental healthcare
                  available to everyone. Every feature we ship is grounded in clinical best practices and empathy.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Our mission</h3>
                <p className="mt-3 text-sm text-gray-600">
                  We break down barriers to care with secure technology, flexible access, and a spectrum of resources—from
                  live sessions to self-help tools—so you can heal and grow at your pace.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[{ title: "Compassion first", description: "We meet every person with empathy, dignity, and respect." }, { title: "Evidence-based", description: "Therapy methods, content, and tools grounded in research." }, { title: "Secure by design", description: "Privacy, encryption, and confidentiality at every step." }].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F4E5F] to-[#2A6070]" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to start your journey?</h2>
          <p className="mt-3 text-white/80">Find a therapist or explore resources to take your next step.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/therapists"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse Therapists
            </Link>
            <Link
              href="/resources"
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
