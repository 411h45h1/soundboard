import React from 'react';
import { Audio } from 'expo-av';
import { DimensionValue } from 'react-native';

// Sound-related types
export interface SoundItem {
  sid: number;
  name: string;
  uri: string;
  title?: string;
  _processing?: boolean;
  _boardItemId?: number;
  _componentId?: string;
}

// Board-related types
export interface Board {
  id: number;
  name: string;
  sounds: SoundItem[];
}

// Expo Router navigation types
export interface ExpoRouterNavigation {
  push: (href: string) => void;
  navigate: (href: string) => void;
  back: () => void;
  canGoBack: () => boolean;
}

export interface EditRouteParams {
  id: string;
  fileName?: string;
  title?: string;
  src?: string;
}

export interface EditBoardRoute {
  params: {
    fileName: string;
    title: string;
    sid: number;
    src: string;
  };
}

// Component prop types
export interface BoardProps {
  navigation: ExpoRouterNavigation;
}

export interface BoardItemProps {
  sid: number;
  name: string;
  title?: string;
  src: string;
  onPlaySound: (sound: SoundItem) => void;
  navigation: ExpoRouterNavigation;
  removeSoundboardItem: (sid: number) => Promise<void>;
}

export interface BoardSelectPanelProps {
  boards: Board[];
  currentBoard: Board | null;
  switchBoard: (boardId: number) => void;
}

export interface BoardControlsProps {
  showSelectBoard: boolean;
  setShowSelectBoard: (show: boolean) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
}

export interface BoardControlsPanelProps {
  setShowInstructions: (show: boolean) => void;
  setShowCreateBoard: (show: boolean) => void;
  showCreateBoard: boolean;
  setShowRenameBoard: (show: boolean) => void;
  showRenameBoard: boolean;
  handleDeleteBoard: () => void;
}

export interface CreateBoardModalProps {
  newBoardName: string;
  setNewBoardName: (name: string) => void;
  handleCreateBoard: () => void;
}

export interface RenameBoardModalProps {
  renameBoardName: string;
  setRenameBoardName: (name: string) => void;
  handleRenameBoard: () => void;
}

export interface InstructionsProps {
  setShowInstructions: (show: boolean) => void;
}

export interface SoundGridProps {
  sounds: SoundItem[];
  navigation: ExpoRouterNavigation;
  onPlaySound: (sound: SoundItem) => void;
  removeSoundboardItem: (sid: number) => Promise<void>;
}

export interface StopAllSoundsButtonProps {
  stopAllSounds: () => Promise<void>;
}

export interface PopupModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
  width?: DimensionValue;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}

export interface EditBoardProps {
  navigation: ExpoRouterNavigation;
  route: EditBoardRoute;
}

export interface BoardHeaderProps {
  isLandscape: boolean;
}

// App Context types
export interface AppContextType {
  boards: Board[];
  currentBoard: Board | null;
  createBoard: (name: string) => void;
  switchBoard: (boardId: number) => void;
  updateSoundBoard: (soundObj: Omit<SoundItem, 'title'>) => Promise<void>;
  updateBoardItem: (sid: number, updatedData: Partial<SoundItem>) => void;
  removeSoundboardItem: (sid: number) => Promise<void>;
  removeBoard: (boardId: number) => void;
  renameBoard: (boardId: number, newName: string) => void;
}

// Audio-related types extending expo-av
export interface ExtendedSound extends Audio.Sound {
  _boardItemId?: number;
  _componentId?: string;
}

// Type assertion helper for extending Audio.Sound
export function extendSound(
  sound: Audio.Sound,
  boardItemId: number,
  componentId: string
): ExtendedSound {
  const extendedSound = sound as ExtendedSound;
  extendedSound._boardItemId = boardItemId;
  extendedSound._componentId = componentId;
  return extendedSound;
}

// Global registry for sound components
declare global {
  var soundBoardRegistry: Record<string, (event?: unknown) => void> | undefined;
}
