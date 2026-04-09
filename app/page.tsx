import Header from "./components/header";
import VideoFeed from "./components/videofeed";
import VideoUploadForm from "./components/VideoUplodeFile";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/video";
import { IVideo } from "@/models/video";

async function getVideos(): Promise<IVideo[]> {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(videos));
  } catch {
    return [];
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="app-shell min-h-screen">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <section className="surface-card mb-10 rounded-3xl border border-cyan-100 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
          <p className="mb-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Creator Studio
          </p>
          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Publish and manage your short videos in one clean dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 sm:text-lg">
            Explore your latest uploads, preview videos instantly, and keep your content pipeline organized.
          </p>
        </section>

        <VideoUploadForm />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Latest Videos</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {videos.length} items
            </span>
          </div>

          <VideoFeed videos={videos} />
        </section>
      </main>
    </div>
  );
}
