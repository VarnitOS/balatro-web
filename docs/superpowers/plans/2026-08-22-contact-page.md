# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `/contact` route with the full Balatro visual stack, a Resend-backed contact form, and an inline Calendly booking widget — shareable as `varnitsahu.com/contact` from email signatures.

**Architecture:** A Next.js App Router page at `app/contact/` splits into a thin server component (metadata) and a `'use client'` component (BalatroBackground, form state, Calendly embed). A separate `app/api/contact/route.ts` POST handler validates inputs and delivers email via Resend. The existing CONTACT section in `page.tsx` gets a link to `/contact`.

**Tech Stack:** Next.js 14 App Router, `resend` npm package, Calendly CDN widget, CSS Modules, `@balatro/cards` (`BalatroDeck`, `Card` with `ambient` prop), framer-motion (none needed here — static page).

**Spec:** `docs/superpowers/specs/2026-08-22-contact-page-design.md`

## Global Constraints

- Font: `m6x11plus` everywhere (inherited via `globals.css` `body` rule — no extra import needed)
- No Tailwind — CSS Modules only, matching existing `page.module.css` patterns
- Color palette: background `#0a0e1a`, panel shadow `#2e3d40`, green accent `#2A8840` / `#0A5520`, version string `rgba(255,255,255,0.55)`
- `resend` installed scoped to `personal-site`: `pnpm add resend --filter personal-site`
- Env var: `RESEND_API_KEY` in `apps/personal-site/.env.local` and Vercel project env
- Calendly URL: left as `TODO_REPLACE_WITH_YOUR_CALENDLY_URL` — user replaces before deploy
- From address: `onboarding@resend.dev` (Resend sandbox, works without DNS setup; switch to `contact@varnitsahu.com` post domain-verification)
- `pnpm dev:site` runs personal-site on `http://localhost:3001`

---

### Task 1: Resend dependency + API route

**Files:**
- Create: `apps/personal-site/src/app/api/contact/route.ts`
- Modify: `apps/personal-site/package.json` (via pnpm add)

**Interfaces:**
- Produces: `POST /api/contact` — accepts `{ name, email, message }` JSON body; returns `{ ok: true }` (200) or `{ error: string }` (400/500)

- [ ] **Step 1: Install Resend**

```bash
pnpm add resend --filter personal-site
```

Expected: `resend` appears in `apps/personal-site/package.json` dependencies.

- [ ] **Step 2: Add RESEND_API_KEY to local env**

Create `apps/personal-site/.env.local` (or append if it exists):

```
RESEND_API_KEY=re_YOUR_KEY_HERE
```

Get a free key from https://resend.com — free tier is 3,000 emails/month. No credit card required.

- [ ] **Step 3: Create the API route**

Create `apps/personal-site/src/app/api/contact/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, message } = body

  if (typeof name !== 'string' || !name.trim())
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })

  if (typeof message !== 'string' || !message.trim())
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  if (message.length > 5000)
    return NextResponse.json({ error: 'Message too long (max 5000 chars)' }, { status: 400 })

  try {
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: 'vsahu@uwaterloo.ca',
      replyTo: email.trim(),
      subject: `[varnitsahu.com] Message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Start dev server and test the API with curl**

In one terminal: `pnpm dev:site`

In another:

```bash
# Should return { "ok": true }
curl -s -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello!"}' | cat

# Should return 400 with error
curl -s -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"bad","message":""}' | cat
```

Expected first call: `{"ok":true}` (and email arrives in vsahu@uwaterloo.ca inbox).
Expected second call: `{"error":"Name is required"}`.

- [ ] **Step 5: Commit**

```bash
git add apps/personal-site/src/app/api/contact/route.ts apps/personal-site/package.json pnpm-lock.yaml
git commit -m "feat: add /api/contact email route via Resend"
```

---

### Task 2: Contact page styles

**Files:**
- Create: `apps/personal-site/src/app/contact/contact.module.css`

**Interfaces:**
- Produces: CSS class names consumed by `ContactClient.tsx` in Task 3

- [ ] **Step 1: Create the CSS module**

Create `apps/personal-site/src/app/contact/contact.module.css`:

