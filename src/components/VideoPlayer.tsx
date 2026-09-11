'use client';

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  return (
    <div className="w-full max-w-4xl rounded-lg overflow-hidden bg-black border border-slate-800">
      <video
        controls
        controlsList="nodownload"
        className="w-full max-h-[600px] object-contain"
      >
        <source src={url} />
        Your browser does not support playing this video.
      </video>
    </div>
  );
}