'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  // Replace [[image name]] with proper image markdown
  const processedContent = useMemo(() => {
    return content.replace(/\[\[(.+?)\]\]/g, (match, imageName) => {
      return `![${imageName}](${imageName})`;
    });
  }, [content]);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ node, src, alt, ...props }: any) {
            if (!src) return null;
            
            return (
              <span className="block my-8">
                <Image
                  src={src}
                  alt={alt || ''}
                  width={800}
                  height={600}
                  className="rounded-lg"
                  {...props}
                />
              </span>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
