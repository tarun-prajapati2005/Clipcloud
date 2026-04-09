import { IVideo } from "@/models/video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoComponent key={video._id?.toString()} video={video} />
      ))}

      {videos.length === 0 && (
        <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/80 py-14 text-center">
          <p className="text-slate-600">No videos found yet. Add your first upload to populate the feed.</p>
        </div>
      )}
    </div>
  );
}