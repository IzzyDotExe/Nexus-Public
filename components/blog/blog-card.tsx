import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPostSummary } from '@/lib/types/blog';
import Link from 'next/link';
import Image from 'next/image';
import { BlogCardClient } from './blog-card-client';

interface BlogCardProps {
  post: BlogPostSummary;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="relative h-full">
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
          {post.headerImage ? (
            <div className="relative h-48 w-full flex-shrink-0">
              <Image
                src={`${post.headerImage}`}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-48 w-full bg-muted flex-shrink-0" />
          )}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-2">
              {post.status === 'archived' && (
                <Badge variant="secondary">Archived</Badge>
              )}
              {post.isOldArchived && (
                <Badge variant="outline">Old</Badge>
              )}
              <span className="text-sm text-muted-foreground">{post.year}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">{post.description}</p>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="bg-accent text-accent-foreground">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Link>
      <BlogCardClient slug={post.slug} />
    </div>
  );
}
