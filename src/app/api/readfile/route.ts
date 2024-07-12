import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Define the path to the image you want to serve

export async function GET(req: NextRequest) {
  try {
    const imagePath = path.join(process.cwd(), req.nextUrl.searchParams.get('path')!);
    const imageBuffer = fs.readFileSync(imagePath);
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Error reading the image' }, { status: 500 });
  }
}
