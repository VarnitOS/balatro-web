'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { BalatroDeck, Card } from '@balatro/cards'
import type { BalatroCard } from '@balatro/cards'
import BalatroBackground from '@/components/BalatroBackground'
import { CardFan } from '@/components/CardFan'
import type { FanItem } from '@/components/CardFan'
import BlogViewer from '@/components/BlogViewer'
import { useScrollToEnter } from '@/hooks/useScrollToEnter'
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic'
import styles from './page.module.css'

// ── Hero card ──────────────────────────────────────────────────────────────
const ACE_OF_SPADES: BalatroCard = {
  id: 'ace-spades', rank: 'A', suit: 'spades', facing: 'front',
}

// ── Nav ───────────────────────────────────────────────────────────────────
const NAV_BUTTONS = [
  { label: 'PLAY',       bg: '#3A5DC9', shadow: '#1E3A8A', size: 'large', section: null },
  { label: 'EXPERIENCE', bg: '#B87822', shadow: '#7A4E0A', size: 'small', section: 'experience' },
  { label: 'PROJECTS',   bg: '#C03030', shadow: '#8A0A0A', size: 'small', section: 'projects' },
  { label: 'BLOGS',      bg: '#7A22A8', shadow: '#4A0A7A', size: 'small', section: 'blogs' },
  { label: 'CONTACT',    bg: '#2A8840', shadow: '#0A5520', size: 'large', section: 'contact' },
]

const SECTIONS = ['intro', 'experience', 'projects', 'blogs', 'contact']

// ── Data ──────────────────────────────────────────────────────────────────
interface ExperienceEntry {
  id: string; rank: string; suit: string
  company: string; role: string
  shortRole: string
  domain: string
}
interface ProjectEntry {
  id: string; rank: string; suit: string
  title: string; description: string; slug: string
}
interface BlogEntry {
  id: string; rank: string; suit: string
  title: string; date: string; slug: string
  tags?: string[]
  content?: string
  images?: { src: string; caption?: string }[]
  pdf?: string
}

const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'exp-1', rank: 'A', suit: 'diamonds',
    company: 'PlayStation (Sony)', role: 'Software Engineering Intern',
    shortRole: 'Engineering', domain: 'playstation.com',
  },
  {
    id: 'exp-2', rank: 'K', suit: 'diamonds',
    company: 'Nokia', role: 'Software Developer (Co-op)',
    shortRole: 'Engineering', domain: 'nokia.com',
  },
  {
    id: 'exp-3', rank: 'Q', suit: 'diamonds',
    company: 'University of Waterloo', role: 'Undergraduate Researcher',
    shortRole: 'Research', domain: 'uwaterloo.ca',
  },
  {
    id: 'exp-4', rank: 'J', suit: 'diamonds',
    company: 'Nokia', role: 'AI/ML Engineering Intern',
    shortRole: 'ML Eng', domain: 'nokia.com',
  },
  {
    id: 'exp-5', rank: '10', suit: 'diamonds',
    company: 'Savi Finance', role: 'Software Engineer Intern',
    shortRole: 'Engineering', domain: 'financesavi.com',
  },
  {
    id: 'exp-6', rank: '9', suit: 'diamonds',
    company: 'WAT.ai', role: 'Machine Learning Engineer',
    shortRole: 'ML Eng', domain: 'watai.ca',
  },
]

