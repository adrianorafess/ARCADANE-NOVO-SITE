import React from 'react';

interface ArcadaneIconProps {
  className?: string;
  size?: number | string;
  primaryColor?: string; // Terracotta (#AF4934) or custom
  secondaryColor?: string; // Sand/Gold (#DCCFC1) or custom
  textColor?: string; // Blue (#3B5EA4) or dark
  variant?: 'icon' | 'full' | 'circular';
  animate?: boolean;
}

export default function ArcadaneIcon({
  className = '',
  size = 120,
  primaryColor = '#AF4934',
  secondaryColor = '#DCCFC1',
  textColor = '#3B5EA4',
  variant = 'icon',
  animate = false,
}: ArcadaneIconProps) {
  
  // Mathematical 8-pointed star generator
  const getStarPoints = (cx: number, cy: number, outerRad: number, innerRad: number) => {
    const points = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const r = i % 2 === 0 ? outerRad : innerRad;
      const x = cx + Math.sin(angle) * r;
      const y = cy - Math.cos(angle) * r;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const starPoints = getStarPoints(68, 62, 6, 2.5);

  if (variant === 'circular') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          id="arcadane-circular-stamp"
        >
          {/* Circular Text Path Definition */}
          <defs>
            <path
              id="textCircle"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              fill="none"
            />
          </defs>

          {/* Window icon centered inside */}
          <g transform="translate(56, 40) scale(0.88)">
            {/* Outer Arch Frame */}
            <path
              d="M 6 114 L 6 52 A 44 44 0 0 1 94 52 L 94 114 Z"
              fill="none"
              stroke={primaryColor}
              strokeWidth="2"
              strokeLinejoin="round"
              className={animate ? 'animate-[pulse_2s_infinite]' : ''}
            />
            {/* Inner Arch Frame */}
            <path
              d="M 11 111 L 11 52 A 39 39 0 0 1 89 52 L 89 111 Z"
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Horizontal Line separating Arch and Dunes */}
            <line
              x1="11"
              y1="52"
              x2="89"
              y2="52"
              stroke={primaryColor}
              strokeWidth="1.5"
            />
            {/* Radial Spokes */}
            <line x1="50" y1="52" x2="50" y2="13" stroke={primaryColor} strokeWidth="1.5" />
            <line x1="50" y1="52" x2="22.5" y2="24.5" stroke={primaryColor} strokeWidth="1.5" />
            <line x1="50" y1="52" x2="77.5" y2="24.5" stroke={primaryColor} strokeWidth="1.5" />

            {/* Dunes */}
            <path
              d="M 11 68 C 35 72, 60 55, 89 64"
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 11 84 C 35 88, 60 74, 89 76"
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M 11 98 C 35 106, 60 92, 89 94"
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* 8-pointed gold star */}
            <polygon
              points={starPoints}
              fill={primaryColor}
              className={animate ? 'animate-[spin_6s_linear_infinite]' : ''}
              style={{ transformOrigin: '68px 62px' }}
            />
          </g>

          {/* Circular text around the stamp */}
          <text fill={textColor} className="font-sans font-bold tracking-[0.24em] text-[8.5px] uppercase">
            <textPath href="#textCircle" startOffset="0%">
              Arcadane Agência de Viagens • Arcadane Agência de Viagens •
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`} style={{ width: size }}>
        {/* The Window Logo Icon */}
        <svg
          viewBox="0 0 100 120"
          className="w-20 h-24 mb-3"
          id="arcadane-window-icon-svg"
        >
          {/* Outer Arch Frame */}
          <path
            d="M 6 114 L 6 52 A 44 44 0 0 1 94 52 L 94 114 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner Arch Frame */}
          <path
            d="M 11 111 L 11 52 A 39 39 0 0 1 89 52 L 89 111 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Horizontal Divider */}
          <line
            x1="11"
            y1="52"
            x2="89"
            y2="52"
            stroke={primaryColor}
            strokeWidth="1.8"
          />
          {/* Arch radial divisions */}
          <line x1="50" y1="52" x2="50" y2="13" stroke={primaryColor} strokeWidth="1.8" />
          <line x1="50" y1="52" x2="22.5" y2="24.5" stroke={primaryColor} strokeWidth="1.8" />
          <line x1="50" y1="52" x2="77.5" y2="24.5" stroke={primaryColor} strokeWidth="1.8" />

          {/* Elegant wavy dunes/seas */}
          <path
            d="M 11 68 C 35 72, 60 55, 89 64"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 11 84 C 35 88, 60 74, 89 76"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 11 98 C 35 106, 60 92, 89 94"
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* 8-pointed golden sun/star */}
          <polygon
            points={starPoints}
            fill={primaryColor}
            className={animate ? 'animate-[spin_6s_linear_infinite]' : ''}
            style={{ transformOrigin: '68px 62px' }}
          />
        </svg>

        {/* Elegant wordmark styling */}
        <div className="flex flex-col items-center">
          <span 
            className="font-signature text-5xl leading-none tracking-wide" 
            style={{ color: textColor }}
          >
            Arcadane
          </span>
          <span 
            className="text-[9px] tracking-[0.28em] font-sans font-bold uppercase mt-2.5"
            style={{ color: secondaryColor }}
          >
            AGÊNCIA DE VIAGENS
          </span>
        </div>
      </div>
    );
  }

  // default 'icon' variant
  return (
    <svg
      viewBox="0 0 100 120"
      className={`${className}`}
      style={{ width: size, height: typeof size === 'number' ? (size * 1.2) : 'auto' }}
      id="arcadane-window-icon-only"
    >
      {/* Outer Arch Frame */}
      <path
        d="M 6 114 L 6 52 A 44 44 0 0 1 94 52 L 94 114 Z"
        fill="none"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner Arch Frame */}
      <path
        d="M 11 111 L 11 52 A 39 39 0 0 1 89 52 L 89 111 Z"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Horizontal Divider */}
      <line
        x1="11"
        y1="52"
        x2="89"
        y2="52"
        stroke={primaryColor}
        strokeWidth="1.8"
      />
      {/* Arch radial divisions */}
      <line x1="50" y1="52" x2="50" y2="13" stroke={primaryColor} strokeWidth="1.8" />
      <line x1="50" y1="52" x2="22.5" y2="24.5" stroke={primaryColor} strokeWidth="1.8" />
      <line x1="50" y1="52" x2="77.5" y2="24.5" stroke={primaryColor} strokeWidth="1.8" />

      {/* Elegant wavy dunes/seas */}
      <path
        d="M 11 68 C 35 72, 60 55, 89 64"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 11 84 C 35 88, 60 74, 89 76"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 11 98 C 35 106, 60 92, 89 94"
        fill="none"
        stroke={primaryColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 8-pointed golden sun/star */}
      <polygon
        points={starPoints}
        fill={primaryColor}
        className={animate ? 'animate-pulse' : ''}
        style={{ transformOrigin: '68px 62px' }}
      />
    </svg>
  );
}
