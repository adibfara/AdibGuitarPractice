// Local storage utilities for persisting user data

const STORAGE_KEYS = {
  METRONOME_SETTINGS: 'guitar-app-metronome',
  SCALE_SETTINGS: 'guitar-app-scales',
  NOTE_SETTINGS: 'guitar-app-notes',
  USER_PREFERENCES: 'guitar-app-preferences'
};

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// Specific storage functions
export const storage = {
  metronome: {
    save: (settings: any) => saveToStorage(STORAGE_KEYS.METRONOME_SETTINGS, settings),
    load: (defaultSettings: any) => loadFromStorage(STORAGE_KEYS.METRONOME_SETTINGS, defaultSettings)
  },
  scales: {
    save: (settings: any) => saveToStorage(STORAGE_KEYS.SCALE_SETTINGS, settings),
    load: (defaultSettings: any) => loadFromStorage(STORAGE_KEYS.SCALE_SETTINGS, defaultSettings)
  },
  notes: {
    save: (settings: any) => saveToStorage(STORAGE_KEYS.NOTE_SETTINGS, settings),
    load: (defaultSettings: any) => loadFromStorage(STORAGE_KEYS.NOTE_SETTINGS, defaultSettings)
  },
  preferences: {
    save: (preferences: any) => saveToStorage(STORAGE_KEYS.USER_PREFERENCES, preferences),
    load: (defaultPreferences: any) => loadFromStorage(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences)
  }
};