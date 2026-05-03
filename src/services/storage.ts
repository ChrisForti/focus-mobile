import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  API_URL: "@focus:apiUrl",
  SELECTED_PROJECT: "@focus:selectedProject",
  USER_PREFERENCES: "@focus:preferences",
};

/**
 * Storage Service
 */
export const StorageService = {
  /**
   * Save API URL
   */
  async saveApiUrl(url: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_URL, url);
    } catch (error) {
      console.error("Error saving API URL:", error);
      throw error;
    }
  },

  /**
   * Get saved API URL
   */
  async getApiUrl(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    } catch (error) {
      console.error("Error getting API URL:", error);
      return null;
    }
  },

  /**
   * Save selected project ID
   */
  async saveSelectedProject(projectId: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_PROJECT,
        String(projectId),
      );
    } catch (error) {
      console.error("Error saving selected project:", error);
      throw error;
    }
  },

  /**
   * Get selected project ID
   */
  async getSelectedProject(): Promise<number | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_PROJECT);
      return value ? parseInt(value, 10) : null;
    } catch (error) {
      console.error("Error getting selected project:", error);
      return null;
    }
  },

  /**
   * Save user preferences
   */
  async savePreferences(preferences: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences),
      );
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  },

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error getting preferences:", error);
      return null;
    }
  },

  /**
   * Clear all storage
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  },

  /**
   * Remove specific item
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  },
};

export default StorageService;
