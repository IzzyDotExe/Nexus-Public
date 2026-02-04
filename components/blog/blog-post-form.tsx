'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAdminMode } from '@/contexts/admin-context';

export function BlogPostForm() {
  const { isAdminMode } = useAdminMode();
  const [apiKey, setApiKey] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    headerImage: '',
    tags: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          headerImage: formData.headerImage || undefined,
          tags: formData.tags.split(' ').filter(tag => tag.trim()),
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Blog post created successfully!');
        setFormData({
          title: '',
          description: '',
          headerImage: '',
          tags: '',
          content: '',
        });
        setApiKey('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to create blog post');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdminMode) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="apiKey">Admin API Key *</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            placeholder="Enter your admin API key"
          />
        </div>

        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="headerImage">Header Image (filename in blog/images/)</Label>
          <Input
            id="headerImage"
            value={formData.headerImage}
            onChange={(e) => setFormData({ ...formData, headerImage: e.target.value })}
            placeholder="image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (space-separated, no # symbols)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="react nextjs typescript"
          />
        </div>

        <div>
          <Label htmlFor="content">Content (Markdown) *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={15}
            className="font-mono"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Use [[image-name.jpg]] to embed images
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </Button>

        {message && (
          <div
            className={`p-3 rounded ${
              message.includes('Error') || message.includes('Failed')
                ? 'bg-destructive/10 text-destructive'
                : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </Card>
  );
}
