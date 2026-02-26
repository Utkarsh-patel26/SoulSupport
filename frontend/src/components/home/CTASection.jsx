'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden transition-colors duration-500">
      {/* Full Width Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
        {/* Soft Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[3rem] p-12 sm:p-20 shadow-2xl transition-colors duration-300"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-8 backdrop-blur-sm shadow-inner">
            <Shield className="text-white w-8 h-8" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Your journey to <br />
            <span className="text-purple-200">peace of mind</span> starts here
          </h2>
          
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Take the first step today. Connect with a licensed therapist who understands you. 
            Your future self will thank you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
                size="xl"
                className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shadow-xl shadow-indigo-900/10 font-bold text-lg px-8 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
                variant="outline text-white border-white/30 hover:bg-white/10"
                size="xl"
                className="w-full sm:w-auto text-white border-2 border-white/30 hover:bg-white/10 hover:border-white font-semibold text-lg px-8 py-6 rounded-2xl backdrop-blur-sm transition-all duration-300"
            >
              Schedule a Call
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm font-medium text-indigo-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" /> HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> 7-Day Free Trial
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" /> Cancel Anytime
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
