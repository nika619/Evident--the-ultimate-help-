import React from 'react';
import { Animated } from 'react-native';
import { AmbientAuroraBackground } from './AmbientAuroraBackground';

interface CloudCursorProps {
  pointerX?: Animated.Value;
  pointerY?: Animated.Value;
}

export const CloudCursorBackground: React.FC<CloudCursorProps> = () => {
  // Gracefully forwards to mobile-native autonomous 3D floating aurora
  return <AmbientAuroraBackground />;
};

