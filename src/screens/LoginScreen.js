// src/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Firebase imports - with error handling
let GoogleAuthProvider, signInWithCredential, auth;

try {
  const firebaseAuth = require('firebase/auth');
  GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
  signInWithCredential = firebaseAuth.signInWithCredential;
  
  // Try to import auth from firebase config
  const firebaseConfig = require('../../firebase');
  auth = firebaseConfig.auth;
} catch (error) {
  console.log('Firebase not configured, using demo mode');
}

// Required for Google Auth in Expo
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '715351171989-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
    iosClientId: '715351171989-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
    androidClientId: '715351171989-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
    webClientId: '715351171989-xxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignIn(authentication);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!username) { 
      Alert.alert('Error', 'Please enter your username'); 
      return; 
    }
    if (!password) { 
      Alert.alert('Error', 'Please enter your password'); 
      return; 
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (username === 'demo' && password === 'password') {
        Alert.alert('Success', 'Login successful!');
        navigation?.navigate?.('MainApp', { screen: 'Profile' });
      } else {
        Alert.alert('Error', 'Invalid credentials. Use demo/password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (authentication) => {
    if (!authentication) {
      Alert.alert('Error', 'Google authentication failed');
      return;
    }
    
    setGoogleLoading(true);
    
    try {
      // Check if Firebase is available
      if (GoogleAuthProvider && signInWithCredential && auth) {
        const credential = GoogleAuthProvider.credential(
          authentication.idToken,
          authentication.accessToken
        );
        
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        
        console.log('Google Sign In Success:', user);
        Alert.alert('Success', `Welcome ${user.displayName || user.email}!`);
        navigation?.navigate?.('MainApp', { screen: 'Profile' });
      } else {
        // Firebase not configured - use demo mode
        throw new Error('Firebase not configured');
      }
      
    } catch (error) {
      console.error('Google Sign In Error:', error);
      
      // Fallback demo mode
      Alert.alert(
        'Google Sign In', 
        'Firebase authentication not configured. Using demo mode.',
        [
          {
            text: 'Continue as Demo',
            onPress: () => navigation?.navigate?.('MainApp', { screen: 'Profile' })
          }
        ]
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const startGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google prompt error:', error);
      Alert.alert('Error', 'Failed to start Google sign in');
      setGoogleLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation?.navigate?.('Signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset feature coming soon!');
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to JSJPROJECT</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Username (use 'demo')" 
          placeholderTextColor="#718096"
          value={username} 
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Password (use 'password')" 
          placeholderTextColor="#718096"
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.loginButton,
            isLoading && styles.loginButtonDisabled
          ]} 
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        {/* Google Sign In */}
        <TouchableOpacity 
          style={[
            styles.googleButton,
            googleLoading && styles.googleButtonDisabled
          ]}
          onPress={startGoogleSignIn}
          activeOpacity={0.8}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#2D3748" size="small" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#2D3748" />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Sign Up Section */}
      <View style={styles.signupContainer}>
        <View style={styles.row}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signupLink}>Create one</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.signupButton}
          onPress={handleSignUp}
          activeOpacity={0.7}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        maxWidth: 500,
        alignSelf: 'center',
        width: '100%',
        paddingVertical: 40,
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 40 : 20,
    marginBottom: 40,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#718096',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#2D3748',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2D3748',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#718096',
    fontSize: 14,
    marginHorizontal: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: '#2D3748',
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: '500',
  },
  signupContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 24,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  signupText: {
    color: '#718096',
    fontSize: 14,
  },
  signupLink: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  signupButtonText: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;