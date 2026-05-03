# Focus Mobile App - Complete Build Specification

## 📱 Project Overview

**Repository**: focus-mobile  
**Framework**: React Native (Expo)  
**Language**: TypeScript  
**Backend API**: https://github.com/ChrisForti/focus (Railway deployed)  
**Target Platforms**: iOS & Android

---

## 🎯 App Purpose

Voice-first productivity tool for nautical carpentry workshops. Workers can:

- Record voice notes hands-free while working
- AI extracts structured tasks automatically
- View and manage tasks categorized by type (CNC, Assembly, Finishing)
- Mark tasks complete with simple taps

---

## 🏗️ Project Structure

```
focus-mobile/
├── src/
│   ├── components/
│   │   ├── RecordButton.tsx          # Large recording button (primary UI)
│   │   ├── TaskList.tsx              # Displays all tasks
│   │   ├── TaskItem.tsx              # Individual task card
│   │   ├── ProjectSelector.tsx       # Dropdown for project selection
│   │   ├── CategoryBadge.tsx         # Visual category indicators
│   │   └── LoadingOverlay.tsx        # Loading states
│   ├── screens/
│   │   ├── HomeScreen.tsx            # Main recording interface
│   │   ├── TasksScreen.tsx           # Task list view
│   │   ├── ProjectsScreen.tsx        # Project management
│   │   └── SettingsScreen.tsx        # API endpoint configuration
│   ├── services/
│   │   ├── api.ts                    # Backend API client
│   │   ├── audio.ts                  # Audio recording logic
│   │   └── storage.ts                # AsyncStorage utilities
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   ├── constants/
│   │   ├── Colors.ts                 # Theme colors
│   │   └── Config.ts                 # API endpoints
│   └── utils/
│       └── helpers.ts                # Utility functions
├── App.tsx                           # Root component with navigation
├── app.json                          # Expo configuration
└── package.json
```

---

## 📦 Dependencies to Install

```bash
# Core navigation
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Audio recording
npx expo install expo-av

# API calls
npm install axios

# Storage
npx expo install @react-native-async-storage/async-storage

# UI components
npm install react-native-paper
npx expo install react-native-vector-icons

# Additional utilities
npm install date-fns
```

---

## 🎨 Design Specifications

### Color Scheme (Workshop-Optimized)

```typescript
const Colors = {
  primary: "#003366", // Navy blue (nautical theme)
  secondary: "#FF6B35", // Vibrant orange (high visibility)
  accent: "#4ECDC4", // Teal

  // Priority colors
  highPriority: "#FF4444", // Red
  mediumPriority: "#FFA500", // Orange
  lowPriority: "#4CAF50", // Green

  // Category colors
  cnc: "#9C27B0", // Purple
  assembly: "#2196F3", // Blue
  finishing: "#FF9800", // Orange
  carpentry: "#795548", // Brown

  // Base colors
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#212121",
  textLight: "#757575",
  border: "#E0E0E0",
};
```

### Typography

- **Headers**: 24-32px, Bold
- **Body**: 16-18px, Regular
- **Task text**: 16px, Medium
- **Buttons**: 18px, Semi-bold

### Touch Targets

- **Minimum size**: 60x60px (for gloved hands)
- **Record button**: 120x120px minimum
- **Task checkboxes**: 48x48px

---

## 🎤 Core Features Implementation

### 1. **Home Screen - Recording Interface**

**Layout:**

```
┌─────────────────────────────┐
│  Focus 🚤            [⚙️]   │
├─────────────────────────────┤
│                             │
│  Project: [Yacht Build ▼]   │
│                             │
│         ●   RECORD          │
│      [  00:00  ]           │  <- Big pulsing button
│                             │
│  Recent Tasks (3):          │
│  ☐ Cut transom (CNC)  🔴   │
│  ☐ Sand to 220 grit   🟡   │
│  ☑ Apply varnish      🟢   │
│                             │
│  [View All Tasks →]         │
└─────────────────────────────┘
```

**Functionality:**

- Hold button to record, release to send
- Shows recording duration
- Visual feedback (pulsing animation, color change)
- Displays last 3 tasks as preview
- Project selector at top

### 2. **Recording Logic**

```typescript
// Key functions needed:
- startRecording(): Begins audio capture
- stopRecording(): Stops and saves audio
- uploadRecording(uri, projectId): Sends to API
- handleRecordingComplete(response): Updates UI with new tasks
```

**Recording Flow:**

1. User presses and holds button
2. Visual/haptic feedback starts
3. Audio recording begins
4. Timer shows duration
5. User releases button
6. Recording stops
7. Upload to API automatically
8. Show loading state
9. Display extracted tasks
10. Add to task list

### 3. **Task List Screen**

**Features:**

- Group by category (CNC, Assembly, Finishing)
- Sort by priority (High → Low)
- Color-coded priority badges
- Swipe to mark complete
- Pull to refresh
- Search/filter functionality

**Task Item Structure:**

```typescript
interface Task {
  id: number;
  task: string;
  priority: "low" | "medium" | "high";
  category: string | null;
  isCompleted: boolean;
  logId: number;
  createdAt?: string;
}
```

### 4. **API Service Implementation**

```typescript
const API_BASE_URL = "https://your-railway-app.com/api";

export const FocusAPI = {
  // Process voice recording
  processVoice: async (audioUri: string, projectId: number) => {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioUri,
      type: "audio/m4a",
      name: `recording-${Date.now()}.m4a`,
    } as any);
    formData.append("projectId", String(projectId));

    const response = await axios.post(
      `${API_BASE_URL}/process-voice`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Get all todos
  getTodos: async () => {
    const response = await axios.get(`${API_BASE_URL}/todos`);
    return response.data;
  },

  // Update todo status
  updateTodo: async (id: number, updates: Partial<Task>) => {
    const response = await axios.patch(`${API_BASE_URL}/todos/${id}`, updates);
    return response.data;
  },

  // Get all projects
  getProjects: async () => {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;
  },
};
```

### 5. **Audio Recording Service**

```typescript
import { Audio } from "expo-av";

export class AudioRecorder {
  private recording: Audio.Recording | null = null;

  async startRecording(): Promise<void> {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    this.recording = recording;
  }

  async stopRecording(): Promise<string> {
    if (!this.recording) throw new Error("No recording in progress");

    await this.recording.stopAndUnloadAsync();
    const uri = this.recording.getURI();
    this.recording = null;

    return uri || "";
  }

  getStatus(): { isRecording: boolean; duration: number } {
    // Return current recording status
  }
}
```

---

## 🚀 Implementation Steps

### Phase 1: Basic Setup (Day 1)

1. ✅ Install all dependencies
2. ✅ Set up navigation structure (Bottom tabs + Stack)
3. ✅ Create basic screen layouts
4. ✅ Implement color theme
5. ✅ Create TypeScript types

### Phase 2: Recording Feature (Day 2-3)

1. ✅ Implement audio recording service
2. ✅ Create RecordButton component with animations
3. ✅ Add recording state management
4. ✅ Test audio capture on device

### Phase 3: API Integration (Day 3-4)

1. ✅ Set up API service
2. ✅ Implement file upload
3. ✅ Connect recording to API
4. ✅ Handle API responses
5. ✅ Add error handling

### Phase 4: Task Management (Day 4-5)

1. ✅ Create TaskList component
2. ✅ Implement task grouping/sorting
3. ✅ Add task completion logic
4. ✅ Implement pull-to-refresh

### Phase 5: Polish & Testing (Day 5-7)

1. ✅ Add loading states
2. ✅ Implement offline support
3. ✅ Add haptic feedback
4. ✅ Test on actual devices
5. ✅ Fix UI for different screen sizes

---

## 📱 Testing Instructions

### Local Testing (Expo Go)

```bash
cd focus-mobile
npm start

# Then scan QR code with Expo Go app
```

### Test with Local Backend

1. Start backend: `cd ~/repos/focus && npm run dev`
2. Get your Mac's local IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
3. Update API URL in app: `http://YOUR_IP:3000/api`
4. Both devices must be on same WiFi

### Test with Production Backend

1. Update API URL to Railway: `https://your-app.railway.app/api`
2. Run `npm start`
3. Test on phone

---

## 🎯 Key Screens to Build

### 1. HomeScreen.tsx

- Project selector dropdown
- Large record button (hold to record)
- Recording timer
- Recent tasks preview (last 3)
- "View All Tasks" button

### 2. TasksScreen.tsx

- Full task list
- Group by category
- Filter/search bar
- Swipe actions (complete, delete)
- Pull to refresh

### 3. ProjectsScreen.tsx

- List all projects
- Create new project
- Select active project
- View project stats

### 4. SettingsScreen.tsx

- API endpoint configuration
- Audio quality settings
- Clear cache
- App version info

---

## 🎨 UI Component Requirements

### RecordButton Component

```typescript
<RecordButton
  isRecording={isRecording}
  onStartRecording={() => startRecording()}
  onStopRecording={() => stopRecording()}
  duration={recordingDuration}
/>
```

- Circular button, 120x120px
- Pulsing animation when recording
- Shows duration in center
- Haptic feedback on press/release

### TaskItem Component

```typescript
<TaskItem
  task={task}
  onToggleComplete={(id) => toggleTask(id)}
  onDelete={(id) => deleteTask(id)}
/>
```

- Checkbox on left
- Task text (multiline support)
- Priority badge (colored dot)
- Category badge
- Swipeable for actions

### CategoryBadge Component

```typescript
<CategoryBadge category="CNC" />
```

- Small pill shape
- Category-specific color
- Icon (optional)

---

## 🔧 Configuration Files

### app.json

```json
{
  "expo": {
    "name": "Focus",
    "slug": "focus-mobile",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#003366"
    },
    "ios": {
      "bundleIdentifier": "com.chrisforti.focus",
      "supportsTablet": true
    },
    "android": {
      "package": "com.chrisforti.focus",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#003366"
      },
      "permissions": ["RECORD_AUDIO"]
    },
    "plugins": [
      [
        "expo-av",
        {
          "microphonePermission": "Allow Focus to record voice notes for task extraction."
        }
      ]
    ]
  }
}
```

---

## 🚢 Build & Deploy

### Development Build

```bash
eas build --profile development --platform all
```

### Production Build

```bash
eas build --profile production --platform all
```

### Submit to App Stores

```bash
eas submit --platform ios
eas submit --platform android
```

---

## 📝 Agent Prompt for Implementation

**Copy this to give to an AI agent in the focus-mobile workspace:**

```
Build a complete React Native (Expo) mobile app for the Focus productivity tool.

CONTEXT:
- Backend API already deployed: https://github.com/ChrisForti/focus
- API Endpoints: /api/process-voice, /api/todos, /api/projects
- Audio uploads transcribed by OpenAI Whisper, tasks extracted by GPT-4o

REQUIREMENTS:
1. Main screen with large record button (hold to record, release to send)
2. Audio recording with expo-av
3. Upload to API as multipart/form-data
4. Display extracted tasks in categorized list (CNC, Assembly, Finishing)
5. Mark tasks complete with tap/swipe
6. Project selector
7. Pull to refresh task list

TECHNICAL SPECS:
- TypeScript strict mode
- React Navigation (bottom tabs + stack)
- Large touch targets (60px minimum for workshop gloves)
- High contrast colors for outdoor visibility
- Priority color coding (red=high, yellow=medium, green=low)
- Offline support with AsyncStorage

DESIGN:
- Navy blue primary (#003366)
- Orange accent (#FF6B35) for high visibility
- 120x120px record button with pulsing animation
- Task cards with category badges and priority dots

Follow the complete spec in MOBILE-APP-SPEC.md for implementation details.

Start by:
1. Installing dependencies (expo-av, axios, react-navigation, react-native-paper)
2. Setting up navigation structure
3. Creating the RecordButton component
4. Implementing audio recording service
5. Building API client
6. Creating TaskList screen
```

---

## ✅ Success Criteria

- [ ] Can record audio by holding button
- [ ] Audio uploads to backend successfully
- [ ] Tasks appear in list after upload
- [ ] Can mark tasks complete
- [ ] Tasks persist across app restarts
- [ ] Works on both iOS and Android
- [ ] UI is readable in bright workshop conditions
- [ ] Touch targets work with gloves
- [ ] No crashes during normal use

---

**Ready to build!** 🚀
