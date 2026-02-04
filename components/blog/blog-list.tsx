'use client';

import { useState, useMemo } from 'react';
import { BlogCard } from './blog-card';
import { BlogFilters } from './blog-filters';
import { BlogPostSummary } from '@/lib/types/blog';
import { useAdminMode } from '@/contexts/admin-context';

interface BlogListProps {
  posts: BlogPostSummary[];
}

export function BlogList({ posts }: BlogListProps) {
  const { isAdminMode } = useAdminMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Hide archived posts unless in admin mode
      if (post.status === 'archived' && !isAdminMode) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some((tag) => post.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }, [posts, searchQuery, selectedTags, isAdminMode]);

  return (
    <div>
      <BlogFilters
        allTags={allTags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {posts.length === 0
              ? 'No blog posts available yet.'
              : 'No blog posts match your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
