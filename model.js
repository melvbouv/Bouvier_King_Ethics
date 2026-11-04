"use strict";

// Hybrid educational scenario, not a measured footprint of a named provider.
// Energy: Epoch AI's 2025 analytical estimate, 0.3 Wh / 500 output tokens.
// Water/carbon: fixed scenario ratios derived from Google's rounded reference.
(function (root) {
  const ASSUMPTIONS = Object.freeze({ wordsPerToken: 0.75, energyWhPer500Tokens: 0.3, waterMlPerWh: 0.26 / 0.24, carbonGPerWh: 0.03 / 0.24 });
  const TASKS = Object.freeze({
    1: { text: "Traduis en anglais les trois premières lignes de ce PDF.", words: 30 },
    2: { text: "Résous l’équation 3x + 7 = 22 et explique chaque étape.", words: 90 },
    3: { text: "Explique-moi le théorème de Pythagore en 150 mots, avec un exemple.", words: 150 },
    4: { text: "Écris un texte de 250 mots en anglais sur mon métier idéal : vétérinaire. Utilise un niveau troisième.", words: 250 },
    5: { text: "Fais une fiche de 500 mots sur la Révolution française, avec les dates, les personnages et les événements importants.", words: 500 },
    6: { text: "Crée un quiz de 20 questions sur la photosynthèse, avec une correction détaillée qui explique chaque réponse.", words: 1200 },
    7: { text: "Écris une rédaction de 1 000 mots racontant une aventure dans une ville abandonnée, avec des descriptions et des dialogues.", words: 1000 },
    8: { text: "Rédige entièrement un exposé de 15 minutes sur le système solaire, puis prépare le contenu de 10 diapositives pour l’accompagner.", words: 2350 },
    9: { text: "Prépare un dossier de révision de 10 pages sur la Seconde Guerre mondiale, avec une chronologie, des fiches et des exercices corrigés.", words: 4000 },
    10: { text: "Rédige une dissertation complète de 50 pages sur “La liberté consiste-t-elle à faire ce que l’on veut ?”, avec une introduction, un plan détaillé, des arguments, des exemples et une conclusion.", words: 20000 },
  });
  Object.values(TASKS).forEach(Object.freeze);
  function calculate(taskId, people = 30, generations = 1) {
    const task = TASKS[taskId];
    if (!Object.hasOwn(TASKS, taskId) || ![1, 30, 200, 10000].includes(people) || ![1, 10].includes(generations)) throw new RangeError("Invalid scenario");
    const outputTokens = task.words / ASSUMPTIONS.wordsPerToken;
    const requests = people * generations;
    const energyWh = outputTokens / 500 * ASSUMPTIONS.energyWhPer500Tokens * requests;
    return { outputWords: task.words, outputTokens, requests, energyWh, waterMl: energyWh * ASSUMPTIONS.waterMlPerWh, carbonG: energyWh * ASSUMPTIONS.carbonGPerWh };
  }
  const model = Object.freeze({ ASSUMPTIONS, TASKS, calculate });
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  else root.FootprintModel = model;
})(globalThis);
