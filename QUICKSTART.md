# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Configure API

Open `src/constants/Config.ts` and update the API URL:

```typescript
export const API_BASE_URL = "https://your-railway-app.railway.app/api";
```

### Step 2: Start Development Server

```bash
npm start
```

### Step 3: Run on Device

- **Physical Device**: Scan QR code with Expo Go app
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal

## 📱 First Time Setup

1. Open the app
2. Go to **Projects** tab
3. Create your first project (e.g., "Yacht Build")
4. Go to **Home** tab
5. Select the project from dropdown
6. Press and hold the orange button to record
7. Speak your tasks naturally
8. Release to process
9. View extracted tasks!

## 🎤 Recording Tips

**Good examples:**

- "Cut the transom with CNC, high priority"
- "Sand all surfaces to 220 grit for finishing"
- "Assemble the deck frame, medium priority"

**The AI will extract:**

- Task description
- Priority level (high/medium/low)
- Category (CNC/Assembly/Finishing/Carpentry)

## ⚙️ Settings

Access via the Settings button on Home screen:

- Change API endpoint
- Clear local cache
- View app info

## 🔧 Troubleshooting

**"No microphone permission"**
→ Go to device Settings → Focus → Enable Microphone

**"Cannot connect to API"**
→ Check Settings → API Configuration → Enter correct URL

**"No projects available"**
→ Go to Projects tab → Create New Project

## 📊 App Structure

```
┌─────────────────┐
│  HOME (Record)  │ ← Main screen, record voice notes
├─────────────────┤
│  TASKS (List)   │ ← View all tasks, mark complete
├─────────────────┤
│  PROJECTS       │ ← Manage projects
└─────────────────┘
```

## 🎯 Next Steps

1. Test recording on your device
2. Create multiple projects
3. Try different voice commands
4. Organize tasks by priority
5. Mark tasks complete as you finish them

## 📝 Notes

- Audio recordings are processed by OpenAI Whisper (transcription) and GPT-4o (task extraction)
- Tasks are automatically categorized and prioritized
- All data syncs with your backend API
- Local storage used for preferences only

## 🐛 Known Issues

- First recording may take a few seconds longer (loading AI models)
- Requires active internet connection for API calls
- Best results with clear audio in quiet environment

Enjoy using Focus! 🚤
