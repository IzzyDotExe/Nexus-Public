'use client';

import { useTextContent } from "@/lib/hooks/useTextContent";

interface HalfScreenHeroProps {
  title: string,
  subtitle: string
}

export function HalfScreenHero({
  title,
  subtitle
} : HalfScreenHeroProps) {
  const { getText } = useTextContent();
  return (
    <section className="relative flex min-h-[50vh] items-center overflow-hidden px-4 py-16">
      <div className="container relative z-10 mx-auto text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
