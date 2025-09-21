# buzzy-api-nodejs

A Node.js client library for interacting with the Buzzy API. This package provides convenient wrapper functions for all Buzzy REST API endpoints with built-in rate limiting and error handling.

## Installation

```bash
npm install buzzy-api-nodejs
```

## Quick Start

```javascript
import { login, getMicroAppData, insertMicroAppRow } from 'buzzy-api-nodejs';

// Authenticate
const { token, userId } = await login({
  url: 'https://your-buzzy-instance.com',
  email: 'your-email@example.com',
  password: 'your-password'
});

// Query data
const data = await getMicroAppData({
  token,
  userId,
  url: 'https://your-buzzy-instance.com',
  microAppID: 'your-datatable-id'
});
```

## API Reference

### Authentication

#### `login({ url, email, password })`
Authenticate with Buzzy using email and password.

**Parameters:**
- `url` (string): Buzzy instance URL
- `email` (string): User email address
- `password` (string): User password

**Returns:** `Promise<{ token: string, userId: string }>`

**Example:**
```javascript
const { token, userId } = await login({
  url: 'https://app.buzzy.buzz',
  email: 'user@example.com',
  password: 'password123'
});
```

#### `getUserID({ authToken, userId, url, email })`
Get user ID from email address.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `email` (string): User email address

**Returns:** `Promise<Object>` - User data object

### Data Operations

#### `getMicroAppData({ authToken, userId, url, microAppID, optSearchFilters, searchFilter, optViewFilters, viewFilterIsMongoQuery, optIsVectorSearch, optVectorSearchString, optLimit })`
Query datatable rows with optional filtering and pagination.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppID` (string): Datatable ID
- `optSearchFilters` (object, optional): Optional search filters for querying
- `searchFilter` (object, optional): Primary search filter for querying
- `optViewFilters` (object, optional): Optional view filters for querying
- `viewFilterIsMongoQuery` (boolean, optional): Whether view filters use MongoDB query syntax
- `optIsVectorSearch` (boolean, optional): Enable vector/semantic search
- `optVectorSearchString` (string, optional): Vector search query string
- `optLimit` (number, optional): Maximum number of rows to return

**Returns:** `Promise<Array>` - Array of datatable rows

#### `getMicroAppDataRow({ authToken, userId, url, rowID })`
Get a single datatable row by ID.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `rowID` (string): Row ID

**Returns:** `Promise<Object>` - Single datatable row

#### `insertMicroAppRow({ authToken, userId, url, microAppID, rowData, embeddingRowID, viewers, userID })`
Create a new datatable row.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppID` (string): Datatable ID
- `rowData` (object): Row data object
- `embeddingRowID` (string, optional): ID of embedding row
- `viewers` (array, optional): Array of user IDs who can view this row
- `userID` (string, optional): ID of the creator

**Returns:** `Promise<Object>` - Created row response

#### `updateMicroAppDataRow({ authToken, userId, url, rowID, rowData, creatorID })`
Update an existing datatable row.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `rowID` (string): Row ID to update
- `rowData` (object): Updated row data object
- `creatorID` (string): The Buzzy User ID of the user who created the row

**Returns:** `Promise<boolean>` - Update success status

#### `removeMicroAppRow(rowID, authToken, userId, url)`
Delete a datatable row.

**Parameters:**
- `rowID` (string): Row ID to delete
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL

**Returns:** `Promise<Object>` - Deletion result

### File Management (MicroAppChild)

