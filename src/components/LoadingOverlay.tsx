import React from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Loading...",
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 200,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
  },
});

export default LoadingOverlay;
