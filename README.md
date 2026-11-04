# Bouvier_King_Ethics

**The Hidden Cost of a Prompt** — an interactive AI ethics assignment for EDHEC, AI for Business, by Bouvier & King.

The static website illustrates estimated cooling-water consumption, electricity consumption and greenhouse-gas emissions associated with repeated AI text requests. It also examines transparency, local impacts and efficiency versus total use.

## Reference and limitations

All three counters use the same May 2025 median Gemini Apps text-request reference reported by Elsworth et al. (2025): **0.26 mL water, 0.24 Wh electricity, 0.03 g CO₂e**. The water value covers direct cooling, and the carbon value uses the paper’s market-based accounting. Training, external networks, storage and user devices are outside the reference. Read the site’s methodology for the precise boundaries.

Prompt cards are illustrative, not individually measured. Multiplying a median reference describes a hypothetical scenario; it is not a prediction of average or total real-world usage. The website makes no AI API calls and has no analytics or tracking.

Primary reference: https://arxiv.org/html/2508.15734v1

## Run and publish

No installation or build step is needed. Open `index.html`, or serve this directory using any static web server. For GitHub Pages, publish the repository root from the `main` branch. All asset links are relative so the site supports a project URL.

## AI-use disclosure

`Bouvier_King_Ethics_AI_Use.pdf` is the one-page disclosure accompanying the assignment. A matching `.txt` file is provided. The students remain responsible for the final submission and interpretation.

Sources checked on 4 November 2026.

## Everyday comparisons and group size

The whole session is multiplied by the selected group: **1 person, 30 people, or 200 people**. No daily frequency or time period is assumed. Every simulated prompt adds one reference-equivalent request per person. The ten French school prompts are illustrative uses, not measured task-specific estimates or an energy ranking; a 50-page dissertation's real footprint is not inferred from this median.

Equivalent quantities use a **100 W television** (Google study section 4.2), **142 g CO₂e/km for an average diesel car** ([Impact CO₂](https://impactco2.fr/outils/transport/voiturethermique)), and an assumed shower at **7.6 L/min** ([EPA WaterSense](https://www.epa.gov/watersense/showerheads)). Small values use seconds, metres or centimetres. These are separate energy, carbon and water-volume comparisons, not equivalent overall environmental impacts. Shower heating is excluded.
