// passwordValidator.tsx

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Validates a password based on security requirements
 * @param password The password to validate
 * @returns An object with validation result and any error messages
 */
export function validatePassword(password: string): PasswordValidationResult {
    const result: PasswordValidationResult = {
        isValid: true,
        errors: [],
    };

    // Check if password is at least 8 characters long
    if (password.length < 8) {
        result.isValid = false;
        result.errors.push("Password must be at least 8 characters long");
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        result.isValid = false;
        result.errors.push("Password must contain at least one lowercase letter");
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        result.isValid = false;
        result.errors.push("Password must contain at least one uppercase letter");
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        result.isValid = false;
        result.errors.push("Password must contain at least one special character");
    }

    return result;
}