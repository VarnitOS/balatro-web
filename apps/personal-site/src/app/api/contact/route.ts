import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
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
      subject: `[varnitsahu.com] Message from ${name.trim().replace(/\s+/g, ' ')}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/contact] Resend error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
