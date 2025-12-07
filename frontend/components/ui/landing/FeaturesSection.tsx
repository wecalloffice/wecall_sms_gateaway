"use client";

import React from 'react';
import { 
  Zap, 
  Shield, 
  Globe, 
  BarChart, 
  Clock, 
  Users, 
  Code, 
  Lock,
  Smartphone,
  TrendingUp,
  Headphones,
  DollarSign
} from 'lucide-react';
import { Section, Container, SectionHeader, AnimatedCard, IconBox } from './reusable';

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Send 100+ SMS per second with our high-throughput SMPP gateway. Real-time delivery with minimal latency.',
    variant: 'primary' as const,
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, GDPR compliant, and ISO 27001 certified. Your data is always protected.',
    variant: 'success' as const,
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Global Reach',
    description: 'Connect with customers in 200+ countries. Direct carrier connections for optimal delivery rates.',
    variant: 'secondary' as const,
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: 'Real-Time Analytics',
    description: 'Track delivery reports, campaign performance, and detailed logs. Make data-driven decisions.',
    variant: 'warning' as const,
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '99.9% Uptime SLA',
    description: 'Guaranteed reliability with redundant infrastructure. Your messages are always delivered on time.',
    variant: 'primary' as const,
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Multi-Tenant Ready',
    description: 'White-label solution for resellers. Manage multiple clients with separate billing and branding.',
    variant: 'secondary' as const,
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Developer Friendly',
    description: 'RESTful API, WebHooks, and SDKs for all major languages. Integration in minutes, not days.',
    variant: 'primary' as const,
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Two-Factor Auth',
    description: 'Built-in OTP verification system. Secure your applications with SMS-based 2FA.',
    variant: 'success' as const,
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: 'SMS & Voice',
    description: 'Send text messages and voice calls from a single platform. Unified communication solution.',
    variant: 'warning' as const,
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Smart Routing',
    description: 'Intelligent route optimization based on cost, speed, and quality. Maximize ROI automatically.',
    variant: 'secondary' as const,
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: '24/7 Support',
    description: 'Expert technical support around the clock. Get help whenever you need it via chat, email, or phone.',
    variant: 'primary' as const,
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Flexible Pricing',
    description: 'Pay only for what you use. Volume discounts and custom enterprise pricing available.',
    variant: 'success' as const,
  },
];

export function FeaturesSection() {
  return (
    <Section id="features" background="gray">
      <Container>
        <SectionHeader
          badge="Powerful Features"
          title="Everything You Need for"
          highlight="SMS Success"
          description="A comprehensive SMS gateway platform built for developers, marketers, and businesses of all sizes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <AnimatedCard key={index} delay={index * 50}>
              <div className="flex items-start gap-4">
                <IconBox variant={feature.variant} size="md">
                  {feature.icon}
                </IconBox>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 lg:mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience the difference?
          </p>
          <button className="btn-primary px-8 py-4 rounded-xl">
            Get Started Now
          </button>
        </div>
      </Container>
    </Section>
  );
}
