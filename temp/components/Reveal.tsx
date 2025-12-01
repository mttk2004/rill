
import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children?: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number; // Delay in seconds (e.g., 0.2)
  threshold?: number; // 0 to 1 (percentage of visibility to trigger)
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right'; // Animation direction
  key?: any;
}

const Reveal = ({ 
  children, 
  width = '100%', 
  delay = 0, 
  threshold = 0.1,
  className = "",
  direction = 'up'
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Only animate once
        }
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  // Map direction to initial transform styles
  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      default: return 'translateY(40px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width,
        position: 'relative',
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;