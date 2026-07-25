import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { generateEvaResponse } from '@/lib/eva';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    await connectDB();
    const response = await generateEvaResponse(message);

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
