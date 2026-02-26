'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, Heart, TrendingUp } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Talk',
    description: 'Share your thoughts and feelings in a safe, judgment-free space. Open up at your own pace.',
    icon: MessageCircle,
    color: 'bg-soft-blue-100 text-soft-blue',
    bg: 'bg-soft-blue-50/50',
    borderColor: 'hover:border-soft-blue/30'
  },
  {
    id: 2,
    title: 'Match',
    description: 'We connect you with a therapist who truly understands your unique journey and needs.',
    icon: Users,
    color: 'bg-primary-soft text-primary',
    bg: 'bg-primary-50/50',
    borderColor: 'hover:border-primary/30'
  },
  {
    id: 3,
    title: 'Heal',
    description: 'Work through challenges together with proven techniques tailored to your goals.',
    icon: Heart,
    color: 'bg-lavender-100 text-lavender',
    bg: 'bg-lavender-50/50',
    borderColor: 'hover:border-lavender/30'
  },
  {
    id: 4,
    title: 'Grow',
    description: 'Build resilience and discover a stronger, more balanced version of yourself.',
    icon: TrendingUp,
    color: 'bg-sage-100 text-sage',
    bg: 'bg-sage-50/50',
    borderColor: 'hover:border-sage/30'
  },
];

export default function PathToWellness() {
  return (
    <section className="py-24 sm:py-32 bg-background relative transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary-soft rounded-full"
          >
            How It Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Your path to <span className="text-sage">wellness</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-text-muted"
          >
            A simple, supportive journey designed around your needs. Every step brings you closer to peace of mind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group p-8 sm:p-10 rounded-2xl bg-surface border border-border ${step.borderColor} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon size={24} />
                  </div>
                </div>
                <div className="flex-grow pt-1">
                 <span className="text-xs font-bold text-text-muted mb-2 block">{step.id}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
