import * as SecureStore from 'expo-secure-store';

// Handle securestore with JSON serialization
export async function setSecure(key, value) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}
export async function getSecure(key, fallback = null) {
  const v = await SecureStore.getItemAsync(key);
  return v ? JSON.parse(v) : fallback;
}

