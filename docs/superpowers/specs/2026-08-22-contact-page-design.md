# Contact Page — Design Spec
*2026-08-22*

## Goal

Add a standalone `/contact` route to `apps/personal-site` that:
- Reuses the full Balatro visual stack (WebGL background, pixel font, ambient card)
- Provides a "Send a message" form that delivers to `vsahu@uwaterloo.ca` via Resend
- Embeds Calendly inline for meeting bookings
- Is shareable as `varnitsahu.com/contact` from email signatures and LinkedIn

The existing `page.tsx` CONTACT section is updated to add a link to `/contact`.

---

## Architecture

### New files

| Path | Role |
|------|------|
| `apps/personal-site/src/app/contact/page.tsx` | Server component — metadata + layout shell |
| `apps/personal-site/src/app/contact/ContactClient.tsx` | `'use client'` — BalatroBackground, ambient Card, form state, Calendly embed |
| `apps/personal-site/src/app/contact/contact.module.css` | Page-specific CSS Modules |
| `apps/personal-site/src/app/api/contact/route.ts` | POST handler — validates input, calls Resend |

### Modified files

| Path | Change |
|------|--------|
| `apps/personal-site/src/app/page.tsx` | CONTACT section: add "Open full contact page →" link to `/contact` |
| `apps/personal-site/package.json` | Add `resend` dependency |

---

## `/contact` Page

### Server component (`page.tsx`)

Sets page metadata (`title: "Contact — Varnit Sahu"`) and renders `<ContactClient />`. No data fetching needed.

### Client component (`ContactClient.tsx`)

**Visual stack (matches main site):**
- `BalatroBackground` fills viewport (same props as `page.tsx`: default shader colors)
- `.vignette` overlay — identical CSS to main site
- `v1.0.0` version string top-right (fixed, same class/style as main site)
- Top-left: `← VARNITSAHU.COM` link (`href="/"`) styled as a small pill button using the `#4f6367` panel background

**Ambient card:**
- One `Card` rendered with `ambient` prop (continuous circular tilt orbit)
- Positioned absolutely top-right, partially off-screen, `pointer-events: none`
- Suit: `spades`, Rank: `A` (same as hero card on main site)

**Page content** (centered, scrollable, `max-width: 680px`, `margin: 0 auto`):

```
[top bar: ← VARNITSAHU.COM ................ v1.0.0]

             ♠ CONTACT

  ┌── SEND A MESSAGE panel ──────────────┐
  │  Name field                          │
  │  Email field                         │
  │  Message textarea (5 rows)           │
  │                       [SEND →]       │
  │  [success / error flash]             │
  └──────────────────────────────────────┘

  ┌── BOOK A MEETING panel ──────────────┐
  │  [Calendly inline embed]             │
  └──────────────────────────────────────┘

  vsahu@uwaterloo.ca · GitHub · LinkedIn
```

**Panel styling** — reuse established Balatro pattern:
- `background: rgba(10, 14, 26, 0.82)`, `border-radius: 12px`
- `box-shadow: 0 6px 0 #2e3d40, 0 8px 0 rgba(0,0,0,0.65)`
- `padding: 32px`

**Form fields** — dark inputs:
- `background: rgba(255,255,255,0.06)`, `border: 1px solid rgba(255,255,255,0.12)`
- `border-radius: 8px`, `color: #fff`, font: `m6x11plus`
- Focus ring: `border-color: #2A8840` (green, matching CONTACT nav button)

**Send button** — matches CONTACT nav button:
- `background: #2A8840`, `box-shadow: 0 5px 0 #0A5520`
- On hover: `translateY(-2px)`, shadow shrinks
- Disabled + spinner state while submitting

**Success flash:** green text "MESSAGE SENT ✓" fades in for 4 s then resets form
**Error flash:** red text "SOMETHING WENT WRONG — try vsahu@uwaterloo.ca"

**Calendly embed:**
- `<div className="calendly-inline-widget" data-url="TODO: paste your Calendly URL here" />`
- `<Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />`
- Widget height: `630px`
- Calendly dark theme via `&background_color=0a0e1a&text_color=ffffff&primary_color=2A8840` appended to `data-url`

---

## Email API (`/api/contact/route.ts`)

**Method:** `POST`

**Request body (JSON):**
```ts
{ name: string; email: string; message: string }
```

**Validation (server-side):**
- All three fields required, non-empty after trim
- `email` matches basic email regex
- `message` max 5000 chars
- Returns `400` with `{ error: string }` on failure

**Email delivery via Resend:**
```ts
resend.emails.send({
  from: 'Contact Form <contact@varnitsahu.com>',  // requires domain verified in Resend
  to: 'vsahu@uwaterloo.ca',
  replyTo: senderEmail,
  subject: `[varnitsahu.com] Message from ${name}`,
  text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
})
```

- Returns `200 { ok: true }` on success
- Returns `500 { error: 'Failed to send' }` on Resend error
- `RESEND_API_KEY` env var — loaded via `process.env.RESEND_API_KEY`

**Note on From address:** Resend's sandbox domain (`onboarding@resend.dev`) works immediately without DNS setup and is fine for development/early use. Switch to `contact@varnitsahu.com` after adding a TXT record to varnitsahu.com's DNS in Resend dashboard.

---

## Main site CONTACT section update

In `page.tsx`, inside the `#contact` section, add below the existing contactBox:

```tsx
<a href="/contact" className={styles.contactFullLink}>
  Open full contact page →
</a>
```

Styled as a small pill link (underline on hover, `color: #4ade80`).

---

## Environment variables

| Var | Where | Value |
|-----|-------|-------|
| `RESEND_API_KEY` | Vercel project + local `.env.local` | Key from resend.com dashboard |

Add to local dev: `echo "RESEND_API_KEY=re_..." >> apps/personal-site/.env.local`

---

## Dependency

```bash
pnpm add resend --filter personal-site
```

No other new dependencies. Calendly loads via CDN `<Script>`.

---

## Spec self-review

- No TBDs or placeholder sections
- Architecture matches all approved design decisions
- Calendly URL left as `TODO` — intentional, user must supply their own
- No rate limiting (YAGNI — single-person site)
- Sandbox Resend domain noted as acceptable initially
