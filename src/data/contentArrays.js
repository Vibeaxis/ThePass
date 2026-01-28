
export const TIER_2_RECIPES = [
  {
    id: 1,
    name: "Duck Confit",
    difficulty: "Medium",
    baseCost: 45,
    ingredients: ["Duck Leg", "Thyme", "Garlic", "Duck Fat", "Potatoes"],
    prepTime: 40,
    failurePoints: ["Skin not crispy", "Meat dry", "Too salty", "Fat not rendered"]
  },
  {
    id: 2,
    name: "Risotto",
    difficulty: "Medium",
    baseCost: 40,
    ingredients: ["Arborio Rice", "White Wine", "Parmesan", "Butter", "Stock"],
    prepTime: 35,
    failurePoints: ["Rice crunchy", "Mushy texture", "Lack of creaminess", "Bland"]
  },
  {
    id: 3,
    name: "Bouillabaisse",
    difficulty: "Medium",
    baseCost: 55,
    ingredients: ["Mixed Fish", "Shellfish", "Saffron", "Fennel", "Potatoes"],
    prepTime: 50,
    failurePoints: ["Fish overcooked", "Shells in broth", "Soup cold", "Lack of saffron"]
  },
  {
    id: 4,
    name: "Coq au Vin",
    difficulty: "Medium",
    baseCost: 48,
    ingredients: ["Chicken", "Red Wine", "Mushrooms", "Bacon", "Pearl Onions"],
    prepTime: 45,
    failurePoints: ["Sauce thin", "Chicken tough", "Wine taste overpowering", "Vegetables mushy"]
  },
  {
    id: 5,
    name: "Beef Wellington",
    difficulty: "Medium",
    baseCost: 80,
    ingredients: ["Beef Tenderloin", "Puff Pastry", "Mushroom Duxelles", "Prosciutto", "Egg Wash"],
    prepTime: 60,
    failurePoints: ["Pastry soggy", "Beef overcooked", "Gap between meat and pastry", "Underseasoned"]
  },
  {
    id: 6,
    name: "Lobster Thermidor",
    difficulty: "Medium",
    baseCost: 75,
    ingredients: ["Lobster", "Cream", "Egg Yolks", "Mustard", "Gruyère"],
    prepTime: 55,
    failurePoints: ["Sauce split", "Lobster rubbery", "Cheese burnt", "Served cold"]
  },
  {
    id: 7,
    name: "Cassoulet",
    difficulty: "Medium",
    baseCost: 50,
    ingredients: ["White Beans", "Duck Confit", "Sausage", "Pork Belly", "Breadcrumbs"],
    prepTime: 50,
    failurePoints: ["Beans undercooked", "Too dry", "Too soupy", "Burnt crust"]
  },
  {
    id: 8,
    name: "Paella",
    difficulty: "Medium",
    baseCost: 60,
    ingredients: ["Bomba Rice", "Saffron", "Shrimp", "Mussels", "Chorizo"],
    prepTime: 45,
    failurePoints: ["Rice burnt (bad way)", "No socarrat", "Seafood chewy", "Rice mushy"]
  },
  {
    id: 9,
    name: "Cioppino",
    difficulty: "Medium",
    baseCost: 58,
    ingredients: ["Crab", "Clams", "Shrimp", "Tomato Broth", "Chili Flakes"],
    prepTime: 40,
    failurePoints: ["Shell fragments", "Seafood overcooked", "Broth watery", "Too spicy"]
  },
  {
    id: 10,
    name: "Osso Buco",
    difficulty: "Medium",
    baseCost: 65,
    ingredients: ["Veal Shanks", "White Wine", "Vegetables", "Broth", "Gremolata"],
    prepTime: 55,
    failurePoints: ["Meat tough", "Sauce greasy", "Bone marrow lost", "Vegetables disintegrated"]
  }
];

