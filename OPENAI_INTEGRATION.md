# OpenAI + Postman Integration Guide

## 🎉 What's New

Your app now uses **OpenAI's GPT-4** to understand natural language commands and provision infrastructure!

## Architecture Flow

```
User Types Message
    ↓
Chat Interface
    ↓
/api/provision endpoint
    ↓
OpenAI API (Function Calling)
    ↓
Postman Mock API
    ↓
Terminal Display & Success
```

## How It Works

### 1. User Input (Natural Language)
Users can now type **natural language** in the chat:
- ✅ "Create a postgres database"
- ✅ "I need a mysql database version 8"
- ✅ "Provision an Ubuntu server"
- ✅ "Create a new VPC network"
- ✅ "Make me a database for customer data"

### 2. OpenAI Processing
The `/api/provision` endpoint:
- Sends the message to OpenAI GPT-4
- Uses **function calling** with tool definitions
- OpenAI decides:
  - What action to take (create, list, delete)
  - What resource type (database, server, networking)
  - What configuration parameters

### 3. Resource Provisioning
Based on OpenAI's decision:
- Calls the appropriate Postman Mock API endpoint
- Passes the extracted parameters
- Returns the created resource

### 4. Terminal Display
Shows the full flow:
- User's original message
- AI's interpretation
- Action being taken
- Resource details
- Success confirmation

## Example Flows

### Create a Database
**User:** "Create a postgres database"

**Terminal Output:**
```
Sending request to AI...
User: Create a postgres database

AI analyzing command...

AI Response: I've created your database.

Action: create
Resource Type: database

Resource Details:
  ✓ ID: db-125
  ✓ Name: new-db
  ✓ Engine: postgres
  ✓ Version: 14

SUCCESS: Database provisioned!
```

### Create a Server
**User:** "I need an Ubuntu server"

**AI extracts:**
- Action: `create`
- Resource Type: `server`
- Config: `{ image: "ubuntu-20.04", size: "medium" }`

**Result:** Server created via POST /servers

## API Endpoint Details

### POST /api/provision

**Request:**
```json
{
  "message": "Create a postgres database",
  "resourceType": "database"
}
```

**Response (Success):**
```json
{
  "success": true,
  "action": "create",
  "resourceType": "database",
  "result": {
    "resource": {
      "id": "db-125",
      "name": "new-db",
      "engine": "postgres",
      "version": "14"
    },
    "message": "Successfully created database: new-db"
  },
  "aiResponse": "I've created your database."
}
```

**Response (No Action):**
```json
{
  "success": true,
  "aiResponse": "I understand you want help with cloud infrastructure. What would you like to create?",
  "noAction": true
}
```

## OpenAI Function Definition

The API uses this tool definition:

```typescript
{
  name: 'provision_infrastructure',
  description: 'Provision or manage cloud infrastructure resources',
  parameters: {
    action: 'create' | 'list' | 'delete' | 'describe',
    resourceType: 'database' | 'server' | 'storage' | 'networking',
    resourceName: string,
    config: {
      engine: string,    // Database engine
      version: string,   // Version
      image: string,     // Server OS image
      size: string,      // Instance size
      cidrBlock: string, // Network CIDR
    }
  }
}
```

## Configuration

### Environment Variables (.env.local)

You need to add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-your-openai-key-here
NEXT_PUBLIC_API_BASE_URL=https://1d8ea325-fef8-4dcf-babf-a86a03eaa444.mock.pstmn.io
```

### Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `.env.local`
4. Restart the dev server: `npm run dev`

## Testing It Out

### Step 1: Add API Key
Update `.env.local` with your OpenAI key.

### Step 2: Restart Server
```bash
npm run dev
```

### Step 3: Try Natural Language Commands
1. Go to http://localhost:3003
2. Click "Provision New Database"
3. Try these commands:
   - "Create a postgres database"
   - "I need a mysql database version 8"
   - "Make me a customer database"

### Step 4: Watch the Magic
- AI interprets your command
- Extracts parameters
- Calls Postman API
- Shows detailed results

## Supported Commands

### Databases
- "Create a postgres database"
- "Make a mysql database version 8"
- "I need a new database"

### Servers
- "Create an Ubuntu server"
- "Provision a new server"
- "I need a t2.micro instance"

### Networking
- "Create a VPC network"
- "Make a new network with CIDR 10.0.0.0/16"
- "Set up networking"

## Current Limitations

1. **Mock Server**: Still using Postman mock - doesn't persist data
2. **Limited Actions**: Only `create` and `list` implemented
3. **Basic Config**: Uses default values for most parameters
4. **No Streaming**: Responses are not streamed (yet)

## Next Enhancements

### 1. Add Streaming Responses
Show AI thinking in real-time:
```typescript
// Use OpenAI streaming
stream: true
```

### 2. More Actions
- List resources: "Show me all databases"
- Delete resources: "Delete database db-123"
- Describe resources: "Tell me about server srv-456"

### 3. Advanced Configuration
Let AI extract more details:
- Database size and tier
- Server instance types
- Network configurations
- Storage sizes

### 4. Multi-Step Conversations
Keep context:
- "Create a database"
- "Now create a server that connects to it"
- "Set up networking for both"

### 5. Postman Flow Integration
Replace mock with real Postman Flow:
```typescript
// In /api/provision/route.ts
const flowUrl = process.env.POSTMAN_FLOW_URL;
const response = await fetch(flowUrl, {
  method: 'POST',
  headers: {
    'x-api-key': process.env.POSTMAN_API_KEY,
  },
  body: JSON.stringify(params),
});
```

## Benefits of This Integration

✅ **Natural Language**: No need to remember exact API syntax
✅ **Flexible**: AI adapts to different phrasings
✅ **Intelligent**: AI suggests defaults and fills in gaps
✅ **Demo-Ready**: Shows AI-powered infrastructure provisioning
✅ **Extensible**: Easy to add more resource types and actions

## Troubleshooting

### Error: "Missing OpenAI API key"
- Check `.env.local` has `OPENAI_API_KEY`
- Restart dev server after adding

### Error: "Rate limit exceeded"
- OpenAI free tier has limits
- Upgrade plan or wait for reset

### AI doesn't trigger function call
- Make command more explicit
- Try: "Create a database" instead of "database please"

### Resource not showing in list
- Mock server returns static data
- POST creates, but GET returns pre-defined examples
- Solution: Implement localStorage (see PROVISIONING_GUIDE.md)

## Demo Script

Perfect for showing off:

1. **Open app** → Dashboard
2. **Click** "Provision New Database"
3. **Type** "Create a postgres database for customer data"
4. **Watch** terminal show AI thinking
5. **Show** OpenAI function call in browser DevTools Network tab
6. **Point out** how AI extracted parameters
7. **Navigate** to Databases page
8. **Explain** mock server behavior

This integration makes your infrastructure provisioning **AI-powered and developer-friendly**! 🚀
