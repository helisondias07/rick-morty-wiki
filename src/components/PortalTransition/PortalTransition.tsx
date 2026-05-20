import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SwirlContainer = styled(motion.div)`
  @keyframes portalSwirl {
    0%   { filter: hue-rotate(0deg)  brightness(1); }
    50%  { filter: hue-rotate(15deg) brightness(1.3); }
    100% { filter: hue-rotate(0deg)  brightness(1); }
  }
  
  animation: portalSwirl 0.5s ease-in-out;
  border-radius: 50%;
  
  /* The SVG portal look */
  background: radial-gradient(circle, #FDFEB4 0%, #c8e87a 15%, #97ce4c 30%, #66BA4F 45%, #3a8c3a 60%, #1a4a1a 75%, #0d0d14 100%);
  box-shadow: 0 0 60px 20px rgba(151,206,76,0.4),
              0 0 120px 40px rgba(151,206,76,0.15),
              inset 0 0 40px rgba(253,254,180,0.2);
              
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      radial-gradient(circle at 20% 30%, rgba(253,254,180,0.6) 0%, transparent 4%),
      radial-gradient(circle at 75% 20%, rgba(253,254,180,0.4) 0%, transparent 3%),
      radial-gradient(circle at 60% 70%, rgba(253,254,180,0.5) 0%, transparent 5%),
      radial-gradient(circle at 15% 65%, rgba(253,254,180,0.3) 0%, transparent 3%),
      radial-gradient(circle at 85% 55%, rgba(253,254,180,0.4) 0%, transparent 4%),
      radial-gradient(circle at 40% 15%, rgba(253,254,180,0.3) 0%, transparent 2%),
      radial-gradient(circle at 30% 80%, rgba(253,254,180,0.5) 0%, transparent 6%),
      radial-gradient(circle at 90% 35%, rgba(253,254,180,0.3) 0%, transparent 3%);
  }
`;

interface PortalTransitionProps {
  isTransitioning: boolean;
  targetRoute: string;
}

export function PortalTransition({ isTransitioning, targetRoute }: PortalTransitionProps) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        navigate(targetRoute);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, targetRoute, navigate]);

  if (!isTransitioning) return null;

  const maxScale = Math.max(window.innerWidth, window.innerHeight) / 20; // Enough to cover screen

  return (
    <Overlay>
      <motion.div
        initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
        animate={{ backgroundColor: 'rgba(13,13,20,1)' }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{ position: 'absolute', inset: 0 }}
      />
      <SwirlContainer
        initial={{ scale: 0, opacity: 0, width: 80, height: 80 }}
        animate={{
          scale: shouldReduceMotion ? 1 : [0, 1, maxScale, maxScale],
          opacity: shouldReduceMotion ? [0, 1, 0] : [0, 1, 1, 0.8]
        }}
        transition={{ 
          duration: shouldReduceMotion ? 0 : 1, 
          times: [0, 0.3, 0.7, 1],
          ease: "easeInOut"
        }}
      />
    </Overlay>
  );
}
