import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/models/Place';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await connectDB();

    const body = await request.json();
    
    const place = await Place.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Place updated successfully', place },
      { status: 200 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await connectDB();

    const place = await Place.findByIdAndDelete(params.id);

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Place deleted successfully' },
      { status: 200 }
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

