// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  // Dynamic campus images that will rotate
  const campusImages = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      title: 'Connect with Campus',
      subtitle: 'Meet students from your university'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
      title: 'Study Together',
      subtitle: 'Find your perfect study group'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
      title: 'Join Events',
      subtitle: 'Discover campus activities'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
      title: 'Build Community',
      subtitle: 'Create lasting connections'
    }
  ];

  // Features with icons
  const features = [
    {
      icon: 'people-circle',
      title: 'Smart Matching',
      description: 'Connect with students who share your interests and courses'
    },
    {
      icon: 'calendar',
      title: 'Event Discovery',
      description: 'Never miss out on campus events and activities'
    },
    {
      icon: 'chatbubbles',
      title: 'Instant Chat',
      description: 'Message your connections and study groups instantly'
    },
    {
      icon: 'trending-up',
      title: 'Grow Network',
      description: 'Build your professional and social network'
    }
  ];

  useEffect(() => {
    // Image rotation every 5 seconds
    const interval = setInterval(() => {
      // Fade out current image
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % campusImages.length
        );
        // Fade in new image
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    // Initial slide animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(interval);
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const currentImage = campusImages[currentImageIndex];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section with Dynamic Image */}
      <View style={styles.heroSection}>
        <Animated.Image
          source={{ uri: currentImage.image }}
          style={[styles.heroImage, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
          style={styles.heroGradient}
        />
        
        <View style={styles.heroContent}>
          <Animated.View style={[styles.logoContainer, { transform: [{ translateY }] }]}>
            <LinearGradient
              colors={['#2D3748', '#4A5568']}
              style={styles.logo}
            >
              <Text style={styles.logoText}>LU</Text>
            </LinearGradient>
            <Text style={styles.appName}>LinkUp</Text>
          </Animated.View>

          <Animated.View style={[styles.heroText, { transform: [{ translateY }] }]}>
            <Text style={styles.heroTitle}>{currentImage.title}</Text>
            <Text style={styles.heroSubtitle}>{currentImage.subtitle}</Text>
          </Animated.View>

          {/* Image Dots Indicator */}
          <View style={styles.dotsContainer}>
            {campusImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentImageIndex && styles.dotActive
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <Animated.View style={[styles.welcomeSection, { transform: [{ translateY }] }]}>
        <Text style={styles.welcomeTitle}>Welcome to LinkUp</Text>
        <Text style={styles.welcomeSubtitle}>
          Your campus connection platform. Connect with peers, join study groups, 
          and discover events that matter to you.
        </Text>
      </Animated.View>

      {/* Features Grid */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.featureCard,
                { 
                  transform: [
                    { translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    })}
                  ] 
                }
              ]}
            >
              <LinearGradient
                colors={['#f8f9fa', '#e9ecef']}
                style={styles.featureIconContainer}
              >
                <Ionicons name={feature.icon} size={28} color="#2D3748" />
              </LinearGradient>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>10K+</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Groups</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Campuses</Text>
        </View>
      </View>

      {/* Auth Buttons Section */}
      <View style={styles.authSection}>
        <Text style={styles.authTitle}>Ready to Get Started?</Text>
        <Text style={styles.authSubtitle}>
          Join thousands of students already building their networks
        </Text>

        <View style={styles.authButtons}>
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <LinearGradient
              colors={['#2D3748', '#4A5568']}
              style={styles.signUpGradient}
            >
              <Ionicons name="person-add" size={18} color="#fff" />
              <Text style={styles.signUpText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <View style={styles.loginContent}>
              <Ionicons name="log-in" size={18} color="#2D3748" />
              <Text style={styles.loginText}>Sign In</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.guestText}>
          or{' '}
          <Text 
            style={styles.guestLink}
            onPress={() => navigation.navigate('Discover')}
          >
            explore as guest
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: height * 0.6,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  heroContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroText: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  welcomeSection: {
    padding: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f3f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 24,
    borderRadius: 20,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  authSection: {
    padding: 32,
    alignItems: 'center',
    marginTop: 16,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  signUpButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    borderWidth: 2,
    borderColor: '#2D3748',
    borderRadius: 12,
    minWidth: 120,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    gap: 8,
  },
  loginText: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '600',
  },
  guestText: {
    fontSize: 14,
    color: '#718096',
  },
  guestLink: {
    color: '#2D3748',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;