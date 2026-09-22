# LoftSims SAP ZDR Assessor

A simple browser-based interface for assessing Zero Data Retention across custom SAP AI Technology data flows.

## Run

Open `index.html` in a modern browser. No server, installation, account or external dependency is required.

## Capabilities

- Load an existing YAML assessment
- Answer all 15 SAP ZDR control questions
- Define the SAP-to-model processor chain
- Record evidence references
- Identify unresolved items and retention risks
- Export the completed assessment as YAML
- Keep assessment state locally in the browser

The tool evaluates ZDR per data flow and never treats “no model training” as equivalent to Zero Data Retention.

## Governance

`#HumansOnTop` — human approval remains the final authority for consequential SAP write-back.
