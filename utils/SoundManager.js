import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOUNDS_METADATA_KEY = "SOUNDBOARD_SOUNDS_METADATA";
const SOUNDS_DIRECTORY = FileSystem.documentDirectory + "sounds/";

// Ensure the sounds directory exists
const ensureSoundsDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(SOUNDS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(SOUNDS_DIRECTORY, {
      intermediates: true,
    });
  }
};

// Get all saved sounds metadata
export const getSoundsMetadata = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SOUNDS_METADATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to load sounds metadata:", e);
    return [];
  }
};

// Get sounds metadata with pagination support
export const getSoundsMetadataPaginated = async (page = 1, limit = 50) => {
  try {
    const jsonValue = await AsyncStorage.getItem(SOUNDS_METADATA_KEY);
    const allSounds = jsonValue != null ? JSON.parse(jsonValue) : [];

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
      sounds: allSounds.slice(startIndex, endIndex),
      total: allSounds.length,
      page,
      limit,
      hasMore: endIndex < allSounds.length,
    };
  } catch (e) {
    console.error("Failed to load sounds metadata:", e);
    return {
      sounds: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }
};

// Save sounds metadata
export const saveSoundsMetadata = async (metadata) => {
  try {
    const jsonValue = JSON.stringify(metadata);
    await AsyncStorage.setItem(SOUNDS_METADATA_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save sounds metadata:", e);
  }
};

// Add a new sound
export const addSound = async (uri, name, category, base64Data = null) => {
  await ensureSoundsDirectory();

  // Generate a unique ID
  const id = Date.now().toString();
  const fileExtension = uri.split(".").pop();
  const fileName = `${name
    .replace(/\s+/g, "_")
    .toLowerCase()}_${id}.${fileExtension}`;
  const destinationUri = SOUNDS_DIRECTORY + fileName;

  try {
    // If we have base64 data, write it directly
    if (base64Data) {
      await FileSystem.writeAsStringAsync(destinationUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } else {
      // Otherwise copy the file
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });
    }

    // Save metadata
    const metadata = {
      id,
      name,
      uri: destinationUri,
      category,
      dateAdded: new Date().toISOString(),
    };

    const allSounds = await getSoundsMetadata();
    allSounds.push(metadata);
    await saveSoundsMetadata(allSounds);

    return metadata;
  } catch (error) {
    console.error("Error adding sound:", error);
    throw error;
  }
};

// Check if a sound file exists and is valid
export const validateSound = async (soundMetadata) => {
  if (!soundMetadata || !soundMetadata.uri) return false;

  try {
    const fileInfo = await FileSystem.getInfoAsync(soundMetadata.uri);
    if (!fileInfo.exists) {
      console.log(`Sound file not found at: ${soundMetadata.uri}`);
      return false;
    }

    // Additional validation: check file size
    if (fileInfo.size <= 0) {
      console.log(`Sound file exists but has zero size: ${soundMetadata.uri}`);
      return false;
    }

    return true;
  } catch (e) {
    console.error(`Error validating sound at ${soundMetadata.uri}:`, e);
    return false;
  }
};

// Remove a sound
export const removeSound = async (soundId) => {
  try {
    const allSounds = await getSoundsMetadata();
    const soundToRemove = allSounds.find((s) => s.id === soundId);

    if (soundToRemove && soundToRemove.uri) {
      // Delete the actual file
      const fileInfo = await FileSystem.getInfoAsync(soundToRemove.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(soundToRemove.uri);
      }
    }

    // Update metadata
    const updatedSounds = allSounds.filter((s) => s.id !== soundId);
    await saveSoundsMetadata(updatedSounds);

    return true;
  } catch (error) {
    console.error("Error removing sound:", error);
    return false;
  }
};

export default {
  getSoundsMetadata,
  getSoundsMetadataPaginated,
  saveSoundsMetadata,
  addSound,
  removeSound,
  validateSound,
};
