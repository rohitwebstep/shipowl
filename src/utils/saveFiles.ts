import { writeFile, mkdir, unlink, stat } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export interface UploadedFileInfo {
    originalName: string;
    savedAs: string;
    size: number;
    type: string;
    url: string;
}

// Helper: ensure directory exists
async function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        console.log(`📁 Directory not found. Creating: ${dirPath}`);
        await mkdir(dirPath, { recursive: true });
    } else {
        console.log(`✅ Directory already exists: ${dirPath}`);
    }
}

// Helper: generate file name
function generateFileName(
    originalName: string,
    pattern: 'original' | 'slug' | 'slug-unique' | 'custom',
    customName?: string
) {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);

    switch (pattern) {
        case 'original':
            console.log(`📝 Using original filename: ${originalName}`);
            return originalName;
        case 'custom':
            const name = `${customName}${ext}`;
            console.log(`📝 Using custom filename: ${name}`);
            return name;
        case 'slug':
            const slug = base.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const slugName = `${slug}${ext}`;
            console.log(`📝 Using slug filename: ${slugName}`);
            return slugName;
        case 'slug-unique':
            const unique = `${base.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
            const slugUniqueName = `${unique}${ext}`;
            console.log(`📝 Using slug-unique filename: ${slugUniqueName}`);
            return slugUniqueName;
        default:
            return originalName;
    }
}

interface SaveFileOptions {
    dir: string;
    pattern: 'original' | 'slug' | 'slug-unique' | 'custom';
    customName?: string;
    multiple?: boolean;
}

export async function saveFilesFromFormData(
    formData: FormData,
    fieldName: string,
    options: SaveFileOptions
): Promise<UploadedFileInfo | UploadedFileInfo[]> {
    const { dir, pattern, customName, multiple = false } = options;

    console.log(`🚀 Starting file save from field: "${fieldName}"`);
    await ensureDir(dir);
    let result: UploadedFileInfo[] | UploadedFileInfo | null = multiple ? [] : null;

    const files = formData.getAll(fieldName).filter(
        (item): item is File => item instanceof File && item.name.length > 0
    );

    console.log(`📦 Total files to process: ${files.length}`);

    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const nameToUse =
            pattern === 'custom' && multiple
                ? `${customName}-${index + 1}`
                : pattern === 'custom'
                    ? customName!
                    : file.name;

        const finalFileName = generateFileName(nameToUse, pattern, nameToUse);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fullPath = path.join(dir, finalFileName);

        await writeFile(fullPath, buffer);

        const fileUrl = fullPath.split('public')[1].replace(/\\/g, '/');

        const info: UploadedFileInfo = {
            originalName: file.name,
            savedAs: finalFileName,
            size: file.size,
            type: file.type,
            url: `/uploads${fileUrl}`,
        };

        if (multiple && Array.isArray(result)) {
            result.push(info);
        } else {
            result = info;
        }
    }

    return result!;

}

/**
 * Deletes a file from the file system
 * @param filePath Absolute path to the file
 * @returns A boolean indicating if the file was deleted successfully
 */
export async function deleteFile(filePath: string): Promise<boolean> {
    try {
        await stat(filePath); // Throws if file doesn't exist
        await unlink(filePath);
        return true;
    } catch (error) {
        console.log(`error - File not found or couldn't be deleted: ${filePath}`, error);
        return false;
    }
}