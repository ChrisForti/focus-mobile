import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "../constants/Colors";
import { Project } from "../types";

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: number | null;
  onSelectProject: (projectId: number) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Project:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProjectId}
          onValueChange={(value) => onSelectProject(value as number)}
          style={styles.picker}
        >
          <Picker.Item label="Select a project..." value={null} />
          {projects.map((project) => (
            <Picker.Item
              key={project.id}
              label={project.name}
              value={project.id}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  picker: {
    height: Platform.OS === "ios" ? 200 : 50,
  },
});

export default ProjectSelector;
