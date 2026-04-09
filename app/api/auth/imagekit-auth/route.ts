// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY

    if (!privateKey || !publicKey) {
        return Response.json(
            { error: "Missing ImageKit environment variables" },
            { status: 500 }
        )
    }

    try {
        const authentictionparameters = getUploadAuthParams({
            privateKey,
            publicKey,
        })

        return Response.json({
            ...authentictionparameters,
            authentictionparameters,
            publicKey,
        });
    } catch {
        return Response.json(
            {
                error: "Authentication for Imagekit faild",
            },
            {
                status: 500
            }
        );

    }
}