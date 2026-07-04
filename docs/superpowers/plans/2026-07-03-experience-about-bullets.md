# Experience Cards & About Section Bullet-Point Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the paragraph-heavy Experience cards with minimal logo+role+company grid cards, and replace the poetic About/intro prose with a recruiter-dense `◆`/`↳` bullet summary derived from real resume content.

**Architecture:** Both sections live in one client component file (`apps/personal-site/src/app/page.tsx`) styled via CSS Modules (`page.module.css`). No new components, no new dependencies, no routing changes. The `EXPERIENCE` array becomes the single source of truth: the Experience section renders it as cards, and the About section derives its "currently"/"previously" bullets from the same array (`EXPERIENCE[0]` vs `EXPERIENCE.slice(1)`).

**Tech Stack:** Next.js 14 (App Router, client component), React 18, TypeScript (strict), CSS Modules. No test runner exists in this app (`apps/personal-site/package.json` has no test script) — verification is `tsc --noEmit` for type safety plus manual dev-server checks in the browser, per this repo's convention for UI changes.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-03-experience-about-bullets-design.md` — follow it exactly for content/copy (highlight bullet text, logo slugs, structure).
- No new fonts, no new background styles — keep `m6x11plus` font and existing dark card panel look (`.introCard`, `rgba(0,0,0,0.55)` panel style) throughout.
- No `dangerouslySetInnerHTML` — bold text rendering must be done via a plain string-splitting helper.
- Logo images must degrade gracefully (hide, not break) if the asset file doesn't exist yet — user adds logo files separately, out of scope for this plan.
- Do not touch the Projects or Blogs sections, `BalatroBackground`, nav, or landing-mode markup.
- `@balatro/cards` package is unaffected — no changes to `packages/balatro-cards/`.

---

### Task 1: Data model, `renderBold` helper, and Experience section → minimal grid cards

**Files:**
- Modify: `apps/personal-site/src/app/page.tsx:1-76` (imports, `ExperienceEntry` interface, `EXPERIENCE` array)
- Modify: `apps/personal-site/src/app/page.tsx:313-335` (Experience section JSX)
- Modify: `apps/personal-site/src/app/page.module.css:436-499` (remove old `.expDetails`/`.expPanel*` rules, add new `.expGrid`/`.expLogoCard*` rules)
- Modify: `apps/personal-site/src/app/page.module.css:608-625` (responsive block: swap `.introText` mobile override for new About classes, add `.expGrid` mobile override)

**Interfaces:**
- Produces: `ExperienceEntry` with fields `{ id, rank, suit, company, role, logo, highlight }` (no `description`) — Task 2 consumes `EXPERIENCE[0]`, `EXPERIENCE.slice(1)`, and each entry's `.company`, `.role`, `.highlight`.
- Produces: `function renderBold(text: string): ReactNode[]` — Task 2 consumes this to render `highlight` strings with `**bold**` spans converted to `<strong>`.

- [ ] **Step 1: Update the `ReactNode` import**

In `apps/personal-site/src/app/page.tsx`, change line 3 from:

```tsx
import { useState, useEffect } from 'react'
```

to:

```tsx
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
```

- [ ] **Step 2: Replace the `ExperienceEntry` interface and `EXPERIENCE` array**

Replace this block (current lines 31-76):

```tsx
interface ExperienceEntry {
  id: string; rank: string; suit: string
  company: string; role: string
  description: string
}
interface ProjectEntry {
  id: string; rank: string; suit: string
  title: string; description: string; slug: string
}
interface BlogEntry {
  id: string; rank: string; suit: string
  title: string; date: string; slug: string
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'exp-1', rank: 'A', suit: 'diamonds',
    company: 'PlayStation (Sony)', role: 'Software Engineering Intern',
    description: 'PlayStation Store & Checkout team — digital commerce for 129M+ monthly users.',
  },
  {
    id: 'exp-2', rank: 'K', suit: 'diamonds',
    company: 'Nokia', role: 'Software Developer (Co-op)',
    description: 'NetGuard Cybersecurity Dome — automated cloud provisioning & agent orchestration.',
  },
  {
    id: 'exp-3', rank: 'Q', suit: 'diamonds',
    company: 'University of Waterloo', role: 'Undergraduate Researcher',
    description: 'Deep learning validation tooling & the QuackIR IR toolkit.',
  },
  {
    id: 'exp-4', rank: 'J', suit: 'diamonds',
    company: 'Nokia', role: 'AI/ML Engineering Intern',
    description: 'Autonomous Networks — closed-loop control plane for self-healing networks.',
  },
  {
    id: 'exp-5', rank: '10', suit: 'diamonds',
    company: 'Savi Finance', role: 'Software Engineer Intern',
    description: 'Investment-planning platform helping young investors save on fees.',
  },
  {
    id: 'exp-6', rank: '9', suit: 'diamonds',
    company: 'WAT.ai', role: 'Machine Learning Engineer',
    description: 'Drilling-regime anomaly detection with unsupervised ML.',
  },
]
```

