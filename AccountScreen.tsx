import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AccountScreen = () => {
  const navigation = useNavigation();
  
  // User information state
  const [userName, setUserName] = useState('Cosmic Explorer');
  const [email, setEmail] = useState('explorer@galaxy.edu');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000');
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dataUsage, setDataUsage] = useState('High');
  const [language, setLanguage] = useState('English');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(starOpacity, {
            toValue: 0.7,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(starOpacity, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [fadeAnim, slideAnim, rotateAnim, starOpacity]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSaveChanges = () => {
    // Logic to save changes, e.g., update user profile in the app or API
    Alert.alert(
      "Settings Saved",
      "Your cosmic settings have been saved!",
      [{ text: "OK" }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "End Expedition",
      "Are you sure you want to end your cosmic journey?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            // Add your logout logic here
            // For example: AuthContext.logout()
            // Then navigate to login screen
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const renderSettingItem = (title, description, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#5E72E4' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );

  const renderSettingOption = (title, options, selectedOption, onSelect) => (
    <View style={styles.settingOptionContainer}>
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0F2027', '#203A43', '#2C5364']}
        style={styles.background}
      >
        {/* Stars Background */}
        <Animated.Image
          source={{ uri: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1000' }}
          style={[styles.starsBackground, { opacity: starOpacity }]}
          resizeMode="cover"
        />

        {/* Floating Planets */}
        <Animated.Image
          source={{ uri: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1000' }}
          style={[
            styles.planet,
            styles.planet1,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <Animated.Image
          source={{ uri: 'https://images.unsplash.com/photo-1614314107768-6018061e5704?q=80&w=1000' }}
          style={[styles.planet, styles.planet2]}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('index')}
          >
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Space Explorer Profile</Text>
          <TouchableOpacity style={styles.helpButton} onPress={() => Alert.alert("Help", "Help Center Coming Soon!")}>
            <FontAwesome5 name="question-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <TouchableOpacity
                  style={styles.changeAvatarButton}
                  onPress={() => Alert.alert("Avatar", "Change Avatar functionality here")}
                >
                  <FontAwesome5 name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userRank}>Cosmic Explorer - Level 7</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <FontAwesome5 name="star" size={16} color="#FFD700" solid />
                  <Text style={styles.statValue}>1,250</Text>
                  <Text style={styles.statLabel}>Stars</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome5 name="rocket" size={16} color="#FF6B6B" solid />
                  <Text style={styles.statValue}>42</Text>
                  <Text style={styles.statLabel}>Missions</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome5 name="medal" size={16} color="#4CAF50" solid />
                  <Text style={styles.statValue}>15</Text>
                  <Text style={styles.statLabel}>Badges</Text>
                </View>
              </View>
            </View>

            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <FontAwesome5 name="user-astronaut" size={18} color="#7B68EE" solid /> Personal Information
              </Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Explorer Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#999"
                  value={userName}
                  onChangeText={setUserName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Galactic Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity 
                style={styles.passwordButton} 
                onPress={() => Alert.alert("Password", "Change Password Screen")}
              >
                <FontAwesome5 name="lock" size={16} color="#7B68EE" solid />
                <Text style={styles.passwordButtonText}>Change Password</Text>
                <FontAwesome5 name="chevron-right" size={16} color="#7B68EE" />
              </TouchableOpacity>
            </View>

            {/* Notification Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <FontAwesome5 name="bell" size={18} color="#7B68EE" solid /> Notification Settings
              </Text>
              {renderSettingItem(
                'Mission Alerts',
                'Receive notifications about new learning missions',
                notificationsEnabled,
                setNotificationsEnabled
              )}
              {renderSettingItem(
                'Achievement Unlocked',
                'Get notified when you earn new badges',
                true,
                () => {}
              )}
              {renderSettingItem(
                'Friend Activities',
                'Updates about your fellow space explorers',
                false,
                () => {}
              )}
            </View>

            {/* App Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <FontAwesome5 name="cog" size={18} color="#7B68EE" solid /> App Settings
              </Text>
              {renderSettingItem(
                'Dark Matter Mode',
                'Enable dark theme for your cosmic journey',
                darkModeEnabled,
                setDarkModeEnabled
              )}
              {renderSettingItem(
                'Space Sounds',
                'Enable sound effects during navigation',
                soundEnabled,
                setSoundEnabled
              )}
              {renderSettingItem(
                'Auto-Save Progress',
                'Automatically save your learning progress',
                autoSaveEnabled,
                setAutoSaveEnabled
              )}
              {renderSettingOption(
                'Data Usage',
                ['Low', 'Medium', 'High'],
                dataUsage,
                setDataUsage
              )}
              {renderSettingOption(
                'Language',
                ['English', 'Spanish', 'French', 'German'],
                language,
                setLanguage
              )}
            </View>

            {/* Privacy & Security */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <FontAwesome5 name="shield-alt" size={18} color="#7B68EE" solid /> Privacy & Security
              </Text>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert("Privacy", "Privacy Settings")}
              >
                <FontAwesome5 name="user-shield" size={16} color="#7B68EE" solid />
                <Text style={styles.menuItemText}>Privacy Settings</Text>
                <FontAwesome5 name="chevron-right" size={16} color="#7B68EE" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert("Data", "Data Management")}
              >
                <FontAwesome5 name="database" size={16} color="#7B68EE" solid />
                <Text style={styles.menuItemText}>Data Management</Text>
                <FontAwesome5 name="chevron-right" size={16} color="#7B68EE" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert("Security", "Account Security")}
              >
                <FontAwesome5 name="fingerprint" size={16} color="#7B68EE" solid />
                <Text style={styles.menuItemText}>Account Security</Text>
                <FontAwesome5 name="chevron-right" size={16} color="#7B68EE" />
              </TouchableOpacity>
            </View>

            {/* Support & About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <FontAwesome5 name="info-circle" size={18} color="#7B68EE" solid /> Support & About
              </Text>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert("Help", "Help Center")}
              >
                <FontAwesome5 name="question-circle" size={16} color="#7B68EE" solid />
                <Text style={styles.menuItemText}>Help Center</Text>
                <FontAwesome5 name="chevron-right" size={16} color="#7B68EE" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert("Terms", "Terms of Service")}
              >
                <FontAwesome5 name="file-contract" size={16} color="#7B68EE" solid />
                <Text style={styles.menuItemText}>Terms of Service</Text>
                <FontAwesome5 name="chevron-right" size={16} color="#7B68EE" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert("About", "About EduQuest")}
              >
                <FontAwesome5 name="rocket" size={16} color="#7B68EE" solid />
                <Text style={styles.menuItemText}>About EduQuest</Text>
                <FontAwesome5 name="chevron-right" size={16} color="#7B68EE" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => Alert.alert("Version", "App Version: 1.0.0")}
              >
                <FontAwesome5 name="code" size={16} color="#7B68EE" solid />
                <Text style={styles.menuItemText}>App Version</Text>
                <Text style={styles.versionText}>v1.0.0</Text>
              </TouchableOpacity>
            </View>

            {/* Save Changes Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <LinearGradient
                colors={['#7B68EE', '#5E72E4']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Save Cosmic Settings</Text>
                <FontAwesome5 name="rocket" size={16} color="white" solid />
              </LinearGradient>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>End Expedition</Text>
              <FontAwesome5 name="power-off" size={16} color="#FF6B6B" />
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>EduQuest Space Academy</Text>
              <Text style={styles.footerText}>© 2025 Galactic Learning Inc.</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  starsBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  // Floating planets
  planet: {
    position: 'absolute',
    borderRadius: 100,
  },
  planet1: {
    width: 80,
    height: 80,
    top: height * 0.15,
    right: -20,
    opacity: 0.7,
  },
  planet2: {
    width: 60,
    height: 60,
    top: height * 0.4,
    left: -15,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#7B68EE',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#7B68EE',
    padding: 10,
    borderRadius: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userRank: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#cccccc',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
  },
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  passwordButtonText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    color: '#cccccc',
    fontSize: 12,
  },
  settingOptionContainer: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#7B68EE',
  },
  optionText: {
    color: 'white',
    fontSize: 14,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  versionText: {
    color: '#cccccc',
    fontSize: 14,
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#cccccc',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default AccountScreen;