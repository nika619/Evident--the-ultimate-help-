# ⚡ Evident — Code-Grounded Career Intelligence Engine

> **Built for the RevenueCat Shipathon 2026 (Devpost — Next Gen Student Track)**  
> *"Your resume should describe what you can prove. Evident remembers what you have done. Apply knows when it matters."*  
> **Brand:** **Evident** • *"Don't Claim It. Prove It."*

---

## 💡 The Core Problem: Absence of Evidence, Not Absence of Work

Students and early career builders rarely have an absence-of-work problem:
- They have 5 GitHub repositories, 3 hackathons, college capstones, pull requests, and late-night prototypes.
- But all of that work is scattered across branches, files, and commits.
- When an internship or job posting appears, they either generate generic, hallucinated buzzwords with ChatGPT (*"Architected scalable cloud microservices"* without any evidence) or undersell what they actually built.

**Evident replaces AI hallucination with verifiable technical provenance.**

Instead of:
```
Job Description ──> Generative AI ──> Generic Hallucinated Resume
```

Evident establishes:
```
Student's Actual Code & Commits
          │
          ▼
     PROOF ENGINE
          │
          ▼
   Relational Evidence
          │
          ▼
    Target Opportunity
          │
          ▼
     APPLY ENGINE
          │
          ▼
Grounded Resume (1-Tap Provenance Inspector)
          │
          ▼
 Architectural Defense Simulator
```

---

## 🏛️ The 5-Dimensional Evidence Model

Rather than conflating confidence into a single subjective number, Evident models technical evidence across 5 orthogonal dimensions:

1. **Evidence Status:**
   - `✓ Direct Source`: Explicit first-party implementation artifact (code, routes, logic).
   - `◐ Supported`: Documented in configs, manifests, or README architecture.
   - `◒ Partial`: Tangential or adjacent framework / paradigm.
   - `○ Evidence Gap`: No signal detected in repository history.
   - `✎ User-Declared`: Self-reported assertion, labeled transparently.
2. **Source Type:** `source_file`, `commit_history`, `dependency_manifest`, `api_route`, `manual_project`.
3. **Authorship Support:** Distinguishes `primary_author` from `collaborator` and `inherited_template`.
4. **Confidence:** `high`, `medium`, `low`.
5. **Freshness:** Preserves exact first and last observed commit dates.

---

## 🌟 The 3-Step Magic Loop

### 1. Living Evidence & Interactive Graph Explorer
- Automatically normalizes connected repositories (`RIFT`, `KALMAN`, `SYNTRA`).
- Extracts verifiable skills, files, and commits.
- Features an **Interactive Evidence Graph** visualizing how skills link directly to source files and commits.

### 2. Transparent Opportunity Matching
- Paste any job posting (e.g. *Software Engineering Intern — Core Systems*).
- Produces an honest **Evidence Coverage Matrix** (`5 Direct`, `2 Supported`, `1 Gap`) rather than arbitrary fake percentages (`87%`).

### 3. Application Studio & The "Why This Bullet?" Inspector (THE HERO)
- Synthesizes grounded resume bullets linked directly to retrieved evidence IDs.
- **1-Tap Evidence Inspector Drawer:** Tapping `[Why this claim?]` slides up the exact file path (`src/auth/middleware.ts`), matching commit SHA (`b81c44a`), and code snippet.
- **Architectural Defense Arena:** Generates technical interview questions derived directly from the candidate's files (e.g. *"Why did you choose database-backed token rotation in `src/auth/tokenRotation.ts` instead of server sessions?"*), evaluates their trade-off defense, and provides code citation tips.

---

## 💳 Deep RevenueCat Integration (Sponsor Showcase)

Evident is architected around **RevenueCat (`react-native-purchases`)**:

1. **Living Career Memory Entitlement (`proof_pro`):**
   - **Annual Career Pass:** `$49.99/year` (Featured with Save 48% ribbon).
   - **Monthly Career Sprint:** `$7.99/month` for active recruiting cycles.
   - **Value Proposition:** Pro transforms Evident from a one-time resume tool into a **Living Career Memory** that continuously monitors your repositories, indexes newly merged features, and keeps your evidence profile up to date as you push code.
2. **Official RevenueCat Test Store:**
   - Fully testable without requiring Apple App Store or Google Play sandbox credentials.
   - Real purchase lifecycle, entitlement listeners, and 1-tap restore.
   - Built-in **Reset to Free Tier** button so judges can test the upgrade flow repeatedly.

---

## 🧪 Verification & Automated Tests

Evident maintains a deterministic golden test suite verifying data integrity:

```bash
# Run automated test suite
npm test

# Run strict TypeScript compiler verification
npx tsc --noEmit
```

### Test Coverage Highlights:
- **`proofGraph.test.ts`:** Relational node connections, skill aggregation, and visual graph generation.
- **`matchingEngine.test.ts`:** Transparent coverage calculation, must-have ratios, project rankings, and grounded bullet synthesis.
- **`claimAuditor.test.ts`:** Anti-hallucination verification; asserts unsupported claims (e.g. Kubernetes, AWS) are flagged and rejected.
- **`interviewService.test.ts`:** Architectural probing generation and trade-off evaluation against actual candidate files.
- **`purchaseService.test.ts`:** RevenueCat Test Store purchases, customer entitlements, and restore state machine.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the Expo application
npm start

# Or run in Web browser
npm run web
```

---

## ⚖️ Open Source License

Distributed under the **MIT License**. See `LICENSE` for details.
