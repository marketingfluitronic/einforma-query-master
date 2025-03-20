
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'subtle';
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ 
  className, 
  children, 
  variant = 'primary' 
}) => {
  const gradientClasses = {
    primary: 'bg-gradient-to-r from-einforma-600 via-einforma-500 to-einforma-400',
    secondary: 'bg-gradient-to-r from-einforma-700 via-einforma-600 to-einforma-500',
    subtle: 'bg-gradient-to-r from-einforma-100 via-einforma-200 to-einforma-100',
  };

  return (
    <div 
      className={cn(
        'animate-gradient-shift bg-[length:200%_200%]',
        gradientClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedGradient;
