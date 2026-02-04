"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CaptchaProps {
  onVerify?: (isValid: boolean) => void
  className?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export function Captcha({ onVerify, className, difficulty = 'hard' }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Generate random CAPTCHA text based on difficulty
  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    const operators = '+-'

    let result = ''

    switch (difficulty) {
      case 'easy':
        // Simple alphanumeric
        for (let i = 0; i < 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        break

      case 'medium':
        // Mixed alphanumeric
        for (let i = 0; i < 5; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        break

      case 'hard':
        // Math problem
        const num1 = Math.floor(Math.random() * 10) + 1
        const num2 = Math.floor(Math.random() * 10) + 1
        const operator = operators.charAt(Math.floor(Math.random() * operators.length))
        const problem = `${num1} ${operator} ${num2}`
        result = problem
        break
    }

    return result
  }, [difficulty])

  // Generate new CAPTCHA on mount and difficulty change
  useEffect(() => {
    setCaptchaText(generateCaptcha())
  }, [generateCaptcha])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setUserInput('')
    setIsVerified(false)
    onVerify?.(false)

    setTimeout(() => {
      setCaptchaText(generateCaptcha())
      setIsLoading(false)
    }, 300)
  }

  // Handle verification
  const handleVerify = () => {
    let isValid = false

    if (difficulty === 'hard') {
      // Evaluate math expression safely
      try {
        // Safer math evaluation without eval
        const expression = captchaText.replace(/\s/g, '')
        const result = Function('"use strict"; return (' + expression + ')')()
        isValid = parseInt(userInput) === result
      } catch {
        isValid = false
      }
    } else {
      // String comparison
      isValid = userInput.toLowerCase() === captchaText.toLowerCase()
    }

    setIsVerified(isValid)
    onVerify?.(isValid)
  }

  // Auto-verify on input change for non-hard difficulty
  useEffect(() => {
    if (difficulty !== 'hard' && userInput.length > 0) {
      handleVerify()
    }
  }, [userInput, difficulty])

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor="captcha" className="text-sm font-medium">
        Human Verification
      </Label>

      <div className="flex items-center space-x-3">
        {/* CAPTCHA Display */}
        <div className="flex-1">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
            <span
              className="font-mono text-lg font-bold tracking-wider select-none"
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                transform: `rotate(${Math.random() * 10 - 5}deg)`,
                color: `hsl(${Math.random() * 360}, 70%, 40%)`
              }}
            >
              {captchaText}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8 p-0"
              aria-label="Refresh CAPTCHA"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Verification Status */}
        {isVerified && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        {userInput.length > 0 && !isVerified && difficulty === 'hard' && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Input Field */}
      <div className="space-y-2">
        <Input
          id="captcha"
          type="text"
          placeholder={difficulty === 'hard' ? "Solve the math problem" : "Enter the characters above"}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={cn(
            "font-mono",
            isVerified && "border-green-500 bg-green-50 dark:bg-green-950",
            userInput.length > 0 && !isVerified && difficulty === 'hard' && "border-red-500"
          )}
          disabled={isVerified}
        />

        {difficulty === 'hard' && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleVerify}
            disabled={isVerified || userInput.length === 0}
            className="w-full"
          >
            Verify Answer
          </Button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        {difficulty === 'hard'
          ? "Solve the math problem shown above"
          : "Type the characters you see above (case insensitive)"
        }
      </p>
    </div>
  )
}