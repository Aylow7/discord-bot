# Discord Bot Utils

## Overview

This is a French-language Discord bot built with Discord.js v14 that provides utility commands for server management and information. The bot supports both slash commands and traditional prefix commands (using `+` as the prefix). It features a simple file-based JSON database for tracking bot statistics and configuration.

**Current Commands**:
- **ping**: Displays bot latency (API and response time)
- **uptime**: Shows how long the bot has been running
- **botinfo**: Displays detailed bot information (servers, users, memory usage, etc.)
- **serverinfo**: Shows comprehensive server/guild information
- **help**: Lists all available commands

All commands are available in both slash (`/command`) and prefix (`+command`) formats.

## User Preferences

- Preferred communication style: Simple, everyday language
- Embed style: Titles in English with backtick-wrapped emoji (`emoji`〃Title), descriptions and footers in French

## System Architecture

### Application Structure

The bot follows a modular command-based architecture with clear separation between slash commands and prefix commands:

- **Entry Point**: `index.js` serves as the main application file, initializing the Discord client with necessary intents (Guilds, GuildMessages, MessageContent, GuildMembers)
- **Command Loading**: Dynamic command loading system that scans `commands/` and `prefixCommands/` directories and registers commands into separate Collections
- **Dual Command Support**: Both Discord slash commands and traditional prefix commands are supported, with identical functionality across both interfaces

### Command System Design

**Rationale**: The bot implements both slash and prefix commands to provide flexibility for users who prefer different interaction methods. While Discord is moving toward slash commands, many users still prefer traditional prefix-based commands.

**Structure**:
- Slash commands are stored in `/commands` directory
- Prefix commands are stored in `/prefixCommands` directory
- Each command exports a default object with command metadata and an execute function
- Commands are loaded dynamically at startup using filesystem scanning

**Benefits**:
- Users can choose their preferred command style
- Consistent functionality across both command types
- Easy to add new commands by creating new files

### Configuration Management

**Approach**: Centralized configuration in `config.js` with exported constants for bot settings and color schemes.

**Design Decision**: Using a simple JavaScript module for configuration provides:
- Type safety through ES6 modules
- Easy imports across the application
- Simple color theming system for embeds (red, green, blue, orange)
- Configurable command prefix

**Trade-offs**: While environment variables would be more secure for sensitive data, the current approach is suitable for this utility bot with minimal sensitive configuration.

### Data Persistence

**Solution**: File-based JSON database stored in `database/config.json`

**Purpose**: Tracks bot statistics and runtime information:
- Bot start time for uptime calculations
- Total command execution count
- Per-guild configuration storage (extensible structure)

**Database Utilities** (`utils/database.js`):
- `initDatabase()`: Initializes or repairs the database file with default values
- `readDatabase()`: Safely reads database with automatic initialization and fallback to defaults
- `writeDatabase()`: Writes data to the JSON file with error handling
- `incrementCommandCount()`: Tracks command usage statistics (called by all commands)
- `setBotStartTime()`: Records bot startup timestamp
- `getBotStartTime()`: Retrieves bot startup timestamp for uptime calculations

**Rationale**: A JSON file database was chosen for simplicity since the bot only needs to track minimal state. This approach:
- Requires no external database server
- Provides persistent storage across restarts
- Is easy to backup and modify manually if needed
- Handles graceful fallbacks when file is missing or corrupted
- Automatically initializes with default values on first run

**Recent Improvements** (November 2025):
- Added automatic database initialization to prevent empty file errors
- Enhanced error handling for missing/corrupted database files
- All commands now properly increment the command counter for accurate statistics

**Limitations**: This approach is not suitable for high-write scenarios or concurrent access, but is adequate for single-instance bot statistics.

### Response Formatting

**Pattern**: Consistent embed-based responses across all commands using Discord.js EmbedBuilder

**Design**:
- All responses use rich embeds with themed colors
- **Strict embed format**: Titles in English using `` `emoji`〃Title `` pattern
- Descriptions and footers in French using `> *text*` format
- Color scheme: Green (success/ping), Blue (info), Orange (help), Red (errors)
- User context in footers (author tag and avatar)

**Benefits**:
- Professional, polished appearance
- Color coding helps users quickly identify response types
- Consistent user experience across all commands
- Bilingual approach: English titles for international recognition, French content for user community

### Moderation Framework (Partial Implementation)

**Evidence**: The `attached_assets` folder contains code snippets for moderation commands (warn, timeout, channel management) and a comprehensive list of planned administration features.

**Current State**: The core bot infrastructure supports a moderation system with:
- Warn tracking system (`utils/warns.js` - referenced but not provided)
- Timeout management with duration parsing
- Channel information utilities
- Permission checking

**Architecture**: Moderation commands follow the same dual-command pattern and use permission checks via Discord.js `PermissionFlagsBits`.

**Note**: The moderation features appear to be in development or partially removed from the current codebase, but the infrastructure and patterns are established for future implementation.

## External Dependencies

### Discord.js Library (v14.16.3)

**Purpose**: Official Discord API wrapper for Node.js

**Usage**:
- Client creation and connection management
- Gateway intents for event subscriptions
- Command builders (SlashCommandBuilder)
- Embed creation for rich responses
- Collection data structures for command storage

### Node.js Built-in Modules

- **fs**: File system operations for database persistence and command loading
- **path**: Cross-platform path manipulation
- **url**: ES6 module path resolution (fileURLToPath)
- **os**: System information (referenced in botinfo)

### Runtime Requirements

- **Node.js**: ES6 modules (type: "module" in package.json)
- **File System Access**: For JSON database and dynamic command loading
- **Discord Bot Token**: Required environment variable (not shown in code but necessary for deployment)