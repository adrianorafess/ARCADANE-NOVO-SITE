import React, { useEffect, useState, useRef } from 'react';
import { Plane } from 'lucide-react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Use refs for mouse coordinates to avoid triggering React component updates on every movement
  const mouseCoords = useRef({ x: 0, y: 0 });
  const currentCoords = useRef({ x: 0, y: 0 });
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect fine pointer capability (non-touch devices like laptops/desktops with mice)
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
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

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

    // Global CSS to hide native cursor on desktop to replace it with our custom plane
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

    // Highly optimized animation loop for buttery smooth cursor tracking (60fps+)
    const animateCursor = () => {
      if (cursorRef.current && isVisible) {
        // Easing interpolation factor (0.2) makes it incredibly smooth with a premium fluid feel
        const ease = 0.2;
        currentCoords.current.x += (mouseCoords.current.x - currentCoords.current.x) * ease;
        currentCoords.current.y += (mouseCoords.current.y - currentCoords.current.y) * ease;

        // Use translate3d to offload rendering to the GPU (hardware accelerated)
        cursorRef.current.style.transform = `translate3d(${currentCoords.current.x}px, ${currentCoords.current.y}px, 0) translate3d(-50%, -15%, 0) scale(${isHovering ? 1.2 : 1})`;
      }
      reqRef.current = requestAnimationFrame(animateCursor);
    };

    // Pre-initialize coordinates with first movement
    const handleInitialMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      currentCoords.current.x = e.clientX;
      currentCoords.current.y = e.clientY;
      window.removeEventListener('mousemove', handleInitialMove);
    };
    window.addEventListener('mousemove', handleInitialMove, { once: true });

    reqRef.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      
      const addedStyle = document.getElementById('custom-cursor-hide-native');
      if (addedStyle) addedStyle.remove();
    };
  }, [isVisible, isMobile, isHovering]);

  if (isMobile || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] select-none will-change-transform"
      style={{
        transform: `translate3d(${currentCoords.current.x}px, ${currentCoords.current.y}px, 0) translate3d(-50%, -15%, 0) scale(${isHovering ? 1.2 : 1})`,
        // Tiny hardware-accelerated transition on hover scale for fluid springiness
        transition: 'transform 0.08s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
    >
      <div 
        className="relative flex items-center justify-center transition-transform duration-200"
        style={{
          transform: 'rotate(-90deg)',
        }}
      >
        {isHovering && (
          <span className="absolute w-8 h-8 rounded-full border border-[#AF4934]/20 bg-[#AF4934]/10 animate-ping pointer-events-none" />
        )}
        
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
