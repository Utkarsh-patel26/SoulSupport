'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    content: "Soul Support changed my life. I was hesitant at first, but my therapist made me feel heard.",
    author: "Sarah M.",
    role: "Anxiety & Stress",
    rating: 5,
    initial: "S",
    color: "bg-soft-blue-100 text-soft-blue"
  },
  {
    content: "The matching process found me the perfect therapist on the first try. Truly understood what I needed.",
    author: "Alex P.",
    role: "Self Discovery",
    rating: 5,
    initial: "A",
    color: "bg-lavender-100 text-lavender"
  },
  {
    content: "Flexible scheduling is a game changer. I can fit sessions in during my lunch breaks or evenings.",
    author: "James L.",
    role: "Career Counseling",
    rating: 4,
    initial: "J",
    color: "bg-sage-100 text-sage"
  },
  {
    content: "I've tried other platforms, but the quality of care here is unmatched. Practical tools I use everyday.",
    author: "Emily R.",
    role: "Relationship Issues",
    rating: 5,
    initial: "E",
    color: "bg-coral-100 text-coral"
  },
  {
    content: "Finally, therapy that feels modern and accessible. The video quality is great and the app is simple.",
    author: "Michael T.",
    role: "Depression",
    rating: 5,
    initial: "M",
    color: "bg-primary-soft text-primary"
  },
  {
    content: "Dr. Chen helped me navigate one of the hardest times in my life with compassion. Forever grateful.",
    author: "Emma K.",
    role: "Life Transitions",
    rating: 5,
    initial: "E",
    color: "bg-soft-blue-100 text-soft-blue"
  },
  {
    content: "The video sessions feel so personal. I was worried it would feel distant, but it's great.",
    author: "David W.",
    role: "Social Anxiety",
    rating: 5,
    initial: "D",
    color: "bg-lavender-100 text-lavender"
  },
  {
    content: "I love the journaling feature. It helps me prepare for my sessions effectively.",
    author: "Sophie L.",
    role: "Mindfulness",
    rating: 4,
    initial: "S",
    color: "bg-sage-100 text-sage"
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="w-[350px] flex-shrink-0 p-6 mx-4 rounded-3xl bg-surface border border-border shadow-soft hover:shadow-lg transition-all duration-300 group">
    <Quote size={24} className="text-text-muted mb-4 group-hover:text-lavender transition-colors opacity-70" />
    
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={14} 
          className={`${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-text-muted/20 text-text-muted/20'}`} 
        />
      ))}
    </div>

    <p className="text-foreground/80 text-base leading-relaxed mb-4 font-medium line-clamp-3">
      "{testimonial.content}"
    </p>

    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-sm ring-2 ring-background`}>
        {testimonial.initial}
      </div>
      <div>
        <div className="font-bold text-foreground text-sm">{testimonial.author}</div>
        <div className="text-xs text-text-muted font-medium uppercase tracking-wide">{testimonial.role}</div>
      </div>
    </div>
  </div>
);

const MarqueeRow = ({ items, direction = 'left', speed = 50 }) => {
  return (
    <div className="flex overflow-hidden py-4 group relative">
      <motion.div
        initial={{ x: direction === 'left' ? 0 : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : 0 }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex"
      >
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <TestimonialCard key={`${item.author}-${idx}`} testimonial={item} />
        ))}
      </motion.div>
    </div>
  );
};

export default function TestimonialsSection() {
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section className="py-24 sm:py-32 bg-surface-alt relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-lavender-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-[10%] left-[5%] w-72 h-72 bg-soft-blue-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 max-w-7xl mb-12 sm:mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-coral-600 uppercase bg-coral-50 rounded-full">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Stories of <span className="text-coral">transformation</span>
            </h2>
            <p className="mt-6 text-lg text-text-muted">
              Real experiences from real people who found hope, healing, and happiness.
            </p>
          </div>
        </div>

        {/* Marquee Container with Gradient Maps for fade effect */}
        <div className="relative w-full space-y-8">
          {/* Side Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-surface-alt to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-surface-alt to-transparent z-20 pointer-events-none" />

          {/* Row 1: Left to Right (Slow) */}
          <MarqueeRow items={row1} direction="right" speed={80} />

          {/* Row 2: Left to Right (Slightly different speed/var) */}
          <MarqueeRow items={row2} direction="right" speed={100} />
        </div>
      </div>
    </section>
  );
}
