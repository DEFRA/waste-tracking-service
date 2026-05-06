# API specification

The OpenAPI specification for the extended Digital Waste Tracking API.

## Status

Not started. Will be worked on **after** the scenarios and data-model workstreams,
because the endpoint shapes are determined by the events the scenarios produce
and the entities the data model defines.

## Layout (to be defined)

Single OpenAPI 3.x YAML file initially, refactored into `$ref`'d components only
if it gets unwieldy.

## Source material

The existing `Receipt_API.yml` is the starting point. It defines:

- `POST /movements/receive` — receiver records waste arrival
- `PUT /movements/receive/{id}` — receiver updates a record
- Five `GET` endpoints for reference data (EWC, hazardous codes, disposal/recovery
  codes, container types, POP names)

The extension adds endpoints for the three other events (Create Movement,
Record Collection, Record Drop-off) and the producer's read-only query.
