import React from 'react';

interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  textVariant?: 'header' | 'hero' | 'minimal' | 'footer';
  subtext?: string;
}

export function SchoolLogo({
  size = 'md',
  className = '',
  showText = false,
  textVariant = 'header',
  subtext
}: SchoolLogoProps) {
  // Size classes for the logo badge
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const imgSize = sizeMap[size] || sizeMap.md;

  const logoImg = (
    <div className={`relative shrink-0 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-[#D97706]/40 p-0.5 flex items-center justify-center ${imgSize} ${className}`}>
      <img
        src="/logo.png"
        alt="The Polytechnic, Ibadan School Crest"
        className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
        loading="eager"
      />
    </div>
  );

  if (!showText) {
    return logoImg;
  }

  return (
    <div className="flex items-center gap-3">
      {logoImg}
      <div>
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-[#3B2211] ${
            textVariant === 'hero' ? 'text-xl sm:text-2xl' : 
            textVariant === 'footer' ? 'text-base sm:text-lg' : 
            'text-base sm:text-lg'
          }`}>
            The Polytechnic, Ibadan
          </span>
          {textVariant !== 'minimal' && (
            <span className="hidden md:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FAF7F5] text-[#8C5638] border border-[#E2D7CF] uppercase tracking-wider">
              Official Portal
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#784728] font-medium hidden sm:block">
          {subtext || 'Faculty Consultation & Student Availability Booking System'}
        </p>
      </div>
    </div>
  );
}
