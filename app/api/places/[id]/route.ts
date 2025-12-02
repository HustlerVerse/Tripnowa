import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/models/Place';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const place = await Place.findById(params.id);

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ place }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

