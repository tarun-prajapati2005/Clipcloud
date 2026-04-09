"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FileUplode from "./fileuplode";
import { apiClient } from "@/lib/api-client";

type UploadResponse = {
  url?: string;
  thumbnailUrl?: string;
};

function VideoUploadForm() {
  const router = useRouter();
  const { status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleVideoSuccess = (res: unknown) => {
    const data = res as UploadResponse;
    const uploadedVideoUrl = data.url ?? "";
    const uploadedThumbUrl = data.thumbnailUrl ?? data.url ?? "";

    setVideoUrl(uploadedVideoUrl);
    setThumbnailUrl(uploadedThumbUrl);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      setError("Please add title, description, and upload a video first.");
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.createVideo({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        controls: true,
        transformation: {
          heigth: 1920,
          width: 1080,
          quality: 100,
        },
      });

      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      setUploadProgress(0);
      router.refresh();
    } catch {
      setError("Video save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <p className="text-sm text-slate-600 dark:text-slate-300">Checking your session...</p>
      </section>
    );
  }

  if (status !== "authenticated") {
    return (
      <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
        <h3 className="text-base font-semibold text-amber-900 dark:text-amber-200">Login Required</h3>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
          Video upload karne ke liye pehle login karein.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10 overflow-hidden rounded-3xl border border-cyan-200 bg-white/90 shadow-lg shadow-cyan-100/60 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none">
      <div className="bg-linear-to-r from-cyan-600 to-sky-500 px-5 py-4 text-white">
        <h3 className="text-xl font-black tracking-tight">Upload New Video</h3>
        <p className="mt-1 text-sm text-cyan-50">
          Drop your next clip and publish it to your ClipCloud feed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Enter video title"
            required
          />
        </div>

        <div className="sm:col-span-1">
          <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Write a short description"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Video File</label>
          <FileUplode
            filetype="video"
            onProgress={setUploadProgress}
            onSuccess={handleVideoSuccess}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-linear-to-r from-cyan-500 to-sky-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Uploading: {uploadProgress}%</p>
            </div>
          )}
          {videoUrl && (
            <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Video uploaded successfully.</p>
          )}
        </div>

        {error && <p className="sm:col-span-2 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={isSaving || !videoUrl}
          className="sm:col-span-2 inline-flex w-fit items-center rounded-xl bg-linear-to-r from-cyan-600 to-sky-500 px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:from-cyan-500 hover:to-sky-400 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
        >
          {isSaving ? "Saving..." : "Publish Video Now"}
        </button>
      </form>
    </section>
  );
}

export default VideoUploadForm;