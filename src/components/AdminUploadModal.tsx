'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';
import { X, UploadCloud } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'PDF' | 'VIDEO' | 'HTML'>('PDF');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!file) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload file directly to Vercel Blob
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
      });

      // 2. Save file metadata into MongoDB
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          type,
          fileUrl: blob.url,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save metadata');
      }

      // Reset form on success
      setTitle('');
      setDescription('');
      setCategory('');
      setFile(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Upload Error:', err);
      setErrorMsg(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Upload New Media Asset</h2>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 h-20 resize-none"
          />

          <input
            type="text"
            placeholder="Category (e.g., Papers, Lectures)"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="PDF">PDF Document (.pdf)</option>
            <option value="VIDEO">Video (.mp4, .webm)</option>
            <option value="HTML">HTML File (.html)</option>
          </select>

          <input
            type="file"
            required
            accept={
              type === 'PDF'
                ? '.pdf'
                : type === 'VIDEO'
                ? 'video/*'
                : '.html'
            }
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 text-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}