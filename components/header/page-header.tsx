"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/theme/theme-toggle"
import { LanguageToggle } from "@/components/theme/language-toggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import headerConfig from "@/config/header.json"
import { Typography } from "@/lib/common/atoms/typography"

interface PageHeaderProps {
  title?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title = "Nexus", children }: PageHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-500/50  backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 lg:px-10">
        <div className="flex items-center gap-10">
          <Link href={headerConfig.avatar.homeLink} className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={headerConfig.avatar.image} />
              <AvatarFallback>{headerConfig.avatar.fallback}</AvatarFallback>
            </Avatar>
            {title}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {children}
          
          {/* Social Media Buttons */}
          {headerConfig.socialLinks.map((link) => (
            <Button key={link.label} variant="ghost" size="icon" asChild>
              <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                <Image src={link.icon} alt={link.label} width={16} height={16} className="dark:invert dark:brightness-90" />
              </a>
            </Button>
          ))}
          
          <LanguageToggle />
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-14 border-b border-blue-500/10 bg-background px-4 py-4 lg:hidden shadow-sm shadow-blue-500/5">
          <div className="container mx-auto">
            <div className="flex flex-col gap-4">
              {children}              
              {/* Language and Theme Toggles - Mobile */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <LanguageToggle />
                <ModeToggle />
              </div>
              {/* Social Media Buttons - Mobile */}
              <div className="flex items-center gap-2 pt-2 border-t">
                {headerConfig.socialLinks.map((link) => (
                  <Button key={link.label} variant="ghost" size="icon" asChild>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                      <Image src={link.icon} alt={link.label} width={16} height={16} className="dark:invert dark:brightness-90" />
                    </a>
                  </Button>
                ))}
              </div>            </div>
          </div>
        </div>
      )}
    </header>
  )
}
