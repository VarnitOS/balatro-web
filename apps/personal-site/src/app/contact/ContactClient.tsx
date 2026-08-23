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

type FormState = 'idle' | 'success'

export default function ContactClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Message from ${name.trim().replace(/\s+/g, ' ')}`)
    const body = encodeURIComponent(`From: ${name.trim()} (${email.trim()})\n\n${message.trim()}`)
    window.open(`mailto:vsahu@uwaterloo.ca?subject=${subject}&body=${body}`)
    setFormState('success')
    setName('')
    setEmail('')
    setMessage('')
    setTimeout(() => setFormState('idle'), 4000)
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
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                required
                maxLength={5000}
              />
              <div className={styles.formFooter}>
                {formState === 'success' && (
                  <span className={styles.flashSuccess}>OPENING EMAIL CLIENT ✓</span>
                )}
                <button type="submit" className={styles.sendBtn}>
                  SEND →
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
            <a href="mailto:vsahu@uwaterloo.ca" className={`${styles.socialBtn} ${styles.emailBtn}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              vsahu@uwaterloo.ca
            </a>
            <div className={styles.socialRow}>
              <a href="https://github.com/VarnitOS" className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16" fill="currentColor" width="22" height="22" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                GitHub
              </a>
              <a href="https://linkedin.com/in/varnitsahu" className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </main>
      </div>
    </BalatroDeck>
  )
}
