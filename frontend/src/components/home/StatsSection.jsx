'use client';

import { motion } from 'framer-motion';

const stats = [
  { label: 'Users Transformed', value: '50K+', color: 'text-indigo-600' },
  { label: 'Licensed Therapists', value: '500+', color: 'text-purple-600' },
  { label: 'Sessions Completed', value: '1M+', color: 'text-teal-600' },
  { label: 'Client Satisfaction', value: '98%', color: 'text-orange-600' },
];

export default function StatsSection() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-surface border border-border hover:-translate-y-2 transition-all duration-300 shadow-soft cursor-default group"
            >
              <h3 className={`text-4xl sm:text-5xl font-bold mb-2 tracking-tight ${stat.color}`}>
                {stat.value}
              </h3>
              <p className="text-sm sm:text-base font-medium text-text-muted uppercase tracking-wider group-hover:text-foreground transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
