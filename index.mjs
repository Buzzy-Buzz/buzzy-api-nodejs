import axios from "axios";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 150,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(...args) {
  console.log(args);
}

function safeParseJSON(s) {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

/**
 * Asynchronously logs in a user and retrieves authentication token and user ID.
 * @param {Object} loginDetails - The login details.
 * @param {string} loginDetails.url - The URL to send the login request to.
 * @param {string} loginDetails.email - The user's email.
 * @param {string} loginDetails.password - The user's password.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the auth token and user ID, or null if login fails.
 */

function login({ url, email, password }) {
  return axios({
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    url: `${url}/api/login`,
    data: {
      email,
      password,
    },
  }).then((response) => {
    if (!response.data) return log("login error");
    const { data } = response;
    return { token: data?.authToken, userId: data?.userId };
  });
}

/**
 * Generates request parameters for axios requests, including authentication headers.
 * @param {string} authToken - The authentication token.
 * @param {string} userId - The user ID.
 * @returns {Object} The request parameters.
 */

function getRequestParams(authToken, userId) {
  return {
    method: "post",
    headers: {
      "X-Auth-Token": authToken,
      "X-User-Id": userId,
      "Content-Type": "application/json",
    },
  };
}

const getRequestParamsWrapped = limiter.wrap(getRequestParams);

/**
 * Inserts a new organization into the database.
 * @param {Object} params - The parameters for the organization insertion.
 * @param {string} params.authToken - The authentication token.
 * @param {string} params.userId - The user ID.
 *  @param {string} params.url - The URL to the API endpoint.
 * @param {Object} params.organizationInfo - The organization information to be inserted.
 *  example: {
 * _id: optional "Organization ID",
 *   name: "Organization Name",
 *  description: "Organization Description",
 * }
 * @returns {Promise<Object>} A promise that resolves to the response body, containing  organzation ID.
 */

async function insertOrganization({
  authToken,
  userId,
  url,
  organizationInfo,
}) {
  const params = Object.assign(getRequestParams(authToken, userId), {
    url: `${url}/api/insertorganization`,
    data: {
      organizationInfo,
    },
  });

  const response = await axios(params);

  const { body = {} } = response.data || {};
  return body || {};
}

const insertOrganizationWrapped = limiter.wrap(insertOrganization);

/**
 * Inserts a new team into the database.
 * @param {Object} params - The parameters for the team insertion.
 * @param {string} params.authToken - The authentication token.
 * @param {string} params.userId - The user ID.
 *  @param {string} params.url - The URL to the API endpoint.
 * @param {Object} params.teamInfo - The organization information to be inserted.
 *  example: {
 *   name: "Team Name",
 *   organizationId: "Organization ID", // of the organization the team belongs to
 * }
 * @returns {Promise<Object>} A promise that resolves to the response body, containing details of the inserted team.
 */

async function insertTeam({ authToken, userId, url, teamInfo, adminID }) {
  const params = Object.assign(getRequestParams(authToken, userId), {
    url: `${url}/api/insertteam`,
    data: {
      teamInfo,
      adminID,
    },
  });

  const response = await axios(params);

  const { body = {} } = response.data || {};
  return body || {};
}

const insertTeamWrapped = limiter.wrap(insertOrganization);
/**
 * Find userID bsaed on email.
 * @param {Object} params - The parameters for the team insertion.
 * @param {string} params.authToken - The authentication token.
 * @param {string} params.userId - The user ID.
 * @param {string} params.url - The URL to the API endpoint.
 * @param {Object} params.email - The email of the user to be inserted into the team.
 *
 */

async function getUserID({ authToken, userId, url, email }) {
  const params = Object.assign(getRequestParams(authToken, userId), {
    url: `${url}/api/userid`,
    data: {
      email,
    },
  });

  const response = await axios(params);

  const { body = {} } = response.data || {};
  return body || {};
}

const getUserIDWrapped = limiter.wrap(getUserID);
/**
 * Inserts a new teammembers into the team.
 * @param {Object} params - The parameters for the team insertion.
 * @param {string} params.authToken - The authentication token.
 * @param {string} params.userId - The user ID.
 * @param {string} params.url - The URL to the API endpoint.
 * @param {Object} params.teamIDs - The team IDs for the users to  be inserted into.
 * @param {Object} params.emails - array of  emails of the users to be inserted into the team.
 * @param {Object} params.userIDs - array of user IDs of the users to be inserted into the team.
 * @param {Object} params.targetInitialApp - The initial app to be opened when the user logs in.
 * @param {Object} params.targetInitialScreen - The initial screen to be opened when the user logs in.
 * @param {Object} params.targetRoute - The route to be opened when the user logs in.
 * 
 
*/

async function insertTeamMembers({
  authToken,
  userId,
  url,
  teamIDs,
  emails,
  userIDs,
  targetInitialApp,
  targetInitialScreen,
  targetRoute = "app",
}) {
  const params = Object.assign(getRequestParams(authToken, userId), {
    url: `${url}/api/insertteammembers`,
    data: {
      teamIDs,
      emails,
      userIDs,
      targetInitialApp,
      targetInitialScreen,
      targetRoute,
    },
  });

  const response = await axios(params);

  const { body = {} } = response.data || {};
  return body || {};
}

const insertTeamMembersWrapped = limiter.wrap(insertOrganization);

/**
 * Inserts a new row into a specified Micro App.
 * @param {Object} params - The parameters for the Datatable (Microapp) row insertion.
 * @param {string} params.microAppID - The ID of the Datatable (Microapp).
 * @param {string} params.authToken - The authentication token.
 * @param {string} params.userId - The user ID.
 * @param {string} params.url - The URL to the Datatable (Microapp) API endpoint.
 * @param {Object} params.rowData - The data to be inserted in the new row.
 * @param {string|null} [params.embeddingRowID=null] - The ID of the embedding row, if applicable.
 * @param {Array<string>} [params.viewers=[]] - An array of user IDs who are viewers of this row.
 * @param {string} params.userID - (optional) The ID of the creator, defaults to the user performing the insertion.
 * @returns {Promise<Object>} A promise that resolves to the response body,  containing details of the inserted row ID.
 */

async function insertMicroAppRow({
  microAppID,
  authToken,
  userId,
  url,
  rowData,
  embeddingRowID = null,
  viewers = [],
  userID,
}) {
  const params = Object.assign(getRequestParams(authToken, userId), {
    url: `${url}/api/insertmicroapprow`,
    data: {
      microAppID,
      embeddingRowID,
      viewers,
      rowData,
      userID,
    },
  });

  const response = await axios(params);

  const { body = {} } = response.data || {};
  return body || {};
}
const insertMicroAppRowWrapped = limiter.wrap(insertMicroAppRow);

/**
 * Retrieves data from a specified Datatable (Microapp).
 * @param {Object} params - The parameters for fetching data from the Datatable (Microapp).
 * @param {string} params.microAppID - The ID of the Datatable (Microapp).
 * @param {string} params.authToken - The authentication token.
 * @param {string} params.userId - The user ID.
 * @param {string} params.url - The URL to the Datatable (Microapp) API endpoint.
 * @param {Object|null} [params.optSearchFilters=null] - Optional search filters for querying the data.
 * @param {Object|null} [params.searchFilter=null] - Primary search filter for querying the data.
 * @param {Object|null} [params.optViewFilters=null] - Optional view filters for querying the data. Especially for large datasets you can sort, skip and limit the data. See https://docs.buzzy.buzz/rest-api/buzzy-rest-api/rest-api/microappdata#paging-example
 * @returns {Promise<Array>} A promise that resolves to an array of rows from the Datatable (Microapp), or an empty array if no data is found.
 */

async function getMicroAppData({
  microAppID,
  authToken,
  userId,
  url,
  optSearchFilters = null,
  searchFilter = null,
  optViewFilters = null,
  viewFilterIsMongoQuery = false,
  optIsVectorSearch = false,
  optVectorSearchString,
  optLimit,
}) {
  const params = Object.assign(getRequestParams(authToken, userId), {
    url: `${url}/api/microappdata`,
    data: {
      microAppID,
      optSearchFilters,
      searchFilter,
      optViewFilters,
      optIsVectorSearch,
      optVectorSearchString,
      optLimit,
    },
  });
  const response = await axios(params);

  const { body = {} } = response.data || {};

  return body.microAppRows || [];
}

const getMicroAppDataWrapped = limiter.wrap(getMicroAppData);

/**
 * Retrieves a specific row of data from a Datatable (Microapp) by its row ID.
 * @param {string} rowID - The unique identifier of the row in the Datatable (Microapp).
 * @param {string} authToken - The authentication token.
 * @param {string} userId - The user ID.
 * @param {string} url - The URL to the Datatable (Microapp) API endpoint.
 * @returns {Promise<Object>} A promise that resolves to the specified row from the Datatable (Microapp), or an empty object if the row is not found.
 */

function getMicroAppDataRow({ rowID, authToken, userId, url }) {
  return axios({
    ...getRequestParams(authToken, userId),
    url: `${url}/api/microappdata/row`,
    data: { rowID },
  })
    .catch((e) => log(e) || {})
    .then((response) => {
      const { body = {} } = response.data || {};
      return body.currentRow;
    });
}

const getMicroAppDataRowWrapped = limiter.wrap(getMicroAppDataRow);

/**
 * Removes a specific row from a Datatable (Microapp) by its row ID.
 * @param {string} rowID - The unique identifier of the row to be removed from the Datatable (Microapp).
 * @param {string} authToken - The authentication token used for authorization.
 * @param {string} userId - The user ID of the individual performing the operation.
 * @param {string} url - The URL to the Datatable (Microapp) API endpoint.
 * @returns {Promise<Object>} A promise that resolves to the response object, typically containing details of the removed row or an indication of the operation's success.
 */

function removeMicroAppRow(rowID, authToken, userId, url) {
  return axios({
    ...getRequestParams(authToken, userId),
    url: `${url}/api/removemicroapprow`,
    data: { rowID },
  })
    .catch((e) => log(e) || {})
    .then((response) => {
      const { body = {} } = response.data || {};
      return body.currentRow;
    });
}

const removeMicroAppRowWrapped = limiter.wrap(removeMicroAppRow);

/**
 * Updates a specific row in a Datatable (Microapp) with new data.
 * @param {Object} params - The parameters for updating the row.
 * @param {string} params.rowID - The unique identifier of the row to be updated in the Datatable (Microapp).
 * @param {string} params.authToken - The authentication token used for authorization.
 * @param {string} params.userId - The user ID of the individual performing the update.
 * @param {string} params.url - The URL to the Datatable (Microapp) API endpoint.
 * @param {Object} params.rowData - The new data to be updated in the row.
 * @param {Object} params.creatorID - The Buzzy User ID of the user who created the row.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the update operation.
 */

function updateMicroAppDataRow({
  rowID,
  authToken,
  userId,
  url,
  rowData,
  creatorID,
}) {
  return axios({
    ...getRequestParams(authToken, userId),
    url: `${url}/api/updatemicroapprow`,
    data: { rowID, rowData, userID: creatorID },
  })
    .catch((e) => log(e) || {})
    .then((response) => {
      const { data } = response || {};
      return true;
    });
}

const updateMicroAppDataRowWrapped = limiter.wrap(updateMicroAppDataRow);

function errorResponse(err) {
  return {
    status: "error",
    statusCode: 400,
    body: err,
    headers: {
      "Content-Type": "text/html",
    },
  };
}

export {
  login,
  getUserID,
  getUserIDWrapped,
  log,
  insertMicroAppRow,
  insertMicroAppRowWrapped,
  getMicroAppData,
  getMicroAppDataWrapped,
  getMicroAppDataRow,
  getMicroAppDataRowWrapped,
  removeMicroAppRow,
  removeMicroAppRowWrapped,
  updateMicroAppDataRow,
  updateMicroAppDataRowWrapped,
  insertOrganization,
  insertOrganizationWrapped,
  insertTeam,
  insertTeamWrapped,
  insertTeamMembers,
  insertTeamMembersWrapped,
  errorResponse,
};
