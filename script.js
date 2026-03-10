const seedData = {
  souci: {
    displayName: "Souci (Marigold mix)",
    equipment: ["Containers or bed space", "Potting soil", "Watering can", "Hand trowel"],
    effort: "Low",
    spaceNeed: "Small to medium; works well in balcony containers.",
    water: "Water when top 2 cm of soil is dry.",
    light: "Full sun to partial sun (6+ hrs).",
    daysToHarvest: 55,
  },
  roquette: {
    displayName: "Roquette japonaise wasabi",
    equipment: ["Shallow planter", "Fine potting mix", "Spray bottle", "Small shears"],
    effort: "Medium",
    spaceNeed: "Small; ideal for windowsills and compact beds.",
    water: "Keep soil evenly moist; avoid soggy roots.",
    light: "Partial sun or bright indirect light.",
    daysToHarvest: 35,
  },
};

const defaults = {
  equipment: ["Containers or garden bed", "Quality soil", "Watering can", "Simple hand tools"],
  effort: "Medium",
  spaceNeed: "Depends on variety; start with one medium container per plant.",
  water: "Most edible crops need 2-3 deep waterings per week.",
  light: "Most crops need 6-8 hours of direct light.",
  daysToHarvest: 60,
};

const plannerForm = document.querySelector("#planner-form");
const resultPanel = document.querySelector("#results");

const addDays = (dateString, days) => {
  const date = new Date(dateString + "T12:00:00");
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const knownSeed = plannerForm.knownSeed.value;
  const customSeed = plannerForm.customSeed.value.trim();
  const plantingDate = plannerForm.plantingDate.value;
  const space = plannerForm.space.value;

  if (!plantingDate) return;

  const selected = knownSeed ? seedData[knownSeed] : null;
  const name = selected?.displayName || customSeed || "Custom seed";
  const details = selected || defaults;

  const timeline = [
    { label: "Planting day", date: addDays(plantingDate, 0) },
    { label: "First check-in", date: addDays(plantingDate, 7) },
    { label: "Growth boost phase", date: addDays(plantingDate, 21) },
    { label: "Expected harvest window", date: addDays(plantingDate, details.daysToHarvest) },
  ];

  resultPanel.classList.remove("hidden");
  resultPanel.innerHTML = `
    <h2>${name} grow plan</h2>
    <p class="muted">AI-assisted starter recommendation based on your selected seed, date, and space.</p>
    <div class="grid">
      <article>
        <h3>Requirements</h3>
        <p><strong>Effort:</strong> ${details.effort}</p>
        <p><strong>Space:</strong> ${details.spaceNeed}</p>
        <p><strong>Water:</strong> ${details.water}</p>
        <p><strong>Light:</strong> ${details.light}</p>
      </article>
      <article>
        <h3>Equipment checklist</h3>
        <ul>${details.equipment.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article>
        <h3>Suggested library support</h3>
        <ul>
          <li>Borrow hand tools from tool-lending desk.</li>
          <li>Ask staff about grow-light and seed-starting resources.</li>
          <li>Join local gardening workshops / seed swaps.</li>
          <li>Space selected: <strong>${space}</strong>.</li>
        </ul>
      </article>
    </div>
    <h3>Timeline + reminders</h3>
    <ul>${timeline.map((step) => `<li><strong>${step.label}:</strong> ${step.date}</li>`).join("")}</ul>
    <p class="muted">Tip: add these dates to your calendar and set repeating reminders every 3 days for watering checks.</p>
  `;
});
