import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ProjectCardClient } from "./project-card-client";

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  link: string
  image: string
  category: 'real-world' | 'personal' | 'games'
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="relative h-full">
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grow">
          <h5 className="mb-2 font-semibold">Key Technologies:</h5>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" asChild>
            <Link href={project.link}>View Project</Link>
          </Button>
        </CardFooter>
      </Card>
      <ProjectCardClient projectId={project.id} />
    </div>
  )
}
