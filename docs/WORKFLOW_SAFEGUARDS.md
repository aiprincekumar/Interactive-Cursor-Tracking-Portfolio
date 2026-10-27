# GitHub Actions Workflow Architecture & Safeguards Standard

> **Document Type:** Operational & CI/CD Governance Specification  
> **Repository:** [`interactive-cursor-tracking-portfolio`](https://github.com/aiprincekumar/interactive-cursor-tracking-portfolio)  
> **Status:** Active & Enforced by Automated Verification Gate (`scripts/verify_single_workflow_guard.mjs`)  

---

## 🏛️ 1. Single Workflow Invariant (एकल वर्कफ़्लो नियम)

In accordance with user directives and repository architecture:
- **Strict Single Workflow Constraint:** The directory `.github/workflows/` must contain **EXACTLY ONE** workflow file:
  - [`deploy.yml`](file:///.github/workflows/deploy.yml) (`name: Deploy to GitHub Pages`)
- **No Secondary CI/CD Workflows:** All test suites, linting, stress harnesses, and E2E verifications are executed **locally** prior to committing, managed by `npm test`, `npm run lint`, and dedicated test harnesses. No extraneous CI workflows, test runners, or matrix builders may be committed to `.github/workflows/`.
- **Enforcement Gate:** The automated test `scripts/verify_single_workflow_guard.mjs` runs on every `npm test`. If any second `.yml` or `.yaml` file is introduced into `.github/workflows/`, the test suite fails immediately with exit code 1.

---

## 🚀 2. Deploy Workflow Specification (`deploy.yml`)

The sole permitted workflow handles automated building and deployment to GitHub Pages (or custom domain):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'changes_log/**'
      - 'docs/**'
      - 'documentation/**'
      - 'documents/**'
      - 'vibe_coding_temp/**'
      - '.agents/**'
      - '.claude/**'
      - '.gemini/**'
      - '*.md'
      - 'LICENSE'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🛡️ 3. Why Did Many Runs Appear in GitHub Actions? (अक्सर भ्रम की वजह)

1. **Workflow vs. Workflow Runs (वर्कफ़्लो बनाम वर्कफ़्लो रन):**
   - In GitHub's web interface, under the **Actions** tab, GitHub displays the execution history ("Workflow Runs") of every commit pushed to the repository.
   - When AI agents or developers push commits frequently, each commit creates an entry in the list with its commit message.
   - This leads to the impression that "many workflows" are active, whereas there is actually **only one workflow definition** executing repeatedly.
2. **Noise Prevention via `paths-ignore`:**
   - To prevent documentation, log audit (`changes_log`), and memory sync (`memory.md`) commits from flooding the Actions tab, `paths-ignore` is strictly configured.
   - Deployments will now only trigger when actual application code (`src/`, `public/`, `package.json`, `vite.config.js`, etc.) is updated.
3. **Concurrency Control (`cancel-in-progress: true`):**
   - If multiple commits occur rapidly, pending runs are automatically superseded by the latest build, eliminating redundant queued runs.
