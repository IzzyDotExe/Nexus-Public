import { ProjectCard } from "./project-card";

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  link: string
  image: string
  category: 'real-world' | 'personal' | 'games'
}

interface ProjectsSectionProps {
  title: string
  subtitle?: string
  projects: Project[]
}

export function ProjectsSection({ title, subtitle, projects }: ProjectsSectionProps) {
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mb-4">
            {subtitle}
          </p>
        )}
        <div className="w-16 h-1 bg-primary rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
