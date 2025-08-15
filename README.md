# buzzy-api-nodejs

Node.js API client for the Buzzy platform - comprehensive functions for Organizations, Teams, MicroApps, and data management.

## Installation

```bash
npm install buzzy-api-nodejs
```

## Requirements

- Node.js >= 18.0.0

## Usage

```javascript
import * as BuzzyAPI from 'buzzy-api-nodejs';

// Authentication
const authResult = await BuzzyAPI.login({
  url: 'https://your-buzzy-instance.com',
  email: 'your-email@example.com',
  password: 'your-password'
});

// Get user ID
const userId = await BuzzyAPI.getUserID({
  authToken: authResult.authToken,
  url: 'https://your-buzzy-instance.com'
});

// Organization operations
const org = await BuzzyAPI.insertOrganization({
  authToken: authResult.authToken,
  userId: userId,
  url: 'https://your-buzzy-instance.com',
  organizationName: 'My Organization'
});

// MicroApp data operations
const rowData = await BuzzyAPI.insertMicroAppRow({
  authToken: authResult.authToken,
  userId: userId,
  url: 'https://your-buzzy-instance.com',
  microAppResourceID: 'your-microapp-id',
  rowData: { field1: 'value1', field2: 'value2' }
});
```

## API Categories

### Authentication
- `login()` - Authenticate with Buzzy platform
- `getUserID()` - Get user ID from auth token

### Organizations
- `insertOrganization()` - Create new organization
- `readOrganization()` - Read organization details
- `updateOrganization()` - Update organization
- `deleteOrganization()` - Delete organization

### Teams
- `insertTeam()` - Create new team
- `insertTeamMembers()` - Add team members
- `readTeam()` - Read team details
- `readTeamMember()` - Read team member details
- `updateTeam()` - Update team
- `updateTeamMember()` - Update team member
- `deleteTeam()` - Delete team
- `deleteTeamMember()` - Remove team member

### MicroApps (Data Tables)
- `insertMicroAppRow()` - Insert new row
- `getMicroAppData()` - Get all data
- `getMicroAppDataRow()` - Get specific row
- `updateMicroAppDataRow()` - Update row
- `removeMicroAppRow()` - Delete row

### MicroApp Children (File Attachments)
- `createMicroAppChild()` - Create child item
- `getChildItemsByField()` - Get children by field
- `readMicroAppChild()` - Read child item
- `updateMicroAppChild()` - Update child item
- `removeMicroAppChild()` - Delete child item

### Utilities
- `errorResponse()` - Create standardized error response
- `log()` - Logging utility

## Rate Limiting

All API functions include rate-limited versions (with "Wrapped" suffix) that use the Bottleneck library to prevent API overload.

## Documentation

For complete API documentation, see: https://docs.buzzy.buzz/rest-api/buzzy-rest-api

## License

MIT
