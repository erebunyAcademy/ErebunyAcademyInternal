import { mkdir, writeFile } from 'fs/promises';
import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import path from 'path';

export const POST = async (req: NextRequest) => {
  try {
    const headersList = headers();
    const key = headersList.get('x-file-key')!;
    const formData = await req.formData();
    const file: any = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadPath = path.join(process.cwd(), 'uploads', path.dirname(key));
    const filePath = path.join(uploadPath, path.basename(key));

    // Ensure the directory exists
    await mkdir(uploadPath, { recursive: true });

    // Write the file
    await writeFile(filePath, buffer);

    return NextResponse.json({ message: 'Success', status: 201 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Failed', status: 500 });
  }
};
