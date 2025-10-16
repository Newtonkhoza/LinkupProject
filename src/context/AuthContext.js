import React, { createContext, useState, useEffect } from 'react';

let AsyncStorage = null;
let SecureStore = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // AsyncStorage not installed in environment; we'll fall back to SecureStore or in-memory only.
}

try {
  SecureStore = require('expo-secure-store');
} catch (e) {
  // expo-secure-store not installed; we'll fallback to AsyncStorage or memory.
}

export const AuthContext = createContext({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  updateUser: async () => {},
});

const STORAGE_KEY = '@linkup_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let raw = null;
        if (SecureStore && SecureStore.getItemAsync) {
          raw = await SecureStore.getItemAsync(STORAGE_KEY);
        } else if (AsyncStorage) {
          raw = await AsyncStorage.getItem(STORAGE_KEY);
        }

        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const persist = async (u) => {
    if (!u) return;
    try {
      const raw = JSON.stringify(u);
      if (SecureStore && SecureStore.setItemAsync) {
        await SecureStore.setItemAsync(STORAGE_KEY, raw);
      } else if (AsyncStorage) {
        await AsyncStorage.setItem(STORAGE_KEY, raw);
      }
    } catch (e) {
      // ignore
    }
  };

  const signIn = async (payload = {}) => {
    // Accept a full user object from backend (Firebase) or a minimal payload
    const u = {
      id: payload.id || payload.uid || payload.username || 'demo',
      name: payload.name || payload.displayName || payload.username || 'Demo User',
      email: payload.email || payload.emailAddress || null,
      photoURL: payload.photoURL || null,
      provider: payload.provider || 'local',
      raw: payload || {},
    };
    setUser(u);
    await persist(u);
    return u;
  };

  const updateUser = async (patch = {}) => {
    const next = { ...(user || {}), ...patch };
    setUser(next);
    await persist(next);
    return next;
  };

  const signUp = async (payload = {}) => {
    // For this app we treat signUp the same as signIn (demo/local flow).
    return signIn(payload);
  };

  const signOut = async () => {
    setUser(null);
    try {
      if (SecureStore && SecureStore.deleteItemAsync) {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
      } else if (AsyncStorage) {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
