
export const generateDish = (recipe, phase, averageSkill = 1) => {
  const flawChance = getFlawChanceByPhase(phase, averageSkill);
  
  const dish = {
    temperature: generateTemperature(flawChance),
    cookLevel: generateCookLevel(flawChance),
    platingQuality: generatePlatingQuality(flawChance),
    missingIngredients: generateMissingIngredients(recipe.ingredients.length, flawChance)
  };

  return dish;
};

const getFlawChanceByPhase = (phase, averageSkill) => {
  // Base flaw chance based on service phase
  let baseChance = 0.3;
  switch (phase) {
    case 'Lunch Service': baseChance = 0.2; break; // 20%
    case 'Mid Service': baseChance = 0.4; break; // 40%
    case 'Dinner Rush': baseChance = 0.6; break; // 60%
    default: baseChance = 0.3;
  }

  // Skill reduction: Each skill level reduces flaw chance by ~10% (0.10)
  // Max skill 5 = 40% reduction from base (levels are 1-based, so 4 upgrades * 0.1)
  // Actually let's make it simpler: Skill 1 = 0% reduction, Skill 5 = 40% reduction
  const skillReduction = (averageSkill - 1) * 0.10;
  
  return Math.max(0.05, baseChance - skillReduction); // Minimum 5% flaw chance always remains
};

const generateTemperature = (flawChance) => {
  const temperatures = ['Blue/Raw', 'Rare', 'Medium Rare', 'Medium', 'Well Done'];
  
  if (Math.random() < flawChance) {
    // Random temperature if flawed
    return temperatures[Math.floor(Math.random() * temperatures.length)];
  }
  
  // Perfect temperature
  return 'Medium';
};

const generateCookLevel = (flawChance) => {
  const cookLevels = ['Burnt', 'Overcooked', 'Perfect', 'Undercooked'];
  
  if (Math.random() < flawChance) {
    const flawedLevels = ['Burnt', 'Overcooked', 'Undercooked'];
    return flawedLevels[Math.floor(Math.random() * flawedLevels.length)];
  }
  
  return 'Perfect';
};

const generatePlatingQuality = (flawChance) => {
  const qualities = ['Sloppy', 'Acceptable', 'Perfect'];
  
  if (Math.random() < flawChance) {
    return Math.random() < 0.5 ? 'Sloppy' : 'Acceptable';
  }
  
  return 'Perfect';
};

const generateMissingIngredients = (totalIngredients, flawChance) => {
  const missing = [];
  
  if (Math.random() < flawChance * 0.5) { // Lower chance for missing ingredients than other flaws
    const numMissing = Math.floor(Math.random() * 2) + 1; // 1-2 missing
    
    for (let i = 0; i < numMissing; i++) {
      const randomIndex = Math.floor(Math.random() * totalIngredients);
      if (!missing.includes(randomIndex)) {
        missing.push(randomIndex);
      }
    }
  }
  
  return missing;
};

export const evaluateDish = (dish, recipe, accuracyRequirement = 80) => {
  let score = 0;
  const issues = [];

  // Check cook level
  if (dish.cookLevel === 'Burnt') {
    score -= 20;
    issues.push('BURNT');
  } else if (dish.cookLevel === 'Undercooked') {
    score -= 10;
    issues.push('UNDERCOOKED');
  } else if (dish.cookLevel === 'Overcooked') {
    score -= 5;
    issues.push('OVERCOOKED');
  } else {
    score += 5;
  }

  // Check plating quality
  if (dish.platingQuality === 'Sloppy') {
    score -= 10;
    issues.push('SLOPPY PLATING');
  } else if (dish.platingQuality === 'Acceptable') {
    score -= 2;
  } else {
    score += 5;
  }

  // Check missing ingredients
  if (dish.missingIngredients.length > 0) {
    score -= dish.missingIngredients.length * 8;
    issues.push(`MISSING ${dish.missingIngredients.length} INGREDIENT(S)`);
  } else {
    score += 5;
  }

  // Check temperature (extreme temperatures are bad)
  if (dish.temperature === 'Blue/Raw') {
    score -= 15;
    issues.push('RAW');
  } else if (dish.temperature === 'Well Done') {
    score -= 5;
    issues.push('OVERDONE');
  }

  // Normalize score to 0-100 scale (max positive score is roughly 15)
  // 15 = 100%
  // 0 = 0%
  // Negative = 0%
  const normalizedScore = Math.min(100, Math.max(0, (score / 15) * 100));

  return {
    score,
    normalizedScore,
    issues,
    isPerfect: normalizedScore >= 95,
    isAcceptable: normalizedScore >= accuracyRequirement,
    isFlawed: normalizedScore < accuracyRequirement,
    accuracyRequirement
  };
};
