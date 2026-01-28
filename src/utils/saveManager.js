
/**
 * Save Manager for The Pass
 * Handles localStorage operations with robust error handling and deep merging.
 */

const SAVE_KEY = 'the_pass_save_data_v1';
const SETTINGS_KEY = 'the_pass_settings_v1';
const CURRENT_VERSION = 1;

// 1. FIXED SCHEMA: Matches GameContext expectations
const DEFAULT_GAME_DATA = {
  version: CURRENT_VERSION,
  careerReputation: 0,
  careerMoney: 0,
  careerDishesServed: 0,
  currentShiftNumber: 1,
  unlockedRecipes: [1, 2, 3, 4],
  bestStats: {
    highestReputation: 0,
    mostDishesServed: 0,
    bestAccuracy: 0
  },
  kitchenStaff: {
    'Grill': { skill: 1, speed: 1, name: 'Grill Station' },
    'Sauté': { skill: 1, speed: 1, name: 'Sauté Station' },
    'Prep': { skill: 1, speed: 1, name: 'Prep Station' },
  }
};

const validateSaveData = (data) => {
  if (!data || typeof data !== 'object') return false;
  // Basic integrity check
  return Object.prototype.hasOwnProperty.call(data, 'version') ||
    Object.prototype.hasOwnProperty.call(data, 'careerMoney');
};

const migrateSaveData = (data) => {
  const migrated = { ...DEFAULT_GAME_DATA, ...data };

  // Deep merge kitchen staff to prevent "undefined" crashes
  if (data.kitchenStaff) {
    migrated.kitchenStaff = {
      ...DEFAULT_GAME_DATA.kitchenStaff,
      ...data.kitchenStaff
    };
  }
  migrated.version = CURRENT_VERSION;
  return migrated;
};

export const saveGameData = (data) => {
  try {
    if (!data) return false;
    const dataToSave = { ...data, version: CURRENT_VERSION, lastSaved: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('SaveManager: Write failed', error);
    return false;
  }
};

export const loadGameData = () => {
  try {
    const serializedData = localStorage.getItem(SAVE_KEY);
    if (!serializedData) return null;

    let parsedData;
    try {
      parsedData = JSON.parse(serializedData);
    } catch (e) {
      console.error('SaveManager: JSON parse failed', e);
      return null;
    }

    if (!validateSaveData(parsedData)) {
      console.warn('SaveManager: Invalid data, attempting full recovery');
      return DEFAULT_GAME_DATA;
    }

    return migrateSaveData(parsedData);

  } catch (error) {
    console.error('SaveManager: Load failed', error);
    return null;
  }
};

export const clearSaveData = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (e) {
    return false;
  }
};

export const hasSaveData = () => {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    return !!data;
  } catch (e) {
    return false;
  }
};

// --- SETTINGS MANAGEMENT ---

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('SaveManager: Settings write failed', error);
    return false;
  }
};

export const loadSettings = (defaultSettings) => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return defaultSettings;
    const parsed = JSON.parse(data);
    return { ...defaultSettings, ...parsed };
  } catch (error) {
    console.error('SaveManager: Settings load failed', error);
    return defaultSettings;
  }
};

export const getInitialState = () => DEFAULT_GAME_DATA;
