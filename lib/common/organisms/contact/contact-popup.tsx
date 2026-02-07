"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { MessageCircle } from "lucide-react"
import { useTextContent } from "@/lib/hooks/useTextContent"
import { CaptchaForm } from "../../molecules/captcha/captcha-form"
import { CaptchaSession } from "@/lib/types/CaptchaSession"
import { generateRandomColor, generateRandomTransform } from "@/lib/utils/captcha"
import { ContactInfo } from "@/lib/types/ContactInfo"
import { ContactDetails } from "../../molecules/contact/contact-details"
import { ResultNote } from "../../atoms/note/result-note"
import { ClosingNote } from "../../atoms/note/closing-note"

interface ContactPopupProps {
    trigger?: React.ReactNode
    className?: string
}

export function ContactPopup({ trigger, className }: ContactPopupProps) {
    const { getText } = useTextContent();
    const [isOpen, setIsOpen] = useState(false)
    const [captchaSession, setCaptchaSession] = useState<CaptchaSession>()
    const [userInput, setUserInput] = useState("")
    const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [captchaColor, setCaptchaColor] = useState('#000000')
    const [captchaTransform, setCaptchaTransform] = useState('translate(0px, 0px) rotate(0deg)')
    const [contactInfo, setContactInfo] = useState<ContactInfo| null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isVerified, setIsVerified] = useState(false)

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
            setCaptchaSession(undefined)
            setUserInput("")
            setContactInfo(null)
            setError(null)
            setIsVerified(false)
        } else {
            // Fetch CAPTCHA when opening
            fetchCaptcha()
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
                            <CaptchaForm
                                onVerify={verifyCaptcha}
                                isVerifying={isVerifying}
                                fetchCaptcha={fetchCaptcha}
                                isLoadingCaptcha={isLoadingCaptcha}
                                captchaSession={captchaSession}
                                error={error}
                                captchaColor={captchaColor}
                                captchaTransform={captchaTransform}
                                userInput={userInput}
                                setUserInput={setUserInput}
                                setCaptchaColor={setCaptchaColor}
                                setCaptchaTransform={setCaptchaTransform}
                            />
                        ) : (
                            <div className="space-y-4 animate-in fade-in-50 duration-500">
                                <ResultNote icon={"success"} subtitle={getText('contact.successMessage')} title={getText('contact.successTitle')} />
                                {contactInfo && (
                                    <ContactDetails contactInfo={contactInfo} />
                                )}
                                <ClosingNote textContent={getText('contact.closingNote')} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}