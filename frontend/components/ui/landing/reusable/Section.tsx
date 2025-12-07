import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  style?: React.CSSProperties;
}

export function Section({ children, className, id, background = 'white', style }: SectionProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-b from-gray-50 to-white',
    dark: 'bg-gray-900',
  };

  return (
    <section
      id={id}
      className={cn(
        'py-8 md:py-10 lg:py-12 relative overflow-hidden',
        bgClasses[background],
        className
      )}
      style={style}
    >
      {children}
    </section>
  );
}
