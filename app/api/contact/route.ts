import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { escapeHtml as esc } from '@/lib/escapeHtml'

const resend = new Resend(process.env.RESEND_API_KEY)

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const name = clean(body.name, 100)
  const email = clean(body.email, 200)
  const message = clean(body.message, 5000)

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'BeJeweled Contact <onboarding@resend.dev>',
      to: 'siddhidokania@gmail.com',
      replyTo: email,
      // Subject is plain text, but strip newlines so it can't be split
      subject: `New message from ${name.replace(/[\r\n]+/g, ' ')} — BeJeweled`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 16px; border-left: 3px solid #111; white-space: pre-wrap;">${esc(message)}</p>
          <hr />
          <p style="color: #999; font-size: 12px;">Sent from BeJeweled contact form</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
