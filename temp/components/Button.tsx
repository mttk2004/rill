
import React from 'react';

interface ButtonProps {
  children?: any;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'outline-white';
  fullWidth?: boolean;
  className?: string;
  [key: string]: any;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) => {
  // Added active:scale-[0.98] for click feedback and transition-all for smooth hover effects
  const baseStyles = "inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    // Primary: Uses hover:brightness-110 to make the button brighter on hover instead of darker
    primary: "border-transparent bg-primary text-white hover:brightness-110 hover:-translate-y-0.5 focus:ring-primary shadow-lg shadow-primary/30 hover:shadow-primary/40",
    
    // Accent: Uses hover:brightness-110 for a consistent "light up" effect
    accent: "border-transparent bg-accent text-white hover:brightness-110 hover:-translate-y-0.5 focus:ring-accent shadow-lg shadow-accent/30 hover:shadow-accent/40",
    
    // Secondary: Light Gray - Neutral actions
    secondary: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-gray-300 focus:ring-gray-200",
    
    // Outline: Bordered - Alternative actions (Default for light backgrounds)
    outline: "border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary",
    
    // Outline White: Specific for dark backgrounds (Hero sections)
    // Fixes the issue where text becomes invisible on hover (White Text -> Primary Text on White Bg)
    'outline-white': "border-white text-white bg-transparent hover:bg-white hover:text-primary focus:ring-white",

    // Ghost: Text only - Low priority
    ghost: "border-transparent text-gray-600 hover:text-primary hover:bg-primary/5",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;