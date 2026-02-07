# Nexus - Personal Portfolio & Blog Platform

A modern, multilingual personal portfolio and blog website built with Next.js 14+, featuring a comprehensive internationalization system, dynamic project showcase, and markdown-based blog.

## Features

- **🌍 Multilingual Support**: Full internationalization with English and French translations
- **📝 Markdown Blog System**: File-based blog with frontmatter metadata and automatic archiving
- **💼 Dynamic Projects Showcase**: Filterable project gallery with technology tags
- **🎨 Dark/Light Mode**: Built-in theme switcher with system preference support
- **📱 Fully Responsive**: Mobile-first design that works on all devices
- **⚡ Fast & Modern**: Built with Next.js 14+ App Router and React Server Components
- **🎯 SEO Optimized**: Proper metadata and semantic HTML structure
- **🛡️ Human Verification**: Captcha-protected contact form to prevent spam

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nexus
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Personalizing Your Site

Update the following configuration files to customize your site:

#### 1. **Translation Files** (`public/locales/`)
- `en.json` - English translations
- `fr.json` - French translations

Edit these files to change:
- Your name and title
- Navigation labels
- Page content and subtitles
- Project and blog text

#### 2. **Header Configuration** (`config/header.json`)
```json
{
  "avatar": {
    "image": "/your-avatar.jpg",
    "fallback": "YI",
    "homeLink": "/"
  },
  "socialLinks": [
    {
      "label": "GitHub",
      "href": "https://github.com/yourusername",
      "icon": "/github.svg"
    }
  ]
}
```

#### 3. **Page Configuration** (`config/pages.json`)
```json
{
  "pages": {
    "home": {
      "heroImage": "/your-hero-image.png",
      "heroImageAlt": "Your Name - Your Title",
      "socialLinks": [...]
    }
  }
}
```

#### 4. **Contact Information** (`config/contact.json`)
Update with your contact details (protected by captcha verification)

#### 5. **Projects** (`data/projects.json`)
Add your projects with:
- Title, description, and category
- Technologies used
- Links to live demo and source code
- Project images

### Adding Blog Posts

Create markdown files in `blog/live/YYYY/` directory:

```markdown
---
title: "Your Blog Post Title"
date: "2026-02-04"
excerpt: "A brief description of your post"
author: "Your Name"
tags: ["tag1", "tag2"]
---

Your blog content here...
```

To archive posts, move them to `blog/archive/YYYY/`

## Project Structure

```
nexus/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── projects/          # Projects pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── blog/             # Blog-specific components
│   ├── header/           # Header navigation
│   ├── home/             # Home page components
│   ├── projects/         # Project components
│   ├── theme/            # Theme & language toggles
│   └── ui/               # Reusable UI components
├── config/               # Configuration files
│   ├── header.json      # Header & social links
│   ├── pages.json       # Page-specific config
│   ├── contact.json     # Contact information
│   └── blog-auth.json   # Blog authentication
├── contexts/            # React contexts
│   ├── language-context.tsx
│   ├── admin-context.tsx
│   └── theme-provider.tsx
├── lib/                 # Utility libraries
│   ├── hooks/          # Custom React hooks
│   ├── molecules/      # Composite components
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
├── blog/               # Blog markdown files
│   ├── live/          # Published posts
│   └── archive/       # Archived posts
├── data/              # JSON data files
│   └── projects.json  # Projects data
├── public/            # Static assets
│   └── locales/       # Translation files
│       ├── en.json
│       └── fr.json
└── README.md
```

## Key Technologies

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Fonts**: Geist Sans, Geist Mono, JetBrains Mono
- **Markdown**: gray-matter for frontmatter parsing
- **Icons**: Lucide React

## Features Details

### Internationalization
The site supports multiple languages through a custom translation system:
- Language switcher in header
- Persistent language selection (localStorage)
- Fallback to default language
- All UI text externalized to JSON files

### Blog System
- Markdown-based with frontmatter metadata
- Automatic date-based sorting
- Archive system for old posts
- Tag-based filtering
- API routes for fetching posts

### Projects Showcase
- Technology-based filtering
- Categorized display (Real World, Personal, Games)
- Responsive card layout
- External and repository links

### Contact Form
- Human verification with dynamic math captcha
- Protected contact information reveal
- Configurable contact details

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

### Deploy Elsewhere

Build the production version:

```bash
npm run build
npm start
```

The site will be built into the `.next` directory and ready to serve.

## Customization Tips

1. Replace "John doe" with your name
2. Update social media icons in `/public/` (github.svg, linkedin.svg, spotify.svg)
3. Modify color scheme in `tailwind.config.ts`
4. Adjust theme colors in `app/globals.css`
5. Update metadata in `app/layout.tsx`
6. Add images and text content

## Admin System

The site includes a built-in admin system for managing projects and blog posts without editing files directly.

### Setting Up Admin Access

1. **Configure Authentication** (`config/blog-auth.json`):
```json
{
  "password": "your-secure-password"
}
```
⚠️ **Important**: Change the default password and never commit sensitive passwords to version control in production!

2. **Access Admin Mode**:
   - Press `Ctrl + Alt + Shift + A` (or `Cmd + Alt + Shift + A` on Mac) while on the Projects or Blog pages
   - Enter your password from `blog-auth.json`
   - Admin controls will appear

### Managing Projects

**Via Admin UI:**
1. Navigate to `/projects`
2. Activate admin mode (`Ctrl + Alt + Shift + A`)
3. Use the "Add Project" form that appears
4. Fill in:
   - Title, description, and category
   - Technologies (comma-separated)
   - External link and repository URL
   - Featured status
5. Submit to save to `data/projects.json`

**Manual Editing:**
Create `data/projects.json`:
```json
{
  "id": "puzzle-quest",
  "title": "Puzzle Quest",
  "description": "An engaging puzzle game with 50+ levels, achievements system, and beautiful animations.",
  "tech": ["Phaser", "TypeScript", "LocalStorage API"],
  "link": "https://github.com/yourusername/puzzle-quest",
  "image": "/projects/puzzle.png",
  "category": "games"
}
```

### Managing Blog Posts

**Via Admin UI:**
1. Navigate to `/blog`
2. Activate admin mode (`Ctrl + Alt + Shift + A`)
3. Use the "Create Post" form that appears
4. Fill in:
   - Title, slug, and author
   - Tags (comma-separated)
   - Excerpt and content (Markdown supported)
5. Submit to create markdown file in `blog/live/YYYY/`

**Manual Editing:**
Create markdown files in `blog/live/YYYY/slug.md`:
```markdown
---
title: "Post Title"
date: "2026-02-04"
excerpt: "Brief description"
author: "Your Name"
tags: ["tag1", "tag2"]
---

Your markdown content here...
```

### Admin Features

- **Live Preview**: See changes immediately
- **File Management**: Automatically creates proper directory structure
- **Validation**: Ensures required fields are present
- **Date Handling**: Auto-generates dates and organizes by year

### Security Notes

- Admin mode is session-based (localStorage)
- Password is checked against `config/blog-auth.json`
- Consider implementing proper authentication for production
- Use environment variables for sensitive data in production

## License

Feel free to use this project as a template for your own portfolio!

## Support

For issues or questions, please open an issue in the GitHub repository.
