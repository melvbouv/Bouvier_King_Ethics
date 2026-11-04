"use strict";

const { TASKS, calculate } = globalThis.FootprintModel;
const EQUIVALENTS = Object.freeze({ tvWatts: 100, carGramsPerKm: 142, glassMl: 250, showerMlPerMinute: 7600 });
const $ = (id) => document.getElementById(id);
const number = new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 3 });
const integer = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
let selectedTask = 1;
let groupSize = 30;
let generations = 1;

function displayMetric(value, kind) {
  const units = { water: ["mL", "L"], energy: ["Wh", "kWh"], carbon: ["g CO₂e", "kg CO₂e"] };
  const convert = value >= 1000;
  const scaled = convert ? value / 1000 : value;
  const formatted = number.format(scaled);
  return { value: formatted, unit: units[kind][convert ? 1 : 0] };
}
function concise(value) {
  return number.format(value);
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
function renderWaterEquivalent(waterMl) {
  if (waterMl < EQUIVALENTS.showerMlPerMinute) {
    const glasses = waterMl / EQUIVALENTS.glassMl;
    const glassAmount = glasses > 0 && glasses < 0.01 ? new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 2 }).format(glasses) : concise(glasses);
    $("water-equivalent").textContent = "≈ " + glassAmount;
    $("water-equivalent-label").textContent = "glasses of water (250 mL)";
    $("water-equivalent-icon").innerHTML = '<path d="M6 3h12l-2 18H8L6 3Z"/><path d="M7 9h10"/>';
  } else {
    $("water-equivalent").textContent = "≈ " + duration(waterMl / EQUIVALENTS.showerMlPerMinute * 60);
    $("water-equivalent-label").textContent = "of shower water";
    $("water-equivalent-icon").innerHTML = '<path d="M5 9V6a3 3 0 0 1 6 0v2M8 10h6M7 14v1m4-1v1m4-1v1M6 18v1m5-1v1m5-1v1"/>';
  }
}
function renderScenario(announce = false) {
  const totals = calculate(selectedTask, groupSize, generations);
  $("prompt-select").value = String(selectedTask);
  [["water", totals.waterMl], ["energy", totals.energyWh], ["carbon", totals.carbonG]].forEach(([kind, value]) => {
    const formatted = displayMetric(value, kind);
    $(kind + "-value").textContent = formatted.value;
    $(kind + "-unit").textContent = formatted.unit;
  });
  renderWaterEquivalent(totals.waterMl);
  $("energy-equivalent").textContent = "≈ " + duration(totals.energyWh / EQUIVALENTS.tvWatts * 3600);
  $("carbon-equivalent").textContent = "≈ " + distance(totals.carbonG / EQUIVALENTS.carGramsPerKm);
  $("request-count").textContent = integer.format(totals.requests);
  $("prompt-text").textContent = TASKS[selectedTask].text;
  $("output-assumption").textContent = "≈ " + integer.format(totals.outputWords) + " words · " + integer.format(totals.outputTokens) + " tokens";
  $("scale-summary").textContent = generations + (generations === 1 ? " response" : " responses") + " × " + groupSize + (groupSize === 1 ? " person" : " people") + " = " + integer.format(totals.requests) + " responses represented.";
  document.querySelectorAll("[data-people]").forEach((button) => {
    const selected = Number(button.dataset.people) === groupSize;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  [["simulate-prompt", 1], ["repeat-prompts", 10]].forEach(([id, value]) => {
    const selected = generations === value;
    $(id).classList.toggle("button-dark", selected);
    $(id).classList.toggle("button-outline", !selected);
    $(id).setAttribute("aria-pressed", String(selected));
  });
  if (announce) {
    document.querySelectorAll(".counter").forEach((card) => {
      card.classList.remove("flash");
      void card.offsetWidth;
      card.classList.add("flash");
    });
    $("counter-announcement").textContent = "Estimate updated. " + integer.format(totals.requests) + " responses for the selected task: " + number.format(totals.waterMl) + " millilitres water, " + number.format(totals.energyWh) + " watt-hours electricity and " + displayMetric(totals.carbonG, "carbon").value + " " + displayMetric(totals.carbonG, "carbon").unit + ".";
  }
}
$("prompt-select").addEventListener("change", () => {
  selectedTask = Number($("prompt-select").value);
  generations = 1;
  renderScenario(true);
});
$("simulate-prompt").addEventListener("click", () => { generations = 1; renderScenario(true); });
$("repeat-prompts").addEventListener("click", () => { generations = 10; renderScenario(true); });
$("reset-session").addEventListener("click", () => {
  selectedTask = 1;
  groupSize = 30;
  generations = 1;
  $("prompt-select").value = "1";
  renderScenario(true);
});
document.querySelectorAll("[data-people]").forEach((button) => {
  button.addEventListener("click", () => { groupSize = Number(button.dataset.people); renderScenario(true); });
});
renderScenario();
