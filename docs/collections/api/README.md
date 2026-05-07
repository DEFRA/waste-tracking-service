# API

The OpenAPI specification for the extended Digital Waste Tracking API.
This workstream consumes the [scenarios](../scenarios/README.md) — every
endpoint shape has to support the events the scenarios produce — and
will eventually feed the [data model](../model/README.md).

## What is here

- `openapi.yaml` — the specification. A single OpenAPI 3.0.3 file
  covering the new endpoints alongside the Phase 1 receipt and reference
  data endpoints, preserved verbatim.

## Surface area

The current draft covers fourteen paths:

| Area | Paths |
|---|---|
| Movement lifecycle | `POST /movements/create`, `PUT /movements/{id}/create` |
| Static collection | `POST /movements/static-collection`, `PUT /movements/{id}/static-collection`, `GET /movements/{id}/static-collection` |
| Drop-off | `POST /movements/drop-off`, `PUT /movements/{id}/drop-off` |
| Receipt (Phase 1) | `POST /movements/receive`, `PUT /movements/{id}/receive` |
| Producer query | `GET /movements/{id}/fate-of-waste` |
| Reference data (Phase 1) | `GET /reference-data/ewc-codes`, `GET /reference-data/hazardous-property-codes`, `GET /reference-data/disposal-or-recovery-codes`, `GET /reference-data/container-types`, `GET /reference-data/pop-names` |

Phase 1 endpoints are kept exactly as published. The single addition to
their behaviour is an optional `transferId` field on the receipt request
body, which links a receipt to an upstream drop-off when the carrier has
recorded one. The Phase 1 default behaviour — receipt without an upstream
record — is preserved.

## Status

The spec is in alpha and being iterated alongside scenario and data-model
work. Several schemas (waste classification, hazardous codes, POPs codes,
party details) are deliberately permissive placeholders pending domain
detail from the BA. A number of design points are still open and tracked
in the [decisions register](../decisions.md).

The vocabulary used across the spec — Movement ID, Transfer ID, the
per-event IDs, what counts as a broker — is documented in the
[glossary](../glossary.md).

## Previewing the spec

The YAML can be previewed in any standard OpenAPI tool. Two options:

- **[Swagger Editor](https://editor.swagger.io)** — paste the contents
  of `openapi.yaml` to get a rendered Swagger UI on the right.
- **VS Code** — the OpenAPI (Swagger) Editor extension by 42Crunch adds
  a preview pane that updates live as the YAML is edited.

When the spec stabilises, an inline rendering on the docs site will
follow.
