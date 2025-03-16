import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

<Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        // Use a transparent background on iOS to show the blur effect
        position: 'absolute',
      },
      default: {},
    }),
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => (
        <FontAwesome5 size={28} name="rocket" color={color} /> // Rocket icon for Home
      ),
    }}
  />
  <Tabs.Screen
    name="explore"
    options={{
      title: 'EDUBOT',
      tabBarIcon: ({ color }) => (
        <FontAwesome5 size={28} name="robot" color={color} /> // Robot icon for EDUBOT
      ),
    }}
  />
  <Tabs.Screen
    name="AccountScreen"
    options={{
      title: 'Account',
      tabBarIcon: ({ color }) => (
        <FontAwesome5 size={28} name="cogs" color={color} /> // Settings (cogs) icon for Account
      ),
    }}
  />
</Tabs>
  );
}