import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const pathname = path.join(process.cwd(), req.nextUrl.searchParams.get('path')!);
    console.log({ pathname });

    // Use createReadStream for efficient streaming
    const fileStream: any = fs.createReadStream(pathname);

    const response = new NextResponse(fileStream);

    // Set the appropriate content-type header based on the file extension
    const extname = path.extname(pathname);
    const contentType = {
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.pdf': 'application/pdf',
    }[extname];
    if (contentType) {
      response.headers.set('Content-Type', contentType);
    }

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Error reading the image' }, { status: 500 });
  }
}
