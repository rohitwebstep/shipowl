// app/api/images/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';

const BASE_DIR = '/tmp/uploads'; // Change as needed

export async function GET(
    req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        // Validate and construct full path safely
        if (!params?.path?.length) {
            return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
        }

        const requestedPath = path.join(...params.path);

        // Prevent directory traversal (e.g., ../../../etc/passwd)
        const fullPath = path.join(BASE_DIR, requestedPath);
        if (!fullPath.startsWith(BASE_DIR)) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
        }

        const fileBuffer = await fs.readFile(fullPath);
        const contentType = mime.getType(fullPath) || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: { 'Content-Type': contentType },
        });

        // 📝 Alternative: Use streaming for large files (optional)
        // const fileStream = fs.createReadStream(fullPath);
        // return new NextResponse(fileStream, {
        //   status: 200,
        //   headers: { 'Content-Type': contentType },
        // });

    } catch (err: any) {
        console.error('Image fetch error:', err.message);
        return NextResponse.json({ error: 'File not found or inaccessible' }, { status: 404 });
    }
}
