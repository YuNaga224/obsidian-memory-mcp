# Obsidian Memory MCP

MCP server that stores AI memories as both JSON and Markdown files for visualization in Obsidian's graph view.

## Features

- **Dual Storage System**: Support for both JSON (legacy) and Markdown formats
- **Obsidian Integration**: Markdown files use `[[link]]` syntax for graph visualization
- **Knowledge Graph**: Store entities, relations, and observations
- **Search Functionality**: Query across all stored memories
- **Migration Tool**: Convert existing JSON data to Markdown format

## Storage Formats

### JSON Format (Legacy)
- Single `memory.json` file with JSONL format
- Backward compatible with existing installations

### Markdown Format (New)
- Individual `.md` files for each entity
- YAML frontmatter for metadata
- Obsidian-compatible `[[links]]` for relations
- Organized observations and relations sections

Example Markdown file (`John_Doe.md`):
```markdown
---
entityType: person
created: 2024-01-10
updated: 2024-01-10
---

# John Doe

## Observations
- Works at Tech Corp
- Expert in TypeScript
- Lives in Tokyo

## Relations
- [[Manager of::Alice Smith]]
- [[Collaborates with::Bob Johnson]]
- [[Located in::Tokyo Office]]
```

## Configuration

Set environment variables to configure storage:

```bash
# Use Markdown storage (default: json)
export STORAGE_TYPE=markdown

# Custom memory directory (optional)
export MEMORY_DIR=/path/to/your/obsidian/vault

# Legacy JSON file path (JSON storage only)
export MEMORY_FILE_PATH=/path/to/memory.json
```

## Migration

To migrate from JSON to Markdown format:

```bash
npm run migrate
```

This will:
1. Read all data from the JSON storage
2. Create corresponding Markdown files
3. Maintain all entities, relations, and observations

## Usage with Obsidian

1. Set `MEMORY_DIR` to point to your Obsidian vault
2. Set `STORAGE_TYPE=markdown`
3. Use the MCP tools to create entities and relations
4. Open Obsidian and view the graph

The knowledge graph will be visualized with:
- Entity files as nodes
- `[[links]]` as edges
- Different colors for different entity types (if configured in Obsidian)

## API

The server exposes the following tools:

- `create_entities`: Create new entities
- `create_relations`: Create relations between entities
- `add_observations`: Add observations to existing entities
- `delete_entities`: Delete entities and related data
- `delete_observations`: Remove specific observations
- `delete_relations`: Remove relations
- `read_graph`: Get the entire knowledge graph
- `search_nodes`: Search entities by query
- `open_nodes`: Get specific entities by name

All tools work identically regardless of storage format.