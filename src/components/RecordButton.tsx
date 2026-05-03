import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import Colors from "../constants/Colors";

interface RecordButtonProps {
  isRecording: boolean;
  duration: number;
  onPressIn: () => void;
  onPressOut: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  duration,
  onPressIn,
  onPressOut,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      // Stop pulsing
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.buttonWrapper, { transform: [{ scale: pulseAnim }] }]}
      >
        <TouchableOpacity
          style={[styles.button, isRecording && styles.buttonRecording]}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.innerCircle,
              isRecording && styles.innerCircleRecording,
            ]}
          />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.label}>
        {isRecording ? "Recording..." : "Hold to Record"}
      </Text>
      {isRecording && (
        <Text style={styles.duration}>{formatDuration(duration)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  buttonWrapper: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.surface,
  },
  buttonRecording: {
    backgroundColor: Colors.error,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    opacity: 0.3,
  },
  innerCircleRecording: {
    opacity: 0.5,
  },
  label: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  duration: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.error,
    fontFamily: "monospace",
  },
});

export default RecordButton;