#### `createMicroAppChild({ authToken, userId, url, microAppResourceID, appID, fieldID, content })`
Create a new file attachment for a datatable row field.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppResourceID` (string): Datatable ID
- `appID` (string): Parent row ID
- `fieldID` (string): Parent field ID
- `content` (object): File content data

**Returns:** `Promise<Object>` - Created attachment response

**Example:**
```javascript
const result = await createMicroAppChild({
  token,
  userId,
  url: 'https://app.buzzy.buzz',
  microAppResourceID: 'datatable-id',
  appID: 'row-id',
  fieldID: 'attachment-field-id',
  content: {
    url: 'https://example.com/file.pdf',
    filename: 'document.pdf',
    size: 1024000,
    type: 'application/pdf'
  }
});
```

#### `getChildItemsByField({ authToken, userId, url, appID, fieldID })`
List all file attachments for a specific row field.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `appID` (string): Parent row ID
- `fieldID` (string): Parent field ID

**Returns:** `Promise<Array>` - Array of child items

#### `readMicroAppChild({ authToken, userId, url, childID })`
Read a specific file attachment by ID.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `childID` (string): Child item ID

**Returns:** `Promise<Object>` - Child item data

#### `updateMicroAppChild({ authToken, userId, url, childID, content })`
Update file attachment content or metadata.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `childID` (string): Child item ID to update
- `content` (object): Updated content data

**Returns:** `Promise<Object>` - Update result

#### `removeMicroAppChild({ authToken, userId, url, childID })`
Delete a file attachment.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `childID` (string): Child item ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Organization Management

#### `insertOrganization({ authToken, userId, url, organizationInfo })`
Create a new organization.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationInfo` (object): Organization information object

**Returns:** `Promise<Object>` - Created organization response

#### `readOrganization({ authToken, userId, url, organizationID })`
Get organization details by ID.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationID` (string): Organization ID to read

**Returns:** `Promise<Object>` - Organization data

#### `updateOrganization({ authToken, userId, url, organizationID, organizationInfo })`
Update an existing organization.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationID` (string): Organization ID
- `organizationInfo` (object): Updated organization information

**Returns:** `Promise<Object>` - Update result

#### `deleteOrganization({ authToken, userId, url, organizationID })`
Delete an organization.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationID` (string): Organization ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Team Management

#### `insertTeam({ authToken, userId, url, teamInfo, adminID })`
Create a new team.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamInfo` (object): Team information object
- `adminID` (string): Admin user ID for the team

**Returns:** `Promise<Object>` - Created team response

#### `readTeam({ authToken, userId, url, teamID })`
Get team details by ID.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID to read

**Returns:** `Promise<Object>` - Team data

#### `updateTeam({ authToken, userId, url, teamID, teamInfo })`
Update an existing team.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `teamInfo` (object): Updated team information

**Returns:** `Promise<Object>` - Update result

#### `deleteTeam({ authToken, userId, url, teamID })`
Delete a team.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Team Member Management

#### `insertTeamMembers({ authToken, userId, url, teamIDs, emails, userIDs, targetInitialApp, targetInitialScreen, targetRoute })`
Add members to teams.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamIDs` (array): Array of team IDs to add members to
- `emails` (array, optional): Array of email addresses of users to add
- `userIDs` (array, optional): Array of user IDs of users to add
- `targetInitialApp` (string, optional): Default app routing parameter
- `targetInitialScreen` (string, optional): Default screen routing parameter
- `targetRoute` (string, optional): Custom routing path (defaults to "app")

**Returns:** `Promise<Object>` - Addition result

#### `readTeamMember({ authToken, userId, url, teamID, userID })`
Get team member details.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `userID` (string): User ID of the team member

**Returns:** `Promise<Object>` - Team member data

#### `updateTeamMember({ authToken, userId, url, teamID, userID, role })`
Update a team member's role.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `userID` (string): User ID of the team member
- `role` (string): New role ('admin' or 'member')

**Returns:** `Promise<Object>` - Update result

#### `deleteTeamMember({ authToken, userId, url, teamID, userID })`
Remove a member from a team.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `userID` (string): User ID of the team member to remove

**Returns:** `Promise<Object>` - Removal result

### Session Management

#### `logout({ authToken, userId, url })`
Logs out a user by removing their authentication token.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL

**Returns:** `Promise<Object>` - Logout response

**Example:**
```javascript
const result = await logout({
  token: 'your-auth-token',
  userId: 'user-id',
  url: 'https://app.buzzy.buzz'
});
```

### Advanced Team Management

#### `enforceTeamMembership({ authToken, userId, url, userID, email, teamIDs })`
Enforces team membership for a user by adding/removing them from specified teams.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID making the request
- `url` (string): Buzzy instance URL
- `userID` (string): User ID to manage (optional if email provided)
- `email` (string): Email to manage (optional if userID provided)
- `teamIDs` (Array): Array of team IDs to enforce membership for

**Returns:** `Promise<Object>` - Enforcement response

#### `getTeamMembers({ authToken, userId, url, teamIDs })`
Gets team members for specified teams.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamIDs` (Array): Array of team IDs to get members for

