import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className }) => {
  return (
    <div className={twMerge('bg-white rounded-xl shadow-sm border border-gray-100 p-6', className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={twMerge('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={twMerge('text-lg font-semibold text-gray-900', className)}>{children}</h3>
);

export const CardContent = ({ children, className }) => (
  <div className={twMerge('', className)}>{children}</div>
);
