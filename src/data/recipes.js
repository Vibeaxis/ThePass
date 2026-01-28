
export const RECIPES = {
  simple: [
    {
      id: 1,
      name: "Caesar Salad",
      ingredients: ["🥬", "🧀", "🍞"],
      platingDescription: "Crisp romaine, shaved parmesan, garlic croutons",
      baseRepValue: 5,
      baseCost: 15
    },
    {
      id: 2,
      name: "Tomato Soup",
      ingredients: ["🍅", "🌿", "🍞"],
      platingDescription: "Rich tomato bisque, fresh basil, crusty bread",
      baseRepValue: 5,
      baseCost: 12
    },
    {
      id: 3,
      name: "Caprese Salad",
      ingredients: ["🍅", "🧀", "🌿"],
      platingDescription: "Fresh mozzarella, heirloom tomatoes, basil glaze",
      baseRepValue: 6,
      baseCost: 16
    },
    {
      id: 4,
      name: "Deviled Eggs",
      ingredients: ["🥚", "🌿", "🌶️"],
      platingDescription: "Whipped yolk, chives, smoked paprika dust",
      baseRepValue: 4,
      baseCost: 10
    },
    {
      id: 5,
      name: "Bruschetta",
      ingredients: ["🍞", "🍅", "🧄"],
      platingDescription: "Grilled ciabatta, garlic rub, tomato concasse",
      baseRepValue: 5,
      baseCost: 14
    },
    {
      id: 6,
      name: "House Fries",
      ingredients: ["🥔", "🧂", "🧄"],
      platingDescription: "Hand-cut potatoes, sea salt, garlic aioli",
      baseRepValue: 4,
      baseCost: 9
    },
    {
      id: 7,
      name: "Fruit Tart",
      ingredients: ["🥧", "🍓", "🥝"],
      platingDescription: "Pastry cream, seasonal berries, apricot glaze",
      baseRepValue: 6,
      baseCost: 12
    }
  ],
  french: [
    // --- SPECIAL FRENCH BISTRO MENU (IDs 10-14) ---
    {
      id: 10,
      name: "Duck Confit",
      ingredients: ["Duck Legs", "Garlic", "Thyme", "Salt", "Fat"],
      platingDescription: "Tender duck legs confit in rich fat", // Mapped from description
      description: "Tender duck legs confit in rich fat",
      baseRepValue: 15,
      baseCost: 85,
      prepTime: 180,
      difficulty: 'Complex',
      failurePoints: ["Undercooked", "Tough", "Burnt"]
    },
    {
      id: 11,
      name: "Beef Bourguignon",
      ingredients: ["Beef Chuck", "Red Wine", "Pearl Onions", "Mushrooms", "Bacon"],
      platingDescription: "Braised beef in burgundy wine sauce",
      description: "Braised beef in burgundy wine sauce",
      baseRepValue: 16,
      baseCost: 90,
      prepTime: 200,
      difficulty: 'Complex',
      failurePoints: ["Tough", "Bland", "Overcooked"]
    },
    {
      id: 12,
      name: "Coq au Vin",
      ingredients: ["Chicken", "Red Wine", "Mushrooms", "Pearl Onions", "Bacon"],
      platingDescription: "Chicken braised in red wine",
      description: "Chicken braised in red wine",
      baseRepValue: 14,
      baseCost: 80,
      prepTime: 190,
      difficulty: 'Complex',
      failurePoints: ["Dry", "Burnt", "Undercooked"]
    },
    {
      id: 13,
      name: "Bouillabaisse",
      ingredients: ["Mixed Fish", "Saffron", "Fennel", "Orange Zest", "Garlic"],
      platingDescription: "Provençal fish stew with saffron",
      description: "Provençal fish stew with saffron",
      baseRepValue: 18,
      baseCost: 95,
      prepTime: 210,
      difficulty: 'Complex',
      failurePoints: ["Overcooked Fish", "Bland", "Burnt"]
    },
    {
      id: 14,
      name: "Soufflé",
      ingredients: ["Eggs", "Butter", "Flour", "Cheese", "Milk"],
      platingDescription: "Light and airy cheese soufflé",
      description: "Light and airy cheese soufflé",
      baseRepValue: 12,
      baseCost: 70,
      prepTime: 150,
      difficulty: 'Complex',
      failurePoints: ["Deflated", "Burnt", "Undercooked"]
    }
  ],
  medium: [
    {
      id: 100,
      name: "French Onion Soup",
      ingredients: ["🧅", "🧀", "🍞"],
      platingDescription: "Caramelized onions, gruyere, toasted baguette",
      baseRepValue: 8,
      baseCost: 18
    },
    {
      id: 101,
      name: "Mushroom Risotto",
      ingredients: ["🍚", "🧀", "🌿", "🍄"],
      platingDescription: "Creamy arborio rice, parmesan, herbs, porcini",
      baseRepValue: 10,
      baseCost: 24
    },
    {
      id: 102,
      name: "Grilled Salmon",
      ingredients: ["🐟", "🥔", "🥬", "🍋"],
      platingDescription: "Atlantic salmon, fingerling potatoes, asparagus",
      baseRepValue: 12,
      baseCost: 28
    },
    {
      id: 103,
      name: "Carbonara",
      ingredients: ["🍝", "🥚", "🥓", "🧀"],
      platingDescription: "Spaghetti, guanciale, pecorino, egg yolk",
      baseRepValue: 11,
      baseCost: 22
    },
    {
      id: 104,
      name: "Bistro Burger",
      ingredients: ["🥩", "🍞", "🧀", "🥓"],
      platingDescription: "Wagyu blend, brioche bun, aged cheddar, bacon jam",
      baseRepValue: 10,
      baseCost: 20
    },
    {
      id: 105,
      name: "Steak Frites",
      ingredients: ["🥩", "🥔", "🧈", "🌿"],
      platingDescription: "Hanger steak, shoal string fries, herb butter",
      baseRepValue: 13,
      baseCost: 30
    },
    {
      id: 106,
      name: "Spicy Tuna Roll",
      ingredients: ["🍚", "🐟", "🌶️", "🥒"],
      platingDescription: "Sushi rice, maguro, spicy mayo, cucumber",
      baseRepValue: 12,
      baseCost: 25
    }
  ],
  complex: [
    {
      id: 200,
      name: "Beef Wellington",
      ingredients: ["🥩", "🍄", "🥐", "🌿"],
      platingDescription: "Tenderloin, duxelles, puff pastry, thyme jus",
      baseRepValue: 18,
      baseCost: 55
    },
    {
      id: 201,
      name: "Pan Seared Scallops",
      ingredients: ["🦪", "🥬", "🍋", "🧈", "🥂"],
      platingDescription: "Diver scallops, microgreens, champagne beurre blanc",
      baseRepValue: 16,
      baseCost: 42
    },
    {
      id: 202,
      name: "Lobster Thermidor",
      ingredients: ["🦞", "🧀", "🌿", "🍞", "🥛"],
      platingDescription: "Maine lobster, gruyere cream, tarragon, crust",
      baseRepValue: 20,
      baseCost: 60
    },
    {
      id: 203,
      name: "Paella Valenciana",
      ingredients: ["🍚", "🦐", "🍗", "🫑", "🍋"],
      platingDescription: "Saffron rice, shrimp, chicken, peppers, socarrat",
      baseRepValue: 18,
      baseCost: 45
    },
    {
      id: 204,
      name: "Osso Buco",
      ingredients: ["🥩", "🥕", "🍅", "🍷", "🌿"],
      platingDescription: "Braised veal shank, gremolata, polenta",
      baseRepValue: 19,
      baseCost: 50
    },
    {
      id: 205,
      name: "Grand Soufflé",
      ingredients: ["🥚", "🍫", "🥛", "🍓", "🍬"],
      platingDescription: "Dark chocolate, creme anglaise, raspberry, sugar dust",
      baseRepValue: 25,
      baseCost: 35
    }
  ]
};

export const getRecipeById = (id) => {
  const allRecipes = [
    ...RECIPES.simple, 
    ...RECIPES.french, 
    ...RECIPES.medium, 
    ...RECIPES.complex
  ];
  return allRecipes.find(recipe => recipe.id === id);
};

export const getRecipesByComplexity = (complexity) => {
  return RECIPES[complexity] || [];
};
