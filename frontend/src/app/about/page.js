import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "About Us - SoulSupport" };

const STATS = [
  { label: "Community Members", value: "50K+" },
  { label: "Partner NGOs", value: "50+" },
  { label: "Licensed Therapists", value: "100+" },
  { label: "Sessions Hosted", value: "300K+" },
];

const TEAM = [
  { name: "Sarah Jenkins", role: "Clinical Director", init: "SJ" },
  { name: "Dr. Ahmed Khan", role: "Head of Counseling", init: "AK" },
  { name: "Maya Patel", role: "Community Lead", init: "MP" },
  { name: "Elena Rostova", role: "Partnership Ops", init: "ER" },
];

const TIMELINE = [
  { year: "2021", event: "SoulSupport community founded by a group of passionate volunteers." },
  { year: "2022", event: "Launched our first digital platform, serving 10,000 students globally." },
  { year: "2024", event: "Partnered with 50+ NGOs to provide free and subsidized therapy." },
  { year: "2026", event: "Reaching a milestone of 300,000+ sessions worldwide." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-charcoal">
      <main>
        {/* Mission / Hero */}
        <section className="relative overflow-hidden bg-primary-soft/30 py-24 sm:py-32">
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <h1 className="font-heading text-h2 font-bold tracking-tight sm:text-h1 mb-6 text-charcoal">
              We're building a world where mental healthcare is accessible to <span className="text-primary">everyone</span>.
            </h1>
            <p className="text-lg text-text-secondary">
              SoulSupport unites passionate volunteers, verified therapists, and dedicated NGOs to bridge the gap in digital mental wellness.
            </p>
          </div>
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-soft to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="py-20 sm:py-24 bg-surface border-y border-border/50 relative">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-heading text-h3 font-bold text-charcoal sm:text-h2">Our Impact</h2>
              <p className="mt-4 text-base text-text-muted">Metrics that highlight our commitment to creating sustainable, supportive ecosystems.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-6xl mx-auto">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-h2 font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 sm:py-24 bg-surface-alt/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="font-heading text-h3 font-bold text-charcoal sm:text-h2">Our Journey</h2>
            </div>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/20 before:to-transparent">
              {TIMELINE.map((item, idx) => (
                <div key={item.year} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary-soft shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary font-bold text-sm">
                    ✓
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface border border-border shadow-card transition-all duration-300 hover:shadow-lg">
                    <span className="font-heading font-bold text-primary mb-1 block">{item.year}</span>
                    <p className="text-text-secondary leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-20 sm:py-24 bg-surface">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-heading text-h3 font-bold text-charcoal sm:text-h2">Meet the Team</h2>
              <p className="mt-4 text-base text-text-muted">A coalition of mental health professionals and technology experts.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {TEAM.map((member) => (
                <div key={member.name} className="flex flex-col items-center p-6 bg-surface-alt/20 rounded-2xl border border-border/50 text-center transition hover:shadow-card">
                  <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
                    {member.init}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-charcoal">{member.name}</h3>
                  <p className="text-sm text-text-muted mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="py-24 bg-primary text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="container mx-auto px-4 relative z-10 max-w-3xl">
            <h2 className="font-heading text-h3 font-bold text-white sm:text-h2 mb-6">
              Partner with SoulSupport
            </h2>
            <p className="text-lg text-primary-100 mb-10 leading-relaxed">
              We actively collaborate with non-profits, student organizations, and independent therapists to expand the reach of our mental wellness network.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register?role=therapist" prefetch={true}>
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-surface-alt shadow-lg transition-transform hover:scale-105">
                  Join as a Therapist
                </Button>
              </Link>
              <Link href="/contact" prefetch={true}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white">
                  Contact Partnerships
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
