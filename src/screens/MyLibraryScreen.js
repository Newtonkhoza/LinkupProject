// src/screens/MyLibraryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MyLibraryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [localResources, setLocalResources] = useState([]);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');

  // Initialize with local resources
  useEffect(() => {
    setLocalResources(libraryResources);
  }, []);

  const categories = [
    { id: 'all', name: 'All Resources', icon: 'grid-outline' },
    { id: 'books', name: 'Textbooks', icon: 'book-outline' },
    { id: 'papers', name: 'Research Papers', icon: 'document-text-outline' },
    { id: 'notes', name: 'Study Notes', icon: 'create-outline' },
    { id: 'videos', name: 'Video Lectures', icon: 'play-circle-outline' },
    { id: 'online', name: 'Online Books', icon: 'globe-outline' },
  ];

  const libraryResources = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      type: 'book',
      category: 'Computer Science',
      pages: 1292,
      rating: 4.8,
      isFeatured: true,
      isNew: false,
      isLocal: true,
    },
    {
      id: 2,
      title: 'Machine Learning: A Probabilistic Perspective',
      author: 'Kevin P. Murphy',
      type: 'book',
      category: 'Artificial Intelligence',
      pages: 1104,
      rating: 4.7,
      isFeatured: true,
      isNew: true,
      isLocal: true,
    },
    {
      id: 3,
      title: 'Deep Learning in Neural Networks',
      author: 'Dr. Sarah Chen et al.',
      type: 'paper',
      category: 'Neural Networks',
      pages: 45,
      rating: 4.9,
      isFeatured: false,
      isNew: true,
      isLocal: true,
    },
  ];

  // Open Library API - Free book search
  const searchOpenLibrary = async (query) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
      );
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        return data.docs.map((book, index) => ({
          id: `ol-${book.key}`,
          title: book.title || 'Unknown Title',
          author: book.author_name ? book.author_name[0] : 'Unknown Author',
          type: 'online',
          category: 'Online Book',
          pages: book.number_of_pages_median || 'N/A',
          rating: 4.0 + (Math.random() * 1.0),
          isFeatured: false,
          isNew: true,
          isLocal: false,
          coverUrl: book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null,
          openLibraryKey: book.key,
          source: 'Open Library'
        }));
      }
      return [];
    } catch (error) {
      console.error('Open Library API error:', error);
      return [];
    }
  };

  // Google Books API
  const searchGoogleBooks = async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items.map((item, index) => {
          const volumeInfo = item.volumeInfo;
          return {
            id: `gb-${item.id}`,
            title: volumeInfo.title || 'Unknown Title',
            author: volumeInfo.authors ? volumeInfo.authors[0] : 'Unknown Author',
            type: 'online',
            category: volumeInfo.categories ? volumeInfo.categories[0] : 'Online Book',
            pages: volumeInfo.pageCount || 'N/A',
            rating: volumeInfo.averageRating || (4.0 + Math.random() * 1.0),
            isFeatured: false,
            isNew: true,
            isLocal: false,
            coverUrl: volumeInfo.imageLinks?.thumbnail,
            previewLink: volumeInfo.previewLink,
            infoLink: volumeInfo.infoLink,
            source: 'Google Books'
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Google Books API error:', error);
      return [];
    }
  };

  // AI Chat Integration Functions
  const openAIChat = async (subject, message = '') => {
    setCurrentSubject(subject);
    const initialMessage = message || `I need help with ${subject} for my studies. Can you explain key concepts and provide examples?`;
    
    setChatMessages([
      {
        id: 1,
        text: `Hello! I'm your study assistant. I can help you with ${subject}. What specific topics would you like to learn about?`,
        isUser: false,
        timestamp: new Date(),
      }
    ]);
    setChatModalVisible(true);
    setUserMessage(initialMessage);
  };

  // Option 1: OpenAI API (Requires API Key)
  const sendMessageToOpenAI = async (message) => {
    try {
      // You'll need to set up a backend proxy for security
      // This is a sample implementation - you should use your own backend
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Replace with your API key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful study assistant specializing in ${currentSubject}. Provide clear explanations, examples, and study tips.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'I apologize, but I am currently unable to respond. Please check your internet connection and try again.';
    }
  };

  // Option 2: Hugging Face Inference API (Free tier available)
  const sendMessageToHuggingFace = async (message) => {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_HUGGING_FACE_TOKEN', // Replace with your token
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {
              text: `Subject: ${currentSubject}. Question: ${message}`,
            },
          }),
        }
      );

      const data = await response.json();
      return data.generated_text || 'I apologize, but I encountered an error. Please try again.';
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return 'I apologize, but I am currently unable to respond. Please try again.';
    }
  };

  // Option 3: Cohere API (Developer-friendly, free tier)
  const sendMessageToCohere = async (message) => {
    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_COHERE_API_KEY', // Replace with your API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `As a study assistant for ${currentSubject}, help with this: ${message}`,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.generations[0]?.text || 'I apologize, but I encountered an error. Please try again.';
    } catch (error) {
      console.error('Cohere API error:', error);
      return 'I apologize, but I am currently unable to respond. Please try again.';
    }
  };

  // Option 4: Anthropic Claude API (High quality, paid)
  const sendMessageToClaude = async (message) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': 'YOUR_ANTHROPIC_API_KEY', // Replace with your API key
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `As a study assistant for ${currentSubject}, please help me with: ${message}`
            }
          ],
        }),
      });

      const data = await response.json();
      return data.content[0]?.text || 'I apologize, but I encountered an error. Please try again.';
    } catch (error) {
      console.error('Claude API error:', error);
      return 'I apologize, but I am currently unable to respond. Please try again.';
    }
  };

  // Main chat function - choose one of the above APIs
  const sendChatMessage = async (message) => {
    if (!message.trim()) return;

    setIsChatLoading(true);
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');

    try {
      // Choose your preferred AI service:
      // Option 1: OpenAI (recommended for best results)
      const aiResponse = await sendMessageToOpenAI(message);
      
      // Option 2: Uncomment to use Hugging Face instead
      // const aiResponse = await sendMessageToHuggingFace(message);
      
      // Option 3: Uncomment to use Cohere instead
      // const aiResponse = await sendMessageToCohere(message);
      
      // Option 4: Uncomment to use Claude instead
      // const aiResponse = await sendMessageToClaude(message);

      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please check your API configuration and try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const [openLibraryResults, googleBooksResults] = await Promise.all([
        searchOpenLibrary(query),
        searchGoogleBooks(query)
      ]);

      const combinedResults = [...openLibraryResults, ...googleBooksResults];
      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search online resources');
    } finally {
      setIsLoading(false);
    }
  };

  // Study assistance functions
  const openWolframAlpha = (query) => {
    const encodedQuery = encodeURIComponent(query);
    Linking.openURL(`https://www.wolframalpha.com/input?i=${encodedQuery}`);
  };

  const openKhanAcademy = (subject) => {
    const subjects = {
      'math': 'math',
      'physics': 'physics',
      'chemistry': 'chemistry',
      'computer science': 'computing',
      'biology': 'biology'
    };
    const path = subjects[subject.toLowerCase()] || 'search';
    Linking.openURL(`https://www.khanacademy.org/${path}`);
  };

  const openCodingResources = () => {
    Linking.openURL('https://www.freecodecamp.org/');
  };

  const openEssayHelp = () => {
    Linking.openURL('https://owl.purdue.edu/owl/purdue_owl.html');
  };

  const handleResourcePress = async (resource) => {
    if (resource.isLocal) {
      Alert.alert(
        resource.title,
        `Author: ${resource.author}\nCategory: ${resource.category}\n${resource.pages ? `Pages: ${resource.pages}` : 'Digital Resource'}\nRating: ${resource.rating}/5.0`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'AI Study Assistant', onPress: () => openAIChat(resource.category) },
          { text: 'View Details', onPress: () => console.log('View details pressed') },
        ]
      );
    } else {
      const actions = [
        { text: 'Cancel', style: 'cancel' },
        { text: 'AI Study Assistant', onPress: () => openAIChat(resource.category) },
      ];

      if (resource.previewLink) {
        actions.push({ text: 'Preview Book', onPress: () => Linking.openURL(resource.previewLink) });
      }
      
      if (resource.infoLink) {
        actions.push({ text: 'More Info', onPress: () => Linking.openURL(resource.infoLink) });
      }

      Alert.alert(
        `${resource.title} (${resource.source})`,
        `Author: ${resource.author}\nCategory: ${resource.category}\nSource: ${resource.source}`,
        actions
      );
    }
  };

  const showStudyAssistanceOptions = (resource) => {
    Alert.alert(
      'Study Assistance',
      `Get help with "${resource.title}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'AI Study Assistant', onPress: () => openAIChat(resource.category) },
        { text: 'Video Tutorials', onPress: () => openKhanAcademy(resource.category) },
        { text: 'Coding Help', onPress: openCodingResources },
        { text: 'Essay Writing Help', onPress: openEssayHelp },
        { text: 'Math/Science Help', onPress: () => openWolframAlpha(resource.title) },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (searchQuery) {
      performSearch(searchQuery);
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredResources = searchQuery ? searchResults : localResources;
  const featuredResources = localResources.filter(resource => resource.isFeatured);
  const newResources = localResources.filter(resource => resource.isNew);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book': return 'book-outline';
      case 'paper': return 'document-text-outline';
      case 'notes': return 'create-outline';
      case 'video': return 'play-circle-outline';
      case 'online': return 'globe-outline';
      default: return 'document-outline';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'book': return '#2C7A7B';
      case 'paper': return '#2D3748';
      case 'notes': return '#D69E2E';
      case 'video': return '#C53030';
      case 'online': return '#4C51BF';
      default: return '#718096';
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    setUserMessage('');
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>My Library</Text>
          <Text style={styles.subtitle}>Academic resources with AI study assistant</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#2D3748" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#718096" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search books, papers, or online resources..."
          placeholderTextColor="#A0AEC0"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.length > 2) {
              performSearch(text);
            } else if (text.length === 0) {
              setSearchResults([]);
            }
          }}
          returnKeyType="search"
          onSubmitEditing={() => performSearch(searchQuery)}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="#2D3748" />
        ) : searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setSearchResults([]);
          }}>
            <Ionicons name="close-circle" size={20} color="#718096" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Assistance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => openAIChat('general studies')}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#4C51BF" />
            <Text style={styles.quickActionText}>AI Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={openCodingResources}>
            <Ionicons name="code-slash" size={24} color="#2C7A7B" />
            <Text style={styles.quickActionText}>Coding Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={openEssayHelp}>
            <Ionicons name="create" size={24} color="#D69E2E" />
            <Text style={styles.quickActionText}>Essay Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => openWolframAlpha('math')}>
            <Ionicons name="calculator" size={24} color="#C53030" />
            <Text style={styles.quickActionText}>Math/Science</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => openKhanAcademy('general')}>
            <Ionicons name="play-circle" size={24} color="#2D3748" />
            <Text style={styles.quickActionText}>Video Lessons</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setActiveCategory(category.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={activeCategory === category.id ? '#fff' : '#2D3748'} 
            />
            <Text style={[
              styles.categoryButtonText,
              activeCategory === category.id && styles.categoryButtonTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Results Header */}
      {searchQuery && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isLoading ? 'Searching...' : `Search Results for "${searchQuery}"`}
          </Text>
          <Text style={styles.resourceCount}>{searchResults.length} results</Text>
        </View>
      )}

      {/* Featured Resources */}
      {!searchQuery && featuredResources.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Resources</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredResources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={styles.featuredCard}
                onPress={() => handleResourcePress(resource)}
                activeOpacity={0.7}
              >
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={12} color="#fff" />
                </View>
                <View style={[styles.resourceIcon, { backgroundColor: `${getTypeColor(resource.type)}15` }]}>
                  <Ionicons name={getTypeIcon(resource.type)} size={24} color={getTypeColor(resource.type)} />
                </View>
                <Text style={styles.featuredTitle} numberOfLines={2}>{resource.title}</Text>
                <Text style={styles.featuredAuthor} numberOfLines={1}>{resource.author}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#D69E2E" />
                  <Text style={styles.rating}>{resource.rating}</Text>
                  <Text style={styles.categoryTag}>{resource.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* All Resources */}
      <View style={styles.section}>
        {!searchQuery && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Resources</Text>
            <Text style={styles.resourceCount}>{filteredResources.length} items</Text>
          </View>
        )}
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2D3748" />
            <Text style={styles.loadingText}>Searching online resources...</Text>
          </View>
        ) : filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => handleResourcePress(resource)}
              activeOpacity={0.7}
            >
              <View style={[styles.resourceIcon, { backgroundColor: `${getTypeColor(resource.type)}15` }]}>
                <Ionicons name={getTypeIcon(resource.type)} size={20} color={getTypeColor(resource.type)} />
                {!resource.isLocal && (
                  <View style={styles.onlineBadge}>
                    <Ionicons name="globe" size={8} color="#fff" />
                  </View>
                )}
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle} numberOfLines={1}>{resource.title}</Text>
                <Text style={styles.resourceAuthor} numberOfLines={1}>{resource.author}</Text>
                <View style={styles.resourceMeta}>
                  <Text style={styles.resourceCategory}>{resource.category}</Text>
                  {!resource.isLocal && (
                    <Text style={styles.sourceTag}>{resource.source}</Text>
                  )}
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#D69E2E" />
                    <Text style={styles.rating}>{resource.rating}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
            </TouchableOpacity>
          ))
        ) : searchQuery ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#CBD5E0" />
            <Text style={styles.emptyStateText}>No resources found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search terms</Text>
          </View>
        ) : null}
      </View>

      {/* AI Chat Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={chatModalVisible}
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setChatModalVisible(false)}
              style={styles.modalBackButton}
            >
              <Ionicons name="arrow-back" size={24} color="#2D3748" />
            </TouchableOpacity>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalTitle}>AI Study Assistant</Text>
              <Text style={styles.modalSubtitle}>Helping with: {currentSubject}</Text>
            </View>
            <TouchableOpacity onPress={clearChat} style={styles.clearChatButton}>
              <Ionicons name="trash-outline" size={20} color="#718096" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
            {chatMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.botMessageText,
                ]}>
                  {message.text}
                </Text>
                <Text style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
            {isChatLoading && (
              <View style={[styles.messageBubble, styles.botMessage]}>
                <ActivityIndicator size="small" color="#4C51BF" />
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask a question about your study topic..."
              placeholderTextColor="#A0AEC0"
              value={userMessage}
              onChangeText={setUserMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!userMessage.trim() || isChatLoading) && styles.sendButtonDisabled,
              ]}
              onPress={() => sendChatMessage(userMessage)}
              disabled={!userMessage.trim() || isChatLoading}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={!userMessage.trim() || isChatLoading ? "#CBD5E0" : "#fff"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    fontSize: 16,
    color: '#2D3748',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  seeAllText: {
    color: '#2D3748',
    fontWeight: '600',
    fontSize: 14,
  },
  resourceCount: {
    color: '#718096',
    fontSize: 14,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  categoryButtonActive: {
    backgroundColor: '#2D3748',
    borderColor: '#2D3748',
  },
  categoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  // Quick Actions
  quickActionCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 80,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
  // Resource Cards
  featuredCard: {
    width: 200,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#D69E2E',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4C51BF',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  resourceAuthor: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resourceCategory: {
    fontSize: 11,
    color: '#718096',
    backgroundColor: '#f7fafc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sourceTag: {
    fontSize: 10,
    color: '#4C51BF',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#2D3748',
    fontWeight: '600',
  },
  // Loading and Empty States
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#718096',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  // Chat Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalBackButton: {
    padding: 8,
    marginRight: 12,
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  clearChatButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4C51BF',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#2D3748',
  },
  messageTime: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingText: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    marginTop: 8,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4C51BF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
});

export default MyLibraryScreen;