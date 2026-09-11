'use client';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  return (
    <div className="w-full h-[650px] rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
      <iframe
        src={`${url}#toolbar=0`}
        className="w-full h-full border-0"
        title="PDF Document Viewer"
      />
    </div>
  );
}