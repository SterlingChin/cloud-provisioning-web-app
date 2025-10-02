# Cloud Infrastructure Terminal - Project Plan for Claude Code

## Project Overview
Build a terminal-style UI that allows developers to provision cloud infrastructure using natural language commands. The terminal calls OpenAI/Claude with MCP integration, which then executes infrastructure commands via Postman Flow.

## Project Structure

```
cloud-terminal/
├── app/
│   ├── api/
│   │   └── provision/
│   │       └── route.ts          # API endpoint that calls OpenAI + Postman Flow
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page with Terminal component
├── components/
│   ├── Terminal.tsx               # Main terminal component (xterm.js)
│   └── TerminalHeader.tsx         # Optional header with branding
├── lib/
│   ├── openai.ts                  # OpenAI client configuration
│   ├── postman.ts                 # Postman Flow API calls
│   └── command-parser.ts          # Fallback command parsing logic
├── types/
│   └── index.ts                   # TypeScript type definitions
├── .env.local                     # Environment variables
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Phase 1: Project Setup

### Tasks
1. Initialize Next.js project with TypeScript and Tailwind
2. Install dependencies
3. Set up environment variables
4. Create basic file structure

### Commands
```bash
npx create-next-app@latest cloud-terminal --typescript --tailwind --app
cd cloud-terminal
npm install xterm xterm-addon-fit openai
npm install -D @types/node
```

### Environment Variables (.env.local)
```bash
OPENAI_API_KEY=sk-...
POSTMAN_FLOW_URL=https://your-postman-flow-endpoint
POSTMAN_API_KEY=your-postman-api-key
```

## Phase 2: Core Terminal Component

### File: components/Terminal.tsx
**Functionality:**
- Initialize xterm.js terminal
- Handle user input (typing, backspace, enter)
- Maintain command history
- Display responses with color formatting
- Support terminal ANSI codes for colors

**Key Features:**
- Command input buffer
- Command history (up/down arrows)
- Loading states
- Error handling with red text
- Success messages with green checkmarks
- Resource details display

**ANSI Color Codes:**
- `\x1b[32m` = Green (success)
- `\x1b[31m` = Red (error)
- `\x1b[36m` = Cyan (info)
- `\x1b[90m` = Gray (processing)
- `\x1b[0m` = Reset

## Phase 3: API Endpoint with OpenAI Integration

### File: app/api/provision/route.ts
**Functionality:**
- Accept natural language commands
- Call OpenAI API with MCP tool definitions
- Parse tool calls from OpenAI response
- Execute Postman Flow requests
- Return formatted responses

**OpenAI Tool Definition:**
```typescript
{
  name: "provision_infrastructure",
  description: "Provision or manage AWS cloud infrastructure",
  parameters: {
    action: "create" | "list" | "delete" | "describe",
    resourceType: "database" | "server" | "storage" | "networking",
    region: string,
    config: object
  }
}
```

**Response Flow:**
1. User command → OpenAI API
2. OpenAI decides to use tool
3. Extract tool parameters
4. Call Postman Flow with parameters
5. Format response for terminal
6. Return to frontend

## Phase 4: Postman Flow Integration

### File: lib/postman.ts
**Functionality:**
- HTTP client for Postman Flow API
- Map OpenAI tool calls to Postman endpoints
- Handle authentication
- Parse AWS responses
- Error handling and retry logic

**Endpoint Mapping:**
```typescript
{
  "create-database": "/databases",
  "create-server": "/servers", 
  "create-storage": "/storage",
  "list-databases": "/databases",
  "list-storage": "/storage"
}
```

## Phase 5: Response Formatting

### File: lib/formatters.ts
**Functionality:**
- Convert API responses to terminal-friendly format
- Create ASCII tables for list operations
- Format resource details with color codes
- Generate status indicators (✓, ✗, •)

**Example Outputs:**
```
Database created:
  ✓ ID: db-125
  ✓ Endpoint: mydb.us-west-2.rds.amazonaws.com
  ✓ Status: available
  ✓ Engine: postgres v14
```

## Phase 6: Enhanced Features

### Command History
- Store last 50 commands
- Navigate with up/down arrows
- Persist in sessionStorage

### Auto-complete
- Show suggestions on Tab key
- Common commands list
- Context-aware suggestions

### Streaming Responses
- Show real-time progress for long operations
- Streaming text from API
- Progress indicators

## Phase 7: UI Polish

### Terminal Header
- Logo/branding
- Connection status indicator
- Help button

### Welcome Screen
```
╔════════════════════════════════════════════╗
║  Cloud Infrastructure Terminal v1.0        ║
║  Powered by Postman + AI                   ║
╚════════════════════════════════════════════╝

Available commands:
  • create [resource] in [region]
  • list [resources]
  • delete [resource]
  • help

Examples:
  $ create postgres database in us-west-2
  $ list all s3 buckets
  $ create ec2 instance

Type 'help' for more information.
```

## Phase 8: Error Handling & Edge Cases

### Handle:
- Network failures
- OpenAI API rate limits
- Postman Flow timeouts
- Invalid commands
- AWS API errors
- Authentication failures

### User Feedback:
- Clear error messages
- Suggested fixes
- Retry mechanisms
- Graceful degradation

## Phase 9: Testing Strategy

### Unit Tests
- Command parsing logic
- Response formatters
- OpenAI integration

### Integration Tests
- Full workflow: command → OpenAI → Postman → response
- Error scenarios
- Edge cases

### Manual Testing
- Demo commands
- Performance under load
- UI responsiveness

## Phase 10: Deployment

### Vercel Deployment
```bash
npm run build
vercel deploy --prod
```

### Environment Setup
- Configure production environment variables
- Set up Postman Flow webhook URLs
- Configure CORS if needed

### Monitoring
- Add logging (console/service)
- Track command usage
- Monitor API errors

## Development Timeline

**Week 1:**
- Phase 1-2: Setup + Terminal Component

**Week 2:**
- Phase 3-4: OpenAI + Postman Integration

**Week 3:**
- Phase 5-7: Formatting + UI Polish

**Week 4:**
- Phase 8-10: Error Handling + Testing + Deployment

## Key Decisions to Make

1. **MCP Implementation:**
   - Use OpenAI function calling (simpler, faster demo)
   - Use actual MCP protocol (more technically accurate)
   - **Recommendation:** Start with OpenAI functions for demo, document how it maps to MCP

2. **Authentication:**
   - How do users authenticate to AWS?
   - Store credentials in Postman Vault?
   - Use demo account for meetup?
   - **Recommendation:** Use pre-configured demo account, mention security in production

3. **Real vs Mock:**
   - Use real AWS API calls?
   - Use mock Postman server for demos?
   - **Recommendation:** Hybrid - mock for demos, real for showcase

4. **Cursor Integration:**
   - Build separate Cursor extension?
   - Just show MCP config file?
   - **Recommendation:** Show config file, mention same backend

## Success Criteria

- Developer can type natural language command
- Terminal shows clear, formatted response within 3 seconds
- All demo scenarios work reliably
- UI looks professional and developer-focused
- Clear connection between terminal → AI → Postman shown
- Works on projector/large screen

## Demo Script Alignment

Your demo flow should be:
1. **Show terminal** - Developer types "create postgres database in us-west-2"
2. **Show response** - Formatted output with resource details
3. **Open Postman** - "Here's the collection that was called, with tests and monitors"
4. **Show monitor** - "This ensures the API stays reliable"
5. **Show Cursor config** - "Same MCP server works in my IDE"

The terminal makes the "AI-ready API" story visual and tangible.