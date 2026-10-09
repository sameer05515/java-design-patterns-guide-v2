# Java Design Patterns Study Guide — V3 (Microservices)

Static learning app built with HTML, Alpine.js, Tailwind CSS, Marked, and highlight.js.

## Run
1. Extract the ZIP.
2. In this folder run `python -m http.server 5500`.
3. Open http://localhost:5500.

Internet access is required for CDN libraries.

## Content
- 23 classic Gang of Four patterns.
- Additional Null Object idiom.
- 15 microservices patterns and resilience/data-integration patterns:
  API Gateway, Service Discovery, Circuit Breaker, Saga, CQRS, Event Sourcing, Bulkhead, Retry, Timeout, Transactional Outbox, Database per Service, Strangler Fig, Rate Limiting, Idempotent Consumer, Anti-Corruption Layer.
- For each pattern: intent, problem solved, structure, Java/Spring example, scenario, trade-offs, related patterns, and interview self-check questions.
- Search and category filtering; code copy; syntax highlighting.

## Notes
Examples are concise learning snippets. Pseudocode is labeled where appropriate. Some Spring examples require the relevant dependency and configuration. CDN use is intended for a learning demo; production apps should bundle dependencies locally.
