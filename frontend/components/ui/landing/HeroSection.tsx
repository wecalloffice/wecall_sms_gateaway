"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe, TrendingUp, Check } from 'lucide-react';
import { Section, Container, GradientText } from './reusable';

export default function HeroSection() {
  const features = [
    'No credit card required',
    'Easy setup',
    'Cancel anytime',
  ];

  const stats = [
    { value: '10B+', label: 'Messages Delivered' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '200+', label: 'Countries' },
    { value: '50K+', label: 'Happy Customers' },
  ];

  return (
    <Section className="pt-24 lg:pt-32 pb-16 lg:pb-24" style={{ background: 'linear-gradient(to bottom right, var(--primary-accent), #ffffff, #fdf2f8)' }}>
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ backgroundColor: 'var(--primary-light)' }} />
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ backgroundColor: 'var(--primary)', animationDelay: '700ms' }} />
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ backgroundColor: 'var(--primary-accent)', animationDelay: '1000ms' }} />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm" style={{ backgroundColor: 'var(--primary-accent)', color: 'var(--primary-dark)' }}>
              <Zap className="w-4 h-4" />
              <span>Trusted by 50,000+ businesses worldwide</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Send SMS Messages{' '}
              <span style={{ background: 'linear-gradient(to right, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Anywhere, Anytime
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              The most reliable SMS gateway for transactional and marketing messages. 
              Deliver OTPs, alerts, and campaigns with 99.9% uptime across 200+ countries.
            </p>

            {/* Features List */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/register">
                <button className="btn-primary group px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-2xl">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#pricing">
                <button className="btn-primary-outline px-8 py-4 text-lg rounded-xl hover:shadow-lg">
                  View Pricing
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats/Visual */}
          <div className="relative">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 lg:bottom-0 lg:right-0 rounded-2xl p-6 shadow-2xl max-w-xs hidden md:block" style={{ background: 'linear-gradient(to bottom right, var(--primary), var(--primary-light))' }}>
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-white" />
                <div className="text-white">
                  <div className="text-2xl font-bold">98.5%</div>
                  <div className="text-sm opacity-90">Delivery Rate</div>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                Industry-leading delivery rates across all carriers
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
