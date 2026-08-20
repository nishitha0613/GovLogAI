import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'warn' | 'error' | 'critical' | 'fatal' | 'success' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const variantStyles = {
    info: 'bg-cyan-950/80 text-cyan-400 border-cyan-700/50',
    warn: 'bg-amber-950/80 text-amber-400 border-amber-700/50',
    error: 'bg-rose-950/80 text-rose-400 border-rose-700/50',
    critical: 'bg-red-950/90 text-red-400 border-red-600/80 font-bold',
    fatal: 'bg-purple-950/90 text-purple-300 border-purple-600/80 font-black tracking-wider uppercase',
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/50',
    purple: 'bg-purple-950/80 text-purple-400 border-purple-700/50',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
};
