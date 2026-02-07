'use client';

import { Button } from "@/components/ui/button";
import { Typography } from "@/lib/common/atoms/typography";

interface NoProjectsProps {
  onClearFilters: () => void
}

export function NoProjects({ onClearFilters }: NoProjectsProps) {
  return (
    <div className="text-center py-16">
      <Typography 
        textKey="projects.noResults" 
        as="p"
        className="text-lg text-muted-foreground mb-4"
      />
      <Button onClick={onClearFilters} variant="outline">
        <Typography textKey="projects.clearFilters" />
      </Button>
    </div>
  )
}
