import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTextContent } from "@/lib/hooks";
import { CaptchaSession } from "@/lib/types/CaptchaSession";
import { generateRandomColor, generateRandomTransform } from "@/lib/utils/captcha";
import { RefreshCw, XCircle } from "lucide-react";
import { Dispatch, KeyboardEventHandler, SetStateAction, SubmitEventHandler, useState } from "react";


interface CaptchaFormProps {
    fetchCaptcha: () => void;
    onVerify: () => void;
    isLoadingCaptcha: boolean;
    captchaSession?: CaptchaSession;
    error: string | null;
    userInput: string;
    setUserInput: Dispatch<SetStateAction<string>>;
    captchaColor: string;
    setCaptchaColor: Dispatch<SetStateAction<string>>;
    captchaTransform: string;
    setCaptchaTransform: Dispatch<SetStateAction<string>>;
    isVerifying: boolean;
}

export function CaptchaForm({
    isVerifying,
    fetchCaptcha,
    isLoadingCaptcha,
    captchaSession,
    userInput,
    setUserInput,
    captchaColor,
    setCaptchaColor,
    captchaTransform,
    setCaptchaTransform,
    error,
    onVerify,
}: CaptchaFormProps) {

    const [inputShake, setInputShake] = useState(false)
    const { getText } = useTextContent();

        // Handle input change with visual effects
    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserInput(value)

        // Trigger shake animation
        setInputShake(true)
        setTimeout(() => setInputShake(false), 300)

        // Change CAPTCHA color and position
        setCaptchaColor(generateRandomColor())
        setCaptchaTransform(generateRandomTransform())
    }

    // Handle input submission
    const handleSubmit : SubmitEventHandler = (e) => {
        e.preventDefault()
        onVerify()
    }

    // Handle input key press
    const handleKeyPress : KeyboardEventHandler = (e) => {
        if (e.key === 'Enter' && !isVerifying && userInput.trim()) {
            onVerify()
        }
    }

    return (
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
    )
}