**Returns:** `Promise<Object>` - Team members response with array of user IDs

### AI-Powered App Creation

#### `createAppWithPrompt({ url, apiKey, userEmail, appPrompt, attachments })`
Creates an app using AI prompt.

**Parameters:**
- `url` (string): Buzzy instance URL
- `apiKey` (string): API key for authentication
- `userEmail` (string): User's email
- `appPrompt` (string): AI prompt for app creation
- `attachments` (Array, optional): Optional attachments array

**Returns:** `Promise<Object>` - App creation response with buzzID

**Example:**
```javascript
const result = await createAppWithPrompt({
  url: 'https://app.buzzy.buzz',
  apiKey: 'your-api-key',
  userEmail: 'user@example.com',
  appPrompt: 'Create a task management app with user assignments',
  attachments: []
});
```

### S3 File Operations

#### `copyS3File({ authToken, userId, url, sourceResourceID, destinationResourceID, fileKey, newFileKey })`
Copies a file between S3 locations.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `sourceResourceID` (string): Source resource ID
- `destinationResourceID` (string): Destination resource ID
- `fileKey` (string): File key to copy
- `newFileKey` (string, optional): Optional new file key

**Returns:** `Promise<Object>` - Copy response with signed URL

#### `uploadFileToS3({ authToken, userId, url, resourceID, fieldID, fileUrl, filename })`
Uploads a file to S3 from a URL.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `resourceID` (string): Resource ID
- `fieldID` (string): Field ID
- `fileUrl` (string): URL of file to upload
- `filename` (string): Filename for the upload

**Returns:** `Promise<Object>` - Upload responsewith URL

**Example:**
```javascript
const result = await uploadFileToS3({
  token: 'your-auth-token',
  userId: 'user-id',
  url: 'https://app.buzzy.buzz',
  resourceID: 'resource-id',
  fieldID: 'field-id',
  fileUrl: 'https://example.com/document.pdf',
  filename: 'document.pdf'
});
```

## Rate Limiting

All functions include built-in rate limiting to prevent API abuse. Each function has both a regular version and a "Wrapped" version with rate limiting applied.

## Error Handling

The library includes an `errorResponse(err)` helper function for consistent error handling across all API calls.

```javascript
import { errorResponse } from 'buzzy-api-nodejs';

try {
  const result = await someApiCall();
} catch (error) {
  const errorInfo = errorResponse(error);
  console.error('API Error:', errorInfo);
}
```

## Complete Example

```javascript
import {
  login,
  getMicroAppData,
  insertMicroAppRow,
  createMicroAppChild,
  getChildItemsByField
} from 'buzzy-api-nodejs';

async function example() {
  // Authenticate
  const { token, userId } = await login({
    url: 'https://app.buzzy.buzz',
    email: 'user@example.com',
    password: 'password123'
  });

  // Create a new row
  const result = await insertMicroAppRow({
    authToken: token,
    userId,
    url: 'https://app.buzzy.buzz',
    microAppID: 'datatable-id',
    rowData: {
      field1: 'Sample data',
      field2: 'More data'
    }
  });

  // Attach a file to the row
  const childResult = await createMicroAppChild({
    authToken: token,
    userId,
    url: 'https://app.buzzy.buzz',
    microAppResourceID: 'datatable-id',
    appID: 'row-id',
    fieldID: 'attachment-field',
    content: {
      url: 'https://example.com/document.pdf',
      filename: 'document.pdf',
      type: 'application/pdf'
    }
  });

  // List all attachments for the field
  const attachments = await getChildItemsByField({
    authToken: token,
    userId,
    url: 'https://app.buzzy.buzz',
    appID: 'row-id',
    fieldID: 'attachment-field'
  });

  console.log('Created row:', result);
  console.log('Attached file:', childResult);
  console.log('All attachments:', attachments);
}
```

## Documentation

For complete API documentation, see: https://docs.buzzy.buzz/rest-api/buzzy-rest-api

## License

MIT
