import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const provinces = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
];

const faculties = {
  'Engineering': ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering'],
  'Science': ['Computer Science', 'Biology', 'Chemistry', 'Physics', 'Mathematics'],
  'Commerce': ['Accounting', 'Economics', 'Business Management', 'Finance'],
  'Humanities': ['Psychology', 'Sociology', 'History', 'Political Science'],
  'Health Sciences': ['Medicine', 'Nursing', 'Pharmacy', 'Dentistry'],
  'Law': ['Law', 'Criminology']
};

const yearOfStudyOptions = [1, 2, 3, 4, 5, 6];

const ProfileEditScreen = ({ navigation, route }) => {
  const { user, onProfileUpdate, initialSection } = route.params || {};
  
  // Use initialSection to show specific section first
  const [activeSection, setActiveSection] = useState(initialSection || 'personal');
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    username: user.username || '',
    email: user.email || '',
    province: user.province || '',
    faculty: user.faculty || '',
    course: user.course || '',
    yearOfStudy: user.yearOfStudy || 1,
    bio: user.bio || '',
    interests: user.interests || [],
    qualifications: user.qualifications || [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    theme: 'light'
  });

  const [showProvincePicker, setShowProvincePicker] = useState(false);
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newQualification, setNewQualification] = useState('');

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Call the update callback if provided
      if (onProfileUpdate) {
        onProfileUpdate(formData);
      }
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const addQualification = () => {
    if (newQualification.trim() && !formData.qualifications.includes(newQualification.trim())) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, newQualification.trim()]
      });
      setNewQualification('');
    }
  };

  const removeQualification = (qualificationToRemove) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter(qual => qual !== qualificationToRemove)
    });
  };

  const CustomPicker = ({ value, onValueChange, items, placeholder, isOpen, onToggle }) => (
    <View style={styles.pickerWrapper}>
      <TouchableOpacity 
        style={styles.pickerTrigger}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.pickerTriggerText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#718096" 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.pickerDropdown}>
          <ScrollView style={styles.pickerScrollView} nestedScrollEnabled={true}>
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.pickerOption}
                onPress={() => {
                  onValueChange(item);
                  onToggle();
                }}
              >
                <Text style={styles.pickerOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const TabButton = ({ title, section, icon }) => (
    <TouchableOpacity 
      style={[styles.tab, activeSection === section && styles.tabActive]}
      onPress={() => setActiveSection(section)}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon} 
        size={18} 
        color={activeSection === section ? '#fff' : '#718096'} 
      />
      <Text style={[styles.tabText, activeSection === section && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3748" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {activeSection === 'personal' ? 'Edit Profile' : 
             activeSection === 'academic' ? 'Academic Info' :
             activeSection === 'interests' ? 'Interests' :
             activeSection === 'qualifications' ? 'Qualifications' :
             activeSection === 'password' ? 'Change Password' : 'Settings'}
          </Text>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TabButton title="Personal" section="personal" icon="person-outline" />
          <TabButton title="Academic" section="academic" icon="school-outline" />
          <TabButton title="Interests" section="interests" icon="pricetags-outline" />
          <TabButton title="Qualifications" section="qualifications" icon="ribbon-outline" />
          <TabButton title="Password" section="password" icon="lock-closed-outline" />
          <TabButton title="Settings" section="settings" icon="settings-outline" />
        </View>

        {/* Personal Information Section */}
        {activeSection === 'personal' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.nameRow}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="First Name"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.surname}
                  onChangeText={(text) => setFormData({...formData, surname: text})}
                  placeholder="Last Name"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) => setFormData({...formData, username: text})}
                placeholder="Username"
                placeholderTextColor="#A0AEC0"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Email"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.bio}
                onChangeText={(text) => setFormData({...formData, bio: text})}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        )}

        {/* Academic Information Section */}
        {activeSection === 'academic' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Academic Information</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Province</Text>
              <CustomPicker
                value={formData.province}
                onValueChange={(value) => setFormData({...formData, province: value})}
                items={provinces}
                placeholder="Select Province"
                isOpen={showProvincePicker}
                onToggle={() => {
                  setShowProvincePicker(!showProvincePicker);
                  setShowFacultyPicker(false);
                  setShowCoursePicker(false);
                  setShowYearPicker(false);
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Faculty</Text>
              <CustomPicker
                value={formData.faculty}
                onValueChange={(value) => setFormData({...formData, faculty: value, course: ''})}
                items={Object.keys(faculties)}
                placeholder="Select Faculty"
                isOpen={showFacultyPicker}
                onToggle={() => {
                  setShowFacultyPicker(!showFacultyPicker);
                  setShowProvincePicker(false);
                  setShowCoursePicker(false);
                  setShowYearPicker(false);
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Course</Text>
              <CustomPicker
                value={formData.course}
                onValueChange={(value) => setFormData({...formData, course: value})}
                items={formData.faculty ? faculties[formData.faculty] : []}
                placeholder={formData.faculty ? "Select Course" : "Select Faculty First"}
                isOpen={showCoursePicker}
                onToggle={() => {
                  if (!formData.faculty) {
                    Alert.alert('Select Faculty', 'Please select a faculty first');
                    return;
                  }
                  setShowCoursePicker(!showCoursePicker);
                  setShowProvincePicker(false);
                  setShowFacultyPicker(false);
                  setShowYearPicker(false);
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Year of Study</Text>
              <CustomPicker
                value={formData.yearOfStudy?.toString()}
                onValueChange={(value) => setFormData({...formData, yearOfStudy: parseInt(value)})}
                items={yearOfStudyOptions.map(y => y.toString())}
                placeholder="Select Year"
                isOpen={showYearPicker}
                onToggle={() => {
                  setShowYearPicker(!showYearPicker);
                  setShowProvincePicker(false);
                  setShowFacultyPicker(false);
                  setShowCoursePicker(false);
                }}
              />
            </View>
          </View>
        )}

        {/* Interests Section */}
        {activeSection === 'interests' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.sectionSubtitle}>Add your interests and hobbies</Text>
            
            <View style={styles.addItemContainer}>
              <TextInput
                style={[styles.input, styles.addItemInput]}
                value={newInterest}
                onChangeText={setNewInterest}
                placeholder="Add an interest..."
                placeholderTextColor="#A0AEC0"
                onSubmitEditing={addInterest}
              />
              <TouchableOpacity style={styles.addItemButton} onPress={addInterest}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {formData.interests.map((interest, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                  <TouchableOpacity onPress={() => removeInterest(interest)}>
                    <Ionicons name="close" size={16} color="#718096" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Qualifications Section */}
        {activeSection === 'qualifications' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Qualifications</Text>
            <Text style={styles.sectionSubtitle}>Add your academic qualifications</Text>
            
            <View style={styles.addItemContainer}>
              <TextInput
                style={[styles.input, styles.addItemInput]}
                value={newQualification}
                onChangeText={setNewQualification}
                placeholder="Add a qualification..."
                placeholderTextColor="#A0AEC0"
                onSubmitEditing={addQualification}
              />
              <TouchableOpacity style={styles.addItemButton} onPress={addQualification}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.qualificationsList}>
              {formData.qualifications.map((qualification, index) => (
                <View key={index} style={styles.qualificationItem}>
                  <Ionicons name="school" size={16} color="#4A5568" />
                  <Text style={styles.qualificationText}>{qualification}</Text>
                  <TouchableOpacity onPress={() => removeQualification(qualification)}>
                    <Ionicons name="trash-outline" size={16} color="#E53E3E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Change Password Section */}
        {activeSection === 'password' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={formData.currentPassword}
                onChangeText={(text) => setFormData({...formData, currentPassword: text})}
                placeholder="Current Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={formData.newPassword}
                onChangeText={(text) => setFormData({...formData, newPassword: text})}
                placeholder="New Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                placeholder="Confirm New Password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
              />
            </View>
          </View>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSubtitle}>Notifications</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>Receive updates via email</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.toggle, formData.emailNotifications && styles.toggleActive]}
                  onPress={() => setFormData({...formData, emailNotifications: !formData.emailNotifications})}
                >
                  <View style={[styles.toggleCircle, formData.emailNotifications && styles.toggleCircleActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive app notifications</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.toggle, formData.pushNotifications && styles.toggleActive]}
                  onPress={() => setFormData({...formData, pushNotifications: !formData.pushNotifications})}
                >
                  <View style={[styles.toggleCircle, formData.pushNotifications && styles.toggleCircleActive]} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsSubtitle}>Privacy</Text>
              
              <View style={styles.field}>
                <Text style={styles.label}>Profile Visibility</Text>
                <CustomPicker
                  value={formData.profileVisibility}
                  onValueChange={(value) => setFormData({...formData, profileVisibility: value})}
                  items={['public', 'private', 'connections_only']}
                  placeholder="Select Visibility"
                  isOpen={showProvincePicker}
                  onToggle={() => {
                    setShowProvincePicker(!showProvincePicker);
                    setShowFacultyPicker(false);
                    setShowCoursePicker(false);
                    setShowYearPicker(false);
                  }}
                />
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsSubtitle}>Appearance</Text>
              
              <View style={styles.field}>
                <Text style={styles.label}>Theme</Text>
                <CustomPicker
                  value={formData.theme}
                  onValueChange={(value) => setFormData({...formData, theme: value})}
                  items={['light', 'dark', 'auto']}
                  placeholder="Select Theme"
                  isOpen={showFacultyPicker}
                  onToggle={() => {
                    setShowFacultyPicker(!showFacultyPicker);
                    setShowProvincePicker(false);
                    setShowCoursePicker(false);
                    setShowYearPicker(false);
                  }}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  saveButton: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#4A5568',
        },
      },
    }),
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    backgroundColor: '#f8f9fa',
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#2D3748',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
  },
  tabTextActive: {
    color: '#fff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#2D3748',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        ':focus': {
          borderColor: '#2D3748',
        },
      },
    }),
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pickerTriggerText: {
    fontSize: 16,
    color: '#2D3748',
  },
  placeholderText: {
    color: '#A0AEC0',
  },
  pickerDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  pickerScrollView: {
    borderRadius: 12,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addItemInput: {
    flex: 1,
    marginBottom: 0,
  },
  addItemButton: {
    backgroundColor: '#2D3748',
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#4A5568',
        },
      },
    }),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  qualificationsList: {
    gap: 12,
  },
  qualificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  qualificationText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#718096',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#2D3748',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }],
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileEditScreen;