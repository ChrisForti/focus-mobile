# Focus Mobile App 🚤

A voice-first productivity tool for nautical carpentry workshops. Record voice notes hands-free and let AI extract structured tasks automatically.

## Features

- 🎤 **Voice Recording** - Hold-to-record button with visual feedback
- 🤖 **AI Task Extraction** - Automatic task extraction using OpenAI GPT-4o
- 📝 **Task Management** - View, organize, and complete tasks by category
- 🎯 **Priority System** - Color-coded priority indicators (High, Medium, Low)
- 📂 **Project Management** - Organize tasks by project
- 💾 **Persistent Storage** - Local storage for preferences and settings

## Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **Audio**: Expo AV
- **Storage**: AsyncStorage
- **API**: Axios
- **Backend**: [Focus API](https://github.com/ChrisForti/focus)

## Project Structure

```
focus-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── RecordButton.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── ProjectSelector.tsx
│   │   ├── CategoryBadge.tsx
│   │   └── LoadingOverlay.tsx
│   ├── screens/            # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   ├── ProjectsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/           # Business logic & API
│   │   ├── api.ts
│   │   ├── audio.ts
│   │   └── storage.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── constants/          # App configuration
│   │   ├── Colors.ts
│   │   └── Config.ts
│   └── utils/              # Helper functions
│       └── helpers.ts
├── App.tsx                 # Root component
├── app.json               # Expo configuration
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for emulator)
- Expo Go app on your physical device (optional)

### Installation

1. **Clone and navigate to the project**

   ```bash
   cd focus-mobile
   ```

2. **Install dependencies** (already done)

   ```bash
   npm install
   ```

3. **Configure API endpoint**

   Update the API URL in `src/constants/Config.ts`:

   ```typescript
   export const API_BASE_URL = "https://your-railway-app.railway.app/api";
   ```

   Or configure it in the Settings screen within the app.

4. **Start the development server**
   ```bash
   npm start
   ```

### Running the App

#### Option 1: Expo Go (Recommended for Testing)

1. Install Expo Go on your iOS or Android device
2. Scan the QR code displayed in the terminal
3. App will load on your device

#### Option 2: iOS Simulator (Mac only)

```bash
npm run ios
```

#### Option 3: Android Emulator

```bash
npm run android
```

## Usage Guide

### Home Screen - Recording Tasks

1. **Select a Project** - Choose from the dropdown at the top
2. **Record Voice Note** - Press and hold the large orange button
3. **Release to Submit** - Recording automatically uploads to API
4. **View Extracted Tasks** - Tasks appear in the "Recent Tasks" section

### Tasks Screen

- View all tasks organized by category
- Tap checkbox to mark tasks complete
- Pull down to refresh task list
- Completed tasks shown at the bottom

### Projects Screen

- View all projects
- Create new projects with name and description
- Select active project for recordings

### Settings Screen

- Configure API endpoint URL
- Clear local cache
- View app version info

## API Integration

The app connects to the Focus backend API with these endpoints:

- `POST /api/process-voice` - Upload and process voice recording
- `GET /api/todos` - Fetch all tasks
- `PATCH /api/todos/:id` - Update task status
- `DELETE /api/todos/:id` - Delete task
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create new project

## Configuration

### API URL Configuration

**For Production (Railway):**

```typescript
export const API_BASE_URL = "https://your-app.railway.app/api";
```

**For Local Development:**

1. Start backend: `cd ~/repos/focus && npm run dev`
2. Get your Mac's IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
3. Update API URL: `http://YOUR_IP:3000/api`
4. Both devices must be on same WiFi

### Permissions

The app requires microphone access for voice recording:

- **iOS**: Automatically prompts on first recording attempt
- **Android**: Permission declared in app.json

## Color Theme

Optimized for workshop environments with high visibility:

- **Primary**: Navy Blue (#003366) - Nautical theme
- **Secondary**: Orange (#FF6B35) - High visibility
- **Priorities**: Red (High), Orange (Medium), Green (Low)
- **Categories**: Purple (CNC), Blue (Assembly), Orange (Finishing), Brown (Carpentry)

## Troubleshooting

### Audio Recording Not Working

- Check microphone permissions in device settings
- Restart the app after granting permissions

### API Connection Errors

- Verify API URL in Settings
- Check network connectivity
- Ensure backend is running (for local dev)

### Tasks Not Loading

- Pull down to refresh on Tasks screen
- Check API URL configuration
- Verify backend is accessible

## Development

### Adding New Features

1. **New Screen**: Create in `src/screens/`
2. **New Component**: Create in `src/components/`
3. **New API Method**: Add to `src/services/api.ts`
4. **Update Navigation**: Modify `App.tsx`

### Running TypeScript Check

```bash
npx tsc --noEmit
```

### Building for Production

**iOS:**

```bash
eas build --platform ios
```

**Android:**

```bash
eas build --platform android
```

## License

MIT

## Support

For issues or questions, refer to the backend repository:
https://github.com/ChrisForti/focus
