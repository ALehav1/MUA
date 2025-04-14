import React from 'react';

type Status = 'New' | 'In Review' | 'Needs Info' | 'Quoted' | 'Bound' | 'Declined';

interface StatusBadgeProps {
  status: Status;
}

const statusColors: Record<Status, { bg: string; text: string }> = {
  New: { bg: 'bg-blue-100', text: 'text-blue-800' },
  'In Review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Needs Info': { bg: 'bg-orange-100', text: 'text-orange-800' },
  Quoted: { bg: 'bg-green-100', text: 'text-green-800' },
  Bound: { bg: 'bg-purple-100', text: 'text-purple-800' },
  Declined: { bg: 'bg-red-100', text: 'text-red-800' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { bg, text } = statusColors[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {status}
    </span>
  );
}; 