const PROJECTS: ProjectEntry[] = [
  {
    id: 'proj-1', rank: 'A', suit: 'clubs',
    title: 'DataBridge', description: 'A SaaS solution for overworked interns within auditing, bridging data gaps between legacy systems and modern reporting.',
    slug: 'DataBridge',
  },
  {
    id: 'proj-2', rank: 'K', suit: 'clubs',
    title: 'NetVigil', description: 'A comprehensive network monitoring and security tool that provides real-time insights into network performance and potential security threats.',
    slug: 'NetVigil',
  },
  {
    id: 'proj-3', rank: 'Q', suit: 'clubs',
    title: 'Law-Der', description: 'An AI-powered legal document analysis and recommendation system for legal professionals.',
    slug: 'Law-Der',
  },
  {
    id: 'proj-4', rank: 'J', suit: 'clubs',
    title: 'OneScroll', description: 'A modern social media aggregator that unifies all your social feeds into one seamless scrolling experience. Stop app-hopping and start enjoying your content in one place.',
    slug: 'OneScroll',
  },
  {
    id: 'proj-5', rank: '10', suit: 'clubs',
    title: 'AdOpt', description: 'A sophisticated real-time bidding (RTB) optimization platform that uses game theory principles to optimize advertising campaigns and maximize ROI.',
    slug: 'AdOpt',
  },
  {
    id: 'proj-6', rank: '9', suit: 'clubs',
    title: 'FluxStonks', description: 'A real-time stock market analysis and trading platform with advanced visualization and prediction capabilities.',
    slug: 'FluxStonks',
  },
  {
    id: 'proj-7', rank: '8', suit: 'clubs',
    title: 'DisasterFirstResponder', description: 'An emergency response coordination platform designed to help first responders during natural disasters and crisis situations.',
    slug: 'DisasterFirstResponder',
  },
  {
    id: 'proj-8', rank: '7', suit: 'clubs',
    title: 'Joblity', description: 'A job search and career mobility platform that helps users find opportunities aligned with their skills and career goals.',
    slug: 'Joblity',
  },
  {
    id: 'proj-9', rank: '6', suit: 'clubs',
    title: 'MealPlanner', description: 'A smart meal planning application that creates personalized meal plans based on dietary preferences, restrictions, and nutritional goals.',
    slug: 'mealplanner',
  },
  {
    id: 'proj-10', rank: '5', suit: 'clubs',
    title: 'MNIST Classifier', description: 'A deep learning model for handwritten digit recognition using the MNIST dataset, with interactive visualization of network operations.',
    slug: 'MNIST',
  },
  {
    id: 'proj-11', rank: '4', suit: 'clubs',
    title: 'TravelCompanion', description: 'An all-in-one travel planning and companion app that helps with itinerary planning, booking, and real-time travel assistance.',
    slug: 'TravelCompanion',
  },
  {
    id: 'proj-12', rank: '3', suit: 'clubs',
    title: 'CardClassifier', description: 'A machine learning model that classifies playing cards from images using convolutional neural networks.',
    slug: 'CardClassifier',
  },
  {
    id: 'proj-13', rank: '2', suit: 'clubs',
    title: 'Options Probability', description: 'Derives implied probability distributions from options market data to visualize the market\'s expectations for future price movements.',
    slug: 'options-impplied-probablity-dristribution-of-market',
  },
]

const BLOGS: BlogEntry[] = [
  {
    id: 'blog-2', rank: 'K', suit: 'hearts',
    title: 'Bellman Optimality Equation', date: '2025', slug: 'bellman-optimality-equation',
    pdf: '/blogs/GameTheory.pdf',
  },
  {
    id: 'blog-1', rank: 'A', suit: 'hearts',
    title: 'How I built this', date: '2025', slug: 'how-i-built-this',
    content: `I spent way too long on this.

That's basically the whole story. I got deep into [Balatro](https://store.steampowered.com/app/2379780/Balatro/) during a co-op term and couldn't shake the UI: the chunky pixel font, the card slap sounds, the way every button has that little 3D press to it. At some point I thought: why does every portfolio look like a dark-mode LinkedIn page? Can we not do something fun?

So I built this instead of applying to jobs like a normal person.

The card components live in their own @balatro/cards package so I can actually reuse them. Framer Motion does most of the heavy lifting on animations. The nav island that physically flies from the bottom of the landing screen to the sticky top bar is just layoutId doing its thing, and I find it unreasonably satisfying every single time.

The swirling red-blue background is a custom GLSL fragment shader running on a raw OGL canvas. I watched a lot of shader tutorials to build it and still only understand about 40% of how it actually works. That feels fine.

The font is m6x11plus. It's free, it's pixel-perfect, and I will use it in everything forever.

If you haven't played [Balatro](https://store.steampowered.com/app/2379780/Balatro/), close this tab and go do that first. Seriously. It'll steal your weekend. It definitely stole mine.`,
  },
]

const SPRING = { type: 'spring' as const, stiffness: 220, damping: 28 }