export const DAILY_EVENTS = [
  {
    id: 1,
    name: "Delivery Truck Late",
    description: "The produce truck got stuck in traffic. Prep time is reduced.",
    effect: { prepTimeChange: -15 }
  },
  {
    id: 2,
    name: "Critic Rumor",
    description: "Word on the street is a food critic is dining tonight.",
    effect: { reputationChange: 0, stressChange: 20 }
  },
  {
    id: 3,
    name: "Staff Illness",
    description: "One of the line cooks called in sick with the flu.",
    effect: { prepTimeChange: -10, stressChange: 15 }
  },
  {
    id: 4,
    name: "Equipment Breakdown",
    description: "The salamander grill is acting up. Expect delays.",
    effect: { moneyChange: -200, prepTimeChange: -5 }
  },
  {
    id: 5,
    name: "VIP Reservation",
    description: "The Mayor has booked the chef's table.",
    effect: { reputationChange: 10, moneyChange: 150 }
  },
  {
    id: 6,
    name: "Food Shortage",
    description: "We're short on butter. Prices for dairy dishes increased.",
    effect: { moneyChange: -100 }
  },
  {
    id: 7,
    name: "New Sous Chef",
    description: "A trial sous chef is helping out today.",
    effect: { prepTimeChange: 10, stressChange: -5 }
  },
  {
    id: 8,
    name: "Kitchen Fire Drill",
    description: "Mandatory safety inspection during prep.",
    effect: { prepTimeChange: -20 }
  },
  {
    id: 9,
    name: "Supplier Discount",
    description: "Our fishmonger gave us a great deal on the catch of the day.",
    effect: { moneyChange: 200 }
  },
  {
    id: 10,
    name: "Influencer Visit",
    description: "A TikTok food star is live streaming from table 4.",
    effect: { reputationChange: 15, stressChange: 10 }
  }
];

export const STAFF_BIOS = [
  {
    id: 1,
    name: "Marco",
    role: "Grill Chef",
    personality: "A veteran of the line who communicates only in grunts and perfect steaks.",
    quips: ["Fire, walking!", "Meat rests when I say it rests.", "Hot behind!", "It's raw because you asked for blue!"]
  },
  {
    id: 2,
    name: "Sofia",
    role: "Sous Chef",
    personality: "Hyper-organized and terrifyingly efficient. Keeps the chaos at bay.",
    quips: ["Yes Chef!", "Wipe that rim!", "Tickets dying in the window!", "Pick up table 4!"]
  },
  {
    id: 3,
    name: "James",
    role: "Runner",
    personality: "Eager to please, fast on his feet, but prone to dropping ramekins.",
    quips: ["Service please!", "Runner available!", "Corner!", "Dropping bread!"]
  },
  {
    id: 4,
    name: "Yuki",
    role: "Pastry Chef",
    personality: "Quiet perfectionist who judges your plating from across the kitchen.",
    quips: ["Ice cream is melting.", "Delicate!", "Sugar work is fragile, watch out.", "Who touched my station?"]
  },
  {
    id: 5,
    name: "Pierre",
    role: "Saucier",
    personality: "Classic French training, believes butter is a food group.",
    quips: ["More butter!", "Reduce, reduce!", "Sauce is life.", "Too thick, fix it."]
  },
  {
    id: 6,
    name: "Amara",
    role: "Garde Manger",
    personality: "Artist with a knife. Can carve a radish into a rose in 3 seconds.",
    quips: ["Cold apps ready!", "Salad flying!", "Fresh herbs down.", "Sharp knife!"]
  },
  {
    id: 7,
    name: "Diego",
    role: "Dishwasher",
    personality: "The backbone of the kitchen. Sees everything, says nothing.",
    quips: ["Plates hot!", "Silverware incoming!", "Clear the pit!", "Rack out!"]
  },
  {
    id: 8,
    name: "Chen",
    role: "Line Cook",
    personality: "Jack of all trades. Can jump on any station and hold it down.",
    quips: ["Swinging to sauté!", "I got you covered.", "All day!", "86 sea bass!"]
  }
];
