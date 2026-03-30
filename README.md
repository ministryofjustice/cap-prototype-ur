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
├── design1/            # Design 1 pages
├── design2/            # Design 2 pages
├── design3/            # Design 3 pages
└── assets/
    └── js/
        └── state.js    # Shared localStorage state helpers
```

## Password

The prototype is password-protected. Check with the team for the current password.

## Server

The `server/` directory contains an Express/Nunjucks app, inherited from the original CAP repo. It is deployed to MoJ Cloud Platform to provide a hosted version of the prototype with server-side session management.

To run it locally:

```bash
npm install
npm run start:dev        # with hot-reload, uses .env
# or
docker compose up        # starts the app and a Redis instance together
```

The app runs at [http://localhost:8001](http://localhost:8001).

## Deployment

### GitHub Pages (static prototype)

The `docs/` folder deploys automatically to GitHub Pages on every push to `main`. No configuration needed.

### MoJ Cloud Platform (Express server)

The server deploys automatically on every push to `main` via GitHub Actions:

1. Validate (lint, types, unit tests)
2. Build and push Docker image to AWS ECR
3. Deploy to **development**
4. Deploy to **staging**

To trigger a manual deploy, use the [Deploy release directly to Cloud Platform](../../actions/workflows/release-trigger.yml) workflow from the Actions tab.

#### GitHub secrets required

Each GitHub environment (`development`, `staging`) needs:

| Secret | Description |
|---|---|
| `KUBE_NAMESPACE` | Cloud Platform namespace (e.g. `cap-prototype-ur-development`) |
| `KUBE_CLUSTER` | Cluster hostname |
| `KUBE_CERT` | Cluster CA certificate |
| `KUBE_TOKEN` | Service account token |
| `ECR_ROLE_TO_ASSUME` | AWS IAM role ARN for ECR access |
| `SESSION_SECRET` | Secret for signing Express sessions |
| `BETA_ACCESS_PASSWORDS` | Comma-separated access passwords |
| `HASH_SECRET` | Secret for hashing |
| `BASIC_AUTH_USER` | Basic auth username (set to `no-basic-auth` to disable) |
| `BASIC_AUTH_PASS` | Basic auth password |

And these repository-level variables:

| Variable | Description |
|---|---|
| `ECR_REGION` | AWS region for ECR (e.g. `eu-west-2`) |
| `ECR_REPOSITORY` | ECR repository name |

Once deployed, the app is accessible at `https://<KUBE_NAMESPACE>.apps.live.cloud-platform.service.justice.gov.uk`.

#### Finding your namespace

Namespaces are provisioned via the [`cloud-platform-environments`](https://github.com/ministryofjustice/cloud-platform-environments) repo. Look for a folder under `namespaces/live.cloud-platform.service.justice.gov.uk/` matching this repo name. If one hasn't been created yet, raise a PR there to provision it.

## Architecture decisions

Records of significant decisions are in [`architecture-docs/decisions/`](architecture-docs/decisions/).
