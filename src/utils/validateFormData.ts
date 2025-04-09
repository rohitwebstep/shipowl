interface ValidationOptions {
    requiredFields?: string[];
    patternValidations?: Record<string, 'string' | 'number' | 'boolean'>;
}

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export function validateFormData(
    formData: FormData,
    { requiredFields = [], patternValidations = {} }: ValidationOptions
): ValidationResult {
    const errors: string[] = [];

    // ✅ Required fields check
    for (const field of requiredFields) {
        const value = formData.get(field);
        if (value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
            errors.push(`Field "${field}" is required`);
        }
    }

    // ✅ Type pattern check (only if field exists)
    for (const [field, expectedType] of Object.entries(patternValidations)) {
        const value = formData.get(field);
        if (value !== null) {
            const val = typeof value === 'string' ? value.trim() : value;

            if (
                (expectedType === 'number' && isNaN(Number(val))) ||
                (expectedType === 'boolean' &&
                    !['true', 'false', '1', '0', true, false, 1, 0].includes(val.toString().toLowerCase()))
            ) {
                errors.push(`Field "${field}" must be of type ${expectedType}`);
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
