"use client";

import { IVideo } from "@/models/video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative w-full bg-slate-100" style={{ aspectRatio: "9/16" }}>
        <video
          src={`${video.videoUrl}?tr=w-1080,h-1920`}
          controls={video.controls}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-2 p-4">
        <h2 className="line-clamp-1 text-base font-semibold text-slate-900">
          {video.title}
        </h2>
        <p className="line-clamp-2 text-sm text-slate-600">
          {video.description}
        </p>
      </div>
    </article>
  );
}
