'use client';

import { Button } from "@/components/ui/button";
import { useTextContent } from "@/lib/hooks/useTextContent";

interface ProjectFiltersProps {
  allTags: string[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  onClearFilters: () => void
  totalProjects: number
  filteredCount: number
}

export function ProjectFilters({
  allTags,
  selectedTags,
  onToggleTag,
  onClearFilters,
  totalProjects,
  filteredCount
}: ProjectFiltersProps) {
  const { getText } = useTextContent();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">{getText('projects.filterByTech')}</span>
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleTag(tag)}
            className="text-xs"
          >
            {tag}
          </Button>
        ))}
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {getText('projects.clearAll')}
          </Button>
        )}
      </div>
      {selectedTags.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {getText('projects.showingProjects', { filtered: filteredCount, total: totalProjects })}
        </p>
      )}
    </div>
  )
}
