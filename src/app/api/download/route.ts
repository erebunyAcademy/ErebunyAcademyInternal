import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const pathname = path.join(process.cwd(), req.nextUrl.searchParams.get('path')!);
    // const fileBuffer = await fs.createReadStream(pathname);
    const fileBuffer = fs.readFileSync(pathname);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Error reading the image' }, { status: 500 });
  }
}
