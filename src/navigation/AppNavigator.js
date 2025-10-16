// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import MessagesScreen from '../screens/MessagesScreen';
import GroupsScreen from '../screens/GroupsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import MyLibraryScreen from '../screens/MyLibraryScreen'; // ADD THIS IMPORT

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Login Button Component
const LoginButton = ({ onPress, size = 28 }) => (
  <TouchableOpacity 
    style={[
      styles.headerLoginButton,
      Platform.OS === 'web' && styles.webLoginButton
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons 
      name="log-in" 
      size={Platform.OS === 'web' ? 24 : size} 
      color="#2D3748" 
    />
    <Text style={[
      styles.headerLoginText,
      Platform.OS === 'web' && styles.webLoginText
    ]}>
      Sign In
    </Text>
  </TouchableOpacity>
);

// Responsive Profile Icon Component
const ProfileIconButton = ({ onPress, size = 28 }) => (
  <TouchableOpacity 
    style={[
      styles.headerProfileButton,
      Platform.OS === 'web' && styles.webProfileButton
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons 
      name="person-circle" 
      size={Platform.OS === 'web' ? 32 : size} 
      color="#2D3748" 
    />
    <Text style={[
      styles.headerProfileText,
      Platform.OS === 'web' && styles.webProfileText
    ]}>
      My Profile
    </Text>
  </TouchableOpacity>
);

// Auth Navigation Button Component
const AuthNavigationButton = ({ onPress, title, isPrimary = true }) => (
  <TouchableOpacity 
    style={[
      styles.authHeaderButton,
      isPrimary ? styles.primaryAuthButton : styles.secondaryAuthButton,
      Platform.OS === 'web' && styles.webAuthButton
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.authHeaderText,
      isPrimary ? styles.primaryAuthText : styles.secondaryAuthText
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Header Right Component - Shows Login when not authenticated, Profile when authenticated
const HeaderRight = ({ navigation, isAuthenticated = false }) => {
  if (isAuthenticated) {
    return (
      <ProfileIconButton 
        onPress={() => navigation.navigate('Profile')}
      />
    );
  }
  
  return (
    <View style={styles.headerRightContainer}>
      <LoginButton 
        onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
      />
    </View>
  );
};

// Screen Wrappers with Navigation
const ProfileScreenWithNavigation = ({ navigation }) => {
  return (
    <ProfileScreen navigation={navigation} />
  );
};

const MessagesScreenWithNavigation = ({ navigation }) => {
  return (
    <MessagesScreen navigation={navigation} />
  );
};

const GroupsScreenWithNavigation = ({ navigation }) => {
  return (
    <GroupsScreen navigation={navigation} />
  );
};

// Main App Stack
const MainAppStack = () => (
  <Tab.Navigator
    screenOptions={({ route, navigation }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        const iconSize = Platform.OS === 'web' ? 24 : size;
        
        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Discover': 
            iconName = focused ? 'compass' : 'compass-outline'; 
            break;
          case 'Messages': 
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; 
            break;
          case 'Groups': 
            iconName = focused ? 'people' : 'people-outline'; 
            break;
          case 'Profile': 
            iconName = focused ? 'person' : 'person-outline'; 
            break;
          default:
            iconName = 'help-outline';
        }
        return <Ionicons name={iconName} size={iconSize} color={color} />;
      },
      tabBarActiveTintColor: '#2D3748',
      tabBarInactiveTintColor: '#718096',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: '#e2e8f0',
        height: Platform.OS === 'web' ? 70 : 60,
        paddingBottom: Platform.OS === 'web' ? 12 : 8,
        paddingTop: Platform.OS === 'web' ? 12 : 8,
        ...Platform.select({
          web: {
            maxWidth: 768,
            alignSelf: 'center',
            width: '100%',
            borderRadius: 20,
            marginHorizontal: 'auto',
            marginBottom: 10,
          },
        }),
      },
      headerStyle: { 
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        ...Platform.select({
          web: {
            maxWidth: 1200,
            alignSelf: 'center',
            width: '100%',
          },
        }),
      },
      headerTintColor: '#2D3748',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: Platform.OS === 'web' ? 20 : 18,
      },
      headerTitleAlign: 'center',
      headerRight: () => (
        <HeaderRight 
          navigation={navigation} 
          isAuthenticated={false}
        />
      ),
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ 
        title: 'LinkUp',
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen 
      name="Discover" 
      component={DiscoverScreen}
      options={{ 
        title: 'Discover',
        tabBarLabel: 'Discover',
      }}
    />
    <Tab.Screen 
      name="Messages" 
      component={MessagesScreenWithNavigation}
      options={{ 
        title: 'Messages',
        tabBarLabel: 'Messages',
      }}
    />
    <Tab.Screen 
      name="Groups" 
      component={GroupsScreenWithNavigation}
      options={{ 
        title: 'Groups',
        tabBarLabel: 'Groups',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreenWithNavigation}
      options={{ 
        title: 'Profile',
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { 
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        ...Platform.select({
          web: {
            maxWidth: 1200,
            alignSelf: 'center',
            width: '100%',
          },
        }),
      },
      headerTintColor: '#2D3748',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: Platform.OS === 'web' ? 20 : 18,
      },
      headerTitleAlign: 'center',
      cardStyle: {
        backgroundColor: '#fff',
        ...Platform.select({
          web: {
            maxWidth: 1200,
            alignSelf: 'center',
            width: '100%',
          },
        }),
      },
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen}
      options={({ navigation }) => ({ 
        title: 'Sign In to LinkUp',
        headerBackTitle: 'Back',
        headerRight: () => (
          <AuthNavigationButton 
            onPress={() => navigation.navigate('Signup')}
            title="Sign Up"
            isPrimary={true}
          />
        ),
      })}
    />
    <Stack.Screen 
      name="Signup" 
      component={SignupScreen}
      options={({ navigation }) => ({ 
        title: 'Create Account',
        headerBackTitle: 'Back',
        headerRight: () => (
          <AuthNavigationButton 
            onPress={() => navigation.navigate('Login')}
            title="Sign In"
            isPrimary={false}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

// Root Navigator
const RootStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: {
        backgroundColor: '#fff',
      },
    }}
    initialRouteName="MainApp"
  >
    <Stack.Screen 
      name="HomeScreen" 
      component={HomeScreen}
      options={{
        animationEnabled: true,
      }}
    />
    
    <Stack.Screen 
      name="Auth" 
      component={AuthStack}
      options={{
        animationEnabled: true,
        presentation: 'card',
      }}
    />
    
    <Stack.Screen 
      name="MainApp" 
      component={MainAppStack}
      options={{
        animationEnabled: true,
      }}
    />
    
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen}
      options={({ navigation }) => ({ 
        headerShown: true,
        title: 'Chat',
        headerStyle: { 
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          ...Platform.select({
            web: {
              maxWidth: 1200,
              alignSelf: 'center',
              width: '100%',
            },
          }),
        },
        headerTintColor: '#2D3748',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: Platform.OS === 'web' ? 20 : 18,
        },
        headerTitleAlign: 'center',
        animationEnabled: true,
        headerRight: () => (
          <HeaderRight 
            navigation={navigation} 
            isAuthenticated={false}
          />
        ),
      })}
    />
    
    <Stack.Screen 
      name="ProfileEdit" 
      component={ProfileEditScreen}
      options={({ navigation }) => ({ 
        headerShown: true,
        title: 'Edit Profile',
        headerStyle: { 
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          ...Platform.select({
            web: {
              maxWidth: 1200,
              alignSelf: 'center',
              width: '100%',
            },
          }),
        },
        headerTintColor: '#2D3748',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: Platform.OS === 'web' ? 20 : 18,
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3748" />
          </TouchableOpacity>
        ),
      })}
    />
    
    {/* ADD MyLibraryScreen HERE */}
    <Stack.Screen 
      name="MyLibrary" 
      component={MyLibraryScreen}
      options={({ navigation }) => ({ 
        headerShown: true,
        title: 'My Library',
        headerStyle: { 
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          ...Platform.select({
            web: {
              maxWidth: 1200,
              alignSelf: 'center',
              width: '100%',
            },
          }),
        },
        headerTintColor: '#2D3748',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: Platform.OS === 'web' ? 20 : 18,
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3748" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <HeaderRight 
            navigation={navigation} 
            isAuthenticated={false}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

// Responsive Styles
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#4A5568',
        },
      },
    }),
  },
  webLoginButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 24,
  },
  headerLoginText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    ...Platform.select({
      web: {
        fontSize: 15,
      },
    }),
  },
  webLoginText: {
    marginLeft: 8,
  },
  headerProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
          backgroundColor: '#e9ecef',
        },
      },
    }),
  },
  webProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 24,
  },
  headerProfileText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    ...Platform.select({
      web: {
        fontSize: 15,
      },
    }),
  },
  webProfileText: {
    marginLeft: 8,
  },
  authHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        paddingHorizontal: 20,
        paddingVertical: 12,
      },
    }),
  },
  webAuthButton: {
    marginRight: 24,
  },
  primaryAuthButton: {
    backgroundColor: '#2D3748',
  },
  secondaryAuthButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  authHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    ...Platform.select({
      web: {
        fontSize: 15,
      },
    }),
  },
  primaryAuthText: {
    color: '#fff',
  },
  secondaryAuthText: {
    color: '#2D3748',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
});

const AppNavigator = () => {
  return <RootStack />;
};

export default AppNavigator;