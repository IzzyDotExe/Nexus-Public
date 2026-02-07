export interface CaptchaSession {
    sessionId: string
    captchaText: string
    expiresAt: number
}