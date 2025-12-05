"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Section, Container, GradientText } from './reusable';

export function CTASection() {
  return (
    <Section id="contact" background="gradient" className="py-20">
      <Container>
        <div className="relative rounded-3xl p-12 lg:p-16 overflow-hidden" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary-light))' }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Limited Time Offer</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <br className="hidden sm:block" />
              SMS Communication?
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join 50,000+ businesses using WeCall SMS Gateway. Get started today with simple, transparent pricing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <button className="group px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-bold rounded-xl text-lg flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#pricing">
                <button className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-xl text-lg transition-all duration-300">
                  View Pricing
                </button>
              </Link>
            </div>

            {/* Trust Elements */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <span>✓ No credit card required</span>
              <span>✓ Easy setup</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
