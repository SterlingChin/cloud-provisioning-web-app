# Provisioning Guide

## How to Create Resources

The app now supports **actual resource creation** via the Postman Mock API! Here's how it works:

### Step-by-Step Flow

1. **Navigate to Provision Page**
   - Click any "Provision New [Resource]" button from:
     - Dashboard quick actions
     - Individual resource pages (Servers, Databases, etc.)

2. **Chat with AI**
   - Type anything in the chat (e.g., "Create a new database")
   - The message content doesn't matter yet - it will trigger provisioning

3. **Watch the Terminal**
   - The AI terminal shows real-time command execution
   - You'll see:
     - Request analysis
     - Parameter extraction
     - API call execution
     - Success/failure status

4. **API Call Happens**
   - The app makes a **real POST request** to the mock API
   - Example for database:
     ```javascript
     POST https://1d8ea325-fef8-4dcf-babf-a86a03eaa444.mock.pstmn.io/databases
     {
       "name": "my-database-1696274838291",
       "engine": "postgres",
       "version": "14"
     }
     ```

5. **View Created Resource**
   - After success, two buttons appear:
     - **"View Databases"** - Navigate to see all resources
     - **"Provision Another"** - Reset and create another

6. **See Your New Resource**
   - Navigate to the resource page (e.g., `/databases`)
   - Click refresh or reload the page
   - Your newly created resource should appear in the list!

## What Gets Created

### Database (`/provision?type=database`)
```json
{
  "name": "my-database-{timestamp}",
  "engine": "postgres",
  "version": "14"
}
```

### Server (`/provision?type=server`)
```json
{
  "name": "my-server-{timestamp}",
  "image": "ubuntu-20.04",
  "size": "medium"
}
```

### Networking (`/provision?type=networking`)
```json
{
  "name": "my-network-{timestamp}",
  "cidrBlock": "10.0.0.0/16"
}
```

## Testing It Out

### Quick Test: Create a Database

1. Open http://localhost:3003
2. Click "Provision New Database" on dashboard
3. Type anything in chat: "I need a postgres database"
4. Press Send
5. Watch the terminal execute commands
6. Wait ~4 seconds for success message
7. Click "View Databases"
8. **Refresh the page** - you should see your new database!

### Mock API Response

The mock server returns the created resource. For example:

**Request:**
```bash
curl -X POST https://1d8ea325-fef8-4dcf-babf-a86a03eaa444.mock.pstmn.io/databases \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-database-123",
    "engine": "postgres",
    "version": "14"
  }'
```

**Response:**
```json
{
  "id": "db-125",
  "name": "new-db",
  "engine": "postgres",
  "version": "14"
}
```

## Important Notes

⚠️ **Mock Server Behavior:**
- The mock server may not persist data between sessions
- Each refresh of the resource list page calls `GET /servers` (or `/databases`, etc.)
- The mock server returns pre-defined mock data from the collection
- Your created resources might not appear in the list if the mock doesn't persist them

### Why You Might Not See Your Resource

The Postman Mock Server returns **static mock responses** based on the collection examples. So:

1. ✅ **POST request succeeds** - Returns `db-125` with your data
2. ✅ **Terminal shows success** - Resource was "created"
3. ❌ **GET request returns original mock data** - Shows `db-123` and `db-124` (from collection)

### Solutions

**Option 1: Use Postman Mock Server with Dynamic Responses**
- Configure your mock server to return dynamic data
- Use Postman examples with variables

**Option 2: Build a Real Backend**
- Replace the mock API with a real backend
- Store resources in a database

**Option 3: Use Local State (Quick Fix)**
- Store created resources in React state or localStorage
- Display them alongside mock data

## Next Steps

Would you like me to implement Option 3 (local state storage) so you can see created resources immediately? This would:
- Store newly created resources in browser localStorage
- Display them in the resource list pages
- Make the provisioning feel more realistic while using mocks

Let me know if you want this enhancement!
