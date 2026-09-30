module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.ts',
    '^react-native-purchases$': '<rootDir>/__mocks__/react-native-purchases.ts',
    '^expo-haptics$': '<rootDir>/__mocks__/expo-haptics.ts',
    '^expo-linear-gradient$': '<rootDir>/__mocks__/expo-linear-gradient.ts',
    '^react-native$': '<rootDir>/__mocks__/react-native.ts',
  },
};
