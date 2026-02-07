"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ReactNode } from "react"

interface PageHeroProps {
  children?: React.ReactNode,
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: ReactNode
  imageSrc?: string
  imageAlt?: string
  socialLinks?: Array<{ label: string; href: string; icon: string }>
}

export function PageHero({
  title,
  children,
  subtitle,
  eyebrow,
  imageSrc,
  imageAlt = "Hero image",
  socialLinks = []
}: PageHeroProps) {

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4">
      <div className="container relative z-10 mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          {eyebrow && (
              eyebrow
          )}
          {title}
          {subtitle && (
              subtitle
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
