import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Modal,
  StatusBar,
  Platform,
  FlatList,
  Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Sample questions for each subject with multiple quiz types
const MATH_QUESTIONS = {
  basic: [
    { id: 1, question: "What is 7 × 8?", options: ["54", "56", "64", "72"], answer: "56" },
    { id: 2, question: "Solve for x: 2x + 5 = 13", options: ["3", "4", "8", "9"], answer: "4" },
    { id: 3, question: "What is the area of a circle with radius 5?", options: ["25π", "10π", "15π", "20π"], answer: "25π" },
    { id: 4, question: "If a triangle has sides of length 3, 4, and 5, what type of triangle is it?", options: ["Equilateral", "Isosceles", "Scalene", "Right"], answer: "Right" },
    { id: 5, question: "What is the square root of 144?", options: ["10", "12", "14", "16"], answer: "12" },
  ],
  algebra: [
    { id: 1, question: "Solve: 3(x - 2) = 15", options: ["5", "7", "9", "11"], answer: "7" },
    { id: 2, question: "If f(x) = 2x² + 3x - 5, what is f(2)?", options: ["5", "7", "9", "11"], answer: "9" },
    { id: 3, question: "Simplify: (3x² - 2x + 1) + (2x² + 4x - 3)", options: ["5x² + 2x - 2", "5x² + 2x - 4", "5x² - 2x - 2", "5x² + 6x - 2"], answer: "5x² + 2x - 2" },
    { id: 4, question: "Solve the inequality: 2x - 5 > 7", options: ["x > 6", "x > 5", "x > 4", "x > 3"], answer: "x > 6" },
    { id: 5, question: "Factor: x² - 9", options: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "(x+3)²"], answer: "(x-3)(x+3)" },
  ],
  geometry: [
    { id: 1, question: "What is the formula for the volume of a sphere?", options: ["4/3πr³", "πr²", "2πr", "4πr²"], answer: "4/3πr³" },
    { id: 2, question: "In a right triangle, if one angle is 30°, what is another angle?", options: ["30°", "45°", "60°", "90°"], answer: "60°" },
    { id: 3, question: "What is the sum of interior angles in a pentagon?", options: ["360°", "450°", "540°", "720°"], answer: "540°" },
    { id: 4, question: "What is the perimeter of a square with side length 8?", options: ["16", "24", "32", "64"], answer: "32" },
    { id: 5, question: "What is the area of a trapezoid with bases 5 and 9 and height 4?", options: ["14", "20", "28", "36"], answer: "28" },
  ]
};

