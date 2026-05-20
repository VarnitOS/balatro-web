'use client'

import Image from 'next/image'
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
  { label: 'ABOUT',    bg: '#3A5DC9', shadow: '#1E3A8A' },
  { label: 'PROJECTS', bg: '#B87822', shadow: '#7A4E0A' },
  { label: 'CONTACT',  bg: '#C03030', shadow: '#8A0A0A' },
  { label: 'RESUME',   bg: '#2A8840', shadow: '#0A5520' },
]

export default function Page() {
  return (
    <BalatroDeck sounds>
      <main className={styles.main}>
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

        {/* Vignette */}
        <div className={styles.vignette} />

        {/* Version — top right */}
        <div className={styles.version}>v1.0.0</div>

        {/* Hero — logo + card */}
        <div className={styles.hero}>
          <div className={styles.logoWrap}>
            <Image
              src="/Assets/VarnitSplashScreen.png"
              alt="Varnit Sahu"
              width={800}
              height={400}
              className={styles.logo}
              priority
            />
            {/* Card sits in the gap between the logo letters */}
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
        </div>

        {/* Bottom chrome */}
        <div className={styles.bottomBar}>
          {/* Profile badge — bottom left */}
          <div className={styles.profileBadge}>
            <span className={styles.profileLabel}>Profile</span>
            <span className={styles.profileId}>VS</span>
          </div>

          {/* Nav buttons — center */}
          <div className={styles.navButtons}>
            {NAV_BUTTONS.map(btn => (
              <button
                key={btn.label}
                className={styles.navBtn}
                style={{
                  ['--btn-bg' as string]: btn.bg,
                  ['--btn-shadow' as string]: btn.shadow,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Socials — bottom right */}
          <div className={styles.socials}>
            <div className={styles.socialRow}>
              <a
                href="https://github.com/varnitsahu"
                className={styles.socialLink}
                title="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                GH
              </a>
              <a
                href="https://linkedin.com/in/varnit-sahu"
                className={styles.socialLink}
                title="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                LI
              </a>
            </div>
            <span className={styles.langBadge}>vsahu@uwaterloo.ca</span>
          </div>
        </div>
      </main>
    </BalatroDeck>
  )
}
