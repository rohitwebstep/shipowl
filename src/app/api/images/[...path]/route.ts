import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';
import { logMessage } from '@/utils/commonUtils';

const BASE_DIR = '/tmp/uploads'; // Change to your actual directory if needed

export async function GET(
    req: NextRequest,
    context: { params: { path: string[] } }
) {
    try {
        const { path: pathSegments } = context.params;

        if (!pathSegments || pathSegments.length === 0) {
            return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
        }

        // Join requested path and sanitize
        const requestedPath = path.join(...pathSegments);
        const fullPath = path.join(BASE_DIR, requestedPath);

        // Prevent directory traversal
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
