import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Content } from '@/models/Content';

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  // 1. Handle Vercel Blob client token generation request
  if ((body as HandleUploadBody).type === 'blob.generate-client-token') {
    try {
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => {
          const session = await getServerSession(authOptions);
          const isAdmin = (session?.user as any)?.role === 'ADMIN';

          if (!isAdmin) {
            throw new Error('Unauthorized: Admin access required');
          }

          return {
            allowedContentTypes: [
              'application/pdf',
              'video/mp4',
              'video/webm',
              'text/html',
            ],
            tokenPayload: JSON.stringify({ userId: (session?.user as any)?.id }),
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log('Blob upload completed successfully:', blob.url);
        },
      });

      return NextResponse.json(jsonResponse);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
  }

  // 2. Handle metadata saving request to MongoDB
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, type, fileUrl } = body;

    if (!title || !category || !type || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required content fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newContent = await Content.create({
      title,
      description,
      category,
      type,
      fileUrl,
      uploadedBy: (session?.user as any)?.id || 'admin',
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
