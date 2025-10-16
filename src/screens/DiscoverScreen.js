// src/screens/DiscoverScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DiscoverScreen = ({ navigation }) => {
  const categories = [
    {
      id: 1,
      title: 'Main Library',
      description: 'Access academic resources, books, and research materials',
      icon: 'library-outline',
      color: '#2D3748',
      screen: 'MyLibrary',
    },
    {
      id: 2,
      title: 'Study Groups',
      description: 'Join or create study groups with peers',
      icon: 'people-outline',
      color: '#4A5568',
    },
    {
      id: 3,
      title: 'Campus Events',
      description: 'Discover workshops, seminars, and social events',
      icon: 'calendar-outline',
      color: '#718096',
    },
    {
      id: 4,
      title: 'Career Hub',
      description: 'Internships, job opportunities, and career guidance',
      icon: 'briefcase-outline',
      color: '#2C7A7B',
    },
  ];

  const featuredResources = [
    {
      id: 1,
      title: 'Research Papers',
      count: '1.2K+',
      icon: 'document-text-outline',
    },
    {
      id: 2,
      title: 'E-Books',
      count: '5K+',
      icon: 'book-outline',
    },
    {
      id: 3,
      title: 'Video Lectures',
      count: '800+',
      icon: 'play-circle-outline',
    },
    {
      id: 4,
      title: 'Study Notes',
      count: '3.5K+',
      icon: 'create-outline',
    },
  ];

  const handleCategoryPress = (category) => {
    if (category.screen) {
      navigation.navigate(category.screen);
    } else {
      console.log(`Screen not defined for ${category.title}`);
      // You could show an alert or handle this case
      alert(`${category.title} feature coming soon!`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Explore academic resources and opportunities</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#718096" />
        <Text style={styles.searchPlaceholder}>Search resources, groups, events...</Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                <Ionicons name={category.icon} size={24} color={category.color} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Library Resources</Text>
        <View style={styles.statsGrid}>
          {featuredResources.map((resource) => (
            <View key={resource.id} style={styles.statCard}>
              <Ionicons name={resource.icon} size={24} color="#2D3748" />
              <Text style={styles.statCount}>{resource.count}</Text>
              <Text style={styles.statLabel}>{resource.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentItems}>
          <View style={styles.recentItem}>
            <View style={styles.recentIcon}>
              <Ionicons name="book" size={16} color="#fff" />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>Advanced Machine Learning</Text>
              <Text style={styles.recentSubtitle}>Textbook • Computer Science</Text>
            </View>
          </View>
          
          <View style={styles.recentItem}>
            <View style={[styles.recentIcon, { backgroundColor: '#4C51BF' }]}>
              <Ionicons name="document" size={16} color="#fff" />
            </View>
            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>Quantum Physics Research</Text>
              <Text style={styles.recentSubtitle}>Research Paper • Physics</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchPlaceholder: {
    marginLeft: 12,
    color: '#718096',
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  seeAllText: {
    color: '#2D3748',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          transform: 'translateY(-2px)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      },
    }),
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  recentItems: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  recentIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: 12,
    color: '#718096',
  },
});

export default DiscoverScreen;