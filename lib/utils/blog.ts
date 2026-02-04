import fs from 'fs/promises';
import path from 'path';
import { BlogPost, BlogMetadata, BlogPostSummary } from '@/lib/types/blog';

const BLOG_ROOT = path.join(process.cwd(), 'blog');
const LIVE_DIR = path.join(BLOG_ROOT, 'live');
const ARCHIVE_DIR = path.join(BLOG_ROOT, 'archive');
const IMAGES_DIR = path.join(BLOG_ROOT, 'images');

/**
 * Parse a blog post markdown file
 * Format:
 * Title
 * Description
 * [[image name]]
 * #tag #tag #tag
 * 
 * --
 * Content
 */
export function parseBlogPost(content: string, slug: string, filePath: string, status: 'live' | 'archived'): BlogPost {
  const lines = content.split('\n');
  
  // Extract metadata
  const title = lines[0]?.trim() || '';
  const description = lines[1]?.trim() || '';
  
  // Find header image (format: [[image name]])
  let headerImage: string | undefined;
  const imageMatch = lines[2]?.match(/\[\[(.+?)\]\]/);
  if (imageMatch) {
    headerImage = imageMatch[1];
  }
  
  // Find tags (format: #tag #tag)
  const tags: string[] = [];
  const tagLine = lines[3]?.trim() || '';
  const tagMatches = tagLine.match(/#[\w-]+/g);
  if (tagMatches) {
    tags.push(...tagMatches.map(tag => tag.substring(1)));
  }
  
  // Find content separator (--) and extract content
  const separatorIndex = lines.findIndex(line => line.trim() === '--');
  const postContent = separatorIndex >= 0 
    ? lines.slice(separatorIndex + 1).join('\n').trim()
    : '';
  
  // Extract year from file path
  const yearMatch = filePath.match(/[\\/](\d{4})[\\/]/);
  const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
  
  // Get file stats for dates
  const now = new Date();
  
  return {
    slug,
    title,
    description,
    headerImage,
    tags,
    content: postContent,
    filePath,
    year,
    status,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Format a blog post to markdown string
 */
export function formatBlogPost(post: Omit<BlogPost, 'slug' | 'filePath' | 'status' | 'year' | 'createdAt' | 'updatedAt'>): string {
  const lines: string[] = [];
  
  lines.push(post.title);
  lines.push(post.description);
  
  if (post.headerImage) {
    lines.push(`[[${post.headerImage}]]`);
  } else {
    lines.push('');
  }
  
  if (post.tags.length > 0) {
    lines.push(post.tags.map(tag => `#${tag}`).join(' '));
  } else {
    lines.push('');
  }
  
  lines.push('');
  lines.push('--');
  lines.push(post.content);
  
  return lines.join('\n');
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(includeOldArchived = false): Promise<BlogPostSummary[]> {
  const posts: BlogPostSummary[] = [];
  const currentDate = new Date();
  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  // Read live posts
  try {
    const liveYears = await fs.readdir(LIVE_DIR);
    for (const year of liveYears) {
      const yearPath = path.join(LIVE_DIR, year);
      const stats = await fs.stat(yearPath);
      
      if (stats.isDirectory()) {
        const files = await fs.readdir(yearPath);
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(yearPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const slug = file.replace('.md', '');
            const post = parseBlogPost(content, slug, filePath, 'live');
            
            posts.push({
              slug: post.slug,
              title: post.title,
              description: post.description,
              headerImage: post.headerImage,
              tags: post.tags,
              year: post.year,
              status: post.status,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
            });
          }
        }
      }
    }
  } catch (error) {
    // Live directory might not exist yet
  }
  
  // Read archived posts
  try {
    const archiveYears = await fs.readdir(ARCHIVE_DIR);
    for (const year of archiveYears) {
      const yearPath = path.join(ARCHIVE_DIR, year);
      const stats = await fs.stat(yearPath);
      
      if (stats.isDirectory()) {
        const files = await fs.readdir(yearPath);
        for (const file of files) {
          if (file.endsWith('.md')) {
            const filePath = path.join(yearPath, file);
            const fileStats = await fs.stat(filePath);
            const archivedDate = fileStats.mtime;
            
            // Check if post is older than 1 year
            const isOldArchived = archivedDate < oneYearAgo;
            
            // Skip old archived posts unless explicitly requested
            if (isOldArchived && !includeOldArchived) {
              continue;
            }
            
            const content = await fs.readFile(filePath, 'utf-8');
            const slug = file.replace('.md', '');
            const post = parseBlogPost(content, slug, filePath, 'archived');
            
            posts.push({
              slug: post.slug,
              title: post.title,
              description: post.description,
              headerImage: post.headerImage,
              tags: post.tags,
              year: post.year,
              status: post.status,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              archivedAt: archivedDate,
              isOldArchived,
            });
          }
        }
      }
    }
  } catch (error) {
    // Archive directory might not exist yet
  }
  
  // Sort by date (newest first)
  posts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  
  return posts;
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Try live posts first
  try {
    const liveYears = await fs.readdir(LIVE_DIR);
    for (const year of liveYears) {
      const filePath = path.join(LIVE_DIR, year, `${slug}.md`);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return parseBlogPost(content, slug, filePath, 'live');
      } catch {
        continue;
      }
    }
  } catch {
    // Live directory might not exist
  }
  
  // Try archived posts
  try {
    const archiveYears = await fs.readdir(ARCHIVE_DIR);
    for (const year of archiveYears) {
      const filePath = path.join(ARCHIVE_DIR, year, `${slug}.md`);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return parseBlogPost(content, slug, filePath, 'archived');
      } catch {
        continue;
      }
    }
  } catch {
    // Archive directory might not exist
  }
  
  return null;
}

/**
 * Create a new blog post
 */
export async function createBlogPost(
  slug: string,
  data: { title: string; description: string; headerImage?: string; tags: string[]; content: string }
): Promise<BlogPost> {
  const year = new Date().getFullYear();
  const yearDir = path.join(LIVE_DIR, year.toString());
  
  // Create year directory if it doesn't exist
  await fs.mkdir(yearDir, { recursive: true });
  
  const filePath = path.join(yearDir, `${slug}.md`);
  
  // Check if post already exists
  try {
    await fs.access(filePath);
    throw new Error('Blog post with this slug already exists');
  } catch (error) {
    // File doesn't exist, continue
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
  
  // Create markdown content
  const mdContent = formatBlogPost(data);
  
  // Write file
  await fs.writeFile(filePath, mdContent, 'utf-8');
  
  // Return the created post
  return parseBlogPost(mdContent, slug, filePath, 'live');
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  slug: string,
  data: Partial<{ title: string; description: string; headerImage?: string; tags: string[]; content: string }>
): Promise<BlogPost> {
  const existingPost = await getBlogPost(slug);
  
  if (!existingPost) {
    throw new Error('Blog post not found');
  }
  
  // Merge updates
  const updatedPost = {
    title: data.title ?? existingPost.title,
    description: data.description ?? existingPost.description,
    headerImage: data.headerImage ?? existingPost.headerImage,
    tags: data.tags ?? existingPost.tags,
    content: data.content ?? existingPost.content,
  };
  
  // Create markdown content
  const mdContent = formatBlogPost(updatedPost);
  
  // Write file
  await fs.writeFile(existingPost.filePath, mdContent, 'utf-8');
  
  // Return the updated post
  return parseBlogPost(mdContent, slug, existingPost.filePath, existingPost.status);
}

/**
 * Archive a blog post (move from live to archive)
 */
export async function archiveBlogPost(slug: string): Promise<BlogPost> {
  const post = await getBlogPost(slug);
  
  if (!post) {
    throw new Error('Blog post not found');
  }
  
  if (post.status === 'archived') {
    throw new Error('Blog post is already archived');
  }
  
  const year = post.year;
  const archiveYearDir = path.join(ARCHIVE_DIR, year.toString());
  
  // Create archive year directory if it doesn't exist
  await fs.mkdir(archiveYearDir, { recursive: true });
  
  const newFilePath = path.join(archiveYearDir, `${slug}.md`);
  
  // Move file
  await fs.rename(post.filePath, newFilePath);
  
  // Return the archived post
  const content = await fs.readFile(newFilePath, 'utf-8');
  return parseBlogPost(content, slug, newFilePath, 'archived');
}

/**
 * Unarchive a blog post (move from archive to live)
 */
export async function unarchiveBlogPost(slug: string): Promise<BlogPost> {
  const post = await getBlogPost(slug);
  
  if (!post) {
    throw new Error('Blog post not found');
  }
  
  if (post.status === 'live') {
    throw new Error('Blog post is not archived');
  }
  
  const year = new Date().getFullYear();
  const liveYearDir = path.join(LIVE_DIR, year.toString());
  
  // Create live year directory if it doesn't exist
  await fs.mkdir(liveYearDir, { recursive: true });
  
  const newFilePath = path.join(liveYearDir, `${slug}.md`);
  
  // Move file
  await fs.rename(post.filePath, newFilePath);
  
  // Return the unarchived post
  const content = await fs.readFile(newFilePath, 'utf-8');
  return parseBlogPost(content, slug, newFilePath, 'live');
}

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
