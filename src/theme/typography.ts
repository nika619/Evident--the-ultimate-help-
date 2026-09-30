import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  code: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 17,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};
