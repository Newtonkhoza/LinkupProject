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
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const provinces = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
];

const faculties = {
  'Engineering': ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering', 'Industrial Engineering'],
  'Science': ['Computer Science', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Statistics'],
  'Commerce': ['Accounting', 'Economics', 'Business Management', 'Finance', 'Marketing'],
  'Humanities': ['Psychology', 'Sociology', 'History', 'Political Science', 'Languages'],
  'Health Sciences': ['Medicine', 'Nursing', 'Pharmacy', 'Dentistry'],
  'Law': ['Law', 'Criminology', 'Forensic Science']
};

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [province, setProvince] = useState('');
  const [faculty, setFaculty] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProvincePicker, setShowProvincePicker] = useState(false);
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);

  const isTablet = width >= 768;

  const validateForm = () => {
    if (!name || !surname || !username || !email || !password || !confirmPassword || !province || !faculty || !course) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Welcome to LinkUp!',
        'Your account has been created successfully',
        [
          {
            text: 'Continue',
            onPress: () => navigation?.navigate?.('MainApp')
          }
        ]
      );
    }, 1500);
  };

  const handleGoogleSignup = () => {
    Alert.alert('Google Sign Up', 'This would normally redirect to Google authentication');
  };

  const CustomPicker = ({ value, onValueChange, items, placeholder, isOpen, onToggle }) => (
    <View style={styles.pickerWrapper}>
      <TouchableOpacity 
        style={styles.pickerTrigger}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.pickerTriggerText,
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={Platform.OS === 'web' ? 20 : 18} 
          color="#718096" 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[
          styles.pickerDropdown,
          Platform.OS === 'web' && styles.webPickerDropdown
        ]}>
          <ScrollView 
            style={styles.pickerScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.pickerOption}
                onPress={() => {
                  onValueChange(item);
                  onToggle();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons 
            name="people-circle" 
            size={Platform.OS === 'web' ? 100 : 80} 
            color="#2D3748" 
            style={styles.headerIcon} 
          />
          <Text style={styles.title}>Join LinkUp Community</Text>
          <Text style={styles.subtitle}>
            Connect with students across South African universities. Create your profile and start networking today!
          </Text>
        </View>

        {/* Social Signup */}
        <View style={styles.socialSection}>
          <TouchableOpacity 
            style={[
              styles.googleButton,
              Platform.OS === 'web' && styles.webGoogleButton
            ]}
            onPress={handleGoogleSignup}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="logo-google" 
              size={Platform.OS === 'web' ? 22 : 20} 
              color="#2D3748" 
            />
            <Text style={[
              styles.googleButtonText,
              Platform.OS === 'web' && styles.webGoogleButtonText
            ]}>
              Sign up with Google
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[
              styles.dividerText,
              Platform.OS === 'web' && styles.webDividerText
            ]}>
              or create account with email
            </Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={[
            styles.sectionTitle,
            Platform.OS === 'web' && styles.webSectionTitle
          ]}>
            Personal Information
          </Text>
          
          {/* Name Row */}
          <View style={[
            styles.nameRow,
            isTablet && styles.tabletNameRow
          ]}>
            <View style={[
              styles.halfInputContainer,
              isTablet && styles.tabletHalfInput
            ]}>
              <Text style={styles.fieldLabel}>First Name *</Text>
              <TextInput 
                style={[
                  styles.input,
                  Platform.OS === 'web' && styles.webInput
                ]} 
                placeholder="Enter your first name" 
                placeholderTextColor="#A0AEC0"
                value={name} 
                onChangeText={setName}
              />
            </View>
            <View style={[
              styles.halfInputContainer,
              isTablet && styles.tabletHalfInput
            ]}>
              <Text style={styles.fieldLabel}>Last Name *</Text>
              <TextInput 
                style={[
                  styles.input,
                  Platform.OS === 'web' && styles.webInput
                ]} 
                placeholder="Enter your last name" 
                placeholderTextColor="#A0AEC0"
                value={surname} 
                onChangeText={setSurname}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username *</Text>
            <TextInput 
              style={[
                styles.input,
                Platform.OS === 'web' && styles.webInput
              ]} 
              placeholder="Choose a username" 
              placeholderTextColor="#A0AEC0"
              value={username} 
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Student Email *</Text>
            <TextInput 
              style={[
                styles.input,
                Platform.OS === 'web' && styles.webInput
              ]} 
              placeholder="your.email@university.ac.za" 
              placeholderTextColor="#A0AEC0"
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[
            styles.sectionTitle,
            Platform.OS === 'web' && styles.webSectionTitle
          ]}>
            Academic Information
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Province *</Text>
            <CustomPicker
              value={province}
              onValueChange={setProvince}
              items={provinces}
              placeholder="Select your province"
              isOpen={showProvincePicker}
              onToggle={() => {
                setShowProvincePicker(!showProvincePicker);
                setShowFacultyPicker(false);
                setShowCoursePicker(false);
              }}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Faculty *</Text>
            <CustomPicker
              value={faculty}
              onValueChange={(value) => {
                setFaculty(value);
                setCourse('');
              }}
              items={Object.keys(faculties)}
              placeholder="Select your faculty"
              isOpen={showFacultyPicker}
              onToggle={() => {
                setShowFacultyPicker(!showFacultyPicker);
                setShowProvincePicker(false);
                setShowCoursePicker(false);
              }}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Course *</Text>
            <CustomPicker
              value={course}
              onValueChange={setCourse}
              items={faculty ? faculties[faculty] : []}
              placeholder={faculty ? "Select your course" : "Select faculty first"}
              isOpen={showCoursePicker}
              onToggle={() => {
                if (!faculty) {
                  Alert.alert('Select Faculty', 'Please select a faculty first');
                  return;
                }
                setShowCoursePicker(!showCoursePicker);
                setShowProvincePicker(false);
                setShowFacultyPicker(false);
              }}
            />
          </View>

          <Text style={[
            styles.sectionTitle,
            Platform.OS === 'web' && styles.webSectionTitle
          ]}>
            Security
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Password *</Text>
            <TextInput 
              style={[
                styles.input,
                Platform.OS === 'web' && styles.webInput
              ]} 
              placeholder="Create a strong password" 
              placeholderTextColor="#A0AEC0"
              value={password} 
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text style={styles.helperText}>Must be at least 6 characters long</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Confirm Password *</Text>
            <TextInput 
              style={[
                styles.input,
                Platform.OS === 'web' && styles.webInput
              ]} 
              placeholder="Re-enter your password" 
              placeholderTextColor="#A0AEC0"
              value={confirmPassword} 
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Terms and Conditions */}
          <View style={[
            styles.termsContainer,
            Platform.OS === 'web' && styles.webTermsContainer
          ]}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Signup Button */}
          <TouchableOpacity 
            style={[
              styles.signupButton,
              Platform.OS === 'web' && styles.webSignupButton,
              isLoading && styles.signupButtonDisabled
            ]} 
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={[
                  styles.signupButtonText,
                  Platform.OS === 'web' && styles.webSignupButtonText
                ]}>
                  Creating Account...
                </Text>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={[
                  styles.signupButtonText,
                  Platform.OS === 'web' && styles.webSignupButtonText
                ]}>
                  Create My Account
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginSection}>
            <Text style={[
              styles.loginText,
              Platform.OS === 'web' && styles.webLoginText
            ]}>
              Already part of our community?{' '}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation?.navigate?.('Login')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.loginLink,
                Platform.OS === 'web' && styles.webLoginLink
              ]}>
                Sign In Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra spacing to ensure scrollability */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    minHeight: Platform.OS === 'web' ? '100vh' : 800,
    ...Platform.select({
      web: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
        minHeight: '100vh',
        paddingVertical: 40,
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: Platform.OS === 'web' ? 20 : 10,
  },
  headerIcon: {
    marginBottom: 16,
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
    lineHeight: 20,
    maxWidth: 400,
  },
  socialSection: {
    marginBottom: 30,
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
    marginBottom: 20,
    gap: 12,
  },
  webGoogleButton: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  googleButtonText: {
    color: '#2D3748',
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: '500',
  },
  webGoogleButtonText: {
    fontSize: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    paddingHorizontal: 12,
    color: '#718096',
    fontSize: 14,
    fontWeight: '500',
  },
  webDividerText: {
    fontSize: 15,
  },
  formSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  webSectionTitle: {
    fontSize: 20,
  },
  nameRow: {
    flexDirection: 'column',
    marginBottom: 15,
    gap: 12,
  },
  tabletNameRow: {
    flexDirection: 'row',
  },
  halfInputContainer: {
    marginBottom: 15,
  },
  tabletHalfInput: {
    flex: 1,
    marginBottom: 0,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#2D3748',
  },
  webInput: {
    outlineStyle: 'none',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: '#2D3748',
    },
  },
  helperText: {
    color: '#718096',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
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
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pickerTriggerText: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
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
  webPickerDropdown: {
    cursor: 'pointer',
  },
  pickerScrollView: {
    borderRadius: 12,
  },
  pickerOption: {
    padding: Platform.OS === 'web' ? 16 : 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerOptionText: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#2D3748',
  },
  termsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webTermsContainer: {
    cursor: 'default',
  },
  termsText: {
    color: '#718096',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#2D3748',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#2D3748',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  webSignupButton: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#4A5568',
    },
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '600',
  },
  webSignupButtonText: {
    fontSize: 16,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  loginText: {
    color: '#718096',
    fontSize: 14,
  },
  webLoginText: {
    fontSize: 15,
  },
  loginLink: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '600',
  },
  webLoginLink: {
    fontSize: 15,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#4A5568',
    },
  },
  bottomSpacing: {
    height: 100,
  },
});

export default SignupScreen;