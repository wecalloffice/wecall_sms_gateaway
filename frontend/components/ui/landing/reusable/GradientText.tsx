import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({ 
  children, 
  className, 
  from = 'var(--primary)', 
  to = 'var(--primary-light)' 
}: GradientTextProps) {
  return (
    <span 
      className={cn('bg-clip-text text-transparent', className)}
      style={{ 
        background: `linear-gradient(to right, ${from}, ${to})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </span>
  );
}
