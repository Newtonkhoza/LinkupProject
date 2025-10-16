import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  Alert
} from 'react-native';

const GroupChat = ({ route, navigation }) => {
  const { group } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const flatListRef = useRef(null);

  // Sample group members
  const [members, setMembers] = useState([
    { id: '1', name: 'You', email: 'you@example.com', role: 'admin', avatar: 'https://via.placeholder.com/40/007bff' },
    { id: '2', name: 'Alex Chen', email: 'alex@example.com', role: 'member', avatar: 'https://via.placeholder.com/40' },
    { id: '3', name: 'Sam Rivera', email: 'sam@example.com', role: 'member', avatar: 'https://via.placeholder.com/40' },
    { id: '4', name: 'Taylor Kim', email: 'taylor@example.com', role: 'member', avatar: 'https://via.placeholder.com/40' },
  ]);

  useEffect(() => {
    // Sample initial group messages
    setMessages([
      {
        id: '1',
        text: `Welcome to ${group.name}! 👋`,
        time: '10:00 AM',
        sender: 'System',
        isSystem: true
      },
      {
        id: '2',
        text: "Thanks for creating this safe space! I'm excited to connect with everyone.",
        time: '10:05 AM',
        sender: 'Alex Chen',
        avatar: 'https://via.placeholder.com/40'
      },
      {
        id: '3',
        text: "Me too! The guidelines here make me feel comfortable sharing.",
        time: '10:10 AM',
        sender: 'Sam Rivera',
        avatar: 'https://via.placeholder.com/40'
      }
    ]);
  }, [group]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'You',
      avatar: 'https://via.placeholder.com/40/007bff'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const addMember = () => {
    if (newMemberEmail.trim() === '') {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const newMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: 'member',
      avatar: 'https://via.placeholder.com/40'
    };

    setMembers(prev => [...prev, newMember]);
    setNewMemberEmail('');
    
    // Add system message
    const systemMessage = {
      id: Date.now().toString(),
      text: `${newMember.name} has joined the group! 🎉`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'System',
      isSystem: true
    };
    setMessages(prev => [...prev, systemMessage]);
    
    Alert.alert('Success', `${newMember.name} has been added to the group`);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'You' ? styles.userMessage : styles.otherMessage,
      item.isSystem && styles.systemMessage
    ]}>
      {!item.isSystem && item.sender !== 'You' && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
      <View style={[
        styles.messageBubble,
        item.sender === 'You' ? styles.userBubble : 
        item.isSystem ? styles.systemBubble : styles.otherBubble
      ]}>
        {!item.isSystem && item.sender !== 'You' && (
          <Text style={styles.senderName}>{item.sender}</Text>
        )}
        <Text style={[
          styles.messageText,
          item.sender === 'You' ? styles.userText : 
          item.isSystem ? styles.systemText : styles.otherText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      {!item.isSystem && item.sender === 'You' && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
    </View>
  );

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      <Text style={styles.memberRole}>{item.role}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={[styles.groupIcon, { backgroundColor: `${group.color}20` }]}>
            <Text style={[styles.groupIconText, { color: group.color }]}>
              {group.icon}
            </Text>
          </View>
          <View>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.memberCount}>{members.length} members</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.membersButton}
          onPress={() => setShowMembers(true)}
        >
          <Text style={styles.membersButtonText}>👥</Text>
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
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={`Message in ${group.name}...`}
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

      {/* Members Modal */}
      <Modal
        visible={showMembers}
        animationType="slide"
        onRequestClose={() => setShowMembers(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Group Members</Text>
            <TouchableOpacity onPress={() => setShowMembers(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={item => item.id}
            style={styles.membersList}
          />

          {/* Add Member Section */}
          <View style={styles.addMemberSection}>
            <Text style={styles.addMemberTitle}>Add New Member</Text>
            <View style={styles.addMemberInput}>
              <TextInput
                style={styles.emailInput}
                value={newMemberEmail}
                onChangeText={setNewMemberEmail}
                placeholder="Enter email address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.addButton} onPress={addMember}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Add the styles for GroupChat here...
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
    flex: 1,
    marginLeft: 10,
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  groupIconText: {
    fontSize: 18,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
  },
  membersButton: {
    padding: 5,
  },
  membersButtonText: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  systemMessage: {
    justifyContent: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 5,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 5,
  },
  userBubble: {
    backgroundColor: '#007bff',
    borderBottomRightRadius: 5,
  },
  otherBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
  },
  systemBubble: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignSelf: 'center',
    maxWidth: '90%',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  otherText: {
    color: '#333',
  },
  systemText: {
    color: '#666',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  membersList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  memberRole: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  addMemberSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addMemberTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  addMemberInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default GroupChat;