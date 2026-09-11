'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { ContentItem } from '@/types';
import ContentCard from '@/components/ContentCard';
import AdminUploadModal from '@/components/AdminUploadModal';
import DeleteModal from '@/components/DeleteModal';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content');
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchContent();
  }, [session]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Portal</h1>
          <p className="text-sm text-slate-400">
            {isAdmin ? 'Manage and publish assets' : 'Explore available materials'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl transition"
          >
            <Plus className="w-5 h-5" />
            <span>Upload Asset</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400">Loading contents...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400">No content uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ContentCard
              key={item._id}
              item={item}
              isAdmin={isAdmin}
              onDelete={(targetItem) => setDeleteItem(targetItem)}
            />
          ))}
        </div>
      )}

      {/* Admin Upload Modal */}
      <AdminUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchContent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteItem}
        contentId={deleteItem?._id || ''}
        contentTitle={deleteItem?.title || ''}
        onClose={() => setDeleteItem(null)}
        onSuccess={fetchContent}
      />
    </div>
  );
}