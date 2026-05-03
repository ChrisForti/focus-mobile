import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import TasksScreen from "./src/screens/TasksScreen";
import ProjectsScreen from "./src/screens/ProjectsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// Constants
import Colors from "./src/constants/Colors";

// Type definitions
import { RootStackParamList, MainTabParamList } from "./src/types";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "mic" : "mic-outline";
          } else if (route.name === "Tasks") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Projects") {
            iconName = focused ? "folder" : "folder-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Record" }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ tabBarLabel: "Tasks" }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ tabBarLabel: "Projects" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.surface,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: "Settings",
              presentation: "modal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
