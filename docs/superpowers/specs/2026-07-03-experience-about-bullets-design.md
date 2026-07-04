# Experience Cards & About Section — Bullet-Point Redesign

**Date:** 2026-07-03
**Status:** Approved

## Problem

The current EXPERIENCE cards each render a single paragraph description, and the About/intro section is poetic prose ("Four suits. Each one a round of shipped code..."). Both read as text-heavy and low-contrast for a recruiter scanning quickly. The target is a denser, bullet-point style (reference: a resume-like card using ◆/↳ bullets, bold+underlined proper nouns, one line per fact) while keeping the site's existing pixel-font/card visual theme and the "one internship = one card" feel in the Experience section.

## Scope

- Experience section cards (`page.tsx` EXPERIENCE array + rendering, `page.module.css` `.expDetails`/`.expPanel`)
- About/intro section content (`page.tsx` intro `<section id="intro">`, `page.module.css` `.introText` etc.)

**Out of scope:** Projects section content/data (stays as current placeholders), location/date fields on Experience cards, company logo sourcing (user will drop asset files in `public/logos/` themselves).

## Content source

Real experience content (dates, locations, quantified bullets) came from the user's resume (LaTeX source, provided in conversation). Only one representative highlight bullet per role is used — see "About section content" below. No fabricated metrics; everything is drawn from the resume.

## Data model changes (`page.tsx`)

```ts
interface ExperienceEntry {
  id: string; rank: string; suit: string
  company: string; role: string
  logo: string       // e.g. '/logos/playstation.svg' — path convention, user adds files later
  highlight: string  // one bullet, supports **bold** markup for inline emphasis
}
```

- Remove the existing `description` field (unused once cards go minimal).
- `highlight` values (in EXPERIENCE array order, most-recent-first as today):
  1. PlayStation (Sony) — Software Engineering Intern: `Optimizing digital checkout & commerce for **129M+** monthly active users`
  2. Nokia — Software Developer (Co-op): `Cut infra provisioning time **from 2 weeks to 3 hours** automating Terraform on GCP`
  3. University of Waterloo — Undergraduate Researcher: `Built PyTorch vs ONNX validation framework for deep learning model deployment`
  4. Nokia — AI/ML Engineering Intern: `Architected a closed-loop control plane supporting **10K+** concurrent network ops`
  5. Savi Finance — Software Engineer Intern: `Shipped GraphQL microservices to **1,000+** weekly active users`
  6. WAT.ai — Machine Learning Engineer: `Cut anomaly-detection false positives by **27%** with unsupervised ML`

## Bold-text rendering helper

Add a small pure function (e.g. in `page.tsx` or a `lib/` util) that splits a string on `**...**` markers and returns an array of strings/`<strong>` nodes:

```ts
function renderBold(text: string): React.ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}
```

No `dangerouslySetInnerHTML` — content is static/developer-authored, but we still avoid raw HTML injection as a matter of habit.

## Experience section — minimal grid cards

Replace the stacked full-width `.expDetails`/`.expPanel` list with a responsive grid, reusing the existing `.cardGrid`/`.gridCard` pattern (already used for Projects/Blogs) for visual consistency and to avoid new CSS where existing patterns fit.

Each card shows only:
- Logo image, top-left. Rendered as a plain `<img src={exp.logo} onError={(e) => { e.currentTarget.style.display = 'none' }} />` so a missing/not-yet-added asset fails gracefully (hides instead of showing a broken-image icon or crashing).
- Role title (bold)
- Company name beneath it

No dates, location, or description text on the card itself. The `CardFan` above the grid and its click-to-scroll-to-card behavior are unchanged.

## About section — recruiter-dense bullet summary

Replaces the two `.introText` prose paragraphs ("Four suits..." / "The hand is dealt..."). Structure (using existing `◆` diamond and `↳` arrow as bullet markers, in the site's existing gold/amber accent for `◆` and muted white for `↳`, m6x11plus font throughout, no new fonts):

```
◆ Computer Science, AI Specialization — University of Waterloo
◆ Currently: Software Engineering Intern — PlayStation (Sony)
  ↳ Optimizing digital checkout & commerce for 129M+ monthly active users
◆ Previously:
  ↳ Nokia — Software Developer: Cut infra provisioning time from 2 weeks to 3 hours automating Terraform on GCP
  ↳ University of Waterloo — Undergrad Researcher: Built PyTorch vs ONNX validation framework for deep learning
  ↳ Nokia — AI/ML Engineering Intern: Architected a closed-loop control plane supporting 10K+ concurrent network ops
  ↳ Savi Finance — Software Engineer Intern: Shipped GraphQL microservices to 1,000+ weekly active users
  ↳ WAT.ai — Machine Learning Engineer: Cut anomaly-detection false positives by 27% with unsupervised ML
```

- The "Currently" and "Previously" blocks are derived directly from the `EXPERIENCE` array (`EXPERIENCE[0]` = currently, `EXPERIENCE.slice(1)` = previously) rather than duplicated as separate copy — single source of truth, no drift if EXPERIENCE changes.
- Company names rendered bold + underlined (matches reference image's proper-noun emphasis); role/connective text stays regular weight, muted.
- The existing `introName` ("VARNIT SAHU") and `introSub` ("Computer Engineering · University of Waterloo" — becomes the education bullet above) stay in place; only the two prose `<p>` blocks below the second divider are replaced by this bullet list.
- Container stays the existing `.introCard` dark panel with `✦`/`—` ornamental dividers — no new background/font, just restructured content per the "match site's pixel/card theme" decision.

## Files to change

- `apps/personal-site/src/app/page.tsx` — `ExperienceEntry` interface, `EXPERIENCE` array (`logo`/`highlight` fields), `renderBold` helper, Experience section JSX (grid cards), Intro section JSX (bullet list)
- `apps/personal-site/src/app/page.module.css` — new/adjusted classes for About bullets (`.aboutBullet`, `.aboutSubBullet` or similar) and Experience grid cards (reusing `.cardGrid`/`.gridCard`, adding a logo image style); remove now-unused `.expPanel`/`.expPanelHeader`/`.expRank`/`.expCompany`/`.expMeta`/`.expDesc` if fully superseded

## Assets

Logo files expected at `public/logos/<slug>.svg` (or `.png`) — user will add these separately. No logos are sourced or committed as part of this change.

Slug convention (same company reuses same file):

| Company | logo path |
|---|---|
| PlayStation (Sony) | `/logos/playstation.svg` |
| Nokia (both roles) | `/logos/nokia.svg` |
| University of Waterloo | `/logos/uwaterloo.svg` |
| Savi Finance | `/logos/savi-finance.svg` |
| WAT.ai | `/logos/wat-ai.svg` |

The `<img>` element tries `.svg` first per the `logo` field value; if the user prefers `.png`, they should update the `logo` path in the `EXPERIENCE` array to match the actual file extension they drop in.
