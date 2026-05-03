import React from 'react';

interface AnnassimLogoProps {
  variant?: 'dark' | 'light' | 'icon-only';
  size?: number;
  className?: string;
}

const AnnassimLogo: React.FC<AnnassimLogoProps> = ({ 
  variant = 'light', 
  size = 40,
  className = ""
}) => {
  // Brand colors
  const green = "#1E4D35";
  const gold = "#C9A84C";
  const white = "#FFFFFF";

  const isDark = variant === 'dark';
  const strokeColor = isDark ? gold : green;
  const textColor = isDark ? white : green;
  const subTextColor = gold;

  const HouseIcon = (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tree left */}
      <circle cx="20" cy="55" r="12" stroke={gold} strokeWidth="1.5" />
      <line x1="20" y1="67" x2="20" y2="80" stroke={gold} strokeWidth="1.5" />
      
      {/* House 1 (Small) */}
      <path d="M40 80V55L55 45L70 55V80H40Z" stroke={strokeColor} strokeWidth="1.5" />
      
      {/* House 2 (Large) */}
      <path d="M60 80V45L80 30L100 45V80H60Z" stroke={gold} strokeWidth="1.5" />
      
      {/* Ground line */}
      <line x1="10" y1="80" x2="100" y2="80" stroke={gold} strokeWidth="1.5" />
    </svg>
  );

  if (variant === 'icon-only') return HouseIcon;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {HouseIcon}
      <div className="flex flex-col">
        <span 
          className="font-bold tracking-[0.2em] leading-none uppercase" 
          style={{ color: subTextColor, fontSize: size * 0.35 }}
        >
          LOTISSEMENT
        </span>
        <span 
          className="font-black tracking-[0.1em] uppercase" 
          style={{ color: textColor, fontSize: size * 0.45 }}
        >
          ANNASSIM 2
        </span>
      </div>
    </div>
  );
};

export default AnnassimLogo;
