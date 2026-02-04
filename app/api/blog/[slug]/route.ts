import { NextRequest, NextResponse } from 'next/server';
import { getBlogPost, updateBlogPost, archiveBlogPost, unarchiveBlogPost } from '@/lib/utils/blog';
import { UpdateBlogPostRequest } from '@/lib/types/blog';
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
 * GET /api/blog/[slug]
 * Fetch a single blog post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getBlogPost(slug);
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/[slug]
 * Update a blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthorized = await requireAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body: UpdateBlogPostRequest = await request.json();
    
    const post = await updateBlogPost(slug, body);
    
    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[slug]
 * Archive a blog post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuthorized = await requireAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    let post;
    
    if (action === 'unarchive') {
      post = await unarchiveBlogPost(slug);
    } else {
      post = await archiveBlogPost(slug);
    }
    
    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error archiving/unarchiving blog post:', error);
    
    if (error instanceof Error && (error.message.includes('not found') || error.message.includes('already archived') || error.message.includes('not archived'))) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to archive/unarchive blog post' },
      { status: 500 }
    );
  }
}
