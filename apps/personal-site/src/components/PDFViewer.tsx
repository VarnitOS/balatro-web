'use client'
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import styles from './PDFViewer.module.css'

interface Props { url: string }

export default function PDFViewer({ url }: Props) {
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [width, setWidth] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!numPages) return
    pageRefs.current = pageRefs.current.slice(0, numPages)
    const observers: IntersectionObserver[] = []
    pageRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCurrentPage(i + 1) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [numPages])

  function zoom(delta: number) {
    setScale(s => Math.min(2.0, Math.max(0.5, parseFloat((s + delta).toFixed(2)))))
  }

  return (
    <div className={styles.viewer} ref={containerRef}>
      <div className={styles.controls}>
        <button className={styles.zoomBtn} onClick={() => zoom(-0.25)}>−</button>
        <span className={styles.zoomLabel}>{Math.round(scale * 100)}%</span>
        <button className={styles.zoomBtn} onClick={() => zoom(0.25)}>+</button>
        <span className={styles.pageLabel}>
          {numPages ? `${currentPage} / ${numPages}` : '—'}
        </span>
      </div>

      <Document
        file={url}
        onLoadSuccess={({ numPages: n }) => { setNumPages(n); setCurrentPage(1) }}
        loading={<p className={styles.status}>Loading...</p>}
        error={<p className={styles.status}>Failed to load ♥</p>}
        className={styles.pages}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <div
            key={i}
            ref={el => { pageRefs.current[i] = el }}
            className={styles.pageWrap}
          >
            <Page
              pageNumber={i + 1}
              width={width * scale}
              renderAnnotationLayer
              renderTextLayer
            />
          </div>
        ))}
      </Document>
    </div>
  )
}
