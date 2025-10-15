import { Paths, Directory, File } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SoundMetadata {
  id: string;
  name: string;
  uri: string;
  category: string;
  dateAdded: string;
}

const SOUNDS_METADATA_KEY = 'SOUNDBOARD_SOUNDS_METADATA';
const SOUNDS_DIRECTORY = new Directory(Paths.document, 'sounds');

const ensureSoundsDirectory = async (): Promise<void> => {
  try {
    const dirExists = await SOUNDS_DIRECTORY.exists;
    if (!dirExists) {
      await SOUNDS_DIRECTORY.create({ intermediates: true });
    }
  } catch (error) {
    console.error('Failed to create sounds directory:', error);
    throw new Error('Unable to initialize sounds storage');
  }
};

export const getSoundsMetadata = async (): Promise<SoundMetadata[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SOUNDS_METADATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Failed to load sounds metadata:', error);
    return [];
  }
};

export const saveSoundsMetadata = async (metadata: SoundMetadata[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(metadata);
    await AsyncStorage.setItem(SOUNDS_METADATA_KEY, jsonValue);
  } catch (error) {
    console.error('Failed to save sounds metadata:', error);
    throw error;
  }
};

export const addSound = async (
  uri: string,
  name: string,
  category: string,
  base64Data: string | null = null
): Promise<SoundMetadata> => {
  await ensureSoundsDirectory();

  const id = Date.now().toString();
  const fileExtension = uri.split('.').pop();
  const fileName = `${name.replace(/\s+/g, '_').toLowerCase()}_${id}.${fileExtension}`;
  const destinationFile = new File(SOUNDS_DIRECTORY, fileName);

  try {
    // If we have base64 data, write it directly
    if (base64Data) {
      await destinationFile.write(base64Data, { encoding: 'base64' });
    } else {
      // Otherwise copy the file
      const sourceFile = new File(uri);
      await sourceFile.copy(destinationFile);
    }

    const metadata: SoundMetadata = {
      id,
      name,
      uri: destinationFile.uri,
      category,
      dateAdded: new Date().toISOString(),
    };

    const allSounds = await getSoundsMetadata();
    allSounds.push(metadata);
    await saveSoundsMetadata(allSounds);

    return metadata;
  } catch (error) {
    console.error('Error adding sound:', error);
    throw error;
  }
};

export const soundExists = async (uri: string): Promise<boolean> => {
  try {
    const soundFile = new File(uri);
    return await soundFile.exists;
  } catch (error) {
    console.error(`Error checking if sound exists at ${uri}:`, error);
    return false;
  }
};

export const removeSound = async (soundId: string | number): Promise<boolean> => {
  try {
    const allSounds = await getSoundsMetadata();
    const soundToRemove = allSounds.find(s => s.id === soundId);

    if (soundToRemove && soundToRemove.uri) {
      try {
        const soundFile = new File(soundToRemove.uri);
        const fileExists = await soundFile.exists;
        if (fileExists) {
          await soundFile.delete();
        }
      } catch (fileError) {
        console.warn('Could not delete sound file:', fileError);
      }
    }

    const updatedSounds = allSounds.filter(s => s.id !== soundId);
    await saveSoundsMetadata(updatedSounds);

    return true;
  } catch (error) {
    console.error('Error removing sound:', error);
    return false;
  }
};

export default {
  getSoundsMetadata,
  saveSoundsMetadata,
  addSound,
  removeSound,
  soundExists,
  ensureSoundsDirectory,
};
