// In-memory mock for AsyncStorage
const store = new Map<string, string>();

const AsyncStorage = {
  getItem: jest.fn(async (key: string) => store.get(key) ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    store.set(key, value);
  }),
  removeItem: jest.fn(async (key: string) => {
    store.delete(key);
  }),
  multiRemove: jest.fn(async (keys: string[]) => {
    keys.forEach((k) => store.delete(k));
  }),
  clear: jest.fn(async () => {
    store.clear();
  }),
  _dump: () => Object.fromEntries(store.entries()),
};

export default AsyncStorage;