with:

```tsx
interface ExperienceEntry {
  id: string; rank: string; suit: string
  company: string; role: string
  logo: string; highlight: string
}
interface ProjectEntry {
  id: string; rank: string; suit: string
  title: string; description: string; slug: string
}
interface BlogEntry {
  id: string; rank: string; suit: string
  title: string; date: string; slug: string
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'exp-1', rank: 'A', suit: 'diamonds',
    company: 'PlayStation (Sony)', role: 'Software Engineering Intern',
    logo: '/logos/playstation.svg',
    highlight: 'Optimizing digital checkout & commerce for **129M+** monthly active users',
  },
  {
    id: 'exp-2', rank: 'K', suit: 'diamonds',
    company: 'Nokia', role: 'Software Developer (Co-op)',
    logo: '/logos/nokia.svg',
    highlight: 'Cut infra provisioning time **from 2 weeks to 3 hours** automating Terraform on GCP',
  },
  {
    id: 'exp-3', rank: 'Q', suit: 'diamonds',
    company: 'University of Waterloo', role: 'Undergraduate Researcher',
    logo: '/logos/uwaterloo.svg',
    highlight: 'Built PyTorch vs ONNX validation framework for deep learning model deployment',
  },
  {
    id: 'exp-4', rank: 'J', suit: 'diamonds',
    company: 'Nokia', role: 'AI/ML Engineering Intern',
    logo: '/logos/nokia.svg',
    highlight: 'Architected a closed-loop control plane supporting **10K+** concurrent network ops',
  },
  {
    id: 'exp-5', rank: '10', suit: 'diamonds',
    company: 'Savi Finance', role: 'Software Engineer Intern',
    logo: '/logos/savi-finance.svg',
    highlight: 'Shipped GraphQL microservices to **1,000+** weekly active users',
  },
  {
    id: 'exp-6', rank: '9', suit: 'diamonds',
    company: 'WAT.ai', role: 'Machine Learning Engineer',
    logo: '/logos/wat-ai.svg',
    highlight: 'Cut anomaly-detection false positives by **27%** with unsupervised ML',
  },
]
```

- [ ] **Step 3: Add the `renderBold` helper**

Directly after the `SPRING` constant (current line 107, `const SPRING = { type: 'spring' as const, stiffness: 220, damping: 28 }`), add:

```tsx
function renderBold(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}
```

- [ ] **Step 4: Rewrite the Experience section JSX**

Replace this block (current lines 313-335):

```tsx
              {/* ── EXPERIENCE ────────────────────────────────────────── */}
              <section id="experience" className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.suit}>♦</span> EXPERIENCE
                </h2>
                <p className={styles.sectionHint}>Click a card to jump to that role.</p>
                <CardFan items={experienceFan} cardWidth={150} cardHeight={210} fanAngle={18} />

                <div className={styles.expDetails}>
                  {EXPERIENCE.map((exp, i) => (
                    <div key={exp.id} id={`exp-detail-${exp.id}`} className={styles.expPanel}>
                      <div className={styles.expPanelHeader}>
                        <span className={styles.expRank}>{exp.rank}♦</span>
                        <div>
                          <p className={styles.expCompany}>{exp.company}</p>
                          <p className={styles.expMeta}>{exp.role}</p>
                        </div>
                      </div>
                      <p className={styles.expDesc}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
```

with:

```tsx
              {/* ── EXPERIENCE ────────────────────────────────────────── */}
              <section id="experience" className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.suit}>♦</span> EXPERIENCE
                </h2>
                <p className={styles.sectionHint}>Click a card to jump to that role.</p>
                <CardFan items={experienceFan} cardWidth={150} cardHeight={210} fanAngle={18} />

                <div className={styles.expGrid}>
                  {EXPERIENCE.map((exp) => (
                    <div key={exp.id} id={`exp-detail-${exp.id}`} className={styles.expLogoCard}>
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className={styles.expLogo}
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                      <p className={styles.expCardRole}>{exp.role}</p>
                      <p className={styles.expCardCompany}>{exp.company}</p>
                    </div>
                  ))}
                </div>
              </section>
```

- [ ] **Step 5: Replace the old Experience CSS with grid-card CSS**

In `apps/personal-site/src/app/page.module.css`, replace this block (current lines 436-499, the full `/* ── EXPERIENCE section ── */` block through `.expDesc`):

