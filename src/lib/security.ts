export const MAX_TEXT_LENGTH = 120;
export const MAX_EMAIL_LENGTH = 254;

const UNSAFE_INPUT_PATTERN = /(<\s*script|javascript:|data:text\/html|on\w+\s*=)/i;

export function sanitizeText(value: string, maxLength = MAX_TEXT_LENGTH): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("")
    .trim()
    .slice(0, maxLength);
}

export function containsUnsafeInput(value: string): boolean {
  return UNSAFE_INPUT_PATTERN.test(value);
}

export function isValidEmail(value: string): boolean {
  if (!value || value.length > MAX_EMAIL_LENGTH) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
