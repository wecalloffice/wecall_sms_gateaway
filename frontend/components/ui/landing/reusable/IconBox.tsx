import React from 'react';
import { cn } from '@/lib/utils';

interface IconBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export function IconBox({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md' 
}: IconBoxProps) {
  const variants = {
    primary: 'text-white',
    secondary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  };

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div 
      className={cn(
        'rounded-lg flex items-center justify-center flex-shrink-0',
        variants[variant],
        sizes[size],
        className
      )}
      style={variant === 'primary' ? { backgroundColor: 'var(--primary)' } : {}}
    >
      {children}
    </div>
  );
}
