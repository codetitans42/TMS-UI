# UI Architecture

The UI should provide modular experiences for CRM, package, itinerary, quotation, booking, invoicing, support, and configuration flows.

## Production Requirements

- server-aware rendering strategy
- typed API client boundaries
- route-level authorization
- accessible design primitives
- bundle and error observability
- form validation and retry-safe submissions
- responsive support for desktop and mobile operations
- end-to-end smoke coverage for critical journeys

## Delivery Guardrails

- require pull requests for `dev`, `stage`, and `prod`
- keep automated review and CI checks green before promotion
