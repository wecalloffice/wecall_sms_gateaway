"use client";

import React from 'react';
import { Quote } from 'lucide-react';
import { Section, Container, SectionHeader, AnimatedCard } from './reusable';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'TechStart Inc.',
    image: '👩‍💼',
    quote: 'WeCall SMS Gateway transformed our customer communication. The API is incredibly easy to integrate, and the delivery rates are outstanding. We saw a 40% increase in engagement.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'E-Commerce Plus',
    image: '👨‍💻',
    quote: 'The analytics dashboard gives us real-time insights into our campaigns. The global coverage is exactly what we needed for our international expansion.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Founder',
    company: 'AppNotify',
    image: '👩‍🚀',
    quote: "Best SMS gateway we've used. The 2FA integration was seamless, and their support team is incredibly responsive. Highly recommend for any business serious about SMS.",
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Lead Developer',
    company: 'FinTech Solutions',
    image: '👨‍💼',
    quote: 'The webhook system and detailed delivery reports make debugging a breeze. Their SMPP gateway handles our high-volume needs without breaking a sweat.',
    rating: 5,
  },
  {
    name: 'Lisa Thompson',
    role: 'Operations Manager',
    company: 'Healthcare Connect',
    image: '👩‍⚕️',
    quote: "Security and compliance are crucial for us. WeCall's GDPR compliance and encryption give us peace of mind while serving our patients.",
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'CEO',
    company: 'RetailChain',
    image: '👔',
    quote: 'Switched from our previous provider and never looked back. Better rates, higher delivery success, and the multi-tenant feature is perfect for our franchise model.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <Section id="testimonials" background="gradient">
      <Container>
        <SectionHeader
          badge="Customer Success Stories"
          title="Trusted by"
          highlight="50,000+ Businesses"
          description="See what our customers have to say about their experience with WeCall SMS Gateway."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedCard key={index} delay={index * 75} className="flex flex-col">
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-10 h-10" style={{ color: 'var(--primary)', opacity: 0.2 }} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xl">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(to bottom right, var(--primary-accent), var(--primary-light))' }}>
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
