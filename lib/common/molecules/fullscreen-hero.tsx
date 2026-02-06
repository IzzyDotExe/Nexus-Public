"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PageHeroProps {
  children?: React.ReactNode,
  title: string
  subtitle?: string
  eyebrow?: string
  ctaText?: string
  onCtaClick?: () => void
  imageSrc?: string
  imageAlt?: string
  socialLinks?: Array<{ label: string; href: string; icon: string }>
}

export function PageHero({
  title,
  children,
  subtitle,
  eyebrow,
  ctaText = "Get Started",
  onCtaClick,
  imageSrc,
  imageAlt = "Hero image",
  socialLinks = []
}: PageHeroProps) {

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4">
      <div className="container relative z-10 mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          {eyebrow && (
            <p className="mb-4 text-lg font-medium text-muted-foreground sm:text-xl lg:text-2xl">
              {eyebrow}
            </p>
          )}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              {subtitle}
            </p>
          )}
          <div>
            {children}          
          </div>

          {/* Social Media Buttons */}
          <div className="flex items-center gap-3 mt-8">
            {socialLinks.map((link) => (
              <Button key={link.label} variant="outline" size="icon" asChild>
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                  <Image src={link.icon} alt={link.label} width={16} height={16} className="dark:invert dark:brightness-90" />
                </a>
              </Button>
            ))}
          </div>

        </div>
        {imageSrc && (
          <div className="flex items-center justify-center lg:justify-end">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={500}
              height={500}
              className="h-auto w-full max-w-md lg:max-w-lg"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
