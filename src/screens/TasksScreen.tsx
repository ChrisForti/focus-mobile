import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import TaskList from "../components/TaskList";
import FocusAPI from "../services/api";
import { Task } from "../types";
import { groupTasksByCategory, sortTasksByPriority } from "../utils/helpers";

const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await FocusAPI.getTodos();
      setTasks(fetchedTasks);
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks");
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTasks();
    setIsRefreshing(false);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await FocusAPI.updateTodo(task.id, { isCompleted: !task.isCompleted });
      loadTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleDelete = async (task: Task) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await FocusAPI.deleteTodo(task.id);
            loadTasks();
          } catch (error) {
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  // Separate completed and incomplete tasks
  const incompleteTasks = sortTasksByPriority(
    tasks.filter((t) => !t.isCompleted),
  );
  const completedTasks = tasks.filter((t) => t.isCompleted);

  // Group incomplete tasks by category
  const groupedTasks = groupTasksByCategory(incompleteTasks);
  const categories = Object.keys(groupedTasks).sort();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>All Tasks</Text>
          <Text style={styles.subtitle}>
            {incompleteTasks.length} pending • {completedTasks.length} completed
          </Text>
        </View>

        {/* Incomplete tasks by category */}
        {categories.length > 0 ? (
          categories.map((category) => (
            <View key={category} style={styles.section}>
              <Text style={styles.categoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <TaskList
                tasks={groupedTasks[category]}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks yet!</Text>
            <Text style={styles.emptySubtext}>
              Record a voice note to get started
            </Text>
          </View>
        )}

        {/* Completed tasks section */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.categoryTitle}>Completed</Text>
            <TaskList
              tasks={completedTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textLight,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
  },
});

export default TasksScreen;
