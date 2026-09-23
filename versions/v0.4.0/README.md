# LoftSims Complete ZDR Readiness v0.4.0

This is the freestanding cumulative release. It contains every ZDR capability developed across v0.1.0 through v0.3.0 and does not depend on those historical folders.

LoftSims evaluates Zero Data Retention for any AI Technology product through a two-state workflow:

1. **Flavor-specific YAML → Flavor Checker**
2. **SAP flavor → 15-control SAP assessment**
3. **Recognized adapter, SAP controls or generated template → Canonical as-is JSON**
4. **As-is system state → Assessment JSON**
5. **Assessment JSON + future-state inputs → Recommendation document**

## Run

Open `index.html` in a modern browser. The application has no server or external dependency and stores work locally in the browser.

## Capabilities

- Loads or edits current-state JSON
- Accepts flavor-specific YAML before assessment
- Detects declared and signature-based SAP/general flavors
- Includes all 15 SAP retention questions, SAP flow configuration and SAP YAML export
- Merges the SAP module into the canonical as-is input and final determination
- Records confidence, detection signals and normalization trace
- Generates a partially populated canonical template for unknown flavors
- Preserves unmapped information and requires human review for ambiguity
- Evaluates storage, logs, model-provider retention, training use, deletion, backups and human access
- Produces machine-readable assessment JSON
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
