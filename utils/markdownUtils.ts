import matter from 'gray-matter';
import { Entity, Relation } from '../types.js';

interface MarkdownMetadata {
  entityType: string;
  created?: string;
  updated?: string;
}

interface ParsedMarkdown {
  metadata: MarkdownMetadata;
  name: string;
  observations: string[];
  relations: Array<{
    to: string;
    relationType: string;
  }>;
}

/**
 * Parse a markdown file content into structured data
 */
export function parseMarkdown(content: string, entityName: string): ParsedMarkdown {
  const parsed = matter(content);
  const metadata = parsed.data as MarkdownMetadata;
  
  // Extract observations from the content
  const observations: string[] = [];
  const relations: Array<{ to: string; relationType: string }> = [];
  
  // Split content into lines for processing
  const lines = parsed.content.split('\n');
  let inObservations = false;
  let inRelations = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check for section headers
    if (trimmed === '## Observations' || trimmed === '### Observations') {
      inObservations = true;
      inRelations = false;
      continue;
    } else if (trimmed === '## Relations' || trimmed === '### Relations') {
      inObservations = false;
      inRelations = true;
      continue;
    } else if (trimmed.startsWith('##') || trimmed.startsWith('###')) {
      // Another section started
      inObservations = false;
      inRelations = false;
    }
    
    // Extract observations (bullet points)
    if (inObservations && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      observations.push(trimmed.substring(2));
    }
    
    // Extract relations (Obsidian links)
    if (inRelations && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      const linkMatch = trimmed.match(/\[\[([^:\]]+)(?:::([^\]]+))?\]\]/);
      if (linkMatch) {
        if (linkMatch[2]) {
          // Format: [[relationType::target]]
          relations.push({
            to: linkMatch[2],
            relationType: linkMatch[1]
          });
        } else {
          // Format: [[target]] - default relation type
          relations.push({
            to: linkMatch[1],
            relationType: 'related_to'
          });
        }
      }
    }
    
    // Also check for inline links anywhere in the content
    const inlineLinks = trimmed.matchAll(/\[\[([^:\]]+)(?:::([^\]]+))?\]\]/g);
    for (const match of inlineLinks) {
      if (!inRelations) { // Avoid duplicates from the Relations section
        if (match[2]) {
          relations.push({
            to: match[2],
            relationType: match[1]
          });
        } else {
          relations.push({
            to: match[1],
            relationType: 'mentioned_in'
          });
        }
      }
    }
  }
  
  return {
    metadata,
    name: entityName,
    observations,
    relations
  };
}

/**
 * Generate markdown content from an entity
 */
export function generateMarkdown(entity: Entity, relations: Relation[]): string {
  const now = new Date().toISOString().split('T')[0];
  
  // Prepare frontmatter
  const frontmatter = {
    entityType: entity.entityType,
    created: now,
    updated: now
  };
  
  // Build content sections
  let content = matter.stringify('', frontmatter);
  
  // Add title
  content += `# ${entity.name}\n\n`;
  
  // Add observations
  if (entity.observations.length > 0) {
    content += `## Observations\n`;
    for (const observation of entity.observations) {
      content += `- ${observation}\n`;
    }
    content += '\n';
  }
  
  // Add relations
  const entityRelations = relations.filter(r => r.from === entity.name);
  if (entityRelations.length > 0) {
    content += `## Relations\n`;
    for (const relation of entityRelations) {
      content += `- [[${relation.relationType}::${relation.to}]]\n`;
    }
    content += '\n';
  }
  
  return content;
}

/**
 * Update the metadata section of a markdown file
 */
export function updateMetadata(content: string, updates: Partial<MarkdownMetadata>): string {
  const parsed = matter(content);
  const updatedData = { ...parsed.data, ...updates };
  
  // Update the 'updated' timestamp
  updatedData.updated = new Date().toISOString().split('T')[0];
  
  return matter.stringify(parsed.content, updatedData);
}

/**
 * Add a relation link to the content
 */
export function addRelationToContent(content: string, relation: Relation): string {
  const lines = content.split('\n');
  let relationsIndex = -1;
  let lastRelationIndex = -1;
  
  // Find the Relations section
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '## Relations' || trimmed === '### Relations') {
      relationsIndex = i;
    } else if (relationsIndex !== -1 && (trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
      lastRelationIndex = i;
    } else if (relationsIndex !== -1 && trimmed.startsWith('#')) {
      // Another section started
      break;
    }
  }
  
  const newRelationLine = `- [[${relation.relationType}::${relation.to}]]`;
  
  if (relationsIndex === -1) {
    // No Relations section exists, create one
    lines.push('');
    lines.push('## Relations');
    lines.push(newRelationLine);
  } else if (lastRelationIndex !== -1) {
    // Add after the last relation
    lines.splice(lastRelationIndex + 1, 0, newRelationLine);
  } else {
    // Add right after the Relations header
    lines.splice(relationsIndex + 1, 0, newRelationLine);
  }
  
  return lines.join('\n');
}

/**
 * Remove a relation link from the content
 */
export function removeRelationFromContent(content: string, relation: Relation): string {
  const linkPattern = new RegExp(
    `^[\\s\\-\\*]*\\[\\[${escapeRegExp(relation.relationType)}::${escapeRegExp(relation.to)}\\]\\]\\s*$`,
    'gm'
  );
  
  return content.replace(linkPattern, '');
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}