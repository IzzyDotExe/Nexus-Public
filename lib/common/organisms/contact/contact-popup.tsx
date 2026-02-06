"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MessageCircle, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { useTextContent } from "@/lib/hooks/useTextContent"

interface ContactPopupProps {
    trigger?: React.ReactNode
    className?: string
}

interface CaptchaSession {
    sessionId: string
    captchaText: string
    expiresAt: number
}

export function ContactPopup({ trigger, className }: ContactPopupProps) {
    const { getText } = useTextContent();
    const [isOpen, setIsOpen] = useState(false)
    const [captchaSession, setCaptchaSession] = useState<CaptchaSession | null>(null)
    const [userInput, setUserInput] = useState("")
    const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [contactInfo, setContactInfo] = useState<{
        email: string
        phone: string
        discord: string
    } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isVerified, setIsVerified] = useState(false)
    const [inputShake, setInputShake] = useState(false)
    const [captchaColor, setCaptchaColor] = useState('#000000')
    const [captchaTransform, setCaptchaTransform] = useState('translate(0px, 0px) rotate(0deg)')

    // Generate random color for CAPTCHA
    const generateRandomColor = () => {
        const colors = [
            '#ef4444', // red
            '#f97316', // orange
            '#eab308', // yellow
            '#22c55e', // green
            '#3b82f6', // blue
            '#8b5cf6', // violet
            '#ec4899', // pink
            '#6b7280', // gray
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    // Generate random transform for CAPTCHA movement
    const generateRandomTransform = () => {
        const x = (Math.random() - 0.5) * 20 // -10px to 10px
        const y = (Math.random() - 0.5) * 20 // -10px to 10px
        const rotation = (Math.random() - 0.5) * 10 // -5deg to 5deg
        return `translate(${x}px, ${y}px) rotate(${rotation}deg)`
    }

    // Handle input change with visual effects
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUserInput(value)

        // Trigger shake animation
        setInputShake(true)
        setTimeout(() => setInputShake(false), 300)

        // Change CAPTCHA color and position
        setCaptchaColor(generateRandomColor())
        setCaptchaTransform(generateRandomTransform())
    }

    // Fetch new CAPTCHA from server
    const fetchCaptcha = async () => {
        setIsLoadingCaptcha(true)
        setError(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'GET',
            })

            if (!response.ok) {
                throw new Error('Failed to fetch CAPTCHA')
            }

            const data = await response.json()
            setCaptchaSession(data)
            setUserInput("")

            // Initialize with random color and position
            setCaptchaColor(generateRandomColor())
            setCaptchaTransform(generateRandomTransform())
        } catch (error) {
            console.error('Error fetching CAPTCHA:', error)
            setError('Failed to load verification. Please try again.')
        } finally {
            setIsLoadingCaptcha(false)
        }
    }

    // Verify CAPTCHA solution with server
    const verifyCaptcha = async () => {
        if (!captchaSession || !userInput.trim()) return

        setIsVerifying(true)
        setError(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: captchaSession.sessionId,
                    userInput: userInput.trim()
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Verification failed')
            }

            const data = await response.json()
            setContactInfo(data.contactInfo)
            setIsVerified(true)
        } catch (error) {
            console.error('Error verifying CAPTCHA:', error)
            setError(error instanceof Error ? error.message : 'Verification failed. Please try again.')
            // Fetch a new CAPTCHA on verification failure
            await fetchCaptcha()
        } finally {
            setIsVerifying(false)
        }
    }

    // Handle dialog open/close
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            // Reset state when closing
            setCaptchaSession(null)
            setUserInput("")
            setContactInfo(null)
            setError(null)
            setIsVerified(false)
        } else {
            // Fetch CAPTCHA when opening
            fetchCaptcha()
        }
    }

    // Handle input submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        verifyCaptcha()
    }

    // Handle input key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isVerifying && userInput.trim()) {
            verifyCaptcha()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="default" size="lg" className={className}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {getText('contact.contactButtonText')}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <Card className="border-0 shadow-none">
                    {!isVerified && <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            {getText('contact.dialogTitle')}
                        </CardTitle>
                        <CardDescription>
                            {getText('contact.dialogDescription')}
                        </CardDescription>
                    </CardHeader>
                    }
                    <CardContent className="space-y-6">
                        {!isVerified ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-3">
                                    <Label htmlFor="captcha" className="text-sm font-medium">
                                        {getText('contact.verificationLabel')}
                                    </Label>

                                    {isLoadingCaptcha ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            <span className="ml-2 text-sm text-muted-foreground">{getText('contact.loadingVerification')}</span>
                                        </div>
                                    ) : captchaSession ? (
                                        <div className="space-y-3">
                                            <div className="p-4 bg-muted/50 rounded-lg text-center overflow-hidden">
                                                <div
                                                    className="text-2xl font-mono font-bold tracking-wider transition-all duration-300 ease-out"
                                                    style={{
                                                        color: captchaColor,
                                                        transform: captchaTransform,
                                                        textShadow: '0 0 10px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    {captchaSession.captchaText}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Input
                                                    id="captcha"
                                                    type="text"
                                                    placeholder={getText('contact.verificationPlaceholder')}
                                                    value={userInput}
                                                    onChange={handleInputChange}
                                                    onKeyPress={handleKeyPress}
                                                    disabled={isVerifying}
                                                    className={`flex-1 transition-transform duration-300 ${inputShake ? 'animate-shake' : ''
                                                        }`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={fetchCaptcha}
                                                    disabled={isLoadingCaptcha || isVerifying}
                                                    title={getText('contact.newChallengeTitle')}
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={!userInput.trim() || isVerifying}
                                            >
                                                {isVerifying ? (
                                                    <>
                                                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                                        {getText('contact.verifyingText')}
                                                    </>
                                                ) : (
                                                    getText('contact.verifyButton')
                                                )}
                                            </Button>
                                        </div>
                                    ) : null}

                                    {error && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <XCircle className="h-4 w-4" />
                                            {error}
                                        </div>
                                    )}

                                    <p className="text-xs text-muted-foreground text-center">
                                        {getText('contact.verificationNote')}
                                    </p>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 animate-in fade-in-50 duration-500">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{getText('contact.successTitle')}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        {getText('contact.successMessage')}
                                    </p>
                                </div>

                                {contactInfo && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{getText('contact.emailLabel')}</p>
                                                <a
                                                    href={`mailto:${contactInfo.email}`}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {contactInfo.email}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{getText('contact.phoneLabel')}</p>
                                                <a
                                                    href={`tel:${contactInfo.phone.replace(/[^\d]/g, '')}`}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">{getText('contact.discordLabel')}</p>
                                                <p className="text-sm text-primary font-mono">
                                                    {contactInfo.discord}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <p className="text-xs text-muted-foreground text-center">
                                        {getText('contact.closingNote')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}