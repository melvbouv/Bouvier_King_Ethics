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
