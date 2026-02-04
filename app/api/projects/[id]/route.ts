import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { Project } from '../route'

export const dynamic = 'force-dynamic';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projects = await loadProjects()
    const project = projects.find(p => p.id === id)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await requireAdminAuth(request)
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, tech, link, image, category } = body

    const projects = await loadProjects()
    const index = projects.findIndex(p => p.id === id)

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update the project while keeping the same ID
    projects[index] = {
      ...projects[index],
      ...(title && { title }),
      ...(description && { description }),
      ...(tech && { tech }),
      ...(link && { link }),
      ...(image !== undefined && { image }),
      ...(category && { category })
    }

    await saveProjects(projects)

    return NextResponse.json({
      success: true,
      data: projects[index]
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await requireAdminAuth(request)
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const projects = await loadProjects()
    const index = projects.findIndex(p => p.id === id)

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const deletedProject = projects[index]
    projects.splice(index, 1)
    await saveProjects(projects)

    return NextResponse.json({
      success: true,
      data: deletedProject
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
