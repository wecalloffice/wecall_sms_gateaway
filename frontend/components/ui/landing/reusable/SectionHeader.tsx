import React from 'react';
import { cn } from '@/lib/utils';
import { GradientText } from './GradientText';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ 
  badge, 
  title, 
  highlight, 
  description, 
  centered = true,
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-12 lg:mb-16',
      centered && 'text-center',
      className
    )}>
      {badge && (
        <div className={cn(
          'inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm mb-4',
          !centered && 'mb-6'
        )} style={{ backgroundColor: 'var(--primary-accent)', color: 'var(--primary-dark)' }}>
          {badge}
        </div>
      )}
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        {title}{' '}
        {highlight && <GradientText>{highlight}</GradientText>}
      </h2>
      
      {description && (
        <p className={cn(
          'text-lg md:text-xl text-gray-600 leading-relaxed',
          centered ? 'max-w-3xl mx-auto' : 'max-w-2xl'
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
