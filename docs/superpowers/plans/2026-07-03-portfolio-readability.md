# Portfolio Readability — Dark Content Column Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centered dark reading lane behind portfolio content so text is legible over the animated WebGL background after clicking PLAY.

**Architecture:** Single `background` gradient on `.portfolioContent` in `page.module.css` creates a dark column (transparent → dark → transparent left-to-right). Optional `backdrop-filter: blur(3px)` layers on top if needed. Zero JSX changes.

**Tech Stack:** CSS Modules (Next.js 14), no build step required.

## Global Constraints

- Do NOT modify `BalatroBackground` or its props in any way.
- Do NOT add any new JSX elements or modify `page.tsx`.
- Do NOT touch landing mode styles (hero, profile badge, socials, nav island).
- `.portfolioContent` is the only selector to change.
- Background must remain visible and animated through the column (opacity < 1).

---

### Task 1: Add dark content column to `.portfolioContent`

**Files:**
- Modify: `apps/personal-site/src/app/page.module.css` (`.portfolioContent` rule, line ~317)

**Interfaces:**
- Consumes: nothing
- Produces: `.portfolioContent` with a dark horizontal gradient background visible only in portfolio mode (the class is only active when `hasEnteredSite` is true)

- [ ] **Step 1: Open the file and locate `.portfolioContent`**

  Find this rule (around line 317):
  ```css
  .portfolioContent {
    position: relative;
    z-index: 2;
  }
  ```

- [ ] **Step 2: Add the dark column background**

  Replace with:
  ```css
  .portfolioContent {
    position: relative;
    z-index: 2;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(6, 12, 18, 0.72) 14%,
      rgba(6, 12, 18, 0.72) 86%,
      transparent 100%
    );
  }
  ```

- [ ] **Step 3: Start the dev server and verify visually**

  ```bash
  pnpm dev:site
  ```
  Open http://localhost:3001. Click PLAY. Scroll through all sections (intro, experience, projects, blogs, contact) and confirm:
  - Text is clearly readable against a dark center lane
  - The Balatro background colors glow visibly at the left and right edges
  - Landing screen (before clicking PLAY) looks identical to before — the gradient only applies inside `.portfolioContent` which is only rendered after PLAY

- [ ] **Step 4: If background color still bleeds through noticeably, add backdrop-filter**

  If the dark lane alone isn't enough (colorful bg too visible through 0.72 opacity), add blur:
  ```css
  .portfolioContent {
    position: relative;
    z-index: 2;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(6, 12, 18, 0.72) 14%,
      rgba(6, 12, 18, 0.72) 86%,
      transparent 100%
    );
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
  }
  ```
  Re-verify: background still visible at edges, text clearly readable.

- [ ] **Step 5: Check mobile (≤768px)**

  Resize browser to 375px wide. The content fills nearly full width so the gradient edges (~14% / ~86%) become thin soft fades — this is intentional and correct. Confirm text is readable.

- [ ] **Step 6: Commit**

  ```bash
  git add apps/personal-site/src/app/page.module.css
  git commit -m "feat: dark content column for portfolio readability"
  ```
