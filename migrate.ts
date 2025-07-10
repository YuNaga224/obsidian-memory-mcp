#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JsonStorageManager } from './storage/JsonStorageManager.js';
import { MarkdownStorageManager } from './storage/MarkdownStorageManager.js';
import { getMemoryDir } from './utils/pathUtils.js';

/**
 * Migration tool to convert JSON storage to Markdown format
 */
async function migrate() {
  console.log('Starting migration from JSON to Markdown format...\n');
  
  try {
    // Create managers
    const jsonManager = new JsonStorageManager();
    const markdownManager = new MarkdownStorageManager();
    
    // Debug: Show JSON file path
    console.log(`JSON file path: ${(jsonManager as any).memoryFilePath}`);
    
    // Load data from JSON
    console.log('Loading data from JSON storage...');
    const graph = await jsonManager.readGraph();
    console.log(`Found ${graph.entities.length} entities and ${graph.relations.length} relations\n`);
    
    // Ensure memory directory exists
    const memoryDir = getMemoryDir();
    await fs.mkdir(memoryDir, { recursive: true });
    console.log(`Memory directory: ${memoryDir}\n`);
    
    // Migrate entities
    console.log('Migrating entities...');
    for (const entity of graph.entities) {
      await markdownManager.createEntities([entity]);
      console.log(`  ✓ ${entity.name} (${entity.entityType})`);
    }
    
    // Migrate relations
    console.log('\nMigrating relations...');
    for (const relation of graph.relations) {
      try {
        await markdownManager.createRelations([relation]);
        console.log(`  ✓ ${relation.from} --[${relation.relationType}]--> ${relation.to}`);
      } catch (error) {
        console.error(`  ✗ Failed to migrate relation: ${relation.from} --[${relation.relationType}]--> ${relation.to}`);
        console.error(`    ${error}`);
      }
    }
    
    console.log('\nMigration completed successfully!');
    console.log(`\nTo use Markdown storage, set the environment variable:`);
    console.log(`  export STORAGE_TYPE=markdown`);
    console.log(`\nYou can also set a custom memory directory:`);
    console.log(`  export MEMORY_DIR=/path/to/your/obsidian/vault`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate();
}