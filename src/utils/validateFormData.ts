interface ValidationOptions {
    requiredFields?: string[];
    patternValidations?: Record<string, 'string' | 'number' | 'boolean'>;
}

interface ValidationResult {
    isValid: boolean;
    error?: Record<string, string>;
    message: string;
}

function toReadableFieldName(field: string): string {
    // Converts camelCase or snake_case to Title Case
    return field
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, char => char.toUpperCase());
}

export function validateFormData(
    formData: FormData,
    { requiredFields = [], patternValidations = {} }: ValidationOptions
): ValidationResult {
    const error: Record<string, string> = {};

    // Required fields
    for (const field of requiredFields) {
        const value = formData.get(field);
        if (value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
            error[field] = `${toReadableFieldName(field)} is required`;
        }
    }

    // Pattern validations
    for (const [field, expectedType] of Object.entries(patternValidations)) {
        const value = formData.get(field);
        if (value !== null) {
            const val = typeof value === 'string' ? value.trim() : value;

            const isInvalidNumber = expectedType === 'number' && isNaN(Number(val));
            const isInvalidBoolean =
                expectedType === 'boolean' &&
                !['true', 'false', '1', '0', true, false, 1, 0, 'active', 'inactive'].includes(val.toString().toLowerCase());

            if (isInvalidNumber || isInvalidBoolean) {
                error[field] = `${toReadableFieldName(field)} must be a valid ${expectedType}`;
            }
        }
    }

    const errorCount = Object.keys(error).length;

    return {
        isValid: errorCount === 0,
        ...(errorCount > 0 && { error }),
        message:
            errorCount === 0
                ? 'Form submitted successfully.'
                : `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please correct and try again.`,
    };
}