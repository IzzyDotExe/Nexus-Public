'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAdminMode } from '@/contexts/admin-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ProjectForm() {
  const { isAdminMode } = useAdminMode();
  const [apiKey, setApiKey] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    link: '',
    image: '',
    category: 'personal' as 'real-world' | 'personal' | 'games',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tech: formData.tech.split(',').map(t => t.trim()).filter(t => t),
          link: formData.link,
          image: formData.image || undefined,
          category: formData.category,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Project created successfully!');
        setFormData({
          title: '',
          description: '',
          tech: '',
          link: '',
          image: '',
          category: 'personal',
        });
        setApiKey('');
        // Reload the page to show the new project
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Failed to create project');
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
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      
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
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="tech">Technologies (comma-separated) *</Label>
          <Input
            id="tech"
            value={formData.tech}
            onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
            placeholder="React, TypeScript, Next.js"
            required
          />
        </div>

        <div>
          <Label htmlFor="link">Project Link *</Label>
          <Input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Image Path (in /public)</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/project-image.png"
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value: 'real-world' | 'personal' | 'games') =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="real-world">Real World</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="games">Games</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Project'}
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