```css
/* ── EXPERIENCE section ── */
.expDetails {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 780px;
  margin-top: 32px;
}

.expPanel {
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 28px 32px;
  scroll-margin-top: 100px;
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.5);
  transition: border-color 0.2s;
}

.expPanel:hover {
  border-color: rgba(184, 120, 34, 0.4);
}

.expPanelHeader {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 16px;
}

.expRank {
  font-family: 'm6x11plus', monospace;
  font-size: 28px;
  color: #c9912a;
  text-shadow: 0 2px 0 rgba(0,0,0,0.8);
  line-height: 1;
  flex-shrink: 0;
  padding-top: 2px;
}

.expCompany {
  font-family: 'm6x11plus', monospace;
  font-size: 26px;
  color: #fff;
  margin: 0;
  letter-spacing: 1px;
}

.expMeta {
  font-family: 'm6x11plus', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 4px 0 0;
  letter-spacing: 0.5px;
}

.expDesc {
  font-family: 'm6x11plus', monospace;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 16px;
  line-height: 1.8;
}
```

with:

```css
/* ── EXPERIENCE section ── */
.expGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 780px;
  margin-top: 32px;
}

.expLogoCard {
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-margin-top: 100px;
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.5);
  transition: border-color 0.2s, transform 0.1s;
}

.expLogoCard:hover {
  border-color: rgba(184, 120, 34, 0.4);
  transform: translateY(-2px);
}

.expLogo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.expCardRole {
  font-family: 'm6x11plus', monospace;
  font-size: 18px;
  color: #fff;
  margin: 0;
  letter-spacing: 0.5px;
}

.expCardCompany {
  font-family: 'm6x11plus', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
  letter-spacing: 0.5px;
}
```

- [ ] **Step 6: Add the `.expGrid` mobile override**

In `apps/personal-site/src/app/page.module.css`, in the `@media (max-width: 768px)` block (current lines 609-625), change:

```css
  .cardGrid { grid-template-columns: 1fr; }
}
```

to:

```css
  .cardGrid { grid-template-columns: 1fr; }
  .expGrid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 7: Type-check**

Run: `pnpm --filter personal-site exec tsc --noEmit`
Expected: No errors. (If you see an error about `.introText` being referenced with a missing mobile rule, that's addressed in Task 2 — this task only touches Experience code, so it should be clean on its own.)

- [ ] **Step 8: Visual check**

Run: `pnpm dev:site` (starts on `http://localhost:3001`), open in browser, click PLAY, scroll to the EXPERIENCE section.
Expected: 6 cards in a responsive grid (not a stacked full-width list). Each card shows only a role title (bold white) and company name (muted) — no paragraph description. Since logo files don't exist yet, no broken-image icon should appear (the `onError` handler hides it) — this is expected and correct.

- [ ] **Step 9: Commit**

```bash
git add apps/personal-site/src/app/page.tsx apps/personal-site/src/app/page.module.css
git commit -m "$(cat <<'EOF'
refactor: minimal logo/role/company grid cards for Experience section

Replaces the single-paragraph stacked panels with a scannable grid,
matching the recruiter-readable bullet-point redesign spec.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: About section → recruiter-dense bullet summary

**Files:**
- Modify: `apps/personal-site/src/app/page.tsx:298-305` (the two `.introText` prose paragraphs)
- Modify: `apps/personal-site/src/app/page.module.css:427-434` (remove `.introText`, add `.aboutBullets`/`.aboutBullet`/`.aboutSubBullet`/`.aboutBulletIcon`/`.aboutSubBulletIcon`/`.aboutCompany`)
- Modify: `apps/personal-site/src/app/page.module.css:608-625` (responsive block: swap `.introText { font-size: 15px; }` for `.aboutBullet`/`.aboutSubBullet` overrides)

**Interfaces:**
- Consumes: `ExperienceEntry[]` (`EXPERIENCE` from Task 1, fields `.company`, `.role`, `.highlight`), `function renderBold(text: string): ReactNode[]` (from Task 1).

- [ ] **Step 1: Replace the intro prose paragraphs**

In `apps/personal-site/src/app/page.tsx`, replace this block (current lines 298-305):

```tsx
                    <p className={styles.introText}>
                      Four suits.<br />
                      Each one a round of shipped code, sharp deadlines,<br />
                      and problems nobody warned me about.
                    </p>
                    <p className={styles.introText}>
                      The hand is dealt. Scroll to see how it played.
                    </p>
