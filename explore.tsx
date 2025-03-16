import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

// Predefined responses
const BOT_RESPONSES = {
  greeting: 'Hey! I\'m Edu Bot, your space learning assistant. How can I help you today?',
  memorization: `Here are some tips to memorize things faster:
  1. Use spaced repetition - Review information at increasing intervals.
  2. Create visual associations - Connect facts to vivid mental images.
  3. Practice active recall - Test yourself instead of just re-reading.
  4. Break information into chunks - Group related concepts together.
  5. Teach what you've learned - Explaining to others reinforces memory.
  6. Use mnemonic devices - Create acronyms or memory palaces.
  7. Get enough sleep - Your brain consolidates memories during rest.
  8. Exercise regularly - Physical activity improves cognitive function.
  
  Would you like me to explain any of these techniques in more detail?`,
  default: 'I\'m still learning! Try asking me about memorization techniques or just say hi!',
};

// Message types
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatbotScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Edu Bot, your space learning assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    // Animate elements when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      let botResponse = BOT_RESPONSES.default;
      
      const lowerCaseInput = inputText.toLowerCase();
      if (lowerCaseInput.includes('hi') || lowerCaseInput.includes('hello') || lowerCaseInput.includes('hey')) {
        botResponse = BOT_RESPONSES.greeting;
      } else if (lowerCaseInput.includes('memorize') || lowerCaseInput.includes('memory') || lowerCaseInput.includes('remember') || lowerCaseInput.includes('faster')) {
        botResponse = BOT_RESPONSES.memorization;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.botMessageContainer
      ]}>
        {!item.isUser && (
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000" }} 
            style={styles.botAvatar} 
          />
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userMessageBubble : styles.botMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.botMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={styles.timestampText}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0F2027", "#203A43", "#2C5364"]} style={styles.background}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1000" }}
          style={styles.starsBackground}
          resizeMode="cover"
        />
        
        {/* Floating Planets */}
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1000" }} 
          style={[styles.planet, styles.planet1]} 
        />
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1614314107768-6018061e5704?q=80&w=1000" }} 
          style={[styles.planet, styles.planet2]} 
        />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate("index")}
          >
            <FontAwesome5 name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Edu Bot</Text>
            <View style={styles.onlineIndicator} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <FontAwesome5 name="info-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Chat Area */}
        <Animated.View 
          style={[
            styles.chatContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000" }}
            style={styles.chatBackground}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(15, 32, 39, 0.8)', 'rgba(32, 58, 67, 0.8)', 'rgba(44, 83, 100, 0.8)']}
            style={styles.chatGradient}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.botInfoCard}>
                  <Image 
                    source={{ uri: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000" }} 
                    style={styles.botInfoAvatar} 
                  />
                  <Text style={styles.botInfoName}>Edu Bot</Text>
                  <Text style={styles.botInfoDescription}>
                    Your AI space learning assistant
                  </Text>
                  <View style={styles.botInfoFeatures}>
                    <View style={styles.botInfoFeature}>
                      <FontAwesome5 name="brain" size={14} color="#5E72E4" solid />
                      <Text style={styles.botInfoFeatureText}>Learning Tips</Text>
                    </View>
                    <View style={styles.botInfoFeature}>
                      <FontAwesome5 name="rocket" size={14} color="#5E72E4" solid />
                      <Text style={styles.botInfoFeatureText}>Study Help</Text>
                    </View>
                    <View style={styles.botInfoFeature}>
                      <FontAwesome5 name="star" size={14} color="#5E72E4" solid />
                      <Text style={styles.botInfoFeatureText}>Motivation</Text>
                    </View>
                  </View>
                </View>
                
                {messages.map(message => renderMessage({ item: message }))}
                
                {isTyping && (
                  <View style={[styles.messageContainer, styles.botMessageContainer]}>
                    <Image 
                      source={{ uri: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000" }} 
                      style={styles.botAvatar} 
                    />
                    <View style={[styles.messageBubble, styles.botMessageBubble, styles.typingBubble]}>
                      <View style={styles.typingIndicator}>
                        <View style={[styles.typingDot, styles.typingDot1]} />
                        <View style={[styles.typingDot, styles.typingDot2]} />
                        <View style={[styles.typingDot, styles.typingDot3]} />
                      </View>
                    </View>
                  </View>
                )}
                
                <View style={{ height: 20 }} />
              </ScrollView>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ask me anything..."
                  placeholderTextColor="#999"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    !inputText.trim() && styles.sendButtonDisabled
                  ]}
                  onPress={handleSend}
                  disabled={!inputText.trim()}
                >
                  <FontAwesome5 name="paper-plane" size={20} color="white" solid />
                </TouchableOpacity>
              </View>
              
              <View style={styles.suggestionContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity 
                    style={styles.suggestionButton}
                    onPress={() => setInputText("Hi")}
                  >
                    <Text style={styles.suggestionText}>👋 Say Hello</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.suggestionButton}
                    onPress={() => setInputText("How do I memorize things faster?")}
                  >
                    <Text style={styles.suggestionText}>🧠 Memorization Tips</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.suggestionButton}
                    onPress={() => setInputText("What can you help me with?")}
                  >
                    <Text style={styles.suggestionText}>❓ What can you do?</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </LinearGradient>
        </Animated.View>
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
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  // Floating planets
  planet: {
    position: "absolute",
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
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginLeft: 8,
  },
  onlineText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Chat area
  chatContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    marginTop: 10,
  },
  chatBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  chatGradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingTop: 20,
  },
  // Bot info card
  botInfoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  botInfoAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#5E72E4",
  },
  botInfoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  botInfoDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  botInfoFeatures: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  botInfoFeature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  botInfoFeatureText: {
    fontSize: 12,
    color: "#5E72E4",
    marginLeft: 5,
  },
  // Message styles
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#5E72E4",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 18,
  },
  userMessageBubble: {
    backgroundColor: "#5E72E4",
    borderBottomRightRadius: 5,
  },
  botMessageBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "white",
  },
  botMessageText: {
    color: "#333",
  },
  timestampText: {
    fontSize: 10,
    color: "rgba(0, 0, 0, 0.5)",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  // Typing indicator
  typingBubble: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5E72E4",
    marginHorizontal: 3,
    opacity: 0.6,
  },
  typingDot1: {
    animationName: "bounce",
    animationDuration: "0.6s",
    animationIterationCount: "infinite",
  },
  typingDot2: {
    animationName: "bounce",
    animationDuration: "0.6s",
    animationDelay: "0.2s",
    animationIterationCount: "infinite",
  },
  typingDot3: {
    animationName: "bounce",
    animationDuration: "0.6s",
    animationDelay: "0.4s",
    animationIterationCount: "infinite",
  },
  // Input area
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#5E72E4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  // Suggestion buttons
  suggestionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  suggestionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  suggestionText: {
    color: "white",
    fontSize: 14,
  },
});

export default ChatbotScreen;