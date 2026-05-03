import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { Task } from "../types";
import CategoryBadge from "./CategoryBadge";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return Colors.highPriority;
      case "medium":
        return Colors.mediumPriority;
      case "low":
        return Colors.lowPriority;
      default:
        return Colors.textLight;
    }
  };

  const priorityColor = getPriorityColor(task.priority);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleComplete(task)}
      >
        <View
          style={[
            styles.checkboxInner,
            task.isCompleted && styles.checkboxCompleted,
          ]}
        >
          {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.taskText,
            task.isCompleted && styles.taskTextCompleted,
          ]}
        >
          {task.task}
        </Text>
        <View style={styles.footer}>
          {task.category && <CategoryBadge category={task.category} />}
          <View
            style={[
              styles.priorityIndicator,
              { backgroundColor: priorityColor },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "flex-start",
  },
  checkbox: {
    width: 48,
    height: 48,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.surface,
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingTop: 4,
  },
  taskText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    fontWeight: "500",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: Colors.textLight,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
});

export default TaskItem;
