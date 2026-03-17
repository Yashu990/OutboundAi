import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Table = ({ children, className }) => (
  <div className="w-full overflow-x-auto">
    <table className={twMerge('w-full border-collapse text-left', className)}>
      {children}
    </table>
  </div>
);

export const THead = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-100">
    {children}
  </thead>
);

export const TBody = ({ children }) => (
  <tbody className="divide-y divide-gray-100">
    {children}
  </tbody>
);

export const TR = ({ children, className }) => (
  <tr className={twMerge('hover:bg-gray-50/50 transition-colors', className)}>
    {children}
  </tr>
);

export const TH = ({ children, className }) => (
  <th className={twMerge('px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider', className)}>
    {children}
  </th>
);

export const TD = ({ children, className }) => (
  <td className={twMerge('px-6 py-4 text-sm text-gray-700', className)}>
    {children}
  </td>
);
