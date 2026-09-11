'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  contentId: string;
  contentTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({ isOpen, contentId, contentTitle, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${contentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert(`Delete failed: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An error occurred while deleting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Confirm Deletion</h2>
        </div>

        <p className="text-slate-300 text-sm mb-6">
          Are you sure you want to delete <span className="font-semibold text-white">"{contentTitle}"</span>? This action will permanently remove the asset from Vercel Blob and MongoDB.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Asset'}
          </button>
        </div>
      </div>
    </div>
  );
}