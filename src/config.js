// Central configuration for sensitive keys and client IDs.
// Replace the empty strings below with your real OAuth client IDs.
// For local development with Expo, you can keep these here or load them
// from environment variables. Do NOT commit real secrets to a public repo.

export const GOOGLE_CLIENT_IDS = {
  expoClientId: '',
  iosClientId: '',
  androidClientId: '',
  webClientId: '',
};

// Optionally export other config values here (firebase config, API endpoints, etc.)
export const FIREBASE_CONFIG = {
  projectId: 'jsjproject-e8070',
  projectNumber: '715351171989',
  webApiKey: 'AIzaSyD8ZRgEblfpcZ3sQTbHtrxQ5ZMsK0tFFIE',
  authDomain: 'jsjproject-e8070.firebaseapp.com',
  storageBucket: 'jsjproject-e8070.appspot.com',
  // appId: '',
};

export default {
  GOOGLE_CLIENT_IDS,
  FIREBASE_CONFIG,
};
