# SoundBoard App - Technical Documentation

## Architecture Overview

### Technology Stack

- **Framework**: React Native 0.74.5
- **Development Platform**: Expo SDK 51.0.34
- **Navigation**: React Navigation 5.x (Stack Navigator)
- **Audio Processing**: Expo AV 14.0.7
- **State Management**: React Context API
- **Storage**: AsyncStorage + Expo FileSystem
- **Build System**: EAS (Expo Application Services)

### Project Structure

```
soundboard/
├── App.js                      # Main app entry point
├── src/
│   ├── components/
│   │   ├── Board/              # Main soundboard components
│   │   │   ├── Board.js        # Main board container
│   │   │   ├── BoardControls.js # Control panel UI
│   │   │   ├── BoardHeader.js   # App header
│   │   │   ├── BoardItem.js     # Individual sound tile
│   │   │   ├── SoundGrid.js     # Grid layout manager
│   │   │   └── ...             # Modal components
│   │   ├── CreateBoardItem.js   # File picker component
│   │   ├── EditBoard.js         # Sound editing screen
│   │   ├── PopupModal.js        # Reusable modal
│   │   └── RecordAudioButton.js # Audio recording
│   ├── core/
│   │   ├── context/
│   │   │   └── AppState.js      # Global state management
│   │   └── responsive.js        # Responsive design utilities
│   └── utils/
│       ├── SoundManager.js      # File system operations
│       └── haptics.js           # Haptic feedback
├── assets/                      # App icons and splash screens
└── [config files]
```

## Core Components

### 1. Application State Management (`AppState.js`)

#### State Structure

```javascript
{
  boards: Array<{
    id: number,
    name: string,
    sounds: Array<{
      sid: number,
      uri: string,
      name: string,
      title: string
    }>
  }>,
  currentBoard: Board | null
}
```

#### Key Functions

- `createBoard(name)`: Creates new soundboard
- `updateSoundBoard(soundObj)`: Adds sound to current board
- `removeSoundboardItem(sid)`: Removes sound from board
- `switchBoard(boardId)`: Changes active board
- `renameBoard(boardId, newName)`: Updates board name

#### Data Persistence

- Boards stored in AsyncStorage as JSON
- Automatic backup/restore on app restart
- Sound file validation and recovery system

### 2. Sound Management (`SoundManager.js`)

#### File System Operations

- **Sound Directory**: `FileSystem.documentDirectory + "sounds/"`
- **Metadata Storage**: AsyncStorage with key `SOUNDBOARD_SOUNDS_METADATA`

#### Core Functions

```javascript
// Add new sound file
addSound(uri, name, category, base64Data);

// Validate sound file existence
validateSound(soundMetadata);

// Remove sound and metadata
removeSound(soundId);

// Batch operations with pagination
getSoundsMetadataPaginated(page, limit);
```

#### File Management Strategy

1. Copy imported files to app's sound directory
2. Generate unique filenames with timestamps
3. Store metadata separately for quick access
4. Validate files on startup and recover corrupted references

### 3. Audio Playback (`BoardItem.js`)

#### Audio Engine

- **Framework**: Expo AV (Audio.Sound)
- **Simultaneous Playback**: Multiple sounds can play concurrently
- **Memory Management**: Automatic unloading of finished sounds

#### Playback Flow

```javascript
// Create sound instance
const { sound } = await Audio.Sound.createAsync(
  { uri: src },
  { shouldPlay: true },
  statusCallback
);

// Track playing state
sound._boardItemId = sid;
playingSounds.current.push(sound);

// Handle completion
if (status.didJustFinish) {
  setIsPlaying(false);
}
```

#### Global Sound Control

- Registry system for tracking all playing sounds
- "Stop All" functionality with component notification
- Individual sound stop capability

### 4. Audio Recording (`RecordAudioButton.js`)

#### Recording Configuration

```javascript
// High-quality recording preset
Audio.Recording.createAsync(
  Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
);

// iOS Audio Mode
{
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  interruptionModeIOS: InterruptionModeIOS.DoNotMix
}
```

#### Recording Features

- Real-time duration display
- Haptic feedback for start/stop
- Automatic title generation with timestamp
- Error handling and user feedback
- Memory cleanup on component unmount

### 5. Responsive Design (`responsive.js`)

#### Scaling System

```javascript
// Base width for scaling calculations
const baseWidth = 320;
const scale = SCREEN_WIDTH / baseWidth;

// Tablet-aware scaling
const scaleFactor = isTabletDevice
  ? Math.min(scale, 1.5) * reductionFactor
  : scale;
```

#### Device Detection

