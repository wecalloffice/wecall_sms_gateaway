"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { Section, Container, SectionHeader } from './reusable';

const useCases = [
  {
    title: 'OTP & 2FA',
    description: 'Secure authentication with one-time passwords and two-factor authentication.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Marketing Campaigns',
    description: 'Reach your audience with targeted promotional messages and announcements.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Transactional Alerts',
    description: 'Send order confirmations, shipping updates, and payment notifications.',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Appointment Reminders',
    description: 'Reduce no-shows with automated appointment and booking reminders.',
    color: 'from-green-500 to-teal-500',
  },
];

export function IntegrationsSection() {
  return (
    <Section background="white">
      <Container>
        <div className="grid lg:grid-cols-1 gap-12 lg:gap-16 items-center mb-20">
          {/* Use Cases */}
          <div>
            <SectionHeader
              badge="Use Cases"
              title="Built for"
              highlight="Every Need"
              description="From authentication to marketing, we've got you covered."
              centered={true}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-all duration-300"
                  style={{ borderColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.borderWidth = '2px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {useCase.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
