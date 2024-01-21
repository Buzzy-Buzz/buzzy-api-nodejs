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
}) {
  const params = Object.assign(getRequestParams(authToken, userId), {
    url: `${url}/api/microappdata`,
    data: {
      microAppID,
      optSearchFilters,
      searchFilter,
      optViewFilters,
    },
  });
  const response = await axios(params);

  const { body = {} } = response.data || {};
  console.log(
    "post axios getMicroAppData body.microAppRows.length",
    body?.microAppRows?.length
  );
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

function getMicroAppDataRow(rowID, authToken, userId, url) {
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
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the update operation.
 */

function updateMicroAppDataRow({ rowID, authToken, userId, url, rowData }) {
  return axios({
    ...getRequestParams(authToken, userId),
    url: `${url}/api/updatemicroapprow`,
    data: { rowID, rowData },
  })
    .catch((e) => log(e) || {})
    .then((response) => {
      const { data } = response || {};
      log(data);
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
  errorResponse,
};
