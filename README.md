# LoftSims General ZDR Readiness

## Version folders

Every released milestone is preserved in its own subfolder:

| Version | Scope | Folder |
| --- | --- | --- |
| v0.1.0 | SAP-specific ZDR assessment | [`versions/v0.1.0/`](versions/v0.1.0/) |
| v0.2.0 | General two-state ZDR assessment and recommendation engine | [`versions/v0.2.0/`](versions/v0.2.0/) |
| v0.3.0 | YAML Flavor Checker and canonical ingestion gateway | [`versions/v0.3.0/`](versions/v0.3.0/) |
| v0.4.0 | Complete freestanding release: flavor YAML builder → checker → assessment → missing controls → recommendation | [`versions/v0.4.0/`](versions/v0.4.0/) |
| v0.5.0 | Validated YAML handoff, 15-control normalization, and bidirectional workflow navigation | [`versions/v0.5.0/`](versions/v0.5.0/) |
| v0.6.0 | 38-source corpus, 15-anchor vectors, system confirmation, and tailored questionnaires | [`versions/v0.6.0/`](versions/v0.6.0/) |
| v0.6.1 | Editable source-derived identifiers, preliminary anchor defaults, stale-state migration, and source reapply | [`versions/v0.6.1/`](versions/v0.6.1/) |
| v0.6.2 | System-type and corpus-source autofill for all essential editable identifiers | [`versions/v0.6.2/`](versions/v0.6.2/) |
| v0.6.3 | Selected-source ZDR feature activation limitations in YAML, assessment, and recommendations | [`versions/v0.6.3/`](versions/v0.6.3/) |

The files at the repository root represent v0.3.0. The current cumulative testing target is **v0.6.3** in its version folder.

## Release policy

Published version folders are immutable snapshots. Enhancements use a new patch folder such as `v0.6.1`, `v0.6.2`, or `v0.6.11`. After testing, a selected patch can be declared the stable release for its main version line.

LoftSims evaluates Zero Data Retention for any AI Technology product through a two-state workflow:

1. **Flavor-specific YAML → Flavor Checker**
2. **Recognized adapter or generated template → Canonical as-is JSON**
3. **As-is system state → Assessment JSON**
4. **Assessment JSON + future-state inputs → Recommendation document**

## Run

Open `index.html` in a modern browser. The application has no server or external dependency and stores work locally in the browser.

To run a specific historical version, open its `index.html` file inside the corresponding version folder.

## Capabilities

- Loads or edits current-state JSON
- Accepts flavor-specific YAML before assessment
- Detects declared and signature-based SAP/general flavors
- Records confidence, detection signals and normalization trace
- Generates a partially populated canonical template for unknown flavors
- Preserves unmapped information and requires human review for ambiguity
- Evaluates storage, logs, model-provider retention, training use, deletion, backups and human access
- Produces machine-readable assessment JSON
- Accepts proposals and requirements from model operators, product operators, clients and customers
- Maps future controls to current findings
- Produces a Markdown recommendation document
- Exports the complete project
- Keeps observed, contracted, asserted and proposed information separate

Example inputs are provided as `current-state.example.json` and `future-state.example.json`.

## Research corpus

The [`research/zdr-market-corpus/`](research/zdr-market-corpus/) folder catalogs provider ZDR documentation, enterprise-product behavior, commercial governance products, standards, regulation, and independent research. Its YAML manifest is designed for future LoftSims evidence ingestion.

## Determination rule

LoftSims evaluates each named data flow independently. “No model training” is not treated as Zero Data Retention, and future-state claims do not change an as-is determination until implementation and evidence are verified.

Unknown or probable flavors cannot silently receive a verified ZDR determination. Probable adapter matches require human confirmation; unknown flavors receive a canonical template for completion.

## Governance

`#HumansOnTop` — the human remains the originator, decision-maker and final authority.
