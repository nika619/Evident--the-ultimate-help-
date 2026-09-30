import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CloudCursorProps {
  pointerX: Animated.Value;
  pointerY: Animated.Value;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CloudCursorBackground: React.FC<CloudCursorProps> = ({ pointerX, pointerY }) => {
  // Center of screen defaults so it's immediately glowing and visible on mount
  const centerX = Math.max(100, (SCREEN_WIDTH || 400) / 2 - 200);
  const centerY = Math.max(120, (SCREEN_HEIGHT || 800) / 3 - 200);

  const cloud1X = useRef(new Animated.Value(centerX)).current;
  const cloud1Y = useRef(new Animated.Value(centerY)).current;
  const cloud2X = useRef(new Animated.Value(centerX + 60)).current;
  const cloud2Y = useRef(new Animated.Value(centerY - 40)).current;
  const cloud3X = useRef(new Animated.Value(centerX - 40)).current;
  const cloud3Y = useRef(new Animated.Value(centerY + 80)).current;

  // Ambient organic float and breath loop
  const breathAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. 24/7 Organic Breathing Cycle
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2. Slow hypnotic rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();

    // 3. Pointer tracking with spring physics
    pointerX.addListener(({ value }) => {
      Animated.spring(cloud1X, { toValue: value, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
      Animated.spring(cloud2X, { toValue: value + 50, useNativeDriver: true, speed: 9, bounciness: 10 }).start();
      Animated.spring(cloud3X, { toValue: value - 40, useNativeDriver: true, speed: 6, bounciness: 14 }).start();
    });

    pointerY.addListener(({ value }) => {
      Animated.spring(cloud1Y, { toValue: value, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
      Animated.spring(cloud2Y, { toValue: value - 40, useNativeDriver: true, speed: 9, bounciness: 10 }).start();
      Animated.spring(cloud3Y, { toValue: value + 30, useNativeDriver: true, speed: 6, bounciness: 14 }).start();
    });

    return () => {
      pointerX.removeAllListeners();
      pointerY.removeAllListeners();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scaleBreath1 = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });

  const scaleBreath2 = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.12, 0.94],
  });

  const floatY = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 15],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Ambient Top Light Beam (Permanent $1M Atmosphere) */}
      <LinearGradient
        colors={['rgba(224, 242, 254, 0.85)', 'rgba(240, 253, 244, 0.4)', 'rgba(248, 250, 252, 0)']}
        style={styles.ambientTopGaze}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Cloud 1: Deep Cyan Core */}
      <Animated.View
        style={[
          styles.cloudOrb,
          {
            width: 440,
            height: 440,
            borderRadius: 220,
            transform: [
              { translateX: cloud1X },
              { translateY: Animated.add(cloud1Y, floatY) },
              { scale: scaleBreath1 },
              { rotate: spin },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(14, 165, 233, 0.45)', 'rgba(56, 189, 248, 0.18)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
        />
      </Animated.View>

      {/* Cloud 2: Electric Violet Horizon */}
      <Animated.View
        style={[
          styles.cloudOrb,
          {
            width: 380,
            height: 380,
            borderRadius: 190,
            transform: [
              { translateX: cloud2X },
              { translateY: cloud2Y },
              { scale: scaleBreath2 },
              { rotate: spin },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.32)', 'rgba(168, 85, 247, 0.12)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.9, y: 0.1 }}
          end={{ x: 0.1, y: 0.9 }}
        />
      </Animated.View>

      {/* Cloud 3: Emerald Provenance Shimmer */}
      <Animated.View
        style={[
          styles.cloudOrb,
          {
            width: 500,
            height: 500,
            borderRadius: 250,
            transform: [
              { translateX: cloud3X },
              { translateY: Animated.add(cloud3Y, floatY) },
              { scale: scaleBreath1 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.22)', 'rgba(14, 165, 233, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  ambientTopGaze: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
  },
  cloudOrb: {
    position: 'absolute',
    opacity: 0.85,
    filter: 'blur(75px)', // WebGL style hardware accelerated optical blur
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 80,
  } as any,
});
