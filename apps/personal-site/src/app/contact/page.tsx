import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact — Varnit Sahu',
  description: 'Get in touch — send a message or book a meeting.',
}

export default function ContactPage() {
  return <ContactClient />
}
