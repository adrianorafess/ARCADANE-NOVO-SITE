import React, { useEffect, useState, useRef } from 'react';
import { Plane } from 'lucide-react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Detect fine pointer capability (non-touch devices)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsMobile(!mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(!e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Listen to hovering state over buttons, links, and specific selectors
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.getAttribute('role') === 'button';

      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleMouseOver);

    // Global CSS to hide native cursor on desktop
    const style = document.createElement('style');
    style.id = 'custom-cursor-hide-native';
    style.innerHTML = `
      @media (pointer: fine) {
        body, a, button, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
      
      const addedStyle = document.getElementById('custom-cursor-hide-native');
      if (addedStyle) addedStyle.remove();
    };
  }, [isVisible, isMobile]);

  if (isMobile || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[99999] transition-transform duration-75 ease-out select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        // Translate X: centered (-50%), Translate Y: offset slightly (-15%) so the tip/nose of the plane acts as the exact click pointer
        transform: `translate(-50%, -15%) scale(${isHovering ? 1.2 : 1})`,
      }}
    >
      <div 
        className="relative flex items-center justify-center"
        style={{
          // A standard mouse cursor points top-left. Since the Lucide plane icon defaults to pointing top-right,
          // rotating it by -90 degrees makes it point beautifully to the top-left (-45 degrees offset from straight up).
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Subtle airplane wind trail wings decoration when hovering */}
        {isHovering && (
          <span className="absolute w-8 h-8 rounded-full border border-[#AF4934]/20 bg-[#AF4934]/10 animate-ping pointer-events-none" />
        )}
        
        {/* Drop shadow on airplane */}
        <Plane 
          className={`w-6 h-6 transition-colors duration-200 drop-shadow-[0_3px_5px_rgba(0,0,0,0.55)] ${
            isHovering ? 'text-brand-primary' : 'text-[#AF4934]'
          }`}
          fill={isHovering ? '#fff' : 'rgba(175, 73, 52, 0.2)'}
        />
      </div>
    </div>
  );
}
