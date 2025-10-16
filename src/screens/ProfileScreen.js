// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'Jordan Smith',
    surname: 'Smith',
    email: 'j.smith@university.edu',
    username: 'jordansmith',
    major: 'Computer Science',
    year: 'Junior',
    bio: 'Passionate about AI and machine learning. Looking for study partners!',
    interests: ['Coding', 'AI/ML', 'Basketball', 'Photography', 'Coffee'],
    mood: 'Studying',
    province: 'Gauteng',
    faculty: 'Science',
    course: 'Computer Science',
    yearOfStudy: 3,
    qualifications: ['National Senior Certificate', 'Python Programming Certificate']
  });

  const [activeTab, setActiveTab] = useState('profile');
  const fadeAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const moods = [
    { emoji: '📚', label: 'Studying', color: '#2D3748' },
    { emoji: '💬', label: 'Chatting', color: '#4A5568' },
    { emoji: '👥', label: 'Collaborating', color: '#718096' },
    { emoji: '☕', label: 'Coffee Break', color: '#4A5568' },
    { emoji: '🎮', label: 'Gaming', color: '#2D3748' },
  ];

  const stats = [
    { number: '24', label: 'Connections', icon: 'people' },
    { number: '8', label: 'Groups', icon: 'people-circle' },
    { number: '12', label: 'Events', icon: 'calendar' },
    { number: '6', label: 'Posts', icon: 'document-text' },
  ];

  const recentActivity = [
    { action: 'Joined CS Study Group', time: '2 hours ago', icon: 'people' },
    { action: 'Attended Tech Workshop', time: '1 day ago', icon: 'school' },
    { action: 'Posted in AI Discussion', time: '2 days ago', icon: 'chatbubble' },
    { action: 'Connected with Sarah Chen', time: '3 days ago', icon: 'person-add' },
  ];

  const updateMood = (mood) => {
    setUser({...user, mood: mood.label});
  };

  const handleEditProfile = () => {
    console.log('Navigating to ProfileEdit...');
    navigation.navigate('ProfileEdit', { 
      user: user,
      onProfileUpdate: (updatedUser) => {
        console.log('Profile updated:', updatedUser);
        setUser(updatedUser);
      }
    });
  };

  const handleSettings = () => {
    console.log('Navigating to Settings...');
    navigation.navigate('ProfileEdit', { 
      user: user,
      onProfileUpdate: (updatedUser) => {
        setUser(updatedUser);
      },
      initialSection: 'settings'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#404040']}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#4A5568', '#2D3748']}
            style={styles.avatarContainer}
          >
            <Text style={styles.avatarText}>
              {user.name.charAt(0)}{user.surname.charAt(0)}
            </Text>
            <View style={styles.onlineIndicator} />
          </LinearGradient>
          
          <Text style={styles.userName}>{user.name} {user.surname}</Text>
          <Text style={styles.userDetails}>{user.major} • {user.year}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Ionicons 
              name="pencil" 
              size={18} 
              color="#000" 
            />
            <Text style={styles.editButtonText}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'activity' && styles.tabActive]}
            onPress={() => setActiveTab('activity')}
          >
            <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>
              Activity
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'academic' && styles.tabActive]}
            onPress={() => setActiveTab('academic')}
          >
            <Text style={[styles.tabText, activeTab === 'academic' && styles.tabTextActive]}>
              Academic
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'profile' ? (
          <>
            {/* Mood Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="happy-outline" size={20} color="#2D3748" />
                <Text style={styles.sectionTitle}>Current Mood</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
                {moods.map((mood, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.moodOption,
                      user.mood === mood.label && styles.moodSelected
                    ]}
                    onPress={() => updateMood(mood)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={[
                      styles.moodLabel,
                      user.mood === mood.label && styles.moodLabelSelected
                    ]}>
                      {mood.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Bio Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={20} color="#2D3748" />
                <Text style={styles.sectionTitle}>About Me</Text>
              </View>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>

            {/* Interests */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pricetags-outline" size={20} color="#2D3748" />
                <Text style={styles.sectionTitle}>Interests</Text>
              </View>
              <View style={styles.interestsGrid}>
                {user.interests.map((interest, index) => (
                  <View key={index} style={styles.interestChip}>
                    <Text style={styles.interestChipText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <LinearGradient
                    colors={['#f8f9fa', '#e9ecef']}
                    style={styles.statGradient}
                  >
                    <Ionicons name={stat.icon} size={24} color="#2D3748" />
                    <Text style={styles.statNumber}>{stat.number}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </>
        ) : activeTab === 'activity' ? (
          /* Activity Tab */
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={20} color="#2D3748" />
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            {recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name={activity.icon} size={18} color="#4A5568" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* Academic Tab */
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="school-outline" size={20} color="#2D3748" />
              <Text style={styles.sectionTitle}>Academic Information</Text>
            </View>
            
            <View style={styles.academicInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#718096" />
                <Text style={styles.infoLabel}>Province:</Text>
                <Text style={styles.infoValue}>{user.province}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={18} color="#718096" />
                <Text style={styles.infoLabel}>Faculty:</Text>
                <Text style={styles.infoValue}>{user.faculty}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="book-outline" size={18} color="#718096" />
                <Text style={styles.infoLabel}>Course:</Text>
                <Text style={styles.infoValue}>{user.course}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color="#718096" />
                <Text style={styles.infoLabel}>Year of Study:</Text>
                <Text style={styles.infoValue}>Year {user.yearOfStudy}</Text>
              </View>
            </View>

            {/* Qualifications */}
            <View style={styles.qualificationsSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="ribbon-outline" size={20} color="#2D3748" />
                <Text style={styles.sectionTitle}>Qualifications</Text>
              </View>
              <View style={styles.qualificationsList}>
                {user.qualifications.map((qualification, index) => (
                  <View key={index} style={styles.qualificationItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#38A169" />
                    <Text style={styles.qualificationText}>{qualification}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={20} color="#2D3748" />
            <Text style={styles.actionText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="qr-code" size={20} color="#2D3748" />
            <Text style={styles.actionText}>QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Ionicons name="settings" size={20} color="#2D3748" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#2D3748',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#2D3748',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  tabTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginLeft: 8,
  },
  moodScroll: {
    marginHorizontal: -5,
  },
  moodOption: {
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodSelected: {
    backgroundColor: '#2D3748',
    borderColor: '#2D3748',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
  },
  moodLabelSelected: {
    color: '#fff',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A5568',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  interestChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#718096',
  },
  academicInfo: {
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 12,
    marginRight: 8,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#4A5568',
    flex: 1,
  },
  qualificationsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  qualificationsList: {
    gap: 8,
  },
  qualificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualificationText: {
    fontSize: 14,
    color: '#4A5568',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default ProfileScreen;