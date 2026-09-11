import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { Content } from '@/models/Content';

export async function GET() {
  try {
    // Ensure the user is logged in (both ADMIN and VIEWER are allowed)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch all uploaded assets sorted by newest first
    const items = await Content.find({}).sort({ createdAt: -1 });

    return NextResponse.json(items, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching content list:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}