```

with:

```tsx
                    <div className={styles.aboutBullets}>
                      <p className={styles.aboutBullet}>
                        <span className={styles.aboutBulletIcon}>◆</span>
                        Computer Science, AI Specialization — University of Waterloo
                      </p>
                      <p className={styles.aboutBullet}>
                        <span className={styles.aboutBulletIcon}>◆</span>
                        Currently: {EXPERIENCE[0].role} — <span className={styles.aboutCompany}>{EXPERIENCE[0].company}</span>
                      </p>
                      <p className={styles.aboutSubBullet}>
                        <span className={styles.aboutSubBulletIcon}>↳</span>
                        {renderBold(EXPERIENCE[0].highlight)}
                      </p>
                      <p className={styles.aboutBullet}>
                        <span className={styles.aboutBulletIcon}>◆</span>
                        Previously:
                      </p>
                      {EXPERIENCE.slice(1).map((exp) => (
                        <p key={exp.id} className={styles.aboutSubBullet}>
                          <span className={styles.aboutSubBulletIcon}>↳</span>
                          {' '}<span className={styles.aboutCompany}>{exp.company}</span> — {exp.role}: {renderBold(exp.highlight)}
                        </p>
                      ))}
                    </div>
```

- [ ] **Step 2: Replace `.introText` with the new bullet classes**

In `apps/personal-site/src/app/page.module.css`, replace this block (current lines 427-434):

```css
.introText {
  font-family: 'm6x11plus', monospace;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.9;
  margin: 0;
  letter-spacing: 0.3px;
}
```

with:

```css
.aboutBullets {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
}

.aboutBullet {
  font-family: 'm6x11plus', monospace;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin: 0;
  letter-spacing: 0.3px;
}

.aboutSubBullet {
  font-family: 'm6x11plus', monospace;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.6;
  margin: 0 0 0 28px;
  letter-spacing: 0.2px;
}

.aboutBulletIcon {
  color: #c9912a;
  margin-right: 8px;
}

.aboutSubBulletIcon {
  color: rgba(255, 255, 255, 0.4);
  margin-right: 6px;
}

.aboutCompany {
  font-weight: bold;
  text-decoration: underline;
  color: #fff;
}
```

- [ ] **Step 3: Update the mobile override**

In `apps/personal-site/src/app/page.module.css`, in the `@media (max-width: 768px)` block, change:

```css
  .introText { font-size: 15px; }
```

to:

```css
  .aboutBullet { font-size: 14px; }
  .aboutSubBullet { font-size: 13px; }
```

- [ ] **Step 4: Type-check**

Run: `pnpm --filter personal-site exec tsc --noEmit`
Expected: No errors — this also confirms Task 1's `renderBold` and the updated `ExperienceEntry` fields are being consumed correctly (no leftover reference to `.description` or `.introText` anywhere).

- [ ] **Step 5: Visual check**

Run: `pnpm dev:site`, open in browser, click PLAY, view the intro/About section (top of the portfolio content, before EXPERIENCE).
Expected: Education bullet, "Currently" bullet with a nested highlight line showing **129M+** in bold, "Previously" bullet followed by 5 nested lines each with a bolded metric (e.g. **2 weeks to 3 hours**, **10K+**, **1,000+**, **27%**) and the company name bold+underlined. No leftover "Four suits" text.

- [ ] **Step 6: Commit**

```bash
git add apps/personal-site/src/app/page.tsx apps/personal-site/src/app/page.module.css
git commit -m "$(cat <<'EOF'
refactor: recruiter-dense bullet summary for About section

Replaces poetic prose with a diamond/arrow bullet list derived from
the EXPERIENCE array (single source of truth), surfacing real
quantified highlights from the resume instead of flavor text.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Full verification

**Files:** None (verification only).

- [ ] **Step 1: Full type-check**

Run: `pnpm --filter personal-site exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Production build**

Run: `pnpm --filter personal-site build`
Expected: Build succeeds with no errors (confirms no stray references to removed CSS classes or fields anywhere else in the app, e.g. other pages/components importing from `page.tsx`).

- [ ] **Step 3: Full manual browser pass**

Run: `pnpm dev:site`, open `http://localhost:3001` in a browser.
- Click PLAY to enter portfolio mode.
- Confirm the About section shows the bullet list (not prose) with correct bold metrics.
- Scroll to EXPERIENCE, confirm the grid of 6 minimal cards renders with no console errors (check browser devtools console — `onError` on the `<img>` tags should fail silently, not throw).
- Click a card in the `CardFan` above the grid, confirm it still scrolls to the matching card via `id="exp-detail-<id>"` (unchanged behavior from before this plan).
- Resize the browser to a narrow (mobile) width, confirm both sections collapse to single-column layouts without overflow.

Expected: All checks pass, no regressions to CardFan click-to-scroll or nav behavior.

- [ ] **Step 4: Report completion**

No commit needed for this task (verification only) — summarize to the user that both sections are live in `dev` and ready for them to drop in logo assets at `public/logos/{playstation,nokia,uwaterloo,savi-finance,wat-ai}.svg`.
