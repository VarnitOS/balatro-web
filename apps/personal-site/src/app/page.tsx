'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { BalatroDeck, Card } from '@balatro/cards'
import type { BalatroCard } from '@balatro/cards'
import BalatroBackground from '@/components/BalatroBackground'
import styles from './page.module.css'

const ACE_OF_SPADES: BalatroCard = {
  id: 'ace-spades',
  rank: 'A',
  suit: 'spades',
  facing: 'front',
}

const NAV_BUTTONS = [
  { label: 'PLAY',       bg: '#3A5DC9', shadow: '#1E3A8A', size: 'large' },
  { label: 'EXPERIENCE', bg: '#B87822', shadow: '#7A4E0A', size: 'small' },
  { label: 'PROJECTS',   bg: '#C03030', shadow: '#8A0A0A', size: 'small' },
  { label: 'CONTACT',    bg: '#2A8840', shadow: '#0A5520', size: 'large' },
]

const SECTIONS = ['experience', 'projects', 'contact']

const SPRING = { type: 'spring' as const, stiffness: 220, damping: 28 }

export default function Page() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('experience')

  useEffect(() => {
    if (!hasEnteredSite) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { threshold: 0.3, rootMargin: '-100px 0px 0px 0px' }
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [hasEnteredSite])

  function handleNavClick(label: string) {
    if (label === 'PLAY') {
      setHasEnteredSite(prev => !prev)
      return
    }
    const id = label.toLowerCase()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  function navButtons(compact: boolean) {
    return NAV_BUTTONS.map((btn) => {
      const isActive = hasEnteredSite && activeSection === btn.label.toLowerCase()
      const isPlayBtn = btn.label === 'PLAY'
      return (
        <button
          key={btn.label}
          onClick={() => handleNavClick(btn.label)}
          className={[
            styles.navBtn,
            btn.size === 'small' ? styles.navBtnSmall : '',
            compact ? styles.navBtnCompact : '',
            isActive ? styles.navBtnActive : '',
          ].join(' ')}
          style={{
            ['--btn-bg' as string]: btn.bg,
            ['--btn-shadow' as string]: btn.shadow,
          }}
        >
          {hasEnteredSite && isPlayBtn ? 'MENU' : btn.label}
        </button>
      )
    })
  }

  return (
    <BalatroDeck sounds>
      <div className={`${styles.root} ${hasEnteredSite ? styles.rootPortfolio : ''}`}>
        <BalatroBackground
          color1="#DE443B"
          color2="#006BB4"
          color3="#162325"
          spinSpeed={7.0}
          contrast={3.5}
          lighting={0.4}
          spinAmount={0.25}
          pixelFilter={745.0}
          mouseInteraction
        />

        <div className={styles.vignette} />
        <div className={styles.version}>v1.0.0</div>

        {/* ── Hero (logo + card) — exits on PLAY ── */}
        <AnimatePresence initial={false}>
          {!hasEnteredSite && (
            <motion.div
              key="hero"
              className={styles.hero}
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -110 }}
              transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.logoWrap}>
                <Image
                  src="/Assets/VarnitSplashScreen.png"
                  alt="Varnit Sahu"
                  width={800}
                  height={400}
                  className={styles.logo}
                  priority
                />
                <div className={styles.cardWrap}>
                  <div style={{
                    ['--card-w' as string]: '205px',
                    ['--card-h' as string]: '275px',
                    ['--card-radius' as string]: '13px',
                  }}>
                    <Card card={ACE_OF_SPADES} ambient />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Profile badge — exits on PLAY ── */}
        <AnimatePresence initial={false}>
          {!hasEnteredSite && (
            <motion.div
              key="profile"
              className={styles.profileBadgeFixed}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className={styles.profileLabel}>Profile</span>
              <span className={styles.profileId}>VS</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Socials — exits on PLAY ── */}
        <AnimatePresence initial={false}>
          {!hasEnteredSite && (
            <motion.div
              key="socials"
              className={styles.socialsFixed}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.socialRow}>
                <a href="https://github.com/VarnitOS" className={styles.socialLink} title="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 16 16" fill="currentColor" width="26" height="26" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/varnitsahu" className={styles.socialLink} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <div className={styles.langIsland}>
                <span className={styles.langBadge}>vsahu@uwaterloo.ca</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Nav island — bottom in menu mode, sticky top in portfolio mode ── */}
        {!hasEnteredSite && (
          <div className={styles.navAnchorBottom}>
            <motion.div
              layoutId="navIsland"
              className={styles.navButtons}
              transition={SPRING}
            >
              {navButtons(false)}
            </motion.div>
          </div>
        )}

        {hasEnteredSite && (
          <div className={styles.stickyNavBar}>
            <motion.div
              layoutId="navIsland"
              className={styles.navButtonsSticky}
              transition={SPRING}
            >
              {navButtons(true)}
            </motion.div>
          </div>
        )}

        {/* ── Portfolio content ── */}
        <AnimatePresence>
          {hasEnteredSite && (
            <motion.div
              key="portfolio"
              className={styles.portfolioContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <section id="experience" className={styles.section}>
                <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
                <div className={styles.sectionBody}>
                  <p className={styles.sectionPlaceholder}>Work experience coming soon.</p>
                </div>
              </section>

              <section id="projects" className={styles.section}>
                <h2 className={styles.sectionTitle}>PROJECTS</h2>
                <div className={styles.sectionBody}>
                  <p className={styles.sectionPlaceholder}>Projects coming soon.</p>
                </div>
              </section>

              <section id="contact" className={styles.section}>
                <h2 className={styles.sectionTitle}>CONTACT</h2>
                <div className={styles.sectionBody}>
                  <p className={styles.sectionPlaceholder}>vsahu@uwaterloo.ca</p>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BalatroDeck>
  )
}
