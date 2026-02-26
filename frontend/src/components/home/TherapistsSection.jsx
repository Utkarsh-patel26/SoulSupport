'use client';

import { motion } from 'framer-motion';
import { Star, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const therapists = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    specialty: 'Clinical Psychologist',
    focus: ['Anxiety', 'Depression', 'Trauma'],
    rating: '4.9',
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    available: true,
  },
  {
    id: 2,
    name: 'Dr. James Chen',
    specialty: 'Licensed Therapist',
    focus: ['Relationships', 'Stress', 'Life Transitions'],
    rating: '5.0',
    reviews: 85,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400',
    available: true,
  },
  {
    id: 3,
    name: 'Dr. Emily Rose',
    specialty: 'Marriage & Family Therapist',
    focus: ['Couples', 'Family', 'Communication'],
    rating: '4.8',
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
    available: false,
  },
  {
    id: 4,
    name: 'Alex Rivera',
    specialty: 'Counselor',
    focus: ['Career', 'Burnout', 'Mindfulness'],
    rating: '4.9',
    reviews: 72,
    image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400&h=400',
    available: true,
  },
];

export default function TherapistsSection() {
  return (
    <section className="py-24 sm:py-32 bg-background relative transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary-soft rounded-full">
              Our Therapists
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Meet your <span className="text-sage">guides</span>
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              Compassionate, licensed professionals ready to support your journey to wellness.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            {/* Custom Navigation buttons could go here */}
            <button className="p-3 rounded-full border border-border hover:bg-surface hover:shadow-md transition-all text-text-muted">
              <ArrowRight className="rotate-180" size={20} />
            </button>
            <button className="p-3 rounded-full border border-border hover:bg-surface hover:shadow-md transition-all text-foreground">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 sm:pb-0 -mx-4 px-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:mx-0 sm:px-0 scrollbar-hide snap-x">
          {therapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-80 sm:w-auto snap-center mr-4 sm:mr-0 group relative bg-surface rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-border"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-surface-alt">
                <img 
                  src={therapist.image} 
                  alt={therapist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {therapist.available && (
                   <div className="absolute top-3 left-3 bg-sage/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                     <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Available Today
                   </div>
                )}
                {/* Checkmark badge mockup */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-soft-blue">
                   <Shield size={14} className="fill-current" />
                </div>
              </div>

              <div className="space-y-3 p-1">
                <div>
                   <h3 className="text-xl font-bold text-foreground">{therapist.name}</h3>
                   <p className="text-text-muted text-sm">{therapist.specialty}</p>
                </div>
                
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-700 text-sm font-medium">
                     <Star size={14} className="fill-current" /> {therapist.rating}
                   </div>
                   <span className="text-xs text-text-muted">({therapist.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {therapist.focus.map((tag, i) => (
                    <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-alt text-text-secondary border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
