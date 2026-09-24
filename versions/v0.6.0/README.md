# LoftSims Complete ZDR Readiness v0.6.0

This freestanding cumulative release adds a source-aware ZDR knowledge layer to the complete assessment workflow and does not depend on historical folders.

LoftSims evaluates Zero Data Retention for any AI Technology product through a two-state workflow:

1. **System metadata + 15 universal controls → Flavor-specific ZDR YAML**
2. **Flavor-specific YAML → Flavor Checker**
3. **Confirmed source-system profile → Applicable knowledge sources + tailored questionnaire**
4. **Recognized adapter or generated template → Canonical as-is JSON**
5. **As-is system state → 15-anchor assessment JSON + missing evidence and controls**
6. **Assessment JSON + future-state inputs → Source-backed recommendation document**

## Knowledge artifacts

- [`knowledge/SOURCES.md`](knowledge/SOURCES.md) lists every captured source and stable ID.
- [`knowledge/source-manifest.yaml`](knowledge/source-manifest.yaml) contains the curated source metadata.
- [`knowledge/knowledge-corpus.json`](knowledge/knowledge-corpus.json) contains the sparse 15-anchor vectors.
- [`knowledge/build_vectors.py`](knowledge/build_vectors.py) reproducibly builds the JSON and browser data.

All 38 captured sources are individually selectable in the Knowledge Match stage. A selected source contributes its organization, product, posture, 15-anchor vector, verification requirements, questionnaire extensions, evidence requests, assessment trace, recommendation references, and project-export provenance.

Selecting a known source also prepopulates editable product, flavor, installation, flow, routing, provider, and model/service fields. Generated IDs are deterministic slugs and can be revised by the human operator before YAML generation.

Versioned autofill migration replaces legacy browser-saved builder remnants once for an existing selected source. Later human edits are preserved on reopen. The **Apply source to editable fields** action lets the operator deliberately regenerate the source-derived values at any time.

Source publications can prepopulate relevant controls as preliminary `failed` or `not_verified` results. Explicit unavailable, retaining, or non-ZDR postures generate failures; favorable or conditional claims remain unverified until customer-specific contract, configuration, and runtime evidence is supplied. Every default records its source ID, reason, truth class, and human-confirmation requirement.

Provider publications remain reference knowledge. They generate questions and evidence requests but cannot independently verify an installation.

## Run

Open `index.html` in a modern browser. The application has no server or external dependency and stores work locally in the browser.

## Capabilities

- Loads or edits current-state JSON
- Generates flavor-specific ZDR YAML for SAP, Salesforce, ServiceNow, Microsoft 365, custom applications or another named system
- Includes a standalone `flavor-yaml-builder.html` in addition to the builder embedded in the complete application
- Accepts flavor-specific YAML before assessment
- Detects the declared system, flavor and schema plus compatible legacy SAP/general flavors
- Automatically normalizes recognized flavor YAML into canonical As-is JSON
- Accepts flavor YAML on the As-is page and routes it through normalization instead of returning a JSON parse error
- Includes all 15 technology-neutral retention questions, system flow configuration and YAML export
- Merges flavor controls into the canonical as-is input and final determination
- Records confidence, detection signals and normalization trace
- Generates a partially populated canonical template for unknown flavors
- Preserves unmapped information and requires human review for ambiguity
- Evaluates storage, logs, model-provider retention, training use, deletion, backups and human access
- Produces machine-readable assessment JSON
- Identifies missing, failed and unverified ZDR controls with required actions
- Provides Back, Clear this section and Continue controls at every workflow stage
- Accepts proposals and requirements from model operators, product operators, clients and customers
- Maps future controls to current findings
- Produces a Markdown recommendation document
- Exports the complete project
- Runs as a self-contained browser application with no dependency on prior release folders
- Keeps observed, contracted, asserted and proposed information separate

Example inputs are provided as `current-state.example.json` and `future-state.example.json`.

## Determination rule

LoftSims evaluates each named data flow independently. “No model training” is not treated as Zero Data Retention, and future-state claims do not change an as-is determination until implementation and evidence are verified.

Unknown or probable flavors cannot silently receive a verified ZDR determination. Probable adapter matches require human confirmation; unknown flavors receive a canonical template for completion.

## Governance

`#HumansOnTop` — the human remains the originator, decision-maker and final authority.
