import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Helper: ensure directory exists
async function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        // console.log(`📁 Directory not found. Creating: ${dirPath}`);
        await mkdir(dirPath, { recursive: true });
    } else {
        // console.log(`✅ Directory already exists: ${dirPath}`);
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
            // console.log(`📝 Using original filename: ${originalName}`);
            return originalName;
        case 'custom':
            const name = `${customName}${ext}`;
            // console.log(`📝 Using custom filename: ${name}`);
            return name;
        case 'slug':
            const slug = base.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const slugName = `${slug}${ext}`;
            // console.log(`📝 Using slug filename: ${slugName}`);
            return slugName;
        case 'slug-unique':
            const unique = `${base.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
            const slugUniqueName = `${unique}${ext}`;
            // console.log(`📝 Using slug-unique filename: ${slugUniqueName}`);
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
): Promise<any> {
    const { dir, pattern, customName, multiple = false } = options;

    // console.log(`🚀 Starting file save from field: "${fieldName}"`);
    await ensureDir(dir);
    const result: any = multiple ? [] : null;

    const files = formData.getAll(fieldName).filter(
        (item): item is File => item instanceof File && item.name
    );

    // console.log(`📦 Total files to process: ${files.length}`);

    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        // console.log(`📄 Processing file ${index + 1}: ${file.name}`);

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

        // console.log(`💾 Saving file to: ${fullPath}`);
        await writeFile(fullPath, buffer);
        // console.log(`✅ Saved file ${file.name} as ${finalFileName}`);

        const fileUrl = fullPath.split('public')[1].replace(/\\/g, '/');

        const info = {
            originalName: file.name,
            savedAs: finalFileName,
            size: file.size,
            type: file.type,
            url: `/uploads${fileUrl}`,
        };

        // console.log(`📁 File saved info:`, info);

        if (multiple) {
            result.push(info);
        } else {
            return info;
        }
    }

    // console.log(`🎉 All files processed.`);
    return result;
}
