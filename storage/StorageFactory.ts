import { StorageManager } from './StorageInterface.js';
import { JsonStorageManager } from './JsonStorageManager.js';
import { MarkdownStorageManager } from './MarkdownStorageManager.js';

export type StorageType = 'json' | 'markdown';

/**
 * Factory for creating storage managers based on configuration
 */
export class StorageFactory {
  static create(type?: StorageType): StorageManager {
    // Get storage type from environment variable if not provided
    const storageType = type || (process.env.STORAGE_TYPE as StorageType) || 'json';
    
    switch (storageType) {
      case 'json':
        return new JsonStorageManager();
      case 'markdown':
        return new MarkdownStorageManager();
      default:
        throw new Error(`Unknown storage type: ${storageType}`);
    }
  }
  
  /**
   * Get the current storage type from environment
   */
  static getStorageType(): StorageType {
    return (process.env.STORAGE_TYPE as StorageType) || 'json';
  }
}