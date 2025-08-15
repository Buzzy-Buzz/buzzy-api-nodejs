# buzzy-api-nodejs

A Node.js client library for interacting with the Buzzy API. This package provides convenient wrapper functions for all Buzzy REST API endpoints with built-in rate limiting and error handling.

## Installation

```bash
npm install buzzy-api-nodejs
```

## Requirements

- Node.js >= 20.0.0

## Quick Start

```javascript
import { login, getMicroAppData, insertMicroAppRow } from 'buzzy-api-nodejs';

// Authenticate
const { authToken, userId } = await login({
  url: 'https://your-buzzy-instance.com',
  email: 'your-email@example.com',
  password: 'your-password'
});

// Query data
const data = await getMicroAppData({
  authToken,
  userId,
  url: 'https://your-buzzy-instance.com',
  microAppResourceID: 'your-datatable-id'
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

**Returns:** `Promise<{ authToken: string, userId: string }>`

**Example:**
```javascript
const { authToken, userId } = await login({
  url: 'https://app.buzzy.buzz',
  email: 'user@example.com',
  password: 'password123'
});
```

#### `getUserID({ authToken, url, email })`
Get user ID from email address.

**Parameters:**
- `authToken` (string): Authentication token
- `url` (string): Buzzy instance URL
- `email` (string): User email address

**Returns:** `Promise<{ userId: string }>`

### Data Operations

#### `getMicroAppData({ authToken, userId, url, microAppResourceID, optLimit, optSkip, optSort, optQuery })`
Query datatable rows with optional filtering and pagination.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppResourceID` (string): Datatable ID
- `optLimit` (number, optional): Maximum number of rows to return
- `optSkip` (number, optional): Number of rows to skip
- `optSort` (object, optional): Sort criteria
- `optQuery` (object, optional): Query filters

**Returns:** `Promise<Array>` - Array of datatable rows

#### `getMicroAppDataRow({ authToken, userId, url, microAppResourceID, appID })`
Get a single datatable row by ID.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppResourceID` (string): Datatable ID
- `appID` (string): Row ID

**Returns:** `Promise<Object>` - Single datatable row

#### `insertMicroAppRow({ authToken, userId, url, microAppResourceID, content })`
Create a new datatable row.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppResourceID` (string): Datatable ID
- `content` (array): Row field values

**Returns:** `Promise<{ appID: string }>` - Created row ID

#### `updateMicroAppDataRow({ authToken, userId, url, microAppResourceID, appID, content })`
Update an existing datatable row.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppResourceID` (string): Datatable ID
- `appID` (string): Row ID to update
- `content` (array): Updated field values

**Returns:** `Promise<Object>` - Update result

#### `removeMicroAppRow({ authToken, userId, url, microAppResourceID, appID })`
Delete a datatable row.

**Parameters:**
- `authToken` (string): Authentication token
- `userId` (string): User ID
- `url` (string): Buzzy instance URL
- `microAppResourceID` (string): Datatable ID
- `appID` (string): Row ID to delete

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

**Returns:** `Promise<{ childID: string }>` - Created attachment ID

**Example:**
```javascript
const result = await createMicroAppChild({
  authToken,
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

#### `getOrganizations({ authToken, userId, url })`
Get all organizations for the authenticated user.

**Returns:** `Promise<Array>` - Array of organizations

#### `createOrganization({ authToken, userId, url, name, description })`
Create a new organization.

**Parameters:**
- `name` (string): Organization name
- `description` (string): Organization description

**Returns:** `Promise<Object>` - Created organization

#### `updateOrganization({ authToken, userId, url, organizationID, name, description })`
Update an existing organization.

**Parameters:**
- `organizationID` (string): Organization ID
- `name` (string): Updated name
- `description` (string): Updated description

**Returns:** `Promise<Object>` - Update result

#### `deleteOrganization({ authToken, userId, url, organizationID })`
Delete an organization.

**Parameters:**
- `organizationID` (string): Organization ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Team Management

#### `getTeams({ authToken, userId, url, organizationID })`
Get all teams in an organization.

**Parameters:**
- `organizationID` (string): Organization ID

**Returns:** `Promise<Array>` - Array of teams

#### `createTeam({ authToken, userId, url, organizationID, name, description })`
Create a new team.

**Parameters:**
- `organizationID` (string): Parent organization ID
- `name` (string): Team name
- `description` (string): Team description

**Returns:** `Promise<Object>` - Created team

#### `updateTeam({ authToken, userId, url, teamID, name, description })`
Update an existing team.

**Parameters:**
- `teamID` (string): Team ID
- `name` (string): Updated name
- `description` (string): Updated description

**Returns:** `Promise<Object>` - Update result

#### `deleteTeam({ authToken, userId, url, teamID })`
Delete a team.

**Parameters:**
- `teamID` (string): Team ID to delete

**Returns:** `Promise<Object>` - Deletion result

### Team Member Management

#### `getTeamMembers({ authToken, userId, url, teamID })`
Get all members of a team.

**Parameters:**
- `teamID` (string): Team ID

**Returns:** `Promise<Array>` - Array of team members

#### `addTeamMember({ authToken, userId, url, teamID, email, role })`
Add a member to a team.

**Parameters:**
- `teamID` (string): Team ID
- `email` (string): Member email address
- `role` (string): Member role

**Returns:** `Promise<Object>` - Addition result

#### `updateTeamMember({ authToken, userId, url, teamID, memberID, role })`
Update a team member's role.

**Parameters:**
- `teamID` (string): Team ID
- `memberID` (string): Member ID
- `role` (string): New role

**Returns:** `Promise<Object>` - Update result

#### `deleteTeamMember({ authToken, userId, url, teamID, memberID })`
Remove a member from a team.

**Parameters:**
- `teamID` (string): Team ID
- `memberID` (string): Member ID to remove

**Returns:** `Promise<Object>` - Removal result

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
  const { authToken, userId } = await login({
    url: 'https://app.buzzy.buzz',
    email: 'user@example.com',
    password: 'password123'
  });

  // Create a new row
  const { appID } = await insertMicroAppRow({
    authToken,
    userId,
    url: 'https://app.buzzy.buzz',
    microAppResourceID: 'datatable-id',
    content: [
      { _id: 'field1', value: 'Sample data' },
      { _id: 'field2', value: 'More data' }
    ]
  });

  // Attach a file to the row
  const { childID } = await createMicroAppChild({
    authToken,
    userId,
    url: 'https://app.buzzy.buzz',
    microAppResourceID: 'datatable-id',
    appID,
    fieldID: 'attachment-field',
    content: {
      url: 'https://example.com/document.pdf',
      filename: 'document.pdf',
      type: 'application/pdf'
    }
  });

  // List all attachments for the field
  const attachments = await getChildItemsByField({
    authToken,
    userId,
    url: 'https://app.buzzy.buzz',
    appID,
    fieldID: 'attachment-field'
  });

  console.log('Created row:', appID);
  console.log('Attached file:', childID);
  console.log('All attachments:', attachments);
}
```

## Documentation

For complete API documentation, see: https://docs.buzzy.buzz/rest-api/buzzy-rest-api

## License

MIT
