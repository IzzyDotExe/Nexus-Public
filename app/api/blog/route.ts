import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts, createBlogPost, generateSlug } from '@/lib/utils/blog';
import { CreateBlogPostRequest } from '@/lib/types/blog';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

async function loadBlogAuthConfig() {
  const configPath = path.join(process.cwd(), 'config', 'blog-auth.json');
  const raw = await readFile(configPath, 'utf-8');
  return JSON.parse(raw) as { adminApiKey: string };
}

async function requireAdminAuth(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const config = await loadBlogAuthConfig();
  return apiKey === config.adminApiKey;
}

/**
 * GET /api/blog
 * Fetch all blog posts
 */
export async function GET(request: NextRequest) {
  try {
    const posts = await getAllBlogPosts();
    
    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog
 * Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    const isAuthorized = await requireAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateBlogPostRequest = await request.json();
    
    const { title, description, headerImage, tags, content } = body;
    
    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and content are required' },
        { status: 400 }
      );
    }
    
    // Generate slug from title
    const slug = generateSlug(title);
    
    // Create blog post
    const post = await createBlogPost(slug, {
      title,
      description,
      headerImage,
      tags: tags || [],
      content,
    });
    
    return NextResponse.json({
      success: true,
      post,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
