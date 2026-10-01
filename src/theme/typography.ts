import { TextStyle, Platform } from 'react-native';

const SANS_FONT = Platform.select({
  ios: '-apple-system',
  android: 'Roboto',
  web: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
  default: 'System',
});

const MONO_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  web: '"JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  default: 'monospace',
});

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: SANS_FONT,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.7,
    lineHeight: 34,
  },
  h2: {
    fontFamily: SANS_FONT,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  h3: {
    fontFamily: SANS_FONT,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.25,
    lineHeight: 22,
  },
  h4: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  body: {
    fontFamily: SANS_FONT,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.05,
  },
  bodySmall: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodyMuted: {
    fontFamily: SANS_FONT,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0,
  },
  code: {
    fontFamily: MONO_FONT,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  codeInline: {
    fontFamily: MONO_FONT,
    fontSize: 11.5,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  mono: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  monoBold: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  terminal: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  label: {
    fontFamily: SANS_FONT,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  badgeText: {
    fontFamily: SANS_FONT,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  shaText: {
    fontFamily: MONO_FONT,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  statNumber: {
    fontFamily: SANS_FONT,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
};