// ── Page ──────────────────────────────────────────────────────────────────
export default function Page() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('intro')
  const [activeBlog, setActiveBlog] = useState<string | null>(null)

  const { play: playMusic } = useBackgroundMusic('/music/theme.mp4')

  useScrollToEnter(!hasEnteredSite, () => setHasEnteredSite(true))

  useEffect(() => {
    if (!hasEnteredSite) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' }
    )
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [hasEnteredSite])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleNavClick(label: string) {
    if (label === 'PLAY') { playMusic(); setHasEnteredSite(prev => !prev); return }
    const btn = NAV_BUTTONS.find(b => b.label === label)
    if (!btn?.section) return
    if (!hasEnteredSite) {
      playMusic()
      setHasEnteredSite(true)
      setTimeout(() => scrollTo(btn.section!), 400)
    } else {
      scrollTo(btn.section)
    }
  }

  // ── Card fan data builders ────────────────────────────────────────────
  const experienceFan: FanItem[] = EXPERIENCE.map((e) => ({
    card: { id: e.id, rank: e.rank, suit: e.suit, facing: 'front' as const },
    label: e.company,
    onClick: (_card) => scrollTo(`exp-detail-${e.id}`),
  }))

  const projectFan: FanItem[] = PROJECTS.map((p) => ({
    card: { id: p.id, rank: p.rank, suit: p.suit, facing: 'front' as const },
    label: p.title,
    // stub: onClick: (_card) => router.push(`/projects/${p.slug}`)
    onClick: undefined,
  }))

  const blogFan: FanItem[] = BLOGS.map((b) => ({
    card: { id: b.id, rank: b.rank, suit: b.suit, facing: 'front' as const },
    label: b.title,
    // stub: onClick: (_card) => router.push(`/blogs/${b.slug}`)
    onClick: undefined,
  }))

  // ── Shared nav buttons renderer ──────────────────────────────────────
  function navButtons(compact: boolean) {
    return NAV_BUTTONS.map((btn) => {
      const isActive = hasEnteredSite && btn.section && activeSection === btn.section
      return (
        <button
          key={btn.label}
          onClick={() => handleNavClick(btn.label)}
          className={[
            styles.navBtn,
            btn.size === 'small' ? styles.navBtnSmall : '',
            compact ? styles.navBtnCompact : '',
            isActive ? styles.navBtnActive : '',
            btn.label === 'PLAY' && !compact ? styles.navBtnPulse : '',
          ].join(' ')}
          style={{
            ['--btn-bg' as string]: btn.bg,
            ['--btn-shadow' as string]: btn.shadow,
          }}
        >
          {hasEnteredSite && btn.label === 'PLAY' ? 'MENU' : btn.label}
        </button>
      )
    })
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <BalatroDeck sounds>
      <div className={`${styles.root} ${hasEnteredSite ? styles.rootPortfolio : ''}`}>
        <BalatroBackground
          color1="#DE443B" color2="#006BB4" color3="#162325"
          spinSpeed={7.0} contrast={3.5} lighting={0.4}
          spinAmount={0.25} pixelFilter={745.0} mouseInteraction
        />

        <div className={styles.vignette} />
        <div className={styles.version}>v1.0.0</div>

        {/* ── Hero ── */}
        <AnimatePresence initial={false}>
          {!hasEnteredSite && (
            <motion.div key="hero" className={styles.hero}
              initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -110 }} transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.logoWrap}>
                <Image src="/Assets/VarnitSplashScreen.png" alt="Varnit Sahu"
                  width={800} height={400} className={styles.logo} priority />
                <div className={styles.cardWrap}>
                  <div style={{ ['--card-w' as string]: '205px', ['--card-h' as string]: '275px', ['--card-radius' as string]: '13px' }}>
                    <Card card={ACE_OF_SPADES} ambient />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Profile badge ── */}
        <AnimatePresence initial={false}>
          {!hasEnteredSite && (
            <motion.div key="profile" className={styles.profileBadgeFixed}
              initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className={styles.profileLabel}>Profile</span>
              <span className={styles.profileId}>VS</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Socials ── */}
        <AnimatePresence initial={false}>
          {!hasEnteredSite && (
            <motion.div key="socials" className={styles.socialsFixed}
              initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={styles.socialRow}>
                <a href="https://github.com/VarnitOS" className={styles.socialLink} title="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 16 16" fill="currentColor" width="32" height="32" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/in/varnitsahu" className={styles.socialLink} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
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

        {/* ── Nav island — layoutId shared element ── */}
        {!hasEnteredSite && (
          <div className={styles.navAnchorBottom}>
            <motion.div layoutId="navIsland" className={styles.navButtons} transition={SPRING}>
              {navButtons(false)}
            </motion.div>
          </div>
        )}
        {hasEnteredSite && (
          <div className={styles.stickyNavBar}>
            <motion.div layoutId="navIsland" className={styles.navButtonsSticky} transition={SPRING}>
              {navButtons(true)}
            </motion.div>
          </div>
        )}

        {/* ── Portfolio content ── */}
        <AnimatePresence>
          {hasEnteredSite && (
            <motion.div key="portfolio" className={styles.portfolioContent}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >

              {/* ── INTRO ────────────────────────────────────────────── */}
              <section id="intro" className={`${styles.section} ${styles.sectionIntro}`}>
                <div className={styles.introCard}>
                  <div className={styles.introDivider}>
                    <span className={styles.introOrn}>✦</span>
                  </div>
                  <div className={styles.introBody}>
                    <p className={styles.introName}>VARNIT SAHU</p>
                    <p className={styles.introSub}>
                      <img src="https://www.google.com/s2/favicons?domain=uwaterloo.ca&sz=64" alt="UW" width={18} height={18} className={styles.companyLogo} />
                      Computer Science, Artificial Intelligence Specialization, Statistics Minor · University of Waterloo
                    </p>
                    <p className={styles.introBlurb}>
                      Co-founding <strong>IPAiC</strong>, an AI copilot for Infection Prevention and Control teams investigating healthcare-associated infections (25+ customer interviews, $1K in non-dilutive funding from Velocity)
                    </p>
                    <div className={styles.aboutBullets} style={{ marginTop: '28px' }}>
                      <div className={styles.aboutBullet}>
                        <span className={styles.aboutBulletIcon}>◆</span>
                        <span className={styles.aboutBulletLabel}>Currently:</span>
                        <a className={styles.aboutCompanyLink} href={`https://${EXPERIENCE[0].domain}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${EXPERIENCE[0].domain}&sz=64`}
                            alt="" width={18} height={18} className={styles.companyLogo}
                          />
                          {EXPERIENCE[0].company}
                        </a>
                        <span className={styles.aboutRoleDash}>· {EXPERIENCE[0].role}</span>
                      </div>
                      <div className={styles.aboutBullet}>
                        <span className={styles.aboutBulletIcon}>◆</span>
                        <span className={styles.aboutBulletLabel}>Previously:</span>
                      </div>
                      {EXPERIENCE.slice(1).map((exp) => (
                        <div key={exp.id} className={styles.aboutSubBullet}>
                          <span className={styles.aboutSubBulletIcon}>↳</span>
                          <a className={styles.aboutCompanyLink} href={`https://${exp.domain}`} target="_blank" rel="noopener noreferrer">
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${exp.domain}&sz=64`}
                              alt="" width={18} height={18} className={styles.companyLogo}
                            />
                            {exp.company}
                          </a>
                          <span className={styles.aboutRoleDash}>· {exp.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.introDivider}>
                    <span className={styles.introOrn}>✦</span>
                  </div>
                </div>
              </section>

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
                        src={`https://www.google.com/s2/favicons?domain=${exp.domain}&sz=64`}
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

              {/* ── PROJECTS ─────────────────────────────────────────── */}
              <section id="projects" className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.suit}>♣</span> PROJECTS
                </h2>
                <p className={styles.sectionHint}>Hover to inspect. Routes to /projects/[slug] when ready.</p>
                <CardFan items={projectFan} cardWidth={150} cardHeight={210} fanAngle={18} />

                <div className={styles.cardGrid}>
                  {PROJECTS.map((p) => (
                    <a key={p.id} className={styles.gridCard} href={`https://github.com/VarnitOS/${p.slug}`} target="_blank" rel="noopener noreferrer">
                      <p className={styles.gridCardTitle}>{p.title}</p>
                      <p className={styles.gridCardDesc}>{p.description}</p>
                      <span className={styles.gridCardGithub}>
                        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                        View on GitHub
                      </span>
                    </a>
                  ))}
                </div>
              </section>

              {/* ── BLOGS ────────────────────────────────────────────── */}
              <section id="blogs" className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.suit}>♥</span> BLOGS
                </h2>
                <p className={styles.sectionHint}>Hover to inspect. Routes to /blogs/[slug] when ready.</p>
                <CardFan items={blogFan} cardWidth={150} cardHeight={210} fanAngle={14} />

                <div className={styles.cardGrid}>
                  {BLOGS.map((b) => (
                    <button key={b.id} className={`${styles.gridCard} ${styles.gridCardClickable}`} onClick={() => setActiveBlog(b.id)}>
                      <p className={styles.gridCardTitle}>{b.title}</p>
                      <p className={styles.gridCardMeta}>{b.date}</p>
                      {b.tags && (
                        <div className={styles.gridCardTags}>
                          {b.tags.map(t => <span key={t} className={styles.gridCardTag}>{t}</span>)}
                        </div>
                      )}
                      <span className={styles.gridCardRead}>♥ Read</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* ── CONTACT ──────────────────────────────────────────── */}
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

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Blog viewer overlay ── */}
      <AnimatePresence>
        {activeBlog && (
          <BlogViewer
            key="blog-viewer"
            posts={BLOGS}
            initialId={activeBlog}
            onClose={() => setActiveBlog(null)}
          />
        )}
      </AnimatePresence>
    </BalatroDeck>
  )
}
