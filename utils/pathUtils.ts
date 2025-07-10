import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Obsidian and file system forbidden characters
const FORBIDDEN_CHARS = /[<>:"/\\|?*\x00-\x1f]/g;
const RESERVED_NAMES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

/**
 * Sanitize a string to be used as a filename
 * Removes or replaces characters that are invalid in file systems or Obsidian
 */
export function sanitizeFilename(name: string): string {
  // Replace forbidden characters with underscores
  let sanitized = name.replace(FORBIDDEN_CHARS, '_');
  
  // Remove leading/trailing dots and spaces
  sanitized = sanitized.trim().replace(/^\.+|\.+$/g, '');
  
  // Handle empty result
  if (!sanitized) {
    return 'unnamed';
  }
  
  // Check for reserved names
  if (RESERVED_NAMES.test(sanitized)) {
    sanitized = `_${sanitized}`;
  }
  
  // Limit length to 200 characters (leaving room for extension)
  if (sanitized.length > 200) {
    const hash = crypto.createHash('md5').update(name).digest('hex').substring(0, 8);
    sanitized = `${sanitized.substring(0, 192)}_${hash}`;
  }
  
  return sanitized;
}

/**
 * Get the memory directory path
 */
export function getMemoryDir(): string {
  // Allow override via environment variable
  if (process.env.MEMORY_DIR) {
    return path.isAbsolute(process.env.MEMORY_DIR)
      ? process.env.MEMORY_DIR
      : path.resolve(process.cwd(), process.env.MEMORY_DIR);
  }
  
  // Default to ./memory in the current working directory
  return path.resolve(process.cwd(), 'memory');
}

/**
 * Get the full path for an entity file
 */
export function getEntityPath(entityName: string): string {
  const filename = sanitizeFilename(entityName);
  return path.join(getMemoryDir(), `${filename}.md`);
}

/**
 * Extract entity name from file path
 */
export function getEntityNameFromPath(filePath: string): string | null {
  const basename = path.basename(filePath);
  if (!basename.endsWith('.md')) {
    return null;
  }
  return basename.slice(0, -3); // Remove .md extension
}

/**
 * Check if a path is within the memory directory
 */
export function isInMemoryDir(filePath: string): boolean {
  const memoryDir = getMemoryDir();
  const resolved = path.resolve(filePath);
  return resolved.startsWith(memoryDir);
}