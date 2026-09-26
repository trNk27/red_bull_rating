// Catalogue of Red Bull variants. `color` is the can body, `accent` the band,
// `emoji` goes on the can. Drop a photo at images/<id>.png (or .jpg/.webp)
// and it replaces the drawn can automatically.
window.EDITIONS = [
  // --- Classics ---
  { id: "original", name: "Red Bull Energy Drink", flavor: "Original", group: "Classic", color: "#1e3a8a", accent: "#c0c7d1", emoji: "🐂" },
  { id: "sugarfree", name: "Red Bull Sugarfree", flavor: "Original, no sugar", group: "Classic", color: "#5b8fd6", accent: "#e5e9ef", emoji: "🐂" },
  { id: "zero", name: "Red Bull Zero", flavor: "Original, zero calories", group: "Classic", color: "#1f2937", accent: "#9ca3af", emoji: "0️⃣" },
  { id: "total-zero", name: "Red Bull Total Zero", flavor: "Original (discontinued)", group: "Classic", color: "#374151", accent: "#d1d5db", emoji: "⚫" },

  // --- Editions ---
  { id: "red-watermelon", name: "Red Edition", flavor: "Watermelon", group: "Edition", color: "#d62839", accent: "#ffb3ba", emoji: "🍉" },
  { id: "red-cranberry", name: "Red Edition (old)", flavor: "Cranberry (discontinued)", group: "Edition", color: "#9b1b30", accent: "#f2a1b0", emoji: "🍒" },
  { id: "blue", name: "Blue Edition", flavor: "Blueberry", group: "Edition", color: "#1d4ed8", accent: "#93c5fd", emoji: "🫐" },
  { id: "yellow", name: "Yellow Edition", flavor: "Tropical Fruits", group: "Edition", color: "#f5c518", accent: "#fff3b0", emoji: "🍍" },
  { id: "green-cactus", name: "Green Edition", flavor: "Cactus Fruit (Kaktusfrucht)", group: "Edition", color: "#2e9e4f", accent: "#b6f0c6", emoji: "🌵" },
  { id: "green-dragonfruit", name: "Green Edition (US)", flavor: "Dragon Fruit", group: "Edition", color: "#22a06b", accent: "#ff7eb6", emoji: "🐉" },
  { id: "green-curuba", name: "Green Edition", flavor: "Curuba & Elderflower (Summer 2024)", group: "Edition", color: "#4d9e3a", accent: "#f4f1c9", emoji: "🌼" },
  { id: "white", name: "White Edition", flavor: "Coconut & Blueberry", group: "Edition", color: "#f3f4f6", accent: "#60a5fa", emoji: "🥥", dark: true },
  { id: "coconut", name: "Coconut Edition (US)", flavor: "Coconut Berry", group: "Edition", color: "#e8e3d9", accent: "#7c3aed", emoji: "🥥", dark: true },
  { id: "purple", name: "Purple Edition", flavor: "Açaí", group: "Edition", color: "#6b21a8", accent: "#d8b4fe", emoji: "🍇" },
  { id: "sea-blue", name: "Sea Blue Edition", flavor: "Juneberry", group: "Edition", color: "#0e7490", accent: "#a5f3fc", emoji: "🌊" },
  { id: "apricot", name: "Apricot Edition", flavor: "Apricot & Strawberry", group: "Edition", color: "#f28c28", accent: "#ffd6a5", emoji: "🍑" },
  { id: "amber", name: "Amber Edition (US)", flavor: "Strawberry Apricot", group: "Edition", color: "#d97706", accent: "#fde68a", emoji: "🍓" },
  { id: "pink", name: "Pink Edition", flavor: "Forest Berries / Wild Berries (Waldbeere)", group: "Edition", color: "#ec4899", accent: "#fbcfe8", emoji: "🍓" },
  { id: "peach", name: "Peach Edition", flavor: "White Peach", group: "Edition", color: "#f9a58b", accent: "#fff1e6", emoji: "🍑" },
  { id: "iced", name: "Iced Edition", flavor: "Iced Vanilla Berry (Winter 2024)", group: "Edition", color: "#7dd3fc", accent: "#f0f9ff", emoji: "🧊", dark: true },
  { id: "orange", name: "Orange Edition", flavor: "Tangerine (discontinued)", group: "Edition", color: "#f97316", accent: "#fed7aa", emoji: "🍊" },
  { id: "silver", name: "Silver Edition", flavor: "Lime (discontinued)", group: "Edition", color: "#a3aab5", accent: "#bef264", emoji: "🍋‍🟩", dark: true },

  // --- Summer ---
  { id: "summer-2026-sudachi", name: "Summer Edition 2026", flavor: "Sudachi Lime", group: "Summer", color: "#84cc16", accent: "#ecfccb", emoji: "🍋‍🟩" },

  // --- Spring ---
  { id: "spring-2026-cherry-sakura", name: "Spring Edition 2026", flavor: "Cherry Sakura", group: "Spring", color: "#f472b6", accent: "#fff0f6", emoji: "🌸" },
  { id: "spring-2025-grapefruit", name: "Spring Edition 2025", flavor: "Grapefruit & Blossom", group: "Spring", color: "#fb7185", accent: "#ffe4e6", emoji: "🌺" },

  // --- Winter ---
  { id: "winter-2026-pistachio", name: "Winter Edition 2026", flavor: "Pistachio & Berries", group: "Winter", color: "#8fbf5a", accent: "#c0265a", emoji: "🌰", isNew: true },
  { id: "winter-2025-fuji-apple", name: "Winter Edition 2025", flavor: "Fuji Apple & Ginger", group: "Winter", color: "#b91c1c", accent: "#fcd34d", emoji: "🍎" },
  { id: "winter-2023-pear", name: "Winter Edition 2023", flavor: "Pear Cinnamon", group: "Winter", color: "#a3b93a", accent: "#7c4a1e", emoji: "🍐" },
  { id: "winter-2022-fig", name: "Winter Edition 2022", flavor: "Fig Apple", group: "Winter", color: "#7e22ce", accent: "#e9d5ff", emoji: "🍏" },
  { id: "winter-2021-pomegranate", name: "Winter Edition 2021", flavor: "Pomegranate", group: "Winter", color: "#9f1239", accent: "#fecdd3", emoji: "❤️" },
  { id: "winter-2020-arctic", name: "Winter Edition 2020", flavor: "Arctic Berry", group: "Winter", color: "#3b82f6", accent: "#e0f2fe", emoji: "❄️" },
  { id: "winter-2019-holiday-spice", name: "Winter Edition 2019", flavor: "Holiday Spice", group: "Winter", color: "#92400e", accent: "#fde68a", emoji: "🎄" },
  { id: "winter-plum", name: "Winter Edition", flavor: "Plum Twist", group: "Winter", color: "#581c87", accent: "#c4b5fd", emoji: "🟣" },

  // --- Japan ---
  { id: "japan-sakura", name: "Sakura Edition (Japan)", flavor: "Cherry Blossom", group: "Japan", color: "#f9a8d4", accent: "#ffffff", emoji: "🌸", dark: true },
  { id: "japan-strawberry", name: "Spring Edition 2025 (Japan)", flavor: "Strawberry", group: "Japan", color: "#e11d48", accent: "#fecdd3", emoji: "🍓" },
];
