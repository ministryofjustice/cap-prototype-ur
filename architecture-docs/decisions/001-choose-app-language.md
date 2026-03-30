# Choose app language

Date: 2025-01-27

## Status

✅ Accepted

## Context

We need a language to write the server in. It should be well known, have support for the GOV.UK Design System, and match existing patterns at MoJ.

## Considerations

The server is straightforward — it needs to serve web pages and manage sessions.

#### Python

A Python app using Django would work. It doesn't have native support for the GOV.UK Design System; this needs separate configuration. There are examples on the MoJ GitHub.

#### JavaScript/TypeScript

A Node.js/Express app natively supports the GOV.UK Design System. There are template repositories for this pattern on the MoJ GitHub that closely match our use case. It is a common, well-supported pattern across MoJ.

TypeScript is preferred over plain JavaScript — the type safety outweighs the small inconvenience of transpilation.

## Decision

We will use Node.js with Express and TypeScript. Nunjucks is used for server-side templating, consistent with GOV.UK Design System conventions.
