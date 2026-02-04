'use client';

import { Button } from "@/components/ui/button";
import { useTextContent } from "@/lib/hooks/useTextContent";

interface ProjectsErrorProps {
  onRetry: () => void
}

export function ProjectsError({ onRetry }: ProjectsErrorProps) {
  const { getText } = useTextContent();
  return (
    <main>
      <section className="relative flex min-h-[50vh] items-center overflow-hidden px-4 py-16">
        <div className="container relative z-10 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {getText('projects.title')}
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            {getText('projects.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center py-16">
            <div className="mb-6">
              <p className="text-lg font-semibold text-foreground mb-2">{getText('projects.errorTitle')}</p>
              <p className="text-muted-foreground mb-6">
                {getText('projects.errorMessage')}
              </p>
            </div>
            <Button onClick={onRetry} variant="default">
              {getText('projects.tryAgain')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
