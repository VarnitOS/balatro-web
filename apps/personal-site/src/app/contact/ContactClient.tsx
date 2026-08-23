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
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/varnitsahu123?background_color=0a0e1a&text_color=ffffff&primary_color=2A8840"
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
