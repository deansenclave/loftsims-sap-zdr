#!/usr/bin/env python3
"""Build the browser-ready ZDR source catalog and sparse 15-anchor vectors."""
from pathlib import Path
import json
import yaml

ROOT = Path(__file__).resolve().parent
manifest = yaml.safe_load((ROOT / "source-manifest.yaml").read_text(encoding="utf-8"))

anchors = [
    ("A01", "content_retention", ("retention", "non_persistence", "session_state")),
    ("A02", "training_use", ("training_use", "training", "tuning")),
    ("A03", "abuse_monitoring", ("abuse_monitoring", "safety", "human_review")),
    ("A04", "service_identity", ("endpoint", "model_eligibility", "product_scope", "deployment_scope")),
    ("A05", "subprocessors", ("subprocessor", "third_party", "downstream", "supplier")),
    ("A06", "locations_and_residency", ("region", "residency", "service_boundary")),
    ("A07", "content_logging", ("logging", "audit_data", "observability")),
    ("A08", "metadata_and_redaction", ("redaction", "sensitive_data", "data_minimization")),
    ("A09", "secondary_storage", ("backup", "cache", "queue", "replica", "memory", "artifact")),
    ("A10", "logging_enforcement", ("technical_enforcement", "policy_enforcement", "runtime_configuration")),
    ("A11", "termination_deletion", ("deletion", "lifecycle")),
    ("A12", "deletion_propagation", ("propagation", "subprocessor")),
    ("A13", "binding_zdr", ("contractual_zdr", "gated_zdr", "binding", "eligibility")),
    ("A14", "contract_precedence", ("legal", "regulation", "compliance", "contract")),
    ("A15", "application_persistence", ("application_state", "application_storage", "product_storage", "persistent_storage")),
]

def vector(source):
    haystack = " ".join(str(source.get(k, "")) for k in (
        "title", "zdr_posture", "claim_scope", "exceptions", "verification", "assessment_impact"
    )).lower()
    result = {}
    for anchor_id, factor, signals in anchors:
        matched = sorted({signal for signal in signals if signal in haystack})
        result[anchor_id] = {
            "factor": factor,
            "coverage": "explicit" if matched else "not_covered",
            "posture": source.get("zdr_posture", "unknown") if matched else "unknown",
            "signals": matched,
        }
    return result

sources = []
for source in manifest["sources"]:
    item = dict(source)
    item["anchor_vector"] = vector(source)
    sources.append(item)

payload = {
    "schema": "loftsims.zdr.knowledge-corpus/v1",
    "release": "0.6.2",
    "snapshot_date": str(manifest["corpus"]["snapshot_date"]),
    "anchors": [{"id": i, "factor": f} for i, f, _ in anchors],
    "sources": sources,
}
(ROOT / "knowledge-corpus.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
(ROOT.parent / "zdr-knowledge-data.js").write_text(
    "window.LOFTSIMS_ZDR_KNOWLEDGE=" + json.dumps(payload, separators=(",", ":")) + ";\n",
    encoding="utf-8",
)
rows = ["# Captured ZDR Sources", "", f"Snapshot: {payload['snapshot_date']}", "", "| ID | Organization | Product | Category |", "| --- | --- | --- | --- |"]
for source in sources:
    rows.append(f"| `{source['id']}` | {source['organization']} | {source['product']} | {source['category']} |")
(ROOT / "SOURCES.md").write_text("\n".join(rows) + "\n", encoding="utf-8")
print(f"Built {len(sources)} source vectors across {len(anchors)} anchors")
