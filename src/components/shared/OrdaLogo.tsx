import React from 'react';

export function OrdaLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: '20px', md: '26px', lg: '44px' };

  return (
    <div
      className="font-playfair font-black tracking-tight flex items-baseline"
      style={{ fontSize: sizes[size], color: '#EFEFEF' }}
    >
      ORDA
      <span style={{ color: '#D4A853' }}>.</span>
    </div>
  );
}
