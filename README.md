# Make a Parenting Plan – UR Prototype

A static HTML prototype for user research on the **handover and holidays** section of the "Make a parenting plan" service. Deployed to GitHub Pages from the `docs/` folder.

## What this is

This prototype tests three different interaction designs for how separated parents answer questions about:

- How children travel between households
- Where handovers take place
- Whether arrangements change during school holidays
- Items that go between households

### Designs

| Design | Approach |
|--------|----------|
| **Design 1** | Answer once for all children, with an option to add per-child overrides |
| **Design 2** | Task list — answer each question per child in turn |
| **Design 3** | Answer once for all children, with a radio to switch to per-child mode |

## Deployed prototype

The prototype is hosted on GitHub Pages at the URL configured for this repo. The entry point is `docs/index.html`, which lets you choose a design.

## Local development

No build step needed. Open `docs/index.html` in a browser, or serve it with any static file server:

```bash
npx serve docs
```

State is stored in `localStorage` under the key `cap-hh-prototype`. To reset state, clear localStorage in the browser devtools.

## Structure

```
docs/
├── index.html          # Design chooser
├── password.html       # Password gate
├── children.html       # Enter children's names
├── parents.html        # Enter parent names → routes to chosen design
├── design2/            # Design 2 pages
├── design3/            # Design 3 pages
└── assets/
    └── js/
        └── state.js    # Shared localStorage state helpers
```

## Password

The prototype is password-protected. Check with the team for the current password.

## Server (legacy)

The `server/` directory contains an Express/Nunjucks app inherited from the original CAP repo. It is not used for the UR prototype — the prototype runs entirely from static files in `docs/`.
