# Obsidian Memory MCP

MCP server that stores AI memories as Markdown files for visualization in Obsidian's graph view.

## About

This project is a modified version of [Anthropic's memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) that has been adapted for Obsidian integration. The original server stored memories in JSON format, while this version stores them as individual Markdown files with Obsidian-compatible `[[link]]` syntax for graph visualization.

### Key Changes from Original

- **Storage Format**: Changed from JSON to individual Markdown files
- **Obsidian Integration**: Added `[[link]]` syntax for relations
- **YAML Frontmatter**: Metadata stored in frontmatter instead of JSON
- **File Structure**: Each entity becomes a separate `.md` file
- **Removed Features**: Simplified to focus on Markdown-only storage

## Features

- **Markdown Storage**: Individual `.md` files for each entity
- **Obsidian Integration**: Uses `[[link]]` syntax for graph visualization
- **Knowledge Graph**: Store entities, relations, and observations
- **Search Functionality**: Query across all stored memories
- **YAML Frontmatter**: Metadata stored in frontmatter

## Storage Format

Each entity is stored as an individual Markdown file with:

- **YAML frontmatter** for metadata (entityType, created, updated)
- **Obsidian-compatible `[[links]]`** for relations
- **Organized sections** for observations and relations

Example entity file (`John_Doe.md`):
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


## Installation & Configuration

### Option 1: Use with npx (Recommended)

No installation required! Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "obsidian-memory": {
      "command": "npx",
      "args": ["obsidian-memory-mcp"],
      "env": {
        "MEMORY_DIR": "/path/to/your/obsidian/vault"
      }
    }
  }
}
```

### Option 2: Local Installation

```bash
git clone https://github.com/YuNaga224/obsidian-memory-mcp.git
cd obsidian-memory-mcp
npm install
npm run build
```

Then configure in Claude Desktop:

```json
{
  "mcpServers": {
    "obsidian-memory": {
      "command": "node",
      "args": ["/full/path/to/obsidian-memory-mcp/dist/index.js"],
      "env": {
        "MEMORY_DIR": "/path/to/your/obsidian/vault"
      }
    }
  }
}
```

## Usage with Obsidian

1. Configure Claude Desktop with one of the options above
2. Restart Claude Desktop
3. Use the MCP memory tools to create entities and relations
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

## Development

```bash
npm run watch  # Watch for changes and rebuild
```

## Credits

This project is based on [Anthropic's memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) from the Model Context Protocol servers collection. We thank Anthropic for releasing the original implementation under the MIT license.

## License

MIT License - see [LICENSE](LICENSE) file for details.

Original memory server: Copyright (c) 2024 Anthropic, PBC  
Obsidian integration modifications: Copyright (c) 2024 YuNaga224