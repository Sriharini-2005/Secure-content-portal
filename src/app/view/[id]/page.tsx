'use client';

import { use, useEffect, useState } from 'react';
import PdfViewer from '@/components/PdfViewer';
import VideoPlayer from '@/components/VideoPlayer';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function ViewPage({ params }: PageProps) {
  // Safe unwrapping for both Next.js 14 (object) and Next.js 15 (Promise)
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const id = resolvedParams.id;

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/content/${id}`);
        if (!res.ok) throw new Error('Failed to load content');
        const data = await res.json();
        setContent(data);
      } catch (err: any) {
        setError(err.message || 'Error loading file');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchContent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading viewer...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error || 'Content not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{content.title}</h1>
          {content.description && (
            <p className="text-slate-400 text-sm mt-1">{content.description}</p>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[600px] flex items-center justify-center">
          {content.type === 'PDF' && <PdfViewer url={content.fileUrl} />}
          {content.type === 'VIDEO' && <VideoPlayer url={content.fileUrl} />}
          {content.type === 'HTML' && (
            <iframe
              src={content.fileUrl}
              className="w-full h-[600px] rounded-lg border-0"
              title={content.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}