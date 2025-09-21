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

#### `getUserID({ token, userId, url, email })`
Get user ID from email address.

**Parameters:**
- `token` (string): Authentication token
- `url` (string): Buzzy instance URL
- `email` (string): User email address

**Returns:** `Promise<{ userId: string }>`

### Data Operations

#### `getMicroAppData({ token, userId, url, microAppID, optSearchFilters, searchFilter, optViewFilters, viewFilterIsMongoQuery, optIsVectorSearch, optVectorSearchString, optLimit })`
Query datatable rows with optional filtering and pagination.

**Parameters:**
- `token` (string): Authentication token
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

#### `getMicroAppDataRow({ token, userId, url, rowID })`
Get a single datatable row by ID.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `rowID` (string): Row ID

**Returns:** `Promise<Object>` - Single datatable row

#### `insertMicroAppRow({ token, userId, url, microAppID, rowData, embeddingRowID, viewers, userID })`
Create a new datatable row.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppID` (string): Datatable ID
- `rowData` (object): Row data object
- `embeddingRowID` (string, optional): ID of embedding row
- `viewers` (array, optional): Array of user IDs who can view this row
- `userID` (string, optional): ID of the creator

**Returns:** `Promise<Object>` - Created row response

#### `updateMicroAppDataRow({ token, userId, url, rowID, rowData, creatorID })`
Update an existing datatable row.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `rowID` (string): Row ID to update
- `rowData` (object): Updated row data object
- `creatorID` (string): The Buzzy User ID of the user who created the row

**Returns:** `Promise<boolean>` - Update success status

#### `removeMicroAppRow(rowID, token, userId, url)`
Delete a datatable row.

**Parameters:**
- `rowID` (string): Row ID to delete
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL

**Returns:** `Promise<Object>` - Deletion result

### File Management (MicroAppChild)

#### `createMicroAppChild({ token, userId, url, microAppResourceID, appID, fieldID, content })`
Create a new file attachment for a datatable row field.

**Parameters:**
- `token` (string): Authentication token
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

#### `getChildItemsByField({ token, userId, url, appID, fieldID })`
List all file attachments for a specific row field.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `appID` (string): Parent row ID
- `fieldID` (string): Parent field ID

**Returns:** `Promise<Array>` - Array of child items

#### `readMicroAppChild({ token, userId, url, childID })`
Read a specific file attachment by ID.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `childID` (string): Child item ID

**Returns:** `Promise<Object>` - Child item data

#### `updateMicroAppChild({ token, userId, url, childID, content })`
Update file attachment content or metadata.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `childID` (string): Child item ID to update
- `content` (object): Updated content data

**Returns:** `Promise<Object>` - Update result

#### `removeMicroAppChild({ token, userId, url, childID })`
Delete a file attachment.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `childID` (string): Child item ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Organization Management

#### `insertOrganization({ token, userId, url, organizationInfo })`
Create a new organization.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationInfo` (object): Organization information object

**Returns:** `Promise<Object>` - Created organization response

#### `readOrganization({ token, userId, url, organizationID })`
Get organization details by ID.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationID` (string): Organization ID to read

**Returns:** `Promise<Object>` - Organization data

#### `updateOrganization({ token, userId, url, organizationID, organizationInfo })`
Update an existing organization.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationID` (string): Organization ID
- `organizationInfo` (object): Updated organization information

**Returns:** `Promise<Object>` - Update result

#### `deleteOrganization({ token, userId, url, organizationID })`
Delete an organization.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `organizationID` (string): Organization ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Team Management

#### `insertTeam({ token, userId, url, teamInfo, adminID })`
Create a new team.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamInfo` (object): Team information object
- `adminID` (string): Admin user ID for the team

**Returns:** `Promise<Object>` - Created team response

#### `readTeam({ token, userId, url, teamID })`
Get team details by ID.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID to read

**Returns:** `Promise<Object>` - Team data

#### `updateTeam({ token, userId, url, teamID, teamInfo })`
Update an existing team.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `teamInfo` (object): Updated team information

**Returns:** `Promise<Object>` - Update result

#### `deleteTeam({ token, userId, url, teamID })`
Delete a team.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Team Member Management

#### `insertTeamMembers({ token, userId, url, teamMembers, targetInitialApp, targetInitialScreen, targetRoute })`
Add members to teams.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamMembers` (array): Array of team member objects
- `targetInitialApp` (string, optional): Default app routing parameter
- `targetInitialScreen` (string, optional): Default screen routing parameter
- `targetRoute` (string, optional): Custom routing path

**Returns:** `Promise<Object>` - Addition result

#### `readTeamMember({ token, userId, url, teamID, userID })`
Get team member details.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `userID` (string): User ID of the team member

**Returns:** `Promise<Object>` - Team member data

#### `updateTeamMember({ token, userId, url, teamID, userID, role })`
Update a team member's role.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `userID` (string): User ID of the team member
- `role` (string): New role ('admin' or 'member')

**Returns:** `Promise<Object>` - Update result

#### `deleteTeamMember({ token, userId, url, teamID, userID })`
Remove a member from a team.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `teamID` (string): Team ID
- `userID` (string): User ID of the team member to remove

**Returns:** `Promise<Object>` - Removal result

### Session Management

#### `logout({ token, userId, url })`
Logs out a user by removing their authentication token.

**Parameters:**
- `token` (string): Authentication token
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

#### `enforceTeamMembership({ token, userId, url, userID, email, teamIDs })`
Enforces team membership for a user by adding/removing them from specified teams.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID making the request
- `url` (string): Buzzy instance URL
- `userID` (string): User ID to manage (optional if email provided)
- `email` (string): Email to manage (optional if userID provided)
- `teamIDs` (Array): Array of team IDs to enforce membership for

**Returns:** `Promise<Object>` - Enforcement response

#### `getTeamMembers({ token, userId, url, teamIDs })`
Gets team members for specified teams.

**Parameters:**
- `token` (string): Authentication token
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

#### `copyS3File({ token, userId, url, sourceResourceID, destinationResourceID, fileKey, newFileKey })`
Copies a file between S3 locations.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `sourceResourceID` (string): Source resource ID
- `destinationResourceID` (string): Destination resource ID
- `fileKey` (string): File key to copy
- `newFileKey` (string, optional): Optional new file key

**Returns:** `Promise<Object>` - Copy response with signed URL

#### `uploadFileToS3({ token, userId, url, resourceID, fieldID, fileUrl, filename })`
Uploads a file to S3 from a URL.

**Parameters:**
- `token` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `resourceID` (string): Resource ID
- `fieldID` (string): Field ID
- `fileUrl` (string): URL of file to upload
- `filename` (string): Filename for the upload

**Returns:** `Promise<Object>` - Upload response with URL

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
    token,
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
    token,
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
    token,
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
