
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveGameData,
  loadGameData,
  clearSaveData,
  getInitialState,
  saveSettings,
  loadSettings
} from '@/utils/saveManager';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

const DEFAULT_SETTINGS = {
  masterVolume: 100,
  sizzleSounds: true,
  ticketPrinter: true,
  kitchenClatter: true,
  orderCompleteDing: true,
  visualEffects: true,
  prepTimeMultiplier: 1.0,
  accuracyRequirement: 80, // 'normal'
  uiScale: 'normal',
  colorBlindMode: false
};

export const GameProvider = ({ children }) => {
  // --- SHIFT STATE (Volatile, resets per shift) ---
  const [reputation, setReputation] = useState(100);
  const [money, setMoney] = useState(1000);
  const [ticketsServed, setTicketsServed] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [serviceTime, setServiceTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Lunch Service');
  const [gameStatus, setGameStatus] = useState('idle');

  // New Shift Management
  const [shiftPhase, setShiftPhase] = useState('PreShift');
  const [currentBookingDifficulty, setCurrentBookingDifficulty] = useState('Medium');
  const [selectedMenu, setSelectedMenu] = useState([]);

  // Service Log & Stats
  const [serviceLog, setServiceLog] = useState([]);
  const [currentServiceStats, setCurrentServiceStats] = useState({
    dishesServed: 0,
    totalProfit: 0,
    averageGrade: 'N/A',
    gradeBreakdown: { S: 0, A: 0, B: 0, F: 0 }
  });

  // Shift Performance Tracking
  const [shiftSummary, setShiftSummary] = useState({
    totalSales: 0,
    wastedFoodCost: 0,
    netProfit: 0,
    reputationGain: 0,
    perfectDishes: 0,
    dishesCooked: 0,
    recipesUnlockedThisShift: []
  });

  // --- CAREER STATE (Persisted) ---
  const [careerStats, setCareerStats] = useState(getInitialState());

  // --- SETTINGS STATE ---
  const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);

  // Initialize Data
  useEffect(() => {
    // Load Settings
    const loadedSettings = loadSettings(DEFAULT_SETTINGS);
    setUserSettings(loadedSettings);
    applyGlobalStyles(loadedSettings);

    // Load Career
    try {
      const savedData = loadGameData();
      if (savedData) {
        console.log("GameContext: Initialized with localStorage data");
        setCareerStats(prev => ({
          ...prev,
          ...savedData,
          kitchenStaff: savedData.kitchenStaff || prev.kitchenStaff,
          bestStats: savedData.bestStats || prev.bestStats
        }));
        setMoney(savedData.careerMoney || 0);
      }
    } catch (error) {
      console.error("GameContext: Critical error loading save data", error);
    }
  }, []);

  // Update Settings Helper
  const updateSetting = (key, value) => {
    setUserSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      saveSettings(newSettings);
      applyGlobalStyles(newSettings); // Apply immediately
      return newSettings;
    });
  };

  const applyGlobalStyles = (settings) => {
    const root = document.documentElement;
    
    // Scale
    root.classList.remove('ui-scale-small', 'ui-scale-normal', 'ui-scale-large');
    root.classList.add(`ui-scale-${settings.uiScale}`);
    
    // Colorblind
    if (settings.colorBlindMode) {
      root.classList.add('colorblind-mode');
    } else {
      root.classList.remove('colorblind-mode');
    }
  };

  // Determine service phase
  useEffect(() => {
    if (shiftPhase !== 'Service' || gameStatus !== 'playing') return;
    if (serviceTime <= 100) setCurrentPhase('Lunch Service');
    else if (serviceTime <= 200) setCurrentPhase('Mid Service');
    else setCurrentPhase('Dinner Rush');
  }, [serviceTime, gameStatus, shiftPhase]);

  // Check game end conditions
  useEffect(() => {
    if (shiftPhase !== 'Service' || gameStatus !== 'playing') return;
    if (reputation <= 0) endGame('fired');
    else if (serviceTime >= 300 || ticketsServed >= 50) endGame('survived');
  }, [reputation, serviceTime, ticketsServed, gameStatus, shiftPhase]);

  const endGame = (status) => {
    setGameStatus(status);
    if (status === 'survived') {
      calculatePostShiftStats();
      setShiftPhase('PostShift');
    }
  };

  const calculatePostShiftStats = () => {
    // Use the accurate service stats for net profit
    const netProfit = currentServiceStats.totalProfit;

    setShiftSummary(prev => ({
      ...prev,
      netProfit,
      reputationGain: reputation
    }));

    const newShiftsCompleted = (careerStats.totalShiftsCompleted || 0) + 1;
    
    // Determine milestone
    let newMilestone = "Sous Chef";
    if (newShiftsCompleted >= 15) newMilestone = "Michelin Star";
    else if (newShiftsCompleted >= 10) newMilestone = "Executive Chef";
    else if (newShiftsCompleted >= 5) newMilestone = "Head Chef";

    // Deep merge new career stats
    const newCareerStats = {
      ...careerStats,
      careerReputation: Math.min(100, Math.max(0, (careerStats.careerReputation || 0) + (reputation > 50 ? 2 : -2))),
      careerMoney: (careerStats.careerMoney || 0) + netProfit,
      careerDishesServed: (careerStats.careerDishesServed || 0) + ticketsServed,
      totalShiftsCompleted: newShiftsCompleted,
      totalDishesCooked: (careerStats.totalDishesCooked || 0) + currentServiceStats.dishesServed,
      totalPerfectDishes: (careerStats.totalPerfectDishes || 0) + currentServiceStats.gradeBreakdown.S,
      currentMilestone: newMilestone,
      bestStats: {
        highestReputation: Math.max(careerStats.bestStats?.highestReputation || 0, reputation),
        mostDishesServed: Math.max(careerStats.bestStats?.mostDishesServed || 0, ticketsServed),
        bestAccuracy: careerStats.bestStats?.bestAccuracy || 0
      },
      kitchenStaff: careerStats.kitchenStaff
    };

    setCareerStats(newCareerStats);
    saveGameData(newCareerStats);
  };

  const advanceShift = () => {
    setShiftPhase('PreShift');
    setGameStatus('idle');
    setReputation(100);
    setTicketsServed(0);
    setTotalTickets(0);
    setServiceTime(0);
    resetServiceLog(); // Clear logs
    
    // Reset basic summary
    setShiftSummary({
      totalSales: 0,
      wastedFoodCost: 0,
      netProfit: 0,
      reputationGain: 0,
      perfectDishes: 0,
      dishesCooked: 0,
      recipesUnlockedThisShift: []
    });

    const difficulties = ['Easy', 'Medium', 'Hard'];
    setCurrentBookingDifficulty(difficulties[Math.floor(Math.random() * difficulties.length)]);
  };

  // --- SERVICE LOG LOGIC ---

  const resetServiceLog = () => {
    setServiceLog([]);
    setCurrentServiceStats({
      dishesServed: 0,
      totalProfit: 0,
      averageGrade: 'N/A',
      gradeBreakdown: { S: 0, A: 0, B: 0, F: 0 }
    });
  };

  const addServiceLogEntry = (dishName, grade, profitLoss, note, timestamp) => {
    const entry = {
      id: Date.now(),
      dishName,
      grade,
      profitLoss,
      note,
      timestamp
    };

    setServiceLog(prev => [entry, ...prev]);

    setCurrentServiceStats(prev => {
      const newCount = prev.dishesServed + 1;
      const newBreakdown = { ...prev.gradeBreakdown, [grade]: prev.gradeBreakdown[grade] + 1 };
      
      // Rough average calc (S=4, A=3, B=2, F=0)
      const points = (newBreakdown.S * 4) + (newBreakdown.A * 3) + (newBreakdown.B * 2);
      const avgScore = points / newCount;
      let avgGrade = 'F';
      if (avgScore >= 3.5) avgGrade = 'S';
      else if (avgScore >= 2.5) avgGrade = 'A';
      else if (avgScore >= 1.5) avgGrade = 'B';

      return {
        dishesServed: newCount,
        totalProfit: prev.totalProfit + profitLoss,
        gradeBreakdown: newBreakdown,
        averageGrade: avgGrade
      };
    });
    
    // Update main game money/stats in real time
    setMoney(prev => prev + profitLoss);
    setTicketsServed(prev => prev + 1);
  };

  // --- ACTIONS ---

  const adjustReputation = (amount) => setReputation(prev => Math.max(0, Math.min(100, prev + amount)));
  const adjustMoney = (amount) => setMoney(prev => prev + amount);
  
  const trackSale = (amount, isPerfect = false) => {
    // Legacy support if needed, but addServiceLogEntry handles money now
  };
  
  const trackWaste = (amount) => {
    setShiftSummary(prev => ({ ...prev, wastedFoodCost: prev.wastedFoodCost - amount }));
    adjustMoney(-amount);
  };

  const incrementTicketsServed = () => setTicketsServed(prev => prev + 1);
  const incrementTotalTickets = () => setTotalTickets(prev => prev + 1);
  const incrementServiceTime = () => setServiceTime(prev => prev + 1);

  const unlockRecipe = (recipeId) => {
    if (!careerStats.unlockedRecipes.includes(recipeId)) {
      setCareerStats(prev => ({
        ...prev,
        unlockedRecipes: [...prev.unlockedRecipes, recipeId]
      }));
    }
  };

  const startShift = () => {
    setReputation(100);
    setTicketsServed(0);
    setTotalTickets(0);
    setServiceTime(0);
    resetServiceLog(); // Ensure clean slate
    setCurrentPhase('Lunch Service');
    setGameStatus('playing');
    setShiftPhase('Service');
  };

  // --- STAFF MANAGEMENT ---
  const trainStaff = (stationKey) => {
    const cost = 500;
    if (money >= cost && careerStats.kitchenStaff[stationKey].skill < 5) {
      setMoney(prev => prev - cost);
      const newStats = {
        ...careerStats,
        careerMoney: careerStats.careerMoney - cost,
        kitchenStaff: {
          ...careerStats.kitchenStaff,
          [stationKey]: {
            ...careerStats.kitchenStaff[stationKey],
            skill: careerStats.kitchenStaff[stationKey].skill + 1
          }
        }
      };
      setCareerStats(newStats);
      saveGameData(newStats);
      return true;
    }
    return false;
  };

  const hireRunner = (stationKey) => {
    const cost = 200;
    if (money >= cost && careerStats.kitchenStaff[stationKey].speed < 5) {
      setMoney(prev => prev - cost);
      const newStats = {
        ...careerStats,
        careerMoney: careerStats.careerMoney - cost,
        kitchenStaff: {
          ...careerStats.kitchenStaff,
          [stationKey]: {
            ...careerStats.kitchenStaff[stationKey],
            speed: careerStats.kitchenStaff[stationKey].speed + 1
          }
        }
      };
      setCareerStats(newStats);
      saveGameData(newStats);
      return true;
    }
    return false;
  };

  const getAverageStaffSkill = () => {
    const staff = Object.values(careerStats.kitchenStaff || {});
    if (staff.length === 0) return 1;
    return staff.reduce((acc, s) => acc + (s.skill || 1), 0) / staff.length;
  };

  const getAverageStaffSpeed = () => {
    const staff = Object.values(careerStats.kitchenStaff || {});
    if (staff.length === 0) return 1;
    return staff.reduce((acc, s) => acc + (s.speed || 1), 0) / staff.length;
  };

  const resetCareerData = () => {
    if (clearSaveData()) {
      const defaultState = getInitialState();
      setCareerStats(defaultState);
      setMoney(defaultState.careerMoney);
      setShiftPhase('PreShift');
      setGameStatus('idle');
      window.location.reload();
    }
  };

  const loadCareerDataFromSave = () => {
    const saved = loadGameData();
    if (saved) {
      setCareerStats(saved);
      return true;
    }
    return false;
  };

  const value = {
    reputation, money, ticketsServed, totalTickets, serviceTime,
    currentPhase, gameStatus, shiftPhase, currentBookingDifficulty, selectedMenu,
    shiftSummary, careerStats, unlockedRecipes: careerStats.unlockedRecipes || [],
    kitchenStaff: careerStats.kitchenStaff || {},
    serviceLog, currentServiceStats, // New Exports

    adjustReputation, adjustMoney, trackSale, trackWaste,
    incrementTicketsServed, incrementTotalTickets, incrementServiceTime,
    unlockRecipe, startShift, advanceShift, resetCareerData, loadCareerDataFromSave,
    setSelectedMenu, trainStaff, hireRunner, getAverageStaffSkill, getAverageStaffSpeed, setShiftPhase,
    addServiceLogEntry, resetServiceLog, // New Exports
    
    // Settings
    userSettings, updateSetting
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
