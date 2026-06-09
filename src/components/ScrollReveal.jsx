import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ 
  children, 
  animation = 'reveal-fade-up', 
  delay = '', // 'delay-100', 'delay-200', etc.
  className = '', 
  triggerOnce = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -40px 0px' // Trigger slightly before it fully crosses the viewport edge
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement && !triggerOnce) {
        observer.unobserve(currentElement);
      }
    };
  }, [triggerOnce]);

  return (
    <div
      ref={elementRef}
      className={`${animation} ${isVisible ? 'is-visible' : ''} ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
