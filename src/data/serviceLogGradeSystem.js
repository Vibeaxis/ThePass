
export const GRADE_THRESHOLDS = {
  S: { minScore: 95, label: 'S' },
  A: { minScore: 85, label: 'A' },
  B: { minScore: 70, label: 'B' },
  F: { minScore: 0, label: 'F' }
};

export const gradeService = (accuracy, prepTime, targetTime, failures, difficulty = 'normal') => {
  // Difficulty Adjustments
  let thresholdS = 95;
  let thresholdA = 85;
  let thresholdB = 70;

  if (difficulty === 'easy') { // 60% base
    thresholdS = 90;
    thresholdA = 75;
    thresholdB = 60;
  } else if (difficulty === 'hard') { // 95% base
    thresholdS = 98;
    thresholdA = 92;
    thresholdB = 85;
  }
  
  // Logic
  if (accuracy >= thresholdS && failures === 0) return 'S';
  if (accuracy >= thresholdA && failures <= 1) return 'A';
  if (accuracy >= thresholdB && failures <= 2) return 'B';
  return 'F';
};

export const calculateProfit = (baseCost, accuracy, grade, failures) => {
  // Base revenue is assumed to be 2x cost usually, but let's use baseCost as the "profit margin" input
  let profit = baseCost * 2; 
  
  // Penalties
  profit -= (failures * 5); // $5 penalty per re-fire
  
  if (accuracy < 80) {
    profit -= Math.floor((80 - accuracy) * 0.5); // $0.50 per point below 80
  }
  
  // Grade Bonuses
  if (grade === 'S') profit += 15;
  else if (grade === 'A') profit += 5;
  else if (grade === 'F') profit -= 10; // Penalty for bad food sent out
  
  return Math.max(0, Math.floor(profit));
};

export const getSousChefNote = (grade, dishName) => {
  const notes = {
    S: [
      "Flawless execution, Chef.",
      "That is what perfection looks like.",
      `${dishName} looked better than the photo.`,
      "The guests are going to love this.",
      "Pure art. impeccable."
    ],
    A: [
      "Solid service. Good pace.",
      "Acceptable standard. Keep it up.",
      "Good, but watch the details.",
      `Nice work on that ${dishName}.`,
      "Respectable. Next check."
    ],
    B: [
      "Sloppy. Tighten up.",
      "You're falling behind standards.",
      `${dishName} was barely passable.`,
      "Watch your plating, Chef.",
      "Don't let that happen again."
    ],
    F: [
      "Are you trying to shut us down?",
      "Absolutely disgraceful.",
      `I wouldn't feed that ${dishName} to a dog.`,
      "Get it together or get out.",
      "Embarrassing."
    ]
  };
  
  const pool = notes[grade] || notes['B'];
  const template = pool[Math.floor(Math.random() * pool.length)];
  return template.replace("${dishName}", dishName || "dish");
};
