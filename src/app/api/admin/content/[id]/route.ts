import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { Content } from '@/models/Content';
import { del } from '@vercel/blob';

interface RouteParams {
  params: Promise<{ id: string }> | { id: string };
}

export async function DELETE(request: Request, context: RouteParams) {
  try {
    // 1. Verify session & ADMIN role
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session?.user || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 2. Resolve route parameters across Next.js versions
    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Find target item in MongoDB
    const item = await Content.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // 4. Delete file from Vercel Blob (safely handled if blob storage key is missing)
    if (item.fileUrl) {
      try {
        await del(item.fileUrl);
      } catch (blobError) {
        console.error('Failed to delete blob storage file:', blobError);
      }
    }

    // 5. Delete document from MongoDB
    await Content.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/content/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete asset' },
      { status: 500 }
    );
  }
}