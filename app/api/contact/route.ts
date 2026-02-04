import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// In-memory store for CAPTCHA sessions (in production, use Redis/database)
const captchaStore = new Map<string, { text: string; expires: number }>()

// Generate random CAPTCHA text
function generateCaptchaText(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  const operators = '+-'

  switch (difficulty) {
    case 'easy':
      return Array.from({ length: 4 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('')

    case 'medium':
      return Array.from({ length: 5 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('')

    case 'hard':
      const num1 = Math.floor(Math.random() * 10) + 1
      const num2 = Math.floor(Math.random() * 10) + 1
      const operator = operators.charAt(Math.floor(Math.random() * operators.length))
      return `${num1} ${operator} ${num2}`

    default:
      return Array.from({ length: 5 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('')
  }
}

// Evaluate math expression safely
function evaluateMathExpression(expression: string): number | null {
  try {
    // Only allow basic arithmetic operations
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '')
    return Function('"use strict"; return (' + sanitized + ')')()
  } catch {
    return null
  }
}

// Clean up expired CAPTCHAs
function cleanupExpiredCaptchas() {
  const now = Date.now()
  for (const [id, data] of captchaStore.entries()) {
    if (data.expires < now) {
      captchaStore.delete(id)
    }
  }
}

async function loadContactInfo() {
  const configPath = path.join(process.cwd(), 'config', 'contact.json')
  const raw = await readFile(configPath, 'utf-8')
  return JSON.parse(raw)
}

// GET: Generate and return a new CAPTCHA
export async function GET() {
  try {
    cleanupExpiredCaptchas()

    const sessionId = crypto.randomUUID()
    const captchaText = generateCaptchaText('medium')
    const expires = Date.now() + (5 * 60 * 1000) // 5 minutes

    captchaStore.set(sessionId, { text: captchaText, expires })

    return NextResponse.json({
      sessionId,
      captchaText,
      expiresAt: expires
    })
  } catch (error) {
    console.error('Error generating CAPTCHA:', error)
    return NextResponse.json(
      { error: 'Failed to generate CAPTCHA' },
      { status: 500 }
    )
  }
}

// POST: Verify CAPTCHA and return contact info
export async function POST(request: NextRequest) {
  try {
    cleanupExpiredCaptchas()

    const body = await request.json()
    const { sessionId, userInput } = body

    if (!sessionId || !userInput) {
      return NextResponse.json(
        { error: 'Missing sessionId or userInput' },
        { status: 400 }
      )
    }

    const captchaData = captchaStore.get(sessionId)
    if (!captchaData) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 400 }
      )
    }

    // Remove the CAPTCHA after first use (one-time use)
    captchaStore.delete(sessionId)

    let isValid = false

    // Check if it's a math problem (contains operators)
    if (captchaData.text.includes('+') || captchaData.text.includes('-')) {
      const expectedResult = evaluateMathExpression(captchaData.text)
      isValid = expectedResult !== null && parseInt(userInput) === expectedResult
    } else {
      // String comparison for alphanumeric CAPTCHAs
      isValid = userInput.toLowerCase() === captchaData.text.toLowerCase()
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect CAPTCHA solution' },
        { status: 400 }
      )
    }

    // Return contact information only after successful verification
    const contactInfo = await loadContactInfo()

    return NextResponse.json({ contactInfo })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}