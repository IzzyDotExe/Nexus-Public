# Blog System Documentation

## Overview

The blog system is a file-based content management system that stores blog posts as Markdown files and serves them through a Next.js API.

## Directory Structure

```
blog/
├── images/           # Blog post images
├── live/            # Active blog posts
│   └── [year]/      # Posts organized by year
│       └── post.md
└── archive/         # Archived blog posts
    └── [year]/
        └── post.md
```

## Markdown File Format

Blog posts use a custom Markdown format:

```md
Title
Description
[[image-name.jpg]]
#tag1 #tag2 #tag3

--
Content goes here...

You can embed images: [[image-name.jpg]]
```

### Structure:
1. **Line 1**: Post title
2. **Line 2**: Short description
3. **Line 3**: Header image (optional) - use `[[filename]]` syntax
4. **Line 4**: Tags - space-separated, prefixed with `#`
5. **Line 5**: Empty line
6. **Line 6**: Separator `--`
7. **Lines 7+**: Post content in Markdown

## API Endpoints

### GET `/api/blog`
Fetch all blog posts.

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "slug": "post-slug",
      "title": "Post Title",
      "description": "Post description",
      "headerImage": "image.jpg",
      "tags": ["tag1", "tag2"],
      "year": 2026,
      "status": "live",
      "createdAt": "2026-02-03T...",
      "updatedAt": "2026-02-03T...",
      "isOldArchived": false
    }
  ]
}
```

### GET `/api/blog/[slug]`
Fetch a single blog post by slug.

**Response:**
```json
{
  "success": true,
  "post": {
    "slug": "post-slug",
    "title": "Post Title",
    "description": "Post description",
    "headerImage": "image.jpg",
    "tags": ["tag1", "tag2"],
    "content": "Full markdown content...",
    "year": 2026,
    "status": "live",
    "createdAt": "2026-02-03T...",
    "updatedAt": "2026-02-03T..."
  }
}
```

### POST `/api/blog`
Create a new blog post.

**Request Body:**
```json
{
  "title": "Post Title",
  "description": "Post description",
  "headerImage": "image.jpg",
  "tags": ["tag1", "tag2"],
  "content": "Markdown content..."
}
```

**Response:**
```json
{
  "success": true,
  "post": { /* created post object */ }
}
```

### PUT `/api/blog/[slug]`
Update an existing blog post.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "headerImage": "new-image.jpg",
  "tags": ["tag1", "tag2"],
  "content": "Updated content..."
}
```

All fields are optional - only provided fields will be updated.

### DELETE `/api/blog/[slug]`
Archive a blog post (moves from `live/` to `archive/`).

**Query Parameters:**
- `action=unarchive` - Unarchive a post (move from `archive/` to `live/`)

**Response:**
```json
{
  "success": true,
  "post": { /* archived post object */ }
}
```

## Filtering Rules

### Frontend Display Rules:
1. **Live posts** - Always visible
2. **Archived posts < 1 year old** - Visible with "Archived" badge
3. **Archived posts > 1 year old** - Hidden from frontend

### Backend Behavior:
- All posts are accessible via API
- Archive date is tracked using file modification time
- Use `includeOldArchived` parameter in `getAllBlogPosts()` to include old archived posts

## Utility Functions

Located in `lib/utils/blog.ts`:

- `parseBlogPost()` - Parse markdown file to BlogPost object
- `formatBlogPost()` - Convert BlogPost object to markdown
- `getAllBlogPosts()` - Get all posts with filtering
- `getBlogPost(slug)` - Get single post
- `createBlogPost()` - Create new post
- `updateBlogPost()` - Update existing post
- `archiveBlogPost()` - Move post to archive
- `unarchiveBlogPost()` - Move post back to live
- `generateSlug()` - Generate URL-safe slug from title

## Components

### BlogList
Main blog listing component with search and tag filtering.

**Props:**
```tsx
{
  posts: BlogPostSummary[]
}
```

### BlogCard
Individual blog post card in the list.

**Props:**
```tsx
{
  post: BlogPostSummary
}
```

### BlogContent
Renders markdown content with syntax highlighting and image support.

**Props:**
```tsx
{
  content: string
}
```

### BlogFilters
Search and tag filtering UI.

**Props:**
```tsx
{
  allTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}
```

## Images

Place images in `blog/images/` directory. Reference them in markdown using:
- Header: `[[image-name.jpg]]` on line 3
- Inline: `[[image-name.jpg]]` anywhere in content

Images are served from `/blog/images/` path.

## Creating a New Post

1. Create a `.md` file in `blog/live/[year]/`
2. Follow the markdown format (title, description, image, tags, --, content)
3. The post will automatically appear on the frontend

Alternatively, use the POST API to create posts programmatically.

## Archiving Posts

To archive a post, use the DELETE endpoint:
```
DELETE /api/blog/[slug]
```

This moves the post from `blog/live/[year]/` to `blog/archive/[year]/`.

To unarchive:
```
DELETE /api/blog/[slug]?action=unarchive
```

## TypeScript Types

Located in `lib/types/blog.ts`:

- `BlogPost` - Complete post with content
- `BlogPostSummary` - Post metadata for listings
- `BlogMetadata` - Base metadata
- `CreateBlogPostRequest` - API request type
- `UpdateBlogPostRequest` - API request type
