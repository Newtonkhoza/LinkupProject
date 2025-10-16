import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
  ScrollView,
  Alert
} from 'react-native';

const GroupsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('wellness');

  // Categories with creative icons and colors
  const categories = [
    { id: 'all', name: 'All Groups', icon: '🌍', color: '#6366f1' },
    { id: 'wellness', name: 'Wellness', icon: '🌿', color: '#10b981' },
    { id: 'learning', name: 'Learning', icon: '📚', color: '#f59e0b' },
    { id: 'creative', name: 'Creative', icon: '🎨', color: '#8b5cf6' },
    { id: 'support', name: 'Support', icon: '🤝', color: '#ec4899' },
    { id: 'social', name: 'Social', icon: '💫', color: '#06b6d4' },
  ];

  // Sample groups with creative descriptions
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Mindful Moments',
      category: 'wellness',
      members: 243,
      description: 'A safe space for meditation and mindfulness practices',
      icon: '🧘‍♀️',
      color: '#10b981',
      isPrivate: false,
      online: 12,
      rules: ['Be respectful', 'No spam', 'Keep it positive']
    },
    {
      id: '2',
      name: 'Creative Writers Hub',
      category: 'creative',
      members: 156,
      description: 'Share your stories and get constructive feedback',
      icon: '✍️',
      color: '#8b5cf6',
      isPrivate: true,
      online: 8,
      rules: ['Constructive feedback only', 'Respect copyright', 'Encourage others']
    },
    {
      id: '3',
      name: 'Tech Learners United',
      category: 'learning',
      members: 589,
      description: 'Learn coding and tech skills together',
      icon: '💻',
      color: '#f59e0b',
      isPrivate: false,
      online: 23,
      rules: ['No question is dumb', 'Share resources', 'Help each other grow']
    },
    {
      id: '4',
      name: 'Mental Health Support',
      category: 'support',
      members: 432,
      description: 'A caring community for mental health discussions',
      icon: '💚',
      color: '#ec4899',
      isPrivate: true,
      online: 15,
      rules: ['Strict confidentiality', 'No judgment', 'Professional boundaries']
    },
    {
      id: '5',
      name: 'Social Anxiety Warriors',
      category: 'support',
      members: 321,
      description: 'Overcoming social anxiety together, one step at a time',
      icon: '🛡️',
      color: '#6366f1',
      isPrivate: true,
      online: 9,
      rules: ['Zero judgment zone', 'Share at your own pace', 'Respect boundaries']
    },
    {
      id: '6',
      name: 'Art Therapy Collective',
      category: 'creative',
      members: 198,
      description: 'Heal and express through various art forms',
      icon: '🎨',
      color: '#ef4444',
      isPrivate: false,
      online: 6,
      rules: ['No art criticism', 'Express freely', 'Supportive environment']
    },
    {
      id: '7',
      name: 'Book Lovers Sanctuary',
      category: 'social',
      members: 267,
      description: 'Discuss books in a cozy, inclusive environment',
      icon: '📖',
      color: '#06b6d4',
      isPrivate: false,
      online: 11,
      rules: ['Respect different opinions', 'No spoilers', 'Diverse reading']
    },
    {
      id: '8',
      name: 'Fitness & Self-Care',
      category: 'wellness',
      members: 345,
      description: 'Holistic approach to fitness and self-care routines',
      icon: '💪',
      color: '#84cc16',
      isPrivate: false,
      online: 18,
      rules: ['Body positive', 'No diet talk', 'Celebrate progress']
    }
  ]);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const createNewGroup = () => {
    if (newGroupName.trim() === '') {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      category: newGroupCategory,
      members: 1,
      description: 'A new supportive community',
      icon: '🌟',
      color: categories.find(cat => cat.id === newGroupCategory)?.color || '#6366f1',
      isPrivate: true,
      online: 1,
      rules: ['Be kind', 'Respect everyone', 'No harassment']
    };

    setGroups(prev => [newGroup, ...prev]);
    setNewGroupName('');
    setShowCreateModal(false);
    
    // Navigate to the new group
    navigateToGroupChat(newGroup);
  };

  const navigateToGroupChat = (group) => {
    navigation.navigate('GroupChat', { group });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        { backgroundColor: selectedCategory === item.id ? item.color : '#f8fafc' },
        selectedCategory === item.id && { borderColor: item.color }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[styles.categoryIcon, { color: selectedCategory === item.id ? 'white' : item.color }]}>
        {item.icon}
      </Text>
      <Text style={[
        styles.categoryText,
        { color: selectedCategory === item.id ? 'white' : '#64748b' }
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigateToGroupChat(item)}
    >
      <View style={styles.groupHeader}>
        <View style={[styles.groupIcon, { backgroundColor: `${item.color}20` }]}>
          <Text style={[styles.groupIconText, { color: item.color }]}>
            {item.icon}
          </Text>
        </View>
        <View style={styles.groupInfo}>
          <View style={styles.groupTitleRow}>
            <Text style={styles.groupName}>{item.name}</Text>
            {item.isPrivate && (
              <Text style={styles.privateBadge}>Private</Text>
            )}
          </View>
          <Text style={styles.groupDescription}>{item.description}</Text>
          <View style={styles.groupStats}>
            <Text style={styles.memberCount}>👥 {item.members} members</Text>
            <Text style={styles.onlineCount}>🟢 {item.online} online</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.groupRules}>
        <Text style={styles.rulesTitle}>Community Guidelines:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.rules.map((rule, index) => (
            <View key={index} style={styles.ruleChip}>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Enter Safe Space →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Safe Spaces</Text>
          <Text style={styles.headerSubtitle}>Find your supportive community</Text>
        </View>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for supportive groups..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      {/* Safety Message */}
      <View style={styles.safetyBanner}>
        <Text style={styles.safetyIcon}>🛡️</Text>
        <Text style={styles.safetyText}>
          This is a safe space. Harassment of any kind is not tolerated.
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Find Your Community</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Groups List */}
      <View style={styles.groupsSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Supportive Communities' : 
           categories.find(cat => cat.id === selectedCategory)?.name + ' Communities'}
        </Text>
        <FlatList
          data={filteredGroups}
          renderItem={renderGroupItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.groupsList}
        />
      </View>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Safe Space</Text>
            
            <Text style={styles.inputLabel}>Group Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Choose a welcoming name..."
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelection}>
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalCategoryChip,
                    { 
                      backgroundColor: newGroupCategory === category.id ? category.color : '#f8fafc',
                      borderColor: category.color
                    }
                  ]}
                  onPress={() => setNewGroupCategory(category.id)}
                >
                  <Text style={[
                    styles.modalCategoryText,
                    { color: newGroupCategory === category.id ? 'white' : category.color }
                  ]}>
                    {category.icon} {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createModalButton}
                onPress={createNewGroup}
              >
                <Text style={styles.createModalButtonText}>Create Safe Space</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  searchIcon: {
    fontSize: 18,
    color: '#64748b',
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  safetyIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  safetyText: {
    flex: 1,
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 20,
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  groupsSection: {
    flex: 1,
  },
  groupsList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  groupHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  groupIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  groupIconText: {
    fontSize: 24,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 10,
  },
  privateBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  groupDescription: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberCount: {
    color: '#475569',
    fontSize: 12,
  },
  onlineCount: {
    color: '#16a34a',
    fontSize: 12,
  },
  groupRules: {
    marginBottom: 15,
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  ruleChip: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ruleText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  categorySelection: {
    marginBottom: 25,
  },
  modalCategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
  },
  modalCategoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  createModalButton: {
    flex: 2,
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  createModalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default GroupsScreen;