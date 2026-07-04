'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './blog-viewer.module.css'

function renderPara(text: string, key: number) {
  const parts: React.ReactNode[] = []
  const re = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g
  let last = 0, m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer" className={styles.docLink}>{m[1]}</a>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <p key={key} className={styles.docPara}>{parts}</p>
}

export interface BlogPost {
  id: string
  rank: string
  suit: string
  title: string
  date: string
  slug: string
  tags?: string[]
  content?: string
  images?: { src: string; caption?: string }[]
}

interface Props {
  posts: BlogPost[]
  initialId: string
  onClose: () => void
}

export default function BlogViewer({ posts, initialId, onClose }: Props) {
  const [activeId, setActiveId] = useState(initialId)
  const active = posts.find(p => p.id === activeId) ?? posts[0]
  const paragraphs = active.content?.split('\n\n').filter(Boolean) ?? []

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* ── Left sidebar ── */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarSuit}>♥</span> BLOGS
        </div>
        <div className={styles.sidebarCount}>{posts.length} entries</div>
        <div className={styles.blogList}>
          {posts.map(p => (
            <button
              key={p.id}
              className={`${styles.blogItem} ${p.id === activeId ? styles.blogItemActive : ''}`}
              onClick={() => setActiveId(p.id)}
            >
              <span className={styles.blogItemRank}>{p.rank} ♥</span>
              <span className={styles.blogItemTitle}>{p.title}</span>
              <span className={styles.blogItemDate}>{p.date}</span>
            </button>
          ))}
        </div>
        <button className={styles.backBtn} onClick={onClose}>← BACK</button>
      </div>

      {/* ── Main content ── */}
      <div className={styles.main}>
        <div className={styles.document}>
          <div className={styles.docHeader}>
            <span className={styles.docRank}>{active.rank} ♥</span>
            <div className={styles.docMeta}>
              <h1 className={styles.docTitle}>{active.title}</h1>
              <div className={styles.docTagRow}>
                <span className={styles.docDate}>{active.date}</span>
                {active.tags?.map(t => (
                  <span key={t} className={styles.docTag}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.docDivider} />
          <div className={styles.docBody}>
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => renderPara(para, i))
            ) : (
              <p className={styles.docEmpty}>This entry is coming soon... ♥</p>
            )}
            {active.images?.map((img, i) => (
              <figure key={i} className={styles.docFigure}>
                <img src={img.src} alt={img.caption ?? ''} className={styles.docImg} />
                {img.caption && <figcaption className={styles.docCaption}>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
