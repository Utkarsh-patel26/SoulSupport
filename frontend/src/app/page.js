'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import FloatingLines from "@/components/FloatingLines";
import StatsSection from "@/components/home/StatsSection";
import PathToWellness from "@/components/home/PathToWellness";
import CoreFeatures from "@/components/home/CoreFeatures";
import TherapistsSection from "@/components/home/TherapistsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div className="bg-background transition-colors duration-300">
      {/* Full-Screen Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating Lines Animation */}
        <div className="absolute inset-0 z-0">
          <FloatingLines
            linesGradient={['#1F4E5F', '#6FAF8F', '#4C6FFF', '#9C8CF1']}
            enabledWaves={['middle', 'bottom']}
            lineCount={[5, 4]}
            lineDistance={[5, 3]}
            animationSpeed={0.8}
            interactive={true}
            bendRadius={2.5}
            bendStrength={-0.3}
            parallax={true}
            parallaxStrength={0.15}
            mixBlendMode="screen"
          />
        </div>

        {/* Gradient Overlay for Better Text Contrast */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1F2937]/50 via-transparent to-[#1F2937]/60" />
        
        {/* Hero Content - Centered */}
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Welcome to <br />
              <span className="text-sage inline-block mt-2">Soul Support</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto font-light">
              Your mental wellness journey starts here. Connect with licensed therapists 
              who truly understand you.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/register" prefetch={true}>
                <Button className="bg-primary hover:bg-primary-hover text-white px-10 py-4 text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105">
                  Begin Your Journey
                </Button>
              </Link>
              <Link href="/therapists" prefetch={true}>
                <Button variant="outline" className="px-10 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 transition-all duration-300">
                  Browse Therapists
                </Button>
              </Link>
            </div>

            {/* Stats Grid - Cinematic Style */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-5xl font-bold text-sage mb-2">100+</p>
                <p className="text-gray-200 text-sm font-medium">Licensed Therapists</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-5xl font-bold text-soft-blue mb-2">3K+</p>
                <p className="text-gray-200 text-sm font-medium">Sessions Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-5xl font-bold text-lavender mb-2">4.9★</p>
                <p className="text-gray-200 text-sm font-medium">Average Rating</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <p className="text-5xl font-bold text-coral mb-2">24/7</p>
                <p className="text-gray-200 text-sm font-medium">Support Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <StatsSection />
      <PathToWellness />
      <CoreFeatures />
      <TherapistsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
