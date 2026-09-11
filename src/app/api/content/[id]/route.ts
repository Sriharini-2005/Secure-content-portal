import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { Content } from '@/models/Content';

interface RouteParams {
  params: Promise<{ id: string }> | { id: string };
}

export async function GET(request: Request, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }

    const resolvedParams = context.params instanceof Promise ? await context.params : context.params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
    }

    await connectToDatabase();
    const item = await Content.findById(id);

    if (!item) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching content item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}