```css
/* ── Root — fills viewport, allows scroll ── */
.root {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Vignette — identical to page.module.css ── */
.vignette {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse at center, transparent 38%, rgba(0, 0, 0, 0.72) 100%),
    linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 20%);
}

/* ── Version string — top right, matches main site ── */
.version {
  position: fixed;
  top: 10px;
  right: 14px;
  z-index: 20;
  font-size: 32px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.5px;
}

/* ── Back link — top left pill button ── */
.backLink {
  position: fixed;
  top: 16px;
  left: 20px;
  z-index: 20;
  background: #4f6367;
  border-radius: 9px;
  padding: 8px 16px 10px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  box-shadow: 0 4px 0 #2e3d40, 0 6px 0 rgba(0, 0, 0, 0.6);
  transition: transform 0.08s, box-shadow 0.08s;
  white-space: nowrap;
}

.backLink:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #2e3d40, 0 8px 0 rgba(0, 0, 0, 0.6);
}

/* ── Ambient card — decorative, top-right corner ── */
.ambientCard {
  position: fixed;
  top: -30px;
  right: -20px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.55;
}

/* ── Main content column ── */
.content {
  position: relative;
  z-index: 10;
  max-width: 680px;
  margin: 0 auto;
  padding: 100px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ── Page heading ── */
.heading {
  font-size: 52px;
  color: #fff;
  text-align: center;
  margin: 0;
  letter-spacing: 1px;
  font-weight: normal;
}

.suit {
  color: rgba(255, 255, 255, 0.35);
}

/* ── Panels (form + calendly) ── */
.panel {
  background: rgba(10, 14, 26, 0.82);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 6px 0 #2e3d40, 0 8px 0 rgba(0, 0, 0, 0.65);
}

.panelTitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px;
  letter-spacing: 0.5px;
  font-weight: normal;
}

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 16px;
  color: #fff;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.input:focus {
  border-color: #2A8840;
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

/* ── Form footer: flash message + send button ── */
.formFooter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.flashSuccess {
  font-size: 14px;
  color: #4ade80;
  flex: 1;
}

.flashError {
  font-size: 12px;
  color: #f87171;
  flex: 1;
}

/* ── Send button — matches CONTACT nav button style ── */
.sendBtn {
  background: #2A8840;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px 24px 12px;
  font-family: inherit;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 5px 0 #0A5520, 0 7px 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.08s, box-shadow 0.08s;
  white-space: nowrap;
}

.sendBtn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 7px 0 #0A5520, 0 9px 0 rgba(0, 0, 0, 0.5);
}

.sendBtn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 3px 0 #0A5520, 0 4px 0 rgba(0, 0, 0, 0.5);
}

.sendBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Direct contact links row ── */
.directLinks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 0;
  flex-wrap: wrap;
}

.directLink {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.15s;
}

.directLink:hover {
  color: #fff;
}

.sep {
  color: rgba(255, 255, 255, 0.3);
  font-size: 18px;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .content { padding: 90px 16px 60px; }
  .panel { padding: 24px 18px; }
  .heading { font-size: 38px; }
  .backLink { font-size: 13px; padding: 6px 12px 8px; }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/personal-site/src/app/contact/contact.module.css
git commit -m "feat: add contact page CSS module"
```

---

### Task 3: ContactClient component

**Files:**
- Create: `apps/personal-site/src/app/contact/ContactClient.tsx`

**Interfaces:**
- Consumes: `contact.module.css` classes from Task 2; `POST /api/contact` from Task 1; `BalatroBackground` from `@/components/BalatroBackground`; `BalatroDeck`, `Card` from `@balatro/cards`
- Produces: `export default function ContactClient()` — default export, no props

- [ ] **Step 1: Create ContactClient.tsx**

