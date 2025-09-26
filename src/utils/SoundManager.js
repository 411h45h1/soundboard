import { File, Directory, Paths } from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SOUNDS_METADATA_KEY = "SOUNDBOARD_SOUNDS_METADATA";
const SOUND_DIRECTORY_NAME = "sounds";

let cachedSoundsDirectory = null;

export const getSoundsDirectoryPath = () => {
  if (!cachedSoundsDirectory) {
    cachedSoundsDirectory = new Directory(Paths.document, SOUND_DIRECTORY_NAME);
  }
  return cachedSoundsDirectory;
};

export const ensureSoundsDirectoryExists = async () => {
  const directory = getSoundsDirectoryPath();

  try {
    await directory.create({ intermediates: true });
    return directory;
  } catch (error) {
    // Directory might already exist, which is fine
    if (!(await directory.exists)) {
      throw error;
    }
    return directory;
  }
};

export const getSoundFileUri = (fileName) => {
  const directory = getSoundsDirectoryPath();
  return new File(directory, fileName);
};

const sanitizeFileName = (name) =>
  name
    .trim()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .toLowerCase();

const inferExtensionFromUri = (uri, fallback = "m4a") => {
  if (!uri) return fallback;

  const sanitized = uri.split("?")[0] ?? uri;
  const lastSegment = sanitized.split("/").pop() ?? sanitized;

  if (lastSegment.includes(".")) {
    return lastSegment.split(".").pop();
  }

  return fallback;
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
  await ensureSoundsDirectoryExists();

  const id = Date.now().toString();
  const safeName = sanitizeFileName(name || "sound");
  const fileExtension = inferExtensionFromUri(name, inferExtensionFromUri(uri));
  const fileName = `${safeName}_${id}.${fileExtension}`;
  const destinationFile = getSoundFileUri(fileName);

  try {
    // If we have base64 data, write it directly
    if (base64Data) {
      await destinationFile.write(base64Data);
    } else {
      if (!uri) {
        throw new Error(
          "A valid URI or base64 payload is required to add a sound."
        );
      }

      // Create a source file instance and copy it
      const sourceFile = new File(uri);
      await sourceFile.copy(destinationFile);
    }

    // Save metadata
    const metadata = {
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
    console.error("Error adding sound:", error);
    throw error;
  }
};

// Check if a sound file exists and is valid
export const validateSound = async (soundMetadata) => {
  if (!soundMetadata || !soundMetadata.uri) return false;

  try {
    const file = new File(soundMetadata.uri);

    if (!(await file.exists)) {
      console.log(`Sound file not found at: ${soundMetadata.uri}`);
      return false;
    }

    // Additional validation: check file size
    if (file.size <= 0) {
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
      const file = new File(soundToRemove.uri);
      if (await file.exists) {
        await file.delete();
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
  ensureSoundsDirectoryExists,
  getSoundsDirectoryPath,
  getSoundFileUri,
  getSoundsMetadata,
  getSoundsMetadataPaginated,
  saveSoundsMetadata,
  addSound,
  removeSound,
  validateSound,
};
