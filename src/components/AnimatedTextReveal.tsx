import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, TextStyle } from 'react-native';

interface AnimatedTextRevealProps {
  text: string;
  style?: TextStyle | any;
  delay?: number; // Base delay before sequence starts
  stagger?: number; // Delay between each word
}

export const AnimatedTextReveal: React.FC<AnimatedTextRevealProps> = ({
  text,
  style,
  delay = 0,
  stagger = 40,
}) => {
  const words = text.split(' ');

  return (
    <View style={styles.container}>
      {words.map((word, index) => {
        const wordAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
          const timer = setTimeout(() => {
            Animated.spring(wordAnim, {
              toValue: 1,
              useNativeDriver: true,
              speed: 12,
              bounciness: 8,
            }).start();
          }, delay + index * stagger);
          return () => clearTimeout(timer);
        }, []);

        return (
          <Animated.Text
            key={`${word}-${index}`}
            style={[
              style,
              styles.word,
              {
                opacity: wordAnim,
                transform: [
                  {
                    translateY: wordAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [15, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {word}{' '}
          </Animated.Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    // preserve spacing
  },
});
