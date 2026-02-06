
'use client'

import { useState, useEffect } from "react";
import { HalfScreenHero } from "@/lib/common/molecules/halfscreen-hero";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectsSection } from "@/components/projects/projects-section";
import { NoProjects } from "@/components/projects/no-projects";
import { ProjectsLoadingState } from "@/components/projects/projects-loading-state";
import { ProjectsError } from "@/components/projects/projects-error";
import { ProjectForm } from "@/components/projects/project-form";
import { useAdminMode } from "@/contexts/admin-context";
import { useTextContent } from "@/lib/hooks/useTextContent";

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  link: string
  image: string
  category: 'real-world' | 'personal' | 'games'
}

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects', {
      cache: 'no-store', // Cache the response for better performance
    })

    if (!res.ok) {
      throw new Error('Failed to fetch projects')
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export default function ProjectsPage() {
  const { isAdminMode } = useAdminMode();
  const { getText } = useTextContent();
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)

  const fetchProjectsData = async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await getProjects()
      setProjects(data || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setError(true)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectsData()
  }, [])

  // Get all unique tags from projects
  const allTags = Array.from(new Set(projects.flatMap(project => project.tech))).sort()

  // Filter projects based on selected tags
  const filteredProjects = selectedTags.length === 0
    ? projects
    : projects.filter(project =>
        selectedTags.some(tag => project.tech.includes(tag))
      )

  // Group filtered projects by category
  const groupedProjects = filteredProjects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = []
    }
    acc[project.category].push(project)
    return acc
  }, {} as Record<string, Project[]>)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  if (loading) {
    return <ProjectsLoadingState />
  }

  if (error) {
    return <ProjectsError onRetry={fetchProjectsData} />
  }

  if (projects.length === 0) {
    return <ProjectsError onRetry={fetchProjectsData} />
  }

  return (
    <main>
      <HalfScreenHero title={getText('projects.title')} subtitle={getText('projects.subtitle')}/>

      <section className="py-16 px-4">
        <div className="container mx-auto space-y-16">
          {isAdminMode && <ProjectForm />}
          
          <ProjectFilters
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            onClearFilters={clearFilters}
            totalProjects={projects.length}
            filteredCount={filteredProjects.length}
          />

          <ProjectsSection
            title={getText('projects.sectionTitles.realWorld')}
            subtitle={getText('projects.sectionSubtitles.realWorld')}
            projects={groupedProjects['real-world'] || []}
          />

          <ProjectsSection
            title={getText('projects.sectionTitles.personal')}
            subtitle={getText('projects.sectionSubtitles.personal')}
            projects={groupedProjects['personal'] || []}
          />

          <ProjectsSection
            title={getText('projects.sectionTitles.games')}
            subtitle={getText('projects.sectionSubtitles.games')}
            projects={groupedProjects['games'] || []}
          />

          {filteredProjects.length === 0 && selectedTags.length > 0 && (
            <NoProjects onClearFilters={clearFilters} />
          )}
        </div>
      </section>
    </main>
  );
}