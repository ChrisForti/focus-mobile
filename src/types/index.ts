export interface Task {
  id: number;
  task: string;
  priority: "low" | "medium" | "high";
  category: string | null;
  isCompleted: boolean;
  logId: number;
  createdAt?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface VoiceLog {
  id: number;
  projectId: number;
  transcription: string;
  audioUrl?: string;
  createdAt: string;
}

export interface ProcessVoiceResponse {
  success: boolean;
  log: VoiceLog;
  tasks: Task[];
  message?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Projects: undefined;
};
