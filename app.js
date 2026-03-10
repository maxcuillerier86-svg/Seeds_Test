const knownSeeds = {
  tomato: {
    description: "Great beginner crop with high yield and many container-friendly varieties.",
    equipment: ["Seed tray or 4-inch pots", "Tomato cage or stake", "Compost-rich potting mix"],
    space: "1 plant per 5-gallon container, or 45 cm spacing in beds.",
    effort: "Medium (regular pruning and tying help)",
    care: "6-8h direct sun, deep watering 2-3x/week, mulch to retain moisture.",
    timelineDays: 80,
  },
  basil: {
    description: "Fast and forgiving herb, ideal for windowsills and balcony planters.",
    equipment: ["Small pot with drainage", "Indoor grow light (optional)", "Fine seed-starting mix"],
    space: "15-20 cm between plants.",
    effort: "Low",
    care: "4-6h sun, keep soil lightly moist, pinch flowers to keep leaves productive.",
    timelineDays: 35,
  },
  "wasabi arugula": {
    description: "Peppery salad green with quick growth and cool-weather preference.",
    equipment: ["Shallow planter box", "Lightweight row cover (optional)", "Hand watering can"],
    space: "10 cm spacing for baby leaves, 15 cm for larger leaves.",
    effort: "Low",
    care: "Partial to full sun, water every 1-2 days in warm weather.",
    timelineDays: 28,
  },
  marigold: {
    description: "Companion flower that supports pollinators and can deter some pests.",
    equipment: ["Starter pots", "Balanced flower fertilizer"],
    space: "20-30 cm between plants.",
    effort: "Low",
    care: "6h sun, water when top 2 cm of soil is dry.",
    timelineDays: 55,
  },
};

const fallbackGuide = {
  description: "General starter guidance generated for an unlisted seed.",
  equipment: ["Seed tray or small starter pots", "Potting mix", "Spray bottle or watering can"],
  space: "Most edible crops need 15-45 cm spacing; check the packet for exact guidance.",
  effort: "Medium",
  care: "Aim for consistent moisture and at least 6h light for fruiting crops (4h for many herbs/greens).",
  timelineDays: 50,
};

const form = document.getElementById("seed-form");
const knownSeedSelect = document.getElementById("known-seed");
const seedInput = document.getElementById("seed-input");
const plantingDateInput = document.getElementById("planting-date");
const output = document.getElementById("output");
const template = document.getElementById("guide-template");

Object.keys(knownSeeds).forEach((seed) => {
  const option = document.createElement("option");
  option.value = seed;
  option.textContent = seed[0].toUpperCase() + seed.slice(1);
  knownSeedSelect.append(option);
});

function plusDays(date, days) {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getGuide(seedName) {
  const normalized = seedName.trim().toLowerCase();
  return knownSeeds[normalized] ?? fallbackGuide;
}

function buildReminders(seedName, plantingDate, timelineDays) {
  const events = [
    ["Prepare soil + tools", -3],
    ["Plant seeds", 0],
    ["Check germination progress", 7],
    ["First nutrient feeding", 18],
    ["Mid-growth health check", Math.round(timelineDays / 2)],
    ["Expected first harvest window", timelineDays],
  ];

  return events.map(([label, dayOffset]) => {
    const when = plusDays(plantingDate, dayOffset);
    return `${label} (${formatDate(when)})`;
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const seedName = seedInput.value.trim() || knownSeedSelect.value;
  if (!seedName) {
    alert("Please choose or type a seed.");
    return;
  }

  const plantingDate = plantingDateInput.value
    ? new Date(`${plantingDateInput.value}T00:00:00`)
    : new Date();

  const guide = getGuide(seedName);
  const reminders = buildReminders(seedName, plantingDate, guide.timelineDays);

  const clone = template.content.cloneNode(true);
  clone.querySelector(".seed-name").textContent = seedName;
  clone.querySelector(".description").textContent = guide.description;
  clone.querySelector(".space").textContent = guide.space;
  clone.querySelector(".effort").textContent = guide.effort;
  clone.querySelector(".care").textContent = guide.care;
  clone.querySelector(".timeline").textContent = `~${guide.timelineDays} days to first harvest/peak.`;

  const equipmentList = clone.querySelector(".equipment");
  guide.equipment.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    equipmentList.append(li);
  });

  const remindersList = clone.querySelector(".reminders");
  reminders.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    remindersList.append(li);
  });

  output.innerHTML = "<h2>Your personalized grow guide</h2>";
  output.append(clone);
});
