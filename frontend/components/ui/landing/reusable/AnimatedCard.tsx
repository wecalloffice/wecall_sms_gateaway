"use client";

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function AnimatedCard({ children, className, delay = 0, hover = true, style }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300',
        hover && 'hover:shadow-xl hover:-translate-y-1 hover:border-gray-300',
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        ...style
      }}
    >
      {children}
    </div>
  );
}
