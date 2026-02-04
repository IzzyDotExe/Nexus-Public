import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic';

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  link: string
  image: string
  category: 'real-world' | 'personal' | 'games'
}

async function loadProjects(): Promise<Project[]> {
  const projectsPath = path.join(process.cwd(), 'data', 'projects.json')
  const raw = await readFile(projectsPath, 'utf-8')
  return JSON.parse(raw)
}

async function saveProjects(projects: Project[]): Promise<void> {
  const projectsPath = path.join(process.cwd(), 'data', 'projects.json')
  await writeFile(projectsPath, JSON.stringify(projects, null, 2), 'utf-8')
}

async function loadBlogAuthConfig() {
  const configPath = path.join(process.cwd(), 'config', 'blog-auth.json')
  const raw = await readFile(configPath, 'utf-8')
  return JSON.parse(raw) as { adminApiKey: string }
}

async function requireAdminAuth(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  const config = await loadBlogAuthConfig()
  return apiKey === config.adminApiKey
}

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET(request: NextRequest) {
  try {
    const projects = await loadProjects()
    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await requireAdminAuth(request)
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, tech, link, image, category } = body

    if (!title || !description || !tech || !link || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const projects = await loadProjects()
    const id = generateId(title)

    // Check if project with this ID already exists
    if (projects.some(p => p.id === id)) {
      return NextResponse.json(
        { success: false, error: 'Project with this title already exists' },
        { status: 409 }
      )
    }

    const newProject: Project = {
      id,
      title,
      description,
      tech,
      link,
      image: image || '',
      category
    }

    projects.push(newProject)
    await saveProjects(projects)

    return NextResponse.json({
      success: true,
      data: newProject
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}