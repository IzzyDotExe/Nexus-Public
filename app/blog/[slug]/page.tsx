import { notFound } from 'next/navigation';
import { BlogContent } from '@/components/blog/blog-content';
import { Badge } from '@/components/ui/badge';
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Image from 'next/image';

async function getBlogPost(slug: string) {
  try {
    const response = await fetch(`/api/blog/${slug}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  return {
    title: post.title,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mt-14">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {post.headerImage && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={`${post.headerImage}`}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {post.status === 'archived' && (
              <Badge variant="secondary">Archived</Badge>
            )}
            <span className="text-sm text-muted-foreground">{post.year}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-8">
          <BlogContent content={post.content} />
        </div>
      </div>
    </main>
  );
}
