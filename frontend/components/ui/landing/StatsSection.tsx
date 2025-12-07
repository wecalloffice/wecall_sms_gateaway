"use client";

import React from 'react';
import { TrendingUp, Users, Globe, Zap } from 'lucide-react';
import { Section, Container, AnimatedCard } from './reusable';

const stats = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: '10B+',
    label: 'Messages Delivered',
    description: 'Successfully sent worldwide',
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: '50K+',
    label: 'Active Customers',
    description: 'Businesses trust us daily',
  },
  {
    icon: <Globe className="w-8 h-8" />,
    value: '200+',
    label: 'Countries Covered',
    description: 'Global SMS delivery',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: '99.9%',
    label: 'Uptime SLA',
    description: 'Guaranteed reliability',
  },
];

export function StatsSection() {
  return (
    <Section background="dark" className="py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedCard
              key={index}
              delay={index * 100}
              className="bg-gray-800/50 border-gray-700 text-center hover:bg-gray-800/70"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(to bottom right, var(--primary), var(--primary-light))' }}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {stat.value}
              </div>
              <div className="text-xl font-semibold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-gray-400">
                {stat.description}
              </div>
            </AnimatedCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
