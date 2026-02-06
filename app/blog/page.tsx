'use client';

import { useState, useEffect } from 'react';
import { BlogList } from "@/components/blog/blog-list";
import { BlogPostForm } from "@/components/blog/blog-post-form";
import { useAdminMode } from "@/contexts/admin-context";
import { useTextContent } from "@/lib/hooks/useTextContent";
import { HalfScreenHero } from '@/lib/molecules/halfscreen-hero';

async function getBlogPosts() {
  try {
    const response = await fetch(`/api/blog`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default function BlogPage() {
  const { isAdminMode } = useAdminMode();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const { getText } = useTextContent();

  if (loading) {
    return <div>{getText('blog.loadingText')}</div>;
  }

  return (
    <main>
      <HalfScreenHero title={getText('blog.title')} subtitle={getText('blog.subtitle')} />

      <div className="container mx-auto px-4 py-12 space-y-12">
        {isAdminMode && <BlogPostForm />}
        <BlogList posts={posts} />
      </div>
      
    </main>
  );
}