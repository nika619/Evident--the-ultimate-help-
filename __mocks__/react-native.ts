export const Platform = {
  OS: 'ios',
  select: (obj: any) => obj.ios || obj.default,
};

export const StyleSheet = {
  create: (styles: any) => styles,
};

export const View = 'View';
export const Text = 'Text';
export const TouchableOpacity = 'TouchableOpacity';
export const TextInput = 'TextInput';
export const ScrollView = 'ScrollView';
export const Image = 'Image';
export const Share = {
  share: jest.fn(async () => ({ action: 'sharedAction' })),
};
export const Alert = {
  alert: jest.fn(),
};