Create `apps/personal-site/src/app/contact/ContactClient.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { BalatroDeck, Card } from '@balatro/cards'
import type { BalatroCard } from '@balatro/cards'
import BalatroBackground from '@/components/BalatroBackground'
import styles from './contact.module.css'

const AMBIENT_CARD: BalatroCard = {
  id: 'ace-spades-contact', rank: 'A', suit: 'spades', facing: 'front',
}

type FormState = 'idle' | 'sending' | 'success' | 'error'

export default function ContactClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error()
      setFormState('success')
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setFormState('idle'), 4000)
    } catch {
      setFormState('error')
      setTimeout(() => setFormState('idle'), 4000)
    }
  }

  return (
    <BalatroDeck>
      <div className={styles.root}>
        <BalatroBackground />
        <div className={styles.vignette} />
        <span className={styles.version}>v1.0.0</span>

        <Link href="/" className={styles.backLink}>← VARNITSAHU.COM</Link>

        <div className={styles.ambientCard}>
          <Card card={AMBIENT_CARD} ambient />
        </div>

        <main className={styles.content}>
          <h1 className={styles.heading}>
            <span className={styles.suit}>♠</span> CONTACT
          </h1>

          {/* ── Send a message ── */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>SEND A MESSAGE</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                className={styles.input}
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={formState === 'sending'}
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={formState === 'sending'}
              />
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                required
                disabled={formState === 'sending'}
                maxLength={5000}
              />
              <div className={styles.formFooter}>
                {formState === 'success' && (
                  <span className={styles.flashSuccess}>MESSAGE SENT ✓</span>
                )}
                {formState === 'error' && (
                  <span className={styles.flashError}>
                    SOMETHING WENT WRONG — try vsahu@uwaterloo.ca
                  </span>
                )}
                <button
                  type="submit"
                  className={styles.sendBtn}
                  disabled={formState === 'sending'}
                >
                  {formState === 'sending' ? '...' : 'SEND →'}
                </button>
              </div>
            </form>
          </section>

          {/* ── Book a meeting ── */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>BOOK A MEETING</h2>
            {/* Replace TODO_REPLACE_WITH_YOUR_CALENDLY_URL with your Calendly link, e.g.:
                https://calendly.com/yourname/30min */}
            <div
              className="calendly-inline-widget"
              data-url="TODO_REPLACE_WITH_YOUR_CALENDLY_URL?background_color=0a0e1a&text_color=ffffff&primary_color=2A8840"
              style={{ minWidth: '320px', height: '630px' }}
            />
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="lazyOnload"
            />
          </section>

          {/* ── Direct links ── */}
          <div className={styles.directLinks}>
            <a href="mailto:vsahu@uwaterloo.ca" className={styles.directLink}>
              vsahu@uwaterloo.ca
            </a>
            <span className={styles.sep}>·</span>
            <a
              href="https://github.com/VarnitOS"
              className={styles.directLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className={styles.sep}>·</span>
            <a
              href="https://linkedin.com/in/varnitsahu"
              className={styles.directLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </main>
      </div>
    </BalatroDeck>
  )
}
```

- [ ] **Step 2: Open browser and verify the page renders**

Dev server should already be running (`pnpm dev:site`). Visit `http://localhost:3001/contact`.

Check:
- WebGL background fills viewport
- Vignette overlay visible
- `v1.0.0` top-right
- `← VARNITSAHU.COM` pill top-left, clicking it navigates to `/`
- Ace of Spades card visible top-right with ambient orbit animation
- "SEND A MESSAGE" panel visible with all three fields
- "BOOK A MEETING" panel shows Calendly placeholder (or widget if URL is set)
- Email/GitHub/LinkedIn row at bottom

- [ ] **Step 3: Test form submission flow in browser**

Fill in name, email, message → click SEND →.
Expected: button shows `...` while sending, then `MESSAGE SENT ✓` appears for 4 s, form resets.

Submit with empty fields.
Expected: browser native validation blocks submission (no API call made).

- [ ] **Step 4: Commit**

```bash
git add apps/personal-site/src/app/contact/ContactClient.tsx
git commit -m "feat: add ContactClient with BalatroBackground, form, and Calendly embed"
```

---

### Task 4: Contact page server component

**Files:**
- Create: `apps/personal-site/src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `ContactClient` default export from Task 3
- Produces: Next.js page at route `/contact` with metadata `title: "Contact — Varnit Sahu"`

- [ ] **Step 1: Create page.tsx**

Create `apps/personal-site/src/app/contact/page.tsx`:

```tsx
import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact — Varnit Sahu',
  description: 'Get in touch — send a message or book a meeting.',
}

export default function ContactPage() {
  return <ContactClient />
}
```

- [ ] **Step 2: Verify page title in browser**

Visit `http://localhost:3001/contact`.
Check browser tab — should read "Contact — Varnit Sahu".

- [ ] **Step 3: Commit**

```bash
git add apps/personal-site/src/app/contact/page.tsx
git commit -m "feat: add /contact page route with metadata"
```

---

### Task 5: Update main site CONTACT section

**Files:**
- Modify: `apps/personal-site/src/app/page.tsx` (lines ~491–501, the `#contact` section)
- Modify: `apps/personal-site/src/app/page.module.css` (append `.contactFullLink`)

**Interfaces:**
- Consumes: existing `.contactBox` panel in `page.tsx`; existing CSS module

- [ ] **Step 1: Append .contactFullLink to page.module.css**

In `apps/personal-site/src/app/page.module.css`, find the `.contactSep` rule (around line 753) and add after it:

```css
.contactFullLink {
  display: inline-block;
  margin-top: 18px;
  font-size: 16px;
  color: #4ade80;
  text-decoration: none;
  letter-spacing: 0.3px;
  transition: opacity 0.15s;
}

.contactFullLink:hover {
  opacity: 0.7;
}
```

