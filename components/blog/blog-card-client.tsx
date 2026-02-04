'use client';

import { useAdminMode } from '@/contexts/admin-context';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BlogCardClientProps {
  slug: string;
}

export function BlogCardClient({ slug }: BlogCardClientProps) {
  const { isAdminMode } = useAdminMode();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': prompt('Enter admin API key:') || '',
        },
      });

      if (response.ok) {
        alert('Blog post deleted successfully!');
        window.location.reload();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to delete blog post');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdminMode) {
    return null;
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant="destructive"
      size="sm"
      className="absolute top-2 right-2 z-10"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
