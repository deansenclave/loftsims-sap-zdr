# LoftSims General ZDR Readiness

LoftSims evaluates Zero Data Retention for any AI Technology product through a two-state workflow:

1. **As-is system state → Assessment JSON**
2. **Assessment JSON + future-state inputs → Recommendation document**

## Run

Open `index.html` in a modern browser. The application has no server or external dependency and stores work locally in the browser.

## Capabilities

- Loads or edits current-state JSON
- Evaluates storage, logs, model-provider retention, training use, deletion, backups and human access
- Produces machine-readable assessment JSON
- Accepts proposals and requirements from model operators, product operators, clients and customers
- Maps future controls to current findings
- Produces a Markdown recommendation document
- Exports the complete project
- Keeps observed, contracted, asserted and proposed information separate

Example inputs are provided as `current-state.example.json` and `future-state.example.json`.

## Determination rule

LoftSims evaluates each named data flow independently. “No model training” is not treated as Zero Data Retention, and future-state claims do not change an as-is determination until implementation and evidence are verified.

## Governance

`#HumansOnTop` — the human remains the originator, decision-maker and final authority.
