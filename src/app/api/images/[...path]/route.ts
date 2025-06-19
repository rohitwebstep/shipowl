import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime';

import { logMessage } from '@/utils/commonUtils';

const BASE_DIR = '/tmp/uploads'; // Adjust as needed

export async function GET(req: NextRequest, context: { params: { path: string[] } }) {
    try {
        const { path: filePathParts } = context.params;

        if (!filePathParts?.length) {
            return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
        }

        const requestedPath = path.join(...filePathParts);

        const fullPath = path.join(BASE_DIR, requestedPath);

        // Prevent directory traversal
        if (!fullPath.startsWith(BASE_DIR)) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
        }

        const fileBuffer = await fs.readFile(fullPath);
        const contentType = mime.getType(fullPath) || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: { 'Content-Type': contentType },
        });

    } catch (error) {
        logMessage('error', 'Image fetch error:', error);
        return NextResponse.json(
            { status: false, message: 'File not found or inaccessible' },
            { status: 500 }
        );
    }
}