- [ ] **Step 2: Add link inside the contact section**

In `apps/personal-site/src/app/page.tsx`, find the `#contact` section (around line 491). The current `contactBox` div contains a `contactLine` paragraph and a `contactLinks` div. Add the link after the `contactLinks` div, still inside `contactBox`:

Current code (around lines 491–501):
```tsx
<section id="contact" className={`${styles.section} ${styles.sectionContact}`}>
  <h2 className={styles.sectionTitle}>CONTACT</h2>
  <div className={styles.contactBox}>
    <p className={styles.contactLine}>vsahu@uwaterloo.ca</p>
    <div className={styles.contactLinks}>
      <a href="https://github.com/VarnitOS" className={styles.contactLink} target="_blank" rel="noopener noreferrer">GitHub</a>
      <span className={styles.contactSep}>·</span>
      <a href="https://linkedin.com/in/varnitsahu" className={styles.contactLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
  </div>
</section>
```

Replace with:
```tsx
<section id="contact" className={`${styles.section} ${styles.sectionContact}`}>
  <h2 className={styles.sectionTitle}>CONTACT</h2>
  <div className={styles.contactBox}>
    <p className={styles.contactLine}>vsahu@uwaterloo.ca</p>
    <div className={styles.contactLinks}>
      <a href="https://github.com/VarnitOS" className={styles.contactLink} target="_blank" rel="noopener noreferrer">GitHub</a>
      <span className={styles.contactSep}>·</span>
      <a href="https://linkedin.com/in/varnitsahu" className={styles.contactLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
    <a href="/contact" className={styles.contactFullLink}>Open full contact page →</a>
  </div>
</section>
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3001`, click PLAY, scroll to CONTACT section.
Expected: "Open full contact page →" link appears below GitHub/LinkedIn. Clicking it opens `/contact`.

- [ ] **Step 4: Commit**

```bash
git add apps/personal-site/src/app/page.tsx apps/personal-site/src/app/page.module.css
git commit -m "feat: add /contact link to main site CONTACT section"
```

---

### Task 6: Add Calendly URL + final verification

**Files:**
- Modify: `apps/personal-site/src/app/contact/ContactClient.tsx` (one line — replace TODO)

- [ ] **Step 1: Replace the Calendly URL placeholder**

In `ContactClient.tsx`, find this line:
```
data-url="TODO_REPLACE_WITH_YOUR_CALENDLY_URL?background_color=0a0e1a&text_color=ffffff&primary_color=2A8840"
```

Replace `TODO_REPLACE_WITH_YOUR_CALENDLY_URL` with your actual Calendly link, e.g.:
```
data-url="https://calendly.com/varnitsahu/30min?background_color=0a0e1a&text_color=ffffff&primary_color=2A8840"
```

- [ ] **Step 2: Verify Calendly widget loads**

Visit `http://localhost:3001/contact`, scroll to "BOOK A MEETING".
Expected: Calendly calendar widget renders inline with dark background, white text, and green highlight color matching the site.

- [ ] **Step 3: Full end-to-end checklist**

Visit `http://localhost:3001/contact` and confirm:
- [ ] WebGL background active
- [ ] Ambient card orbiting top-right
- [ ] `← VARNITSAHU.COM` navigates back to `/`
- [ ] Contact form: submit empty → blocked by browser validation
- [ ] Contact form: submit valid → `MESSAGE SENT ✓` flash, email received at vsahu@uwaterloo.ca
- [ ] Calendly widget shows actual calendar (not blank/error)
- [ ] GitHub/LinkedIn/email links work
- [ ] Page title in tab: "Contact — Varnit Sahu"
- [ ] Main site CONTACT section has "Open full contact page →" link

- [ ] **Step 4: Commit + push**

```bash
git add apps/personal-site/src/app/contact/ContactClient.tsx
git commit -m "feat: wire Calendly URL on /contact page"
git push origin dev
```

---

## Post-deploy: Resend from-address upgrade (optional)

After deploying to Vercel, if you want emails to come from `contact@varnitsahu.com` instead of Resend's sandbox:

1. Go to https://resend.com/domains → Add domain → enter `varnitsahu.com`
2. Add the shown DNS TXT records to your domain registrar
3. Wait for verification (usually < 5 min)
4. In `route.ts`, change:
   ```ts
   from: 'Contact Form <onboarding@resend.dev>',
   ```
   to:
   ```ts
   from: 'Varnit Sahu <contact@varnitsahu.com>',
   ```
5. Add `RESEND_API_KEY` to Vercel via `vercel env add RESEND_API_KEY`
