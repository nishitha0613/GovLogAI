import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  danger = false,
  onClick,
}) => {
  let baseClass = 'glass-panel rounded-xl p-5 border border-slate-800 transition-all duration-300';
  if (glow) baseClass = 'glass-panel-glow rounded-xl p-5 transition-all duration-300';
  if (danger) baseClass = 'glass-panel-danger rounded-xl p-5 transition-all duration-300';

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${onClick ? 'cursor-pointer hover:border-cyan-500/50 hover:translate-y-[-2px]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
