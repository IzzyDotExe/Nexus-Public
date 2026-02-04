export interface BlogMetadata {
  title: string;
  description: string;
  headerImage?: string;
  tags: string[];
  year: number;
  status: 'live' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

export interface BlogPost extends BlogMetadata {
  slug: string;
  content: string;
  filePath: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  headerImage?: string;
  tags: string[];
  year: number;
  status: 'live' | 'archived';
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isOldArchived?: boolean;
}

export interface CreateBlogPostRequest {
  title: string;
  description: string;
  headerImage?: string;
  tags: string[];
  content: string;
}

export interface UpdateBlogPostRequest {
  title?: string;
  description?: string;
  headerImage?: string;
  tags?: string[];
  content?: string;
}
