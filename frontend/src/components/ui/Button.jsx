import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ className, variant = 'primary', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-hover focus:ring-brand',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-200',
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)} 
      {...props} 
    />
  );
};
