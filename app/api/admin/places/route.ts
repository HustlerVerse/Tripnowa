import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/models/Place';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();

    const body = await request.json();
    
    const place = await Place.create(body);

    return NextResponse.json(
      { message: 'Place created successfully', place },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

