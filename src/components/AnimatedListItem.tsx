import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedListItemProps {
  children: React.ReactNode;
  delayIndex?: number;
  style?: ViewStyle | any;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ children, delayIndex = 0, style }) => {
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(mountAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 15,
        bounciness: 8,
      }).start();
    }, delayIndex * 75); // 75ms stagger
    return () => clearTimeout(timer);
  }, [delayIndex]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: mountAnim,
          transform: [
            {
              translateY: mountAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
            {
              scale: mountAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
