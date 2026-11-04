"use strict";

// One coherent published median reference, not measured prompt-specific costs.
const REFERENCE = Object.freeze({ waterMl: 0.26, energyWh: 0.24, carbonG: 0.03 });
// Quantity comparisons; see the linked sources and methodology on the page.
const EQUIVALENTS = Object.freeze({ tvWatts: 100, carGramsPerKm: 142, showerMlPerMinute: 7600 });
const EXAMPLES = Object.freeze({
  1: "Traduis en anglais les trois premières lignes de ce PDF.",
  2: "Résous l’équation 3x + 7 = 22 et explique chaque étape.",
  3: "Explique-moi le théorème de Pythagore en 150 mots, avec un exemple.",
  4: "Écris un texte de 250 mots en anglais sur mon métier idéal : vétérinaire. Utilise un niveau troisième.",
  5: "Fais une fiche de 500 mots sur la Révolution française, avec les dates, les personnages et les événements importants.",
  6: "Crée un quiz de 20 questions sur la photosynthèse, avec une correction détaillée qui explique chaque réponse.",
  7: "Écris une rédaction de 1 000 mots racontant une aventure dans une ville abandonnée, avec des descriptions et des dialogues.",
  8: "Rédige entièrement un exposé de 15 minutes sur le système solaire, puis prépare le contenu de 10 diapositives pour l’accompagner.",
  9: "Prépare un dossier de révision de 10 pages sur la Seconde Guerre mondiale, avec une chronologie, des fiches et des exercices corrigés.",
  10: "Rédige une dissertation complète de 50 pages sur “La liberté consiste-t-elle à faire ce que l’on veut ?”, avec une introduction, un plan détaillé, des arguments, des exemples et une conclusion."
});
const $ = (id) => document.getElementById(id);
const number = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
let sessionPrompts = 0;
let groupSize = 1;

function totalsFor(requests) {
  return { waterMl: requests * REFERENCE.waterMl, energyWh: requests * REFERENCE.energyWh, carbonG: requests * REFERENCE.carbonG };
}

function displayMetric(value, kind) {
  const units = { water: ["mL", "L"], energy: ["Wh", "kWh"], carbon: ["g CO₂e", "kg CO₂e"] };
  const convert = value >= 1000;
  return { value: number.format(convert ? value / 1000 : value), unit: units[kind][convert ? 1 : 0] };
}

function concise(value) {
  // Keep small nonzero comparisons visible without implying high precision.
  const decimals = value > 0 && value < 0.01 ? 3 : 2;
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: decimals }).format(value);
}

function duration(seconds) {
  if (seconds >= 3600) return concise(seconds / 3600) + " h";
  if (seconds >= 60) return concise(seconds / 60) + " min";
  return concise(seconds) + " s";
}

function distance(km) {
  if (km === 0 || km >= 1) return concise(km) + " km";
  if (km >= 0.001) return concise(km * 1000) + " m";
  return concise(km * 100000) + " cm";
}

function renderSession() {
  const requests = sessionPrompts * groupSize;
  const totals = totalsFor(requests);
  [["water", totals.waterMl], ["energy", totals.energyWh], ["carbon", totals.carbonG]].forEach(([kind, value]) => {
    const formatted = displayMetric(value, kind);
    $(kind + "-value").textContent = formatted.value;
    $(kind + "-unit").textContent = formatted.unit;
  });
  $("water-equivalent").textContent = "≈ " + duration(totals.waterMl / EQUIVALENTS.showerMlPerMinute * 60);
  $("energy-equivalent").textContent = "≈ " + duration(totals.energyWh / EQUIVALENTS.tvWatts * 3600);
  $("carbon-equivalent").textContent = "≈ " + distance(totals.carbonG / EQUIVALENTS.carGramsPerKm);
  $("request-count").textContent = integer.format(requests);
  $("scale-summary").textContent = sessionPrompts === 0
    ? "Your counters show the estimated total for " + integer.format(groupSize) + (groupSize === 1 ? " person." : " people.")
    : integer.format(sessionPrompts) + (sessionPrompts === 1 ? " simulated prompt" : " simulated prompts") + " × " + integer.format(groupSize) + (groupSize === 1 ? " person" : " people") + " = " + integer.format(requests) + " reference-equivalent requests.";
}

function animateCounters() {
  document.querySelectorAll(".counter").forEach((card) => {
    card.classList.remove("flash");
    void card.offsetWidth;
    card.classList.add("flash");
  });
}

function announceTotals() {
  const requests = sessionPrompts * groupSize;
  const total = totalsFor(requests);
  $("counter-announcement").textContent = integer.format(requests) + " reference-equivalent requests for " + integer.format(groupSize) + " people. Estimated totals: " + number.format(total.waterMl) + " millilitres cooling water, " + number.format(total.energyWh) + " watt-hours electricity, " + number.format(total.carbonG) + " grams carbon dioxide equivalent.";
}

function addRequests(amount) {
  sessionPrompts += amount;
  renderSession();
  animateCounters();
  $("activity-message").textContent = "+" + amount + (amount === 1 ? " simulated prompt" : " simulated prompts") + " per person · " + integer.format(amount * groupSize) + " reference-equivalent requests added.";
  announceTotals();
}

$("prompt-select").addEventListener("change", () => {
  const selected = Number($("prompt-select").value);
  $("prompt-text").textContent = EXAMPLES[selected];
  $("prompt-scope-note").textContent = selected >= 5
    ? "Long outputs can differ substantially from this median reference. The counter adds one standard text-request equivalent per person, not an estimate for the requested document. No live AI model is called."
    : "Each example adds one standard text-request equivalent per person. The selected output is not individually measured. No live AI model is called.";
});
$("simulate-prompt").addEventListener("click", () => addRequests(1));
$("repeat-prompts").addEventListener("click", () => addRequests(10));
$("reset-session").addEventListener("click", () => {
  sessionPrompts = 0;
  renderSession();
  $("activity-message").textContent = "Session reset. Your counters are back at zero.";
  $("counter-announcement").textContent = "Session reset. All three estimated counters are zero.";
});

document.querySelectorAll("[data-people]").forEach((button) => {
  button.addEventListener("click", () => {
    groupSize = Number(button.dataset.people);
    document.querySelectorAll("[data-people]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    renderSession();
    animateCounters();
    $("activity-message").textContent = "Scale updated: the whole session now represents " + integer.format(groupSize) + (groupSize === 1 ? " person." : " people.");
    announceTotals();
  });
});

renderSession();
