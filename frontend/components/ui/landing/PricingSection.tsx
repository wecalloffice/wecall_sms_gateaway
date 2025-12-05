"use client";

import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { Section, Container, SectionHeader, AnimatedCard, GradientText } from './reusable';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses and startups',
    price: '49',
    period: 'month',
    features: [
      { text: '5,000 SMS/month', included: true },
      { text: 'REST API access', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Email support', included: true },
      { text: '50+ countries', included: true },
      { text: 'Advanced routing', included: false },
      { text: 'Dedicated account manager', included: false },
      { text: 'Custom integrations', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing businesses with higher volume',
    price: '199',
    period: 'month',
    features: [
      { text: '50,000 SMS/month', included: true },
      { text: 'REST API + Webhooks', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority support', included: true },
      { text: '200+ countries', included: true },
      { text: 'Advanced routing', included: true },
      { text: 'Dedicated account manager', included: false },
      { text: 'Custom integrations', included: false },
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    period: '',
    features: [
      { text: 'Unlimited SMS', included: true },
      { text: 'Full API suite + SDKs', included: true },
      { text: 'Custom analytics dashboard', included: true },
      { text: '24/7 premium support', included: true },
      { text: 'Global coverage', included: true },
      { text: 'Advanced routing', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom integrations', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <Section id="pricing" background="white">
      <Container>
        <SectionHeader
          badge="Transparent Pricing"
          title="Choose the Perfect"
          highlight="Plan for You"
          description="No hidden fees. No surprises. Simple, transparent pricing for all plans."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <AnimatedCard
              key={index}
              delay={index * 100}
              className={`relative ${
                plan.popular
                  ? 'shadow-2xl scale-105 lg:scale-110'
                  : ''
              }`}
              style={plan.popular ? { borderColor: 'var(--primary)', borderWidth: '2px' } : {}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 px-4 py-1.5 text-white text-sm font-bold rounded-full shadow-lg" style={{ background: 'linear-gradient(to right, var(--primary), var(--primary-light))' }}>
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline">
                  {plan.price === 'Custom' ? (
                    <div className="text-4xl font-bold">
                      <GradientText>Custom</GradientText>
                    </div>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{plan.period}
                      </span>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <Link href={plan.price === 'Custom' ? '#contact' : '/register'}>
                  <button
                    className={`w-full py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'btn-primary shadow-lg hover:shadow-xl'
                        : 'btn-primary-outline'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>

                {/* Features */}
                <div className="pt-6 border-t border-gray-200">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included
                              ? 'text-gray-700'
                              : 'text-gray-500 line-through'
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Pay as you go • No credit card required • Cancel anytime
          </p>
        </div>
      </Container>
    </Section>
  );
}
