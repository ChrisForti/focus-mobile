import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import FocusAPI from "../services/api";
import { Project } from "../types";

const ProjectsScreen: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const fetchedProjects = await FocusAPI.getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      Alert.alert("Error", "Failed to load projects");
      console.error(error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      Alert.alert("Error", "Project name is required");
      return;
    }

    try {
      await FocusAPI.createProject(
        newProjectName.trim(),
        newProjectDescription.trim() || undefined,
      );
      setNewProjectName("");
      setNewProjectDescription("");
      setIsCreating(false);
      loadProjects();
      Alert.alert("Success", "Project created successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to create project");
      console.error(error);
    }
  };

  const renderProjectItem = (project: Project) => (
    <View key={project.id} style={styles.projectItem}>
      <View style={styles.projectIcon}>
        <Text style={styles.projectIconText}>
          {project.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.projectContent}>
        <Text style={styles.projectName}>{project.name}</Text>
        {project.description && (
          <Text style={styles.projectDescription}>{project.description}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Projects</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setIsCreating(!isCreating)}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? "Cancel" : "+ New Project"}
            </Text>
          </TouchableOpacity>
        </View>

        {isCreating && (
          <View style={styles.createForm}>
            <TextInput
              style={styles.input}
              placeholder="Project name"
              value={newProjectName}
              onChangeText={setNewProjectName}
              placeholderTextColor={Colors.textLight}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newProjectDescription}
              onChangeText={setNewProjectDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textLight}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateProject}
            >
              <Text style={styles.submitButtonText}>Create Project</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.projectsList}>
          {projects.length > 0 ? (
            projects.map(renderProjectItem)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No projects yet</Text>
              <Text style={styles.emptySubtext}>
                Create your first project to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  createForm: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  projectsList: {
    marginTop: 12,
  },
  projectItem: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  projectIconText: {
    color: Colors.surface,
    fontSize: 24,
    fontWeight: "bold",
  },
  projectContent: {
    flex: 1,
    justifyContent: "center",
  },
  projectName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  emptyState: {
    alignItems: "center",
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
    textAlign: "center",
  },
});

export default ProjectsScreen;
