import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import StorageService from "../services/storage";
import { API_BASE_URL } from "../constants/Config";

const SettingsScreen: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedUrl = await StorageService.getApiUrl();
      if (savedUrl) {
        setApiUrl(savedUrl);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleSaveApiUrl = async () => {
    if (!apiUrl.trim()) {
      Alert.alert("Error", "API URL is required");
      return;
    }

    try {
      setIsSaving(true);
      await StorageService.saveApiUrl(apiUrl.trim());
      Alert.alert("Success", "API URL saved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save API URL");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setApiUrl(API_BASE_URL);
  };

  const handleClearCache = async () => {
    Alert.alert(
      "Clear Cache",
      "This will remove all locally stored data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await StorageService.clearAll();
              Alert.alert("Success", "Cache cleared successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to clear cache");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Configuration</Text>

          <Text style={styles.label}>Backend API URL</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="https://your-app.railway.app/api"
            placeholderTextColor={Colors.textLight}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleResetToDefault}
            >
              <Text style={styles.secondaryButtonText}>Reset to Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSaveApiUrl}
              disabled={isSaving}
            >
              <Text style={styles.primaryButtonText}>
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearCache}
          >
            <Text style={styles.dangerButtonText}>Clear Cache</Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Clears all locally stored data including selected project and
            preferences
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Backend</Text>
            <Text style={styles.infoValue}>Focus API</Text>
          </View>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  dangerButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: "500",
  },
});

export default SettingsScreen;
