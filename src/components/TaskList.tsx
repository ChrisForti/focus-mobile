import React from "react";
import { View, StyleSheet } from "react-native";
import { Task } from "../types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onDelete,
}) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default TaskList;
