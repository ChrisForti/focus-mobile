import { Audio } from "expo-av";
import { AUDIO_SETTINGS } from "../constants/Config";

/**
 * Audio Recording Service
 */
export class AudioRecorder {
  private recording: Audio.Recording | null = null;
  private startTime: number = 0;

  /**
   * Request audio permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting audio permissions:", error);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    try {
      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Audio recording permission not granted");
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      this.recording = recording;
      this.startTime = Date.now();
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  /**
   * Stop recording and return the audio file URI
   */
  async stopRecording(): Promise<string> {
    try {
      if (!this.recording) {
        throw new Error("No recording in progress");
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.startTime = 0;

      if (!uri) {
        throw new Error("No audio file URI");
      }

      return uri;
    } catch (error) {
      console.error("Error stopping recording:", error);
      throw error;
    }
  }

  /**
   * Get current recording status
   */
  async getStatus(): Promise<{
    isRecording: boolean;
    duration: number;
  }> {
    if (!this.recording) {
      return { isRecording: false, duration: 0 };
    }

    try {
      const status = await this.recording.getStatusAsync();
      return {
        isRecording: status.isRecording,
        duration: status.durationMillis || 0,
      };
    } catch (error) {
      console.error("Error getting recording status:", error);
      return { isRecording: false, duration: 0 };
    }
  }

  /**
   * Cancel current recording
   */
  async cancelRecording(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        console.error("Error canceling recording:", error);
      }
      this.recording = null;
      this.startTime = 0;
    }
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.recording !== null;
  }

  /**
   * Get recording duration in milliseconds
   */
  getDuration(): number {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime;
  }
}

// Singleton instance
export const audioRecorder = new AudioRecorder();

export default audioRecorder;
