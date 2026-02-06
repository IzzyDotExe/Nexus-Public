'use client';

import { Button } from "@/components/ui/button";
import { useTextContent } from "@/lib/hooks/useTextContent";

interface NoProjectsProps {
  onClearFilters: () => void
}

export function NoProjects({ onClearFilters }: NoProjectsProps) {
  const { getText } = useTextContent();
  return (
    <div className="text-center py-16">
      <p className="text-lg text-muted-foreground mb-4">{getText('projects.noResults')}</p>
      <Button onClick={onClearFilters} variant="outline">
        {getText('projects.clearFilters')}
      </Button>
    </div>
  )
}
