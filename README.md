# Bouvier_King_Ethics

**The Hidden Cost of a Prompt** — an interactive AI ethics assignment for EDHEC, AI for Business, by Bouvier & King.

## Pages

- `index.html`: ten French school prompts, estimated water/electricity/CO₂e counters, everyday equivalents and groups of 1, 30, 200 or 10,000 people (EDHEC scenario). A class of 30 is selected initially. Changing the prompt updates the estimate immediately. The one/ten generation controls compare repeated runs of the selected task; they are not a basket of earlier tasks.
- `method.html`: the shortened explanation, full model, task assumptions, ethical discussion and primary sources.

## Model

This is a **hybrid educational scenario**, not a measurement of the exact prompts or a claim about a particular provider. `model.js` contains the data and calculation; `app.js` connects it to the interface. The reference model and data year are shown beside the counters. Displayed results use up to three significant figures; small nonzero values remain visible.

- Assumed output words for prompts 1–10: 30, 90, 150, 250, 500, 1,200, 1,000, 2,350, 4,000, 20,000.
- Approximate output tokens = words ÷ 0.75. Actual tokenization varies by language/model.
- Electricity = tokens × 0.3 Wh ÷ 500, based on [Epoch AI's 2025 GPT-4o analytical reference](https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use), scaled linearly for this teaching scenario.
- Water = Wh × (0.26 ÷ 0.24) mL/Wh; carbon = Wh × (0.03 ÷ 0.24) g CO₂e/Wh. These fixed scenario ratios derive from [Google's rounded 2025 reference](https://arxiv.org/html/2508.15734v1). They are environmental proxies applied to the energy scenario, not measured water/carbon for GPT-4o or any named service. The carbon ratio is not a location-based grid factor.
- Group total = per-generation estimate × generations per person × selected people.

Long documents extrapolate this simplified model and may span multiple calls. Large input/PDF processing, hidden reasoning, retries, training, devices and networks are not modeled. A longer response does not follow an exact universal energy curve; see the methodology page for empirical research and limitations.

## Everyday comparisons

TV: 100 W. Car: 142 g CO₂e/km for Impact CO₂'s average diesel reference. Small water volumes: an assumed 250 mL glass. From 7.6 L upwards: shower duration at an assumed 7.6 L/min. These compare energy, greenhouse-gas quantity or volume, not identical overall environmental impacts. Sources and formulas are on the method page.

## Run and publish

No dependencies or build step are required. Open `index.html` or serve this directory with a static web server. GitHub Pages publishes the root of `main`. All local links are relative and work at a project URL. No live AI API calls, analytics or tracking are used.

Sources checked 4 November 2026.
