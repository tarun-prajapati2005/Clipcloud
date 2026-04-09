// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
   

     try {
         const authentictionparameters = getUploadAuthParams({
         privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, 
         publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
     })
 
     return Response.json({ 
                 ...authentictionparameters,
                 authentictionparameters,
         publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      });
    } catch {
     return Response.json(
        {
            error: "Authentication for Imagekit faild",
        },
        {
            status:500
        }
     );
    
   }
}