import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> } // 👈 params is now a Promise
) {
    // Await the params before using them
    const resolvedParams = await params;
    console.log('params:', resolvedParams);

    const filePath = path.join(...resolvedParams.path);
    console.log('filePath:', filePath);

    try {
        const fileBuffer = await fs.readFile(filePath);
        const ext = path.extname(filePath).substring(1);

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': `image/${ext}`,
            },
        });
    } catch (err) {
        console.error('File read error:', err);
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}