
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'opaque';
  animateIn?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  className, 
  children, 
  variant = 'default',
  animateIn = false,
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white/70 backdrop-blur-md border border-white/30 shadow-lg',
    subtle: 'bg-white/40 backdrop-blur-sm border border-white/20 shadow-md',
    opaque: 'bg-white/90 backdrop-blur-lg border border-white/50 shadow-xl',
  };

  const animationClass = animateIn ? 'animate-fade-in-up' : '';

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClass,
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
