'use client';

import { ContentItem } from '@/types';
import { FileText, Video, Code, Eye, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ContentCardProps {
  item: ContentItem;
  isAdmin: boolean;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (item: ContentItem) => void;
}

export default function ContentCard({ item, isAdmin, onEdit, onDelete }: ContentCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex justify-between items-center mb-3">
          {item.type === 'VIDEO' ? (
            <Video className="text-indigo-400" />
          ) : item.type === 'PDF' ? (
            <FileText className="text-emerald-400" />
          ) : (
            <Code className="text-amber-400" />
          )}
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
            {item.category}
          </span>
        </div>
        <h3 className="font-bold text-lg text-white">{item.title}</h3>
        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
        <Link
          href={`/view/${item._id}`}
          className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center font-medium"
        >
          <Eye className="w-4 h-4 mr-1" /> View Asset
        </Link>
        {isAdmin && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(item)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(item)}
              className="p-1 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}