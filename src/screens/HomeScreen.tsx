import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/Colors";
import RecordButton from "../components/RecordButton";
import TaskList from "../components/TaskList";
import ProjectSelector from "../components/ProjectSelector";
import LoadingOverlay from "../components/LoadingOverlay";
import { audioRecorder } from "../services/audio";
import FocusAPI from "../services/api";
import StorageService from "../services/storage";
import { Task, Project } from "../types";
import { getRecentTasks } from "../utils/helpers";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  // Timer for recording duration
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 100);
      }, 100);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Load projects and tasks on mount
  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  const loadProjects = async () => {
    try {
      const fetchedProjects = await FocusAPI.getProjects();
      setProjects(fetchedProjects);

      // Load last selected project
      const savedProjectId = await StorageService.getSelectedProject();
      if (savedProjectId) {
        setSelectedProjectId(savedProjectId);
      } else if (fetchedProjects.length > 0) {
        setSelectedProjectId(fetchedProjects[0].id);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load projects");
      console.error(error);
    }
  };

  const loadTasks = async () => {
    try {
      const allTasks = await FocusAPI.getTodos();
      const recent = getRecentTasks(
        allTasks.filter((t) => !t.isCompleted),
        3,
      );
      setRecentTasks(recent);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const handlePressIn = async () => {
    try {
      await audioRecorder.startRecording();
      setIsRecording(true);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to start recording. Please check permissions.",
      );
      console.error(error);
    }
  };

  const handlePressOut = async () => {
    try {
      setIsRecording(false);
      const audioUri = await audioRecorder.stopRecording();

      if (!selectedProjectId) {
        Alert.alert("Error", "Please select a project first");
        return;
      }

      // Upload and process
      setIsLoading(true);
      setLoadingMessage("Processing voice recording...");

      const response = await FocusAPI.processVoice(audioUri, selectedProjectId);

      if (response.success && response.tasks.length > 0) {
        Alert.alert(
          "Success!",
          `Extracted ${response.tasks.length} task${response.tasks.length > 1 ? "s" : ""}`,
        );
        loadTasks(); // Refresh tasks
      } else {
        Alert.alert("Info", "No tasks extracted from recording");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process recording");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = async (projectId: number) => {
    setSelectedProjectId(projectId);
    await StorageService.saveSelectedProject(projectId);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await FocusAPI.updateTodo(task.id, { isCompleted: !task.isCompleted });
      loadTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Focus 🚤</Text>
        </View>

        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
        />

        <RecordButton
          isRecording={isRecording}
          duration={duration}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />

        {recentTasks.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Tasks</Text>
            <TaskList
              tasks={recentTasks}
              onToggleComplete={handleToggleComplete}
            />
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("Tasks" as never)}
            >
              <Text style={styles.viewAllText}>View All Tasks →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <LoadingOverlay visible={isLoading} message={loadingMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
  },
  recentSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  viewAllButton: {
    marginTop: 12,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: "center",
  },
  viewAllText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
