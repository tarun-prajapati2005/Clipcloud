"use client" // This component must be a client component

import {
    upload,
} from "@imagekit/next";
import { useState } from "react";

interface FileUplodeProps {
    onSuccess: (res: unknown) => void
    onProgress?: (progress: number) => void
    filetype?: "image" | "video"
}


const FileUplode = ({
    onSuccess,
    onProgress,
    filetype
}: FileUplodeProps) => {

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedFileName, setSelectedFileName] = useState<string>("")

    const validataFile = (file: File) => {
        if (filetype === "video") {
            if (!file.type.startsWith("video/")) {
                setError("plese Upload a valid video file")
                return false
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size Must be less then 100 MB")
            return false
        }
        return true
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file || !validataFile(file)) return

        setSelectedFileName(file.name)

        setUploading(true)
        setError(null)

        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth = await authRes.json()
            const signature = auth.signature ?? auth.authentictionparameters?.signature
            const expire = auth.expire ?? auth.authentictionparameters?.expire
            const token = auth.token ?? auth.authentictionparameters?.token

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature,
                expire,
                token,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const precent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(precent))
                    }
                }
            })
            onSuccess(res)
        } catch (error) {
            console.error("uplode failed", error)
            setError("File upload failed. Please try again.")

        } finally {
            setUploading(false)
        }
    }

    const inputId = filetype === "video" ? "video-upload-input" : "image-upload-input"

    return (
        <div className="rounded-2xl border border-dashed border-cyan-300 bg-cyan-50/60 p-4 dark:border-cyan-700 dark:bg-cyan-950/20">
            <input
                id={inputId}
                type="file"
                accept={filetype === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                className="hidden"
            />

            <label
                htmlFor={inputId}
                className="inline-flex cursor-pointer items-center rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
                {uploading ? "Uploading..." : filetype === "video" ? "Choose Video" : "Choose File"}
            </label>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                Max size: 100MB. Supported: {filetype === "video" ? "mp4, mov, webm" : "image files"}
            </p>

            {selectedFileName && (
                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Selected: {selectedFileName}
                </p>
            )}

            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        </div>
    );
};

export default FileUplode;