- **Tablet Detection**: `width >= 768 && aspectRatio < 1.6`
- **Orientation Tracking**: Dynamic landscape/portrait detection
- **Platform Scaling**: iOS vs Android pixel density handling

#### Grid Layout Adaptation

```javascript
// Responsive column calculation
const numColumns = isTabletDevice
  ? screenWidth > 1000
    ? 5
    : 4 // Large tablet: 5, tablet: 4
  : screenWidth > 400
  ? 3
  : 2; // Large phone: 3, phone: 2
```

## Data Flow Architecture

### 1. Sound Addition Flow

```
User Action (Import/Record)
    ↓
CreateBoardItem/RecordAudioButton
    ↓
File Processing (SoundManager)
    ↓
Context Update (AppState.updateSoundBoard)
    ↓
Local Storage (AsyncStorage)
    ↓
UI Update (Board re-render)
```

### 2. Playback Flow

```
User Tap (BoardItem)
    ↓
Sound Validation (SoundManager.validateSound)
    ↓
Audio Creation (Expo AV)
    ↓
State Updates (isPlaying, sound tracking)
    ↓
Global Registry (playingSounds tracking)
    ↓
Status Monitoring (playback callbacks)
```

## Performance Optimizations

### 1. Memory Management

- Automatic sound unloading after playback
- Component unmount cleanup
- Batch processing for large sound collections
- Lazy loading of sound metadata

### 2. UI Performance

- React.memo for BoardItem components
- useCallback for event handlers
- Batch state updates to prevent cascading renders
- Responsive grid calculations cached

### 3. File System

- Pagination for large sound libraries
- Non-blocking sound validation
- Background processing for file operations
- Recovery system for corrupted files

## Security & Privacy

### 1. Permissions

- **iOS**: Microphone usage description in Info.plist
- **Android**: RECORD_AUDIO permission
- **File Access**: Scoped to app's document directory

### 2. Data Protection

- All files stored locally in app sandbox
- No external network requests for audio
- User controls all data deletion
- No analytics or tracking implemented

## Build Configuration

### 1. Expo Configuration (`app.json`)

```json
{
  "expo": {
    "name": "SoundBoard",
    "version": "1.2.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"],
    "updates": {
      "enabled": true,
      "fallbackToCacheTimeout": 0
    }
  }
}
```

### 2. EAS Build Profiles (`eas.json`)

- **Development**: Development client with internal distribution
- **Preview**: Staging builds with simulator support
- **Production**: App store builds with auto-increment versioning

### 3. Dependencies

#### Core Runtime

- `expo`: ^51.0.34
- `react-native`: 0.74.5
- `react`: 18.2.0

#### Audio & Media

- `expo-av`: ~14.0.7 (Audio playback/recording)
- `expo-document-picker`: ~12.0.2 (File selection)
- `expo-haptics`: ~13.0.1 (Tactile feedback)

#### Storage & Navigation

- `@react-native-async-storage/async-storage`: 1.23.1
- `@react-navigation/native`: ^5.9.4
- `@react-navigation/stack`: ^5.14.5

## Error Handling

### 1. Audio Errors

```javascript
try {
  await Audio.Sound.createAsync({ uri: src });
} catch (error) {
  // Show user-friendly error
  // Mark sound as invalid
  // Log for debugging
}
```

### 2. File System Errors

- Graceful handling of missing files
- Automatic recovery attempts
- User notification for irrecoverable errors
- Fallback to default sounds when possible

### 3. State Recovery

- Automatic board recreation if storage corrupted
- Sound validation and cleanup on startup
- Default board creation for new users

## Testing Strategy

### 1. Manual Testing Areas

- Cross-platform audio playback
- File import from various sources
- Memory usage during extended sessions
- Orientation changes
- Background/foreground transitions

### 2. Performance Monitoring

- Memory usage during sound playback
- File system operation timing
- UI responsiveness during batch operations
- Startup time optimization

## Development Workflow

### 1. Local Development

```bash
# Start Expo development server
yarn start

# Platform-specific development
yarn android
yarn ios
yarn web
```

### 2. Building & Deployment

```bash
# Build for all platforms
yarn build

# Submit to app stores
yarn submit:all

# OTA Updates
yarn update:branch:prod
```

### 3. Code Quality

- Component-based architecture
- Consistent error handling patterns
- Responsive design principles
- Performance optimization practices

## Future Considerations

### 1. Scalability

- Sound library size limits
- Memory usage optimization
- Background processing improvements
- Cloud backup options

### 2. Feature Extensions

- Sound effects and filters
- Playlist functionality
- Sound sharing capabilities
- Advanced organization features

### 3. Platform-Specific Enhancements

- iOS Shortcuts integration
- Android widgets
- Web PWA capabilities
- Desktop app versions
