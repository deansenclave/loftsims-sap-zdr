# ZDR Market and Implementation Corpus

Snapshot date: **2026-09-24**

This corpus supports organizations evaluating or implementing Zero Data Retention (ZDR) for AI Technology products. It distinguishes contractual ZDR, technical non-persistence, training-use restrictions, configurable retention, product-level storage, and governance evidence.

## What is included

- AI model/API provider retention documentation
- Enterprise AI product and consuming-application claims
- ZDR configuration and implementation guidance
- AI governance and third-party assessment products
- Standards, regulations, control frameworks, and independent research

The machine-readable catalog is in [`source-manifest.yaml`](source-manifest.yaml). The catalog stores URLs and assessment metadata rather than copying third-party publications into this repository.

## Evidence classes

| Class | Meaning |
| --- | --- |
| `provider_primary` | Provider-owned product, policy, legal, or technical documentation |
| `regulatory_primary` | Official regulation or regulator material |
| `standards_primary` | Standards or control-framework publisher material |
| `independent_research` | Academic or independent comparative analysis |
| `commercial_assessment` | Product that inventories, assesses, governs, or monitors AI risk |

## ZDR claim taxonomy

| Claim | Treatment in an assessment |
| --- | --- |
| No training | Does not establish ZDR |
| Configurable deletion or retention period | Does not establish ZDR |
| `store=false` | Request-level evidence only; other logging paths remain in scope |
| No durable request/response storage | Technical ZDR evidence for the named service and flow |
| Contractual ZDR | Binding evidence only for named products, endpoints, regions, and exceptions |
| Downstream provider ZDR | Covers only the disclosed handoff; the consuming application still requires assessment |

## Highest-value market findings

1. OpenAI and Anthropic offer gated ZDR arrangements for eligible API features; their documentation lists features that remain ineligible or follow standard retention.
2. Google, AWS, Cohere, and Mistral document configurable or product-specific ZDR paths. Exact models, APIs, account settings, and feature exceptions matter.
3. Salesforce publishes a downstream-provider ZDR position for Einstein Trust Layer and Agentforce, while Salesforce audit and feedback features can persist separate data.
4. Microsoft 365 Copilot is not a ZDR product: prompts and responses are logged and retained for compliance, audit, eDiscovery, and lifecycle management.
5. SAP Joule materials describe product retention and privacy behavior; they do not establish universal ZDR for every SAP/Joule flow.
6. Governance platforms can collect evidence and manage controls, but their presence alone does not prove runtime ZDR.
7. The EU AI Act can require logs for some high-risk systems. A valid design may need content-minimized operational evidence rather than blanket elimination of every log.

## LoftSims ingestion guidance

Each source can map to LoftSims evidence with these rules:

- `claim_scope` becomes the assessed service boundary.
- `zdr_posture` is a lead, not a determination.
- `exceptions` generate mandatory follow-up controls.
- `verification` identifies evidence needed from the operator or customer.
- `assessment_impact` maps the publication to the relevant ZDR control family.
- Human review remains mandatory before a source changes an assessment status.

`#HumansOnTop` — human decision-makers retain final authority.
