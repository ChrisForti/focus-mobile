// API Configuration
// Update this URL to your Railway deployment URL
export const API_BASE_URL = "https://focus-production-a2e3.up.railway.app/api";

// For local development:
// export const API_BASE_URL = "http://YOUR_LOCAL_IP:3000/api";

// Audio settings
export const AUDIO_SETTINGS = {
  maxRecordingDuration: 300000, // 5 minutes in milliseconds
  audioFormat: "m4a",
  quality: "high" as const,
};

// App settings
export const APP_CONFIG = {
  taskPreviewCount: 3, // Number of tasks to show on home screen
  autoRefreshInterval: 30000, // 30 seconds
};

export default {
  API_BASE_URL,
  AUDIO_SETTINGS,
  APP_CONFIG,
};
