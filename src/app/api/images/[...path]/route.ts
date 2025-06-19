import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';
import { logMessage } from '@/utils/commonUtils';

const BASE_DIR = '/tmp/uploads';

export async function GET(
    req: NextRequest,
    context: { params: { path: string[] } } // ✅ This is valid in App Router
) {
    try {
        const pathSegments = context.params.path;

        if (!Array.isArray(pathSegments) || pathSegments.length === 0) {
            return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
        }

        const requestedPath = path.join(...pathSegments);
        const fullPath = path.join(BASE_DIR, requestedPath);
        const normalizedPath = path.normalize(fullPath);

        if (!normalizedPath.startsWith(BASE_DIR)) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
        }

        const fileBuffer = await fs.readFile(normalizedPath);
        const contentType = mime.getType(normalizedPath) || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
            },
        });
    } catch (error) {
        logMessage('error', 'Image fetch error:', error);
        return NextResponse.json(
            { status: false, message: 'File not found or inaccessible' },
            { status: 500 }
        );
    }
}
