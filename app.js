"use strict";

// All three values come from the same Gemini Apps May 2025 median reference.
// They are a scenario unit, not a measured cost of the displayed prompt.
const REFERENCE = Object.freeze({ waterMl: 0.26, energyWh: 0.24, carbonG: 0.03 });
const EXAMPLES = Object.freeze({
  email: "Write a polite email asking my professor for feedback on our business project.",
  translate: "Translate this message into English: Bonjour, pourriez-vous confirmer notre rendez-vous de demain ?",
  ideas: "Suggest five creative names for a student business that repairs and resells used furniture.",
  explain: "Explain the difference between revenue and profit using a simple business example."
});
const $ = (id) => document.getElementById(id);
const number = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
let sessionRequests = 0;

function totalsFor(requests) {
  return { waterMl: requests * REFERENCE.waterMl, energyWh: requests * REFERENCE.energyWh, carbonG: requests * REFERENCE.carbonG };
}

function displayMetric(value, kind) {
  const units = { water: ["mL", "L"], energy: ["Wh", "kWh"], carbon: ["g CO₂e", "kg CO₂e"] };
  const convert = value >= 1000;
  return { value: number.format(convert ? value / 1000 : value), unit: units[kind][convert ? 1 : 0] };
}

function renderSession() {
  const totals = totalsFor(sessionRequests);
  [["water", totals.waterMl], ["energy", totals.energyWh], ["carbon", totals.carbonG]].forEach(([kind, value]) => {
    const formatted = displayMetric(value, kind);
    $(kind + "-value").textContent = formatted.value;
    $(kind + "-unit").textContent = formatted.unit;
  });
  $("request-count").textContent = integer.format(sessionRequests);
}

function addRequests(amount) {
  sessionRequests += amount;
  renderSession();
  document.querySelectorAll(".counter").forEach((card) => {
    card.classList.remove("flash");
    // Restart the brief visual confirmation after every activation.
    void card.offsetWidth;
    card.classList.add("flash");
  });
  $("activity-message").textContent = amount === 1
    ? "+1 simulated request added. Try repeating it, or change the example."
    : "+10 simulated requests added. Each repeat uses the same reference.";
  const total = totalsFor(sessionRequests);
  $("counter-announcement").textContent = integer.format(sessionRequests) + " simulated requests. Estimated totals: " + number.format(total.waterMl) + " millilitres cooling water, " + number.format(total.energyWh) + " watt-hours electricity, " + number.format(total.carbonG) + " grams carbon dioxide equivalent.";
}

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-prompt]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    $("prompt-text").textContent = EXAMPLES[button.dataset.prompt];
  });
});
$("simulate-prompt").addEventListener("click", () => addRequests(1));
$("repeat-prompts").addEventListener("click", () => addRequests(10));
$("reset-session").addEventListener("click", () => {
  sessionRequests = 0;
  renderSession();
  $("activity-message").textContent = "Session reset. Your counters are back at zero.";
  $("counter-announcement").textContent = "Session reset. All three estimated counters are zero.";
});

function validInteger(input, fallback) {
  const raw = input.valueAsNumber;
  const value = Number.isFinite(raw) ? Math.round(raw) : fallback;
  return Math.min(Number(input.max), Math.max(Number(input.min), value));
}

function renderScenario() {
  const people = validInteger($("people"), 1000);
  const daily = validInteger($("daily-requests"), 20);
  const days = Number($("period").value);
  const requests = people * daily * days;
  const totals = totalsFor(requests);
  $("people-label").textContent = integer.format(people);
  $("people").setAttribute("aria-valuetext", integer.format(people) + " people");
  $("scenario-requests").textContent = integer.format(requests);
  [["water", totals.waterMl], ["energy", totals.energyWh], ["carbon", totals.carbonG]].forEach(([kind, value]) => {
    const formatted = displayMetric(value, kind);
    $("scale-" + kind).textContent = formatted.value + " " + formatted.unit;
  });
  document.querySelectorAll("[data-people]").forEach((button) => {
    const selected = Number(button.dataset.people) === people;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

$("people").addEventListener("input", renderScenario);
$("daily-requests").addEventListener("input", renderScenario);
$("daily-requests").addEventListener("change", () => {
  $("daily-requests").value = validInteger($("daily-requests"), 20);
  renderScenario();
});
$("period").addEventListener("change", renderScenario);
document.querySelectorAll("[data-people]").forEach((button) => {
  button.addEventListener("click", () => {
    $("people").value = button.dataset.people;
    renderScenario();
  });
});

renderSession();
renderScenario();
