import axios from "axios";
import { API_BASE_URL } from "../constants/Config";
import { Task, Project, ProcessVoiceResponse } from "../types";

/**
 * API Service for Focus backend
 */
export const FocusAPI = {
  /**
   * Process voice recording and extract tasks
   */
  processVoice: async (
    audioUri: string,
    projectId: number,
  ): Promise<ProcessVoiceResponse> => {
    try {
      const formData = new FormData();

      // Append audio file
      formData.append("audio", {
        uri: audioUri,
        type: "audio/m4a",
        name: `recording-${Date.now()}.m4a`,
      } as any);

      // Append project ID
      formData.append("projectId", String(projectId));

      const response = await axios.post(
        `${API_BASE_URL}/process-voice`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error processing voice:", error);
      throw error;
    }
  },

  /**
   * Get all todos
   */
  getTodos: async (): Promise<Task[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  },

  /**
   * Update todo status
   */
  updateTodo: async (id: number, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/todos/${id}`,
        updates,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  },

  /**
   * Delete a todo
   */
  deleteTodo: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  },

  /**
   * Get all projects
   */
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  /**
   * Create a new project
   */
  createProject: async (
    name: string,
    description?: string,
  ): Promise<Project> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects`, {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  /**
   * Update API base URL (for settings)
   */
  setBaseURL: (url: string) => {
    axios.defaults.baseURL = url;
  },
};

export default FocusAPI;
