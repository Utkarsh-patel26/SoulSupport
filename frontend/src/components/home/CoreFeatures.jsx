'use client';

import { motion } from 'framer-motion';
import { Video, MessageSquare, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Video Sessions',
    description: 'Connect face-to-face with your therapist from anywhere. HD video calls that feel as natural as being in the same room.',
    bullets: ['HIPAA Compliant', 'Quick Response', 'Personalized Care'],
    cta: 'Learn more about sessions',
    icon: Video,
    imagePos: 'right',
    gradient: 'from-lavender-50 to-soft-blue-50',
    iconColor: 'text-lavender',
    bgIcon: 'bg-lavender-100',
  },
  {
    title: '24/7 Messaging',
    description: 'Reach out whenever you need support. Your therapist responds thoughtfully, helping you process thoughts between sessions.',
    bullets: ['Unlimited Messaging', 'Voice Notes', 'Secure Encryption'],
    cta: 'See how messaging works',
    icon: MessageSquare,
    imagePos: 'left',
    gradient: 'from-soft-blue-50 to-primary-50',
    iconColor: 'text-soft-blue',
    bgIcon: 'bg-soft-blue-100',
  },
  {
    title: 'Flexible Scheduling',
    description: 'Book sessions that fit your life. Early mornings, late nights, weekends – therapy on your terms.',
    bullets: ['Easy Rescheduling', 'Calendar Sync', 'Reminders'],
    cta: 'Check availability',
    icon: Calendar,
    imagePos: 'right',
    gradient: 'from-sage-50 to-primary-50',
    iconColor: 'text-sage',
    bgIcon: 'bg-sage-100',
  },
];

export default function CoreFeatures() {
  return (
    <section className="py-24 sm:py-32 bg-surface transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl space-y-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
           <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary-soft rounded-full">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Therapy that <span className="text-soft-blue">fits you</span>
          </h2>
          <p className="mt-6 text-lg text-text-muted">
            Modern tools and flexible options designed to make your mental health journey as seamless and effective as possible.
          </p>
        </div>

        {features.map((feature, index) => (
          <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${feature.imagePos === 'left' ? 'lg:flex-row-reverse' : ''}`}>
            
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: feature.imagePos === 'left' ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-8"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bgIcon} flex items-center justify-center ${feature.iconColor}`}>
                <feature.icon size={28} />
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-lg text-text-secondary leading-relaxed">
                {feature.description}
              </p>

              <ul className="space-y-4">
                {feature.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-text-muted font-medium">
                    <CheckCircle2 size={20} className="text-primary-500 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <Link 
                href="#"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold hover:gap-3 transition-all duration-300"
              >
                {feature.cta} <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* Illustration / Mockup Card */}
            <motion.div 
              initial={{ opacity: 0, x: feature.imagePos === 'left' ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full"
            >
              <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br ${feature.gradient} p-8 flex items-center justify-center group shadow-soft border border-border`}>
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Abstract UI Representation */}
                <div className="relative w-full max-w-sm bg-surface rounded-2xl shadow-xl p-6 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1 border border-border/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-surface-alt animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-2 w-1/3 bg-surface-alt rounded-full" />
                      <div className="h-2 w-1/2 bg-surface-alt rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-16 w-full bg-surface-alt rounded-xl" />
                    <div className="h-16 w-full bg-surface-alt rounded-xl opacity-75" />
                    <div className="h-16 w-full bg-surface-alt rounded-xl opacity-50" />
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-surface rounded-xl shadow-lg border border-border flex items-center justify-center">
                    <feature.icon size={24} className={feature.iconColor} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
