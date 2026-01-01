"use client";

import Link from "next/link";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { AnimatedCard } from "@/components/common/AnimatedCard";
import { AnimatedSection } from "@/components/common/AnimatedSection";

const RESOURCES = [
  {
    icon: "📖",
    title: "Self-Help Guides",
    description: "Comprehensive guides on managing stress, anxiety, and more",
  },
  {
    icon: "🎧",
    title: "Wellness Podcasts",
    description: "Expert discussions on mental health and personal growth",
  },
  {
    icon: "🎬",
    title: "Video Library",
    description: "Educational videos on therapy techniques and mindfulness",
  },
  {
    icon: "🛠️",
    title: "Wellness Tools",
    description: "Interactive tools for mood tracking and meditation",
  },
  {
    icon: "📝",
    title: "Blog & Articles",
    description: "Expert insights and articles on mental wellness",
  },
  {
    icon: "🆘",
    title: "Crisis Support",
    description: "24/7 emergency resources and helpline information",
  },
];

const IMPROVEMENTS = [
  {
    emoji: "💕",
    title: "Relationships",
    description: "Improve communication and build stronger connections",
  },
  {
    emoji: "💪",
    title: "Confidence",
    description: "Build self-esteem and overcome self-doubt",
  },
  {
    emoji: "🧘",
    title: "Stress & Anxiety",
    description: "Learn coping strategies and manage mental health",
  },
];

const floatingTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ===== HERO SECTION ===== */}
      <motion.section 
        className="relative pt-20 pb-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800" />

        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-6 dark:bg-teal-900 dark:text-teal-100"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-lg">⭐</span>
                <span className="font-medium">#1 Trusted Therapy Platform</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Online Therapy Can Help You{" "}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Heal & Thrive
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Access professional counseling from the comfort of your home. Secure, confidential, and tailored to your needs.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full text-lg font-semibold">
                      Get Stronger Now
                    </Button>
                  </motion.div>
                </Link>
                <motion.button 
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    ▶
                  </div>
                  Watch How It Works
                </motion.button>
              </div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {[
                  { number: "3L+", label: "Sessions" },
                  { number: "100+", label: "Experts" },
                  { number: "4.9", label: "Rating" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                  >
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stat.number}</p>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              className="relative h-96 lg:h-full min-h-96"
              initial={{ opacity: 0, x: 50, y: 0 }}
              animate={{ opacity: 1, x: 0, y: [0, -20, 0] }}
              transition={{ duration: 0.8, delay: 0.3, ...floatingTransition }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-cyan-200 dark:from-teal-900 dark:to-cyan-900 rounded-3xl flex items-center justify-center overflow-hidden">
                <motion.div className="grid grid-cols-3 gap-4 p-8">
                  {[
                    { size: 'w-16 h-16', color: 'bg-teal-400', delay: 0 },
                    { size: 'w-12 h-12', color: 'bg-teal-300', delay: 0.2 },
                    { size: 'w-20 h-20', color: 'bg-teal-500', delay: 0.4 },
                    { size: 'w-12 h-12', color: 'bg-cyan-300', delay: 0.1 },
                    { size: 'w-24 h-24', color: 'bg-teal-400', delay: 0.3 },
                    { size: 'w-14 h-14', color: 'bg-cyan-400', delay: 0.5 },
                    { size: 'w-16 h-16', color: 'bg-teal-300', delay: 0.2 },
                    { size: 'w-10 h-10', color: 'bg-cyan-400', delay: 0.4 },
                    { size: 'w-12 h-12', color: 'bg-teal-500', delay: 0.3 },
                  ].map((shape, i) => (
                    <motion.div
                      key={i}
                      className={`${shape.size} rounded-lg ${shape.color} opacity-70`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, delay: shape.delay, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== ABOUT SECTION ===== */}
      <AnimatedSection
        className="py-20 bg-gray-50 dark:bg-gray-900"
        title="Why We're the Most Trusted"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: "50K+", label: "Users Worldwide" },
                { number: "3L+", label: "Sessions Completed" },
                { number: "4.9★", label: "Average Rating" },
                { number: "100+", label: "Licensed Therapists" },
              ].map((stat, i) => (
                <AnimatedCard key={i} delay={i * 0.1}>
                  <p className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">{stat.number}</p>
                  <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                </AnimatedCard>
              ))}
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Who We Are</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  SoulSupport is a leading digital mental health platform providing accessible, affordable, and high-quality therapy services. Our mission is to break down barriers to mental healthcare and empower individuals to achieve emotional wellness.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We believe everyone deserves access to professional mental health support. By combining technology with human expertise, we create a safe space where healing can happen, anytime, anywhere.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ===== RESOURCES SECTION ===== */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Mental Health Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Access tools and content to support your mental wellness journey
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {RESOURCES.map((resource, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div className="text-5xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== IMPROVEMENTS SECTION ===== */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Areas We Can Help With
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              From relationships to personal growth, we support your journey
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {IMPROVEMENTS.map((item, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <div className="text-6xl mb-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-900 dark:to-cyan-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Healing Journey?
          </motion.h2>
          <motion.p 
            className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Connect with a licensed therapist today and take the first step towards better mental health.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/register">
              <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

