import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image
} from 'react-native';

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Sample initial messages
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hey there! How are you doing?',
        time: '10:00 AM',
        isUser: false, // Respondent message
        sender: 'John Doe',
        avatar: 'https://via.placeholder.com/40'
      },
      {
        id: '2',
        text: "I'm good! Just working on some new features.",
        time: '10:05 AM',
        isUser: true, // User message
        sender: 'You',
        avatar: 'https://via.placeholder.com/40/007bff'
      },
      {
        id: '3',
        text: 'That sounds great! When do you think it will be ready?',
        time: '10:10 AM',
        isUser: false, // Respondent message
        sender: 'John Doe',
        avatar: 'https://via.placeholder.com/40'
      }
    ]);
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    // User's message (right side)
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true, // This will make it appear on the right
      sender: 'You',
      avatar: 'https://via.placeholder.com/40/007bff',
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate typing
    setIsTyping(true);

    // Respondent's auto-reply after 2 seconds (left side)
    setTimeout(() => {
      setIsTyping(false);
      const autoReply = {
        id: Date.now().toString(),
        text: getRandomReply(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false, // This will make it appear on the left
        sender: 'John Doe',
        avatar: 'https://via.placeholder.com/40',
        status: 'delivered'
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2000);
  };

  const getRandomReply = () => {
    const replies = [
      "That's interesting! Tell me more.",
      "I see what you mean.",
      "Thanks for sharing that!",
      "Let me think about that...",
      "That sounds great!",
      "I appreciate your perspective.",
      "Could you explain that further?",
      "That makes sense!",
      "I agree with you on that.",
      "What do you think about this?"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageRow,
      item.isUser ? styles.userRow : styles.respondentRow
    ]}>
      {/* Respondent messages on LEFT with avatar */}
      {!item.isUser && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
      
      {/* Message Bubble */}
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.respondentBubble
      ]}>
        {!item.isUser && (
          <Text style={styles.senderName}>{item.sender}</Text>
        )}
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.respondentText
        ]}>
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={styles.timeText}>{item.time}</Text>
          {item.isUser && (
            <Text style={styles.statusText}>✓{item.status === 'delivered' ? '✓' : ''}</Text>
          )}
        </View>
      </View>

      {/* User messages on RIGHT with avatar */}
      {item.isUser && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/40' }} 
        style={styles.typingAvatar} 
      />
      <View style={styles.respondentBubble}>
        <View style={styles.typingDots}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.contactName}>John Doe</Text>
            <Text style={styles.status}>
              {isTyping ? 'Typing...' : 'Online'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isTyping ? renderTypingIndicator : null}
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007bff',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 12,
    color: '#4CAF50',
  },
  menuButton: {
    padding: 5,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#333',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  // Message row container
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  userRow: {
    justifyContent: 'flex-end', // Align user messages to right
  },
  respondentRow: {
    justifyContent: 'flex-start', // Align respondent messages to left
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  // User bubble (right side)
  userBubble: {
    backgroundColor: '#007bff',
    borderBottomRightRadius: 5,
    marginLeft: 'auto', // Push to right
  },
  // Respondent bubble (left side)
  respondentBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  respondentText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#999',
  },
  statusText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 5,
  },
  // Typing indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'flex-start', // Always on left side
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
    padding: 15,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  // Input area
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MessagesScreen;