const SCIENCE_QUESTIONS = {
  astronomy: [
    { id: 1, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: "Mars" },
    { id: 2, question: "What is the largest planet in our solar system?", options: ["Earth", "Saturn", "Jupiter", "Neptune"], answer: "Jupiter" },
    { id: 3, question: "What is the name of our galaxy?", options: ["Andromeda", "Milky Way", "Triangulum", "Sombrero"], answer: "Milky Way" },
    { id: 4, question: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], answer: "8" },
    { id: 5, question: "What causes the phases of the moon?", options: ["Earth's shadow", "The moon's rotation", "The moon's position relative to Earth and the Sun", "Solar flares"], answer: "The moon's position relative to Earth and the Sun" },
  ],
  biology: [
    { id: 1, question: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Brain", "Skin"], answer: "Skin" },
    { id: 2, question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Endoplasmic Reticulum", "Golgi Apparatus"], answer: "Mitochondria" },
    { id: 3, question: "What is the process by which plants make their food?", options: ["Respiration", "Photosynthesis", "Digestion", "Excretion"], answer: "Photosynthesis" },
    { id: 4, question: "What is the scientific name for humans?", options: ["Homo erectus", "Homo neanderthalensis", "Homo sapiens", "Homo habilis"], answer: "Homo sapiens" },
    { id: 5, question: "Which blood type is known as the universal donor?", options: ["A+", "AB-", "O-", "B+"], answer: "O-" },
  ],
  chemistry: [
    { id: 1, question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: "Au" },
    { id: 2, question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Nitrogen" },
    { id: 3, question: "What is the pH of pure water?", options: ["0", "7", "14", "10"], answer: "7" },
    { id: 4, question: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], answer: "6" },
    { id: 5, question: "Which element has the chemical symbol 'Fe'?", options: ["Iron", "Fluorine", "Francium", "Fermium"], answer: "Iron" },
  ]
};

const HISTORY_QUESTIONS = {
  ancient: [
    { id: 1, question: "Which ancient civilization built the pyramids of Giza?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: "Egyptians" },
    { id: 2, question: "Who was the first Emperor of Rome?", options: ["Julius Caesar", "Augustus", "Nero", "Constantine"], answer: "Augustus" },
    { id: 3, question: "Which ancient wonder was located in Alexandria?", options: ["Hanging Gardens", "Colossus", "Lighthouse", "Temple of Artemis"], answer: "Lighthouse" },
    { id: 4, question: "Which civilization developed the first known writing system?", options: ["Egyptians", "Sumerians", "Chinese", "Indus Valley"], answer: "Sumerians" },
    { id: 5, question: "Who was the famous queen of ancient Egypt who allied with Mark Antony?", options: ["Nefertiti", "Hatshepsut", "Cleopatra", "Isis"], answer: "Cleopatra" },
  ],
  modern: [
    { id: 1, question: "Who was the first president of the United States?", options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"], answer: "George Washington" },
    { id: 2, question: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: "1945" },
    { id: 3, question: "Which country was the first to send a human to space?", options: ["USA", "USSR", "China", "UK"], answer: "USSR" },
    { id: 4, question: "Who was the leader of the civil rights movement in the United States?", options: ["Malcolm X", "Martin Luther King Jr.", "Rosa Parks", "John F. Kennedy"], answer: "Martin Luther King Jr." },
    { id: 5, question: "Which event marked the beginning of World War I?", options: ["The invasion of Poland", "The assassination of Archduke Franz Ferdinand", "The sinking of the Lusitania", "The Treaty of Versailles"], answer: "The assassination of Archduke Franz Ferdinand" },
  ],
  medieval: [
    { id: 1, question: "Who was the famous king of England who had six wives?", options: ["Henry VII", "Henry VIII", "Richard III", "Edward VI"], answer: "Henry VIII" },
    { id: 2, question: "What was the name of the plague that killed millions in Europe during the 14th century?", options: ["Yellow Fever", "Smallpox", "Black Death", "Spanish Flu"], answer: "Black Death" },
    { id: 3, question: "Which empire conquered Constantinople in 1453?", options: ["Roman Empire", "Ottoman Empire", "Mongol Empire", "Byzantine Empire"], answer: "Ottoman Empire" },
    { id: 4, question: "Who was the famous French heroine who led the French army to victory at Orleans?", options: ["Marie Antoinette", "Catherine de Medici", "Joan of Arc", "Eleanor of Aquitaine"], answer: "Joan of Arc" },
    { id: 5, question: "What was the name of the period of artistic and cultural change in Europe that marked the transition from medieval to modern times?", options: ["Enlightenment", "Industrial Revolution", "Renaissance", "Reformation"], answer: "Renaissance" },
  ]
};

// Quest data
const QUESTS = [
  {
    id: "1",
    title: "Solar System Adventure",
    description: "Explore planets and stars in our solar system",
    image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000",
    difficulty: "Beginner",
    xp: 100,
    type: "astronomy",
    subject: "Science",
    questions: SCIENCE_QUESTIONS.astronomy
  },
  {
    id: "2",
    title: "Fraction Master",
    description: "Master fractions and decimals with interactive problems",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
    difficulty: "Intermediate",
    xp: 150,
    type: "algebra",
    subject: "Math",
    questions: MATH_QUESTIONS.algebra
  },
  {
    id: "3",
    title: "Grammar Challenge",
    description: "Test your grammar skills with challenging exercises",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000",
    difficulty: "Beginner",
    xp: 75,
    type: "language",
    subject: "English",
    questions: [
      { id: 1, question: "Which of these is a proper noun?", options: ["city", "happiness", "London", "beautiful"], answer: "London" },
      { id: 2, question: "Which sentence uses the correct form of the verb?", options: ["They was happy.", "She were tired.", "He is sleeping.", "We is going home."], answer: "He is sleeping." },
      { id: 3, question: "Which word is an adverb?", options: ["quick", "quickly", "quickness", "quicken"], answer: "quickly" },
      { id: 4, question: "Which sentence has the correct punctuation?", options: ["Where are you going?", "Where are you going.", "Where are you going", "Where, are you going?"], answer: "Where are you going?" },
      { id: 5, question: "Which of these is a preposition?", options: ["run", "happy", "under", "quickly"], answer: "under" },
    ]
  },
  {
    id: "4",
    title: "Ancient Civilizations",
    description: "Discover the wonders of ancient civilizations",
    image: "https://images.unsplash.com/photo-1608425234255-d7c8a5380b3b?q=80&w=1000",
    difficulty: "Advanced",
    xp: 200,
    type: "ancient",
    subject: "History",
    questions: HISTORY_QUESTIONS.ancient
  },
  {
    id: "5",
    title: "Chemistry Lab",
    description: "Conduct virtual experiments and learn about elements",
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=1000",
    difficulty: "Intermediate",
    xp: 125,
    type: "chemistry",
    subject: "Science",
    questions: SCIENCE_QUESTIONS.chemistry
  }
];

// Friend activity data with more detailed activities
const FRIENDS = [
  { 
    id: "1",
    name: "Alex", 
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    level: 7,
    activities: [
      { type: "quest", name: "Solar System Adventure", time: "2h ago", xp: 100 },
      { type: "badge", name: "Science Whiz", time: "1d ago", icon: "medal" },
      { type: "level", value: 7, time: "2d ago", xp: 500 }
    ],
    streak: 12
  },
  { 
    id: "2",
    name: "Maya", 
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    level: 9,
    activities: [
      { type: "badge", name: "Math Master", time: "1h ago", icon: "award" },
      { type: "quest", name: "Fraction Master", time: "5h ago", xp: 150 },
      { type: "achievement", name: "Perfect Score", time: "2d ago", icon: "star" }
    ],
    streak: 23
  },
  { 
    id: "3",
    name: "Jayden", 
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    level: 5,
    activities: [
      { type: "quest", name: "Grammar Challenge", time: "30m ago", xp: 75 },
      { type: "level", value: 5, time: "1d ago", xp: 300 },
      { type: "badge", name: "Quick Learner", time: "3d ago", icon: "zap" }
    ],
    streak: 5
  },
  { 
    id: "4",
    name: "Sophia", 
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    level: 8,
    activities: [
      { type: "achievement", name: "Weekly Champion", time: "4h ago", icon: "trophy" },
      { type: "quest", name: "Ancient Civilizations", time: "1d ago", xp: 200 },
      { type: "badge", name: "History Buff", time: "2d ago", icon: "book" }
    ],
    streak: 18
  },
  { 
    id: "5",
    name: "Ethan", 
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    level: 6,
    activities: [
      { type: "level", value: 6, time: "3h ago", xp: 400 },
      { type: "quest", name: "Chemistry Lab", time: "1d ago", xp: 125 },
      { type: "badge", name: "Element Expert", time: "4d ago", icon: "flask" }
    ],
    streak: 9
  }
];

const HomePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [questModalVisible, setQuestModalVisible] = useState(false);
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentQuizType, setCurrentQuizType] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuest, setCurrentQuest] = useState(null);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [quizTypes, setQuizTypes] = useState([]);
  const [dailyXP, setDailyXP] = useState(75);
  const [totalXP, setTotalXP] = useState(1250);
  const [streakDays, setStreakDays] = useState(7);
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

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

  const openQuestionModal = (subject, quizType = null) => {
    let questions;
    let availableTypes = [];
    
    switch (subject) {
      case "Math":
        availableTypes = Object.keys(MATH_QUESTIONS);
        questions = quizType ? MATH_QUESTIONS[quizType] : MATH_QUESTIONS.basic;
        break;
      case "Science":
        availableTypes = Object.keys(SCIENCE_QUESTIONS);
        questions = quizType ? SCIENCE_QUESTIONS[quizType] : SCIENCE_QUESTIONS.astronomy;
        break;
      case "History":
        availableTypes = Object.keys(HISTORY_QUESTIONS);
        questions = quizType ? HISTORY_QUESTIONS[quizType] : HISTORY_QUESTIONS.ancient;
        break;
      default:
        questions = [];
        availableTypes = [];
    }
    
    setCurrentSubject(subject);
    setQuizTypes(availableTypes);
    setCurrentQuizType(quizType || availableTypes[0]);
    setCurrentQuestions(questions);
    setSelectedAnswers({});
    setShowResults(false);
    setModalVisible(true);
  };

  const openQuestModal = (quest) => {
    setCurrentQuest(quest);
    setCurrentQuestions(quest.questions);
    setSelectedAnswers({});
    setShowResults(false);
    setQuestModalVisible(true);
  };

  const openFriendModal = (friend) => {
    setCurrentFriend(friend);
    setFriendModalVisible(true);
  };

  const handleSelectAnswer = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleSubmit = (isQuest = false) => {
    setShowResults(true);
    const score = getScore();
    const totalQuestions = currentQuestions.length;
    const earnedPoints = Math.round((score / totalQuestions) * (isQuest ? currentQuest.xp : 50));
    
    setEarnedXP(earnedPoints);
    setDailyXP(dailyXP + earnedPoints);
    setTotalXP(totalXP + earnedPoints);
    
    // If perfect score, increase streak
    if (score === totalQuestions) {
      setStreakDays(streakDays + 1);
    }
  };

  const getScore = () => {
    let score = 0;
    currentQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.answer) {
        score++;
      }
    });
    return score;
  };

  const changeQuizType = (type) => {
    let questions;
    
    switch (currentSubject) {
      case "Math":
        questions = MATH_QUESTIONS[type];
        break;
      case "Science":
        questions = SCIENCE_QUESTIONS[type];
        break;
      case "History":
        questions = HISTORY_QUESTIONS[type];
        break;
      default:
        questions = [];
    }
    
    setCurrentQuizType(type);
    setCurrentQuestions(questions);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const renderActivityIcon = (activity) => {
    switch (activity.type) {
      case "quest":
        return <FontAwesome5 name="rocket" size={16} color="#5E72E4" />;
      case "badge":
        return <FontAwesome5 name={activity.icon} size={16} color="#FF7043" />;
      case "level":
        return <FontAwesome5 name="level-up-alt" size={16} color="#4CAF50" />;
      case "achievement":
        return <FontAwesome5 name={activity.icon} size={16} color="#FFC107" />;
      default:
        return <FontAwesome5 name="star" size={16} color="#5E72E4" />;
    }
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
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=1000" }} 
          style={[styles.planet, styles.planet3]} 
        />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, Explorer!</Text>
              <Text style={styles.subtitle}>Ready to learn something new?</Text>
            </View>
            <TouchableOpacity style={styles.avatarContainer}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={styles.avatar} />
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>5</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats Bar */}
          <Animated.View 
            style={[
              styles.statsBar,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.statItem}>
              <FontAwesome5 name="bolt" size={16} color="#FFC107" solid />
              <Text style={styles.statValue}>{dailyXP}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="trophy" size={16} color="#5E72E4" solid />
              <Text style={styles.statValue}>{totalXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="fire" size={16} color="#FF7043" solid />
              <Text style={styles.statValue}>{streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </Animated.View>

          {/* Daily Quest Banner */}
          <TouchableOpacity onPress={() => openQuestionModal("Math", "basic")}>
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1506703719100-a0b3a3a7f0b3?q=80&w=1000" }}
              style={styles.banner}
              imageStyle={{ borderRadius: 16 }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bannerGradient}
              >
                <View style={styles.bannerContent}>
                  <View style={styles.bannerTextContainer}>
                    <Text style={styles.bannerTitle}>Daily Quest</Text>
                    <Text style={styles.bannerSubtitle}>Complete 3 math problems</Text>
                  </View>
                  <View style={styles.xpContainer}>
                    <Text style={styles.xpText}>+50 XP</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          {/* Continue Learning Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
            {/* Math Card */}
            <TouchableOpacity 
              style={[styles.subjectCard, { backgroundColor: "#FF7043" }]}
              onPress={() => openQuestionModal("Math")}
            >
              <View style={styles.subjectIconContainer}>
                <FontAwesome5 name="calculator" size={24} color="white" />
              </View>
              <Text style={styles.subjectTitle}>Math</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: "70%" }]} />
              </View>
              <Text style={styles.progressText}>70% Complete</Text>
              <View style={styles.quizTypesContainer}>
                <TouchableOpacity 
                  style={styles.quizTypeButton}
                  onPress={() => openQuestionModal("Math", "basic")}
                >
                  <Text style={styles.quizTypeText}>Basic</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quizTypeButton}
                  onPress={() => openQuestionModal("Math", "algebra")}
                >
                  <Text style={styles.quizTypeText}>Algebra</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Science Card */}
            <TouchableOpacity 
              style={[styles.subjectCard, { backgroundColor: "#26C6DA" }]}
              onPress={() => openQuestionModal("Science")}
            >
              <View style={styles.subjectIconContainer}>
                <FontAwesome5 name="flask" size={24} color="white" />
              </View>
              <Text style={styles.subjectTitle}>Science</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: "45%" }]} />
              </View>
              <Text style={styles.progressText}>45% Complete</Text>
              <View style={styles.quizTypesContainer}>
                <TouchableOpacity 
                  style={styles.quizTypeButton}
                  onPress={() => openQuestionModal("Science", "astronomy")}
                >
                  <Text style={styles.quizTypeText}>Astronomy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quizTypeButton}
                  onPress={() => openQuestionModal("Science", "biology")}
                >
                  <Text style={styles.quizTypeText}>Biology</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* History Card */}
            <TouchableOpacity 
              style={[styles.subjectCard, { backgroundColor: "#8D6E63" }]}
              onPress={() => openQuestionModal("History")}
            >
              <View style={styles.subjectIconContainer}>
                <FontAwesome5 name="book" size={24} color="white" />
              </View>
              <Text style={styles.subjectTitle}>History</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: "30%" }]} />
              </View>
              <Text style={styles.progressText}>30% Complete</Text>
              <View style={styles.quizTypesContainer}>
                <TouchableOpacity 
                  style={styles.quizTypeButton}
                  onPress={() => openQuestionModal("History", "ancient")}
                >
                  <Text style={styles.quizTypeText}>Ancient</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quizTypeButton}
                  onPress={() => openQuestionModal("History", "modern")}
                >
                  <Text style={styles.quizTypeText}>Modern</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Popular Quests Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Quests</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Quest Items */}
          <View style={styles.questsContainer}>
            {QUESTS.map((quest) => (
              <TouchableOpacity 
                key={quest.id} 
                style={styles.questItem}
                onPress={() => openQuestModal(quest)}
              >
                <Image
                  source={{ uri: quest.image }}
                  style={styles.questImage}
                />
                <View style={styles.questInfo}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDescription}>{quest.description}</Text>
                  <View style={styles.questMeta}>
                    <View style={[
                      styles.questDifficulty, 
                      { 
                        backgroundColor: 
                          quest.difficulty === "Beginner" ? "#4CAF50" : 
                          quest.difficulty === "Intermediate" ? "#FFC107" : "#F44336" 
                      }
                    ]}>
                      <Text style={styles.questDifficultyText}>{quest.difficulty}</Text>
                    </View>
                    <Text style={styles.questXP}>+{quest.xp} XP</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Friends Activity */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Friends Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.friendsContainer}>
            {FRIENDS.map((friend) => (
              <TouchableOpacity 
                key={friend.id} 
                style={styles.friendCard}
                onPress={() => openFriendModal(friend)}
              >
                <View style={styles.friendHeader}>
                  <Image
                    source={{ uri: friend.avatar }}
                    style={styles.friendAvatar}
                  />
                  <View style={styles.friendLevelBadge}>
                    <Text style={styles.friendLevelText}>{friend.level}</Text>
                  </View>
                </View>
                <Text style={styles.friendName}>{friend.name}</Text>
                
                <View style={styles.friendStreakContainer}>
                  <FontAwesome5 name="fire" size={12} color="#FF7043" solid />
                  <Text style={styles.friendStreakText}>{friend.streak} day streak</Text>
                </View>
                
                <View style={styles.friendActivityList}>
                  {friend.activities.slice(0, 2).map((activity, index) => (
                    <View key={index} style={styles.friendActivityItem}>
                      {renderActivityIcon(activity)}
                      <View style={styles.friendActivityContent}>
                        <Text style={styles.friendActivityText}>
                          {activity.type === "quest" ? `Completed ${activity.name}` :
                           activity.type === "badge" ? `Earned ${activity.name} badge` :
                           activity.type === "level" ? `Reached Level ${activity.value}` :
                           `Achieved ${activity.name}`}
                        </Text>
                        <Text style={styles.friendActivityTime}>{activity.time}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 20 }} />
        </ScrollView>
        
        {/* Subject Quiz Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{currentSubject} Quiz</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome5 name="times" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              {!showResults && (
                <View style={styles.quizTypeSelector}>
                  <Text style={styles.quizTypeSelectorLabel}>Quiz Type:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {quizTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.quizTypeSelectorButton,
                          currentQuizType === type && styles.quizTypeSelectorButtonActive
                        ]}
                        onPress={() => changeQuizType(type)}
                      >
                        <Text style={[
                          styles.quizTypeSelectorButtonText,
                          currentQuizType === type && styles.quizTypeSelectorButtonTextActive
                        ]}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              
              {showResults ? (
                <View style={styles.resultsContainer}>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreText}>{getScore()}/{currentQuestions.length}</Text>
                  </View>
                  <Text style={styles.resultTitle}>
                    {getScore() === currentQuestions.length 
                      ? "Perfect Score!" 
                      : getScore() > currentQuestions.length / 2 
                        ? "Good Job!" 
                        : "Keep Practicing!"}
                  </Text>
                  
                  <View style={styles.xpEarnedContainer}>
                    <FontAwesome5 name="star" size={24} color="#FFC107" solid />
                    <Text style={styles.xpEarnedText}>+{earnedXP} XP Earned!</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.tryAgainButton}
                    onPress={() => {
                      setSelectedAnswers({});
                      setShowResults(false);
                    }}
                  >
                    <Text style={styles.tryAgainButtonText}>Try Again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <ScrollView style={styles.questionsContainer}>
                    {currentQuestions.map((question, index) => (
                      <View key={question.id} style={styles.questionCard}>
                        <Text style={styles.questionNumber}>Question {index + 1}</Text>
                        <Text style={styles.questionText}>{question.question}</Text>
                        <View style={styles.optionsContainer}>
                          {question.options.map((option) => (
                            <TouchableOpacity 
                              key={option} 
                              style={[
                                styles.optionButton,
                                selectedAnswers[question.id] === option && styles.selectedOption
                              ]}
                              onPress={() => handleSelectAnswer(question.id, option)}
                            >
                              <Text style={[
                                styles.optionText,
                                selectedAnswers[question.id] === option && styles.selectedOptionText
                              ]}>
                                {option}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity 
                    style={[
                      styles.submitButton,
                      Object.keys(selectedAnswers).length < currentQuestions.length && styles.disabledButton
                    ]}
                    onPress={() => handleSubmit(false)}
                    disabled={Object.keys(selectedAnswers).length < currentQuestions.length}
                  >
                    <Text style={styles.submitButtonText}>Submit Answers</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
        
        {/* Quest Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={questModalVisible}
          onRequestClose={() => setQuestModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {currentQuest && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{currentQuest.title}</Text>
                    <TouchableOpacity onPress={() => setQuestModalVisible(false)}>
                      <FontAwesome5 name="times" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.questModalInfo}>
                    <Image source={{ uri: currentQuest.image }} style={styles.questModalImage} />
                    <View style={styles.questModalDetails}>
                      <Text style={styles.questModalDescription}>{currentQuest.description}</Text>
                      <View style={styles.questModalMeta}>
                        <View style={[
                          styles.questDifficulty, 
                          { 
                            backgroundColor: 
                              currentQuest.difficulty === "Beginner" ? "#4CAF50" : 
                              currentQuest.difficulty === "Intermediate" ? "#FFC107" : "#F44336" 
                          }
                        ]}>
                          <Text style={styles.questDifficultyText}>{currentQuest.difficulty}</Text>
                        </View>
                        <View style={styles.questSubject}>
                          <Text style={styles.questSubjectText}>{currentQuest.subject}</Text>
                        </View>
                        <Text style={styles.questXP}>+{currentQuest.xp} XP</Text>
                      </View>
                    </View>
                  </View>
                  
                  {showResults ? (
                    <View style={styles.resultsContainer}>
                      <View style={styles.scoreCircle}>
                        <Text style={styles.scoreText}>{getScore()}/{currentQuestions.length}</Text>
                      </View>
                      <Text style={styles.resultTitle}>
                        {getScore() === currentQuestions.length 
                          ? "Quest Completed!" 
                          : getScore() > currentQuestions.length / 2 
                            ? "Almost There!" 
                            : "Try Again!"}
                      </Text>
                      
                      <View style={styles.xpEarnedContainer}>
                        <FontAwesome5 name="star" size={24} color="#FFC107" solid />
                        <Text style={styles.xpEarnedText}>+{earnedXP} XP Earned!</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.tryAgainButton}
                        onPress={() => {
                          setSelectedAnswers({});
                          setShowResults(false);
                        }}
                      >
                        <Text style={styles.tryAgainButtonText}>Try Again</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setQuestModalVisible(false)}
                      >
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <ScrollView style={styles.questionsContainer}>
                        {currentQuestions.map((question, index) => (
                          <View key={question.id} style={styles.questionCard}>
                            <Text style={styles.questionNumber}>Question {index + 1}</Text>
                            <Text style={styles.questionText}>{question.question}</Text>
                            <View style={styles.optionsContainer}>
                              {question.options.map((option) => (
                                <TouchableOpacity 
                                  key={option} 
                                  style={[
                                    styles.optionButton,
                                    selectedAnswers[question.id] === option && styles.selectedOption
                                  ]}
                                  onPress={() => handleSelectAnswer(question.id, option)}
                                >
                                  <Text style={[
                                    styles.optionText,
                                    selectedAnswers[question.id] === option && styles.selectedOptionText
                                  ]}>
                                    {option}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                      <TouchableOpacity 
                        style={[
                          styles.submitButton,
                          Object.keys(selectedAnswers).length < currentQuestions.length && styles.disabledButton
                        ]}
                        onPress={() => handleSubmit(true)}
                        disabled={Object.keys(selectedAnswers).length < currentQuestions.length}
                      >
                        <Text style={styles.submitButtonText}>Complete Quest</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
        
        {/* Friend Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={friendModalVisible}
          onRequestClose={() => setFriendModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {currentFriend && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{currentFriend.name}'s Profile</Text>
                    <TouchableOpacity onPress={() => setFriendModalVisible(false)}>
                      <FontAwesome5 name="times" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.friendProfileHeader}>
                    <Image source={{ uri: currentFriend.avatar }} style={styles.friendProfileAvatar} />
                    <View style={styles.friendProfileInfo}>
                      <Text style={styles.friendProfileName}>{currentFriend.name}</Text>
                      <View style={styles.friendProfileLevel}>
                        <Text style={styles.friendProfileLevelText}>Level {currentFriend.level}</Text>
                      </View>
                      <View style={styles.friendProfileStreak}>
                        <FontAwesome5 name="fire" size={16} color="#FF7043" solid />
                        <Text style={styles.friendProfileStreakText}>{currentFriend.streak} day streak</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.friendProfileSection}>
                    <Text style={styles.friendProfileSectionTitle}>Recent Activity</Text>
                    <FlatList
                      data={currentFriend.activities}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={styles.friendProfileActivity}>
                          <View style={styles.friendProfileActivityIcon}>
                            {renderActivityIcon(item)}
                          </View>
                          <View style={styles.friendProfileActivityContent}>
                            <Text style={styles.friendProfileActivityText}>
                              {item.type === "quest" ? `Completed ${item.name}` :
                               item.type === "badge" ? `Earned ${item.name} badge` :
                               item.type === "level" ? `Reached Level ${item.value}` :
                               `Achieved ${item.name}`}
                            </Text>
                            <Text style={styles.friendProfileActivityTime}>{item.time}</Text>
                          </View>
                          {item.xp && (
                            <View style={styles.friendProfileActivityXP}>
                              <Text style={styles.friendProfileActivityXPText}>+{item.xp} XP</Text>
                            </View>
                          )}
                        </View>
                      )}
                    />
                  </View>
                  
                  <TouchableOpacity style={styles.challengeFriendButton}>
                    <FontAwesome5 name="trophy" size={16} color="white" />
                    <Text style={styles.challengeFriendButtonText}>Challenge Friend</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
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
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
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
  planet3: {
    width: 100,
    height: 100,
    bottom: height * 0.1,
    right: -30,
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc",
    marginTop: 4,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#5E72E4",
  },
  levelBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#5E72E4",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Stats Bar
  statsBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    color: "#cccccc",
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  banner: {
    height: 120,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: "flex-end",
  },
  bannerGradient: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 16,
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  xpContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  xpText: {
    color: "white",
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  seeAllText: {
    color: "#5E72E4",
    fontSize: 14,
  },
  cardsContainer: {
    paddingLeft: 20,
  },
  subjectCard: {
    width: 180,
    height: 220,
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  subjectIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 3,
  },
  progressText: {
    color: "white",
    fontSize: 12,
    marginBottom: 10,
  },
  quizTypesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quizTypeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  quizTypeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
  },
  questsContainer: {
    paddingHorizontal: 20,
  },
  questItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  questImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  questInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  questTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  questDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  questMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  questDifficulty: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  questDifficultyText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  questXP: {
    color: "#5E72E4",
    fontWeight: "bold",
  },
  questSubject: {
    backgroundColor: "#5E72E4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  questSubjectText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  // Friends section
  friendsContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  friendCard: {
    width: '48%',
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  friendHeader: {
    position: "relative",
    alignItems: "center",
    marginBottom: 10,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#5E72E4",
  },
  friendLevelBadge: {
    position: "absolute",
    bottom: -5,
    right: 10,
    backgroundColor: "#5E72E4",
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  friendLevelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  friendName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  friendStreakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  friendStreakText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  friendActivityList: {
    marginTop: 5,
  },
  friendActivityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "rgba(240, 240, 240, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  friendActivityContent: {
    flex: 1,
    marginLeft: 8,
  },
  friendActivityText: {
    fontSize: 11,
    color: "#333",
  },
  friendActivityTime: {
    fontSize: 9,
    color: "#666",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  quizTypeSelector: {
    marginBottom: 15,
  },
  quizTypeSelectorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  quizTypeSelectorButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#F5F5F5",
  },
  quizTypeSelectorButtonActive: {
    backgroundColor: "#5E72E4",
  },
  quizTypeSelectorButtonText: {
    fontSize: 14,
    color: "#333",
  },
  quizTypeSelectorButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  questionsContainer: {
    maxHeight: height * 0.6,
  },
  questionCard: {
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 15,
  },
  questionNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedOption: {
    backgroundColor: "#5E72E4",
    borderColor: "#5E72E4",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#5E72E4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Results styles
  resultsContainer: {
    alignItems: "center",
    padding: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#5E72E4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  xpEarnedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 25,
  },
  xpEarnedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFC107",
    marginLeft: 10,
  },
  tryAgainButton: {
    backgroundColor: "#5E72E4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  tryAgainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Quest Modal styles
  questModalInfo: {
    marginBottom: 20,
  },
  questModalImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
    marginBottom: 15,
  },
  questModalDetails: {
    padding: 5,
  },
  questModalDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  questModalMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Friend Profile styles
  friendProfileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
  },
  friendProfileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#5E72E4",
  },
  friendProfileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  friendProfileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  friendProfileLevel: {
    backgroundColor: "#5E72E4",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  friendProfileLevelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  friendProfileStreak: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendProfileStreakText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  friendProfileSection: {
    marginBottom: 20,
  },
  friendProfileSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  friendProfileActivity: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  friendProfileActivityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  friendProfileActivityContent: {
    flex: 1,
  },
  friendProfileActivityText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  friendProfileActivityTime: {
    fontSize: 12,
    color: "#666",
  },
  friendProfileActivityXP: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  friendProfileActivityXPText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFC107",
  },
  challengeFriendButton: {
    backgroundColor: "#5E72E4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  challengeFriendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default HomePage;