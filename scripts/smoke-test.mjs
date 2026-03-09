import assert from "node:assert/strict";

const mod = await import("../index.mjs");

const expectedExports = [
  "copyS3File",
  "copyS3FileWrapped",
  "createAppWithPrompt",
  "createAppWithPromptWrapped",
  "createMicroAppChild",
  "createMicroAppChildWrapped",
  "deleteOrganization",
  "deleteOrganizationWrapped",
  "deleteTeam",
  "deleteTeamMember",
  "deleteTeamMemberWrapped",
  "deleteTeamWrapped",
  "enforceTeamMembership",
  "enforceTeamMembershipWrapped",
  "errorResponse",
  "getChildItemsByField",
  "getChildItemsByFieldWrapped",
  "getMicroAppData",
  "getMicroAppDataRow",
  "getMicroAppDataRowWrapped",
  "getMicroAppDataWrapped",
  "getTeamMembers",
  "getTeamMembersWrapped",
  "getUserID",
  "getUserIDWrapped",
  "insertMicroAppRow",
  "insertMicroAppRowWrapped",
  "insertOrganization",
  "insertOrganizationWrapped",
  "insertTeam",
  "insertTeamMembers",
  "insertTeamMembersWrapped",
  "insertTeamWrapped",
  "log",
  "login",
  "logout",
  "logoutWrapped",
  "readMicroAppChild",
  "readMicroAppChildWrapped",
  "readOrganization",
  "readOrganizationWrapped",
  "readTeam",
  "readTeamMember",
  "readTeamMemberWrapped",
  "readTeamWrapped",
  "removeMicroAppChild",
  "removeMicroAppChildWrapped",
  "removeMicroAppRow",
  "removeMicroAppRowWrapped",
  "updateMicroAppChild",
  "updateMicroAppChildWrapped",
  "updateMicroAppDataRow",
  "updateMicroAppDataRowWrapped",
  "updateOrganization",
  "updateOrganizationWrapped",
  "updateTeam",
  "updateTeamMember",
  "updateTeamMemberWrapped",
  "updateTeamWrapped",
  "uploadFileToS3",
  "uploadFileToS3Wrapped",
];

const actualExports = Object.keys(mod).sort();

assert.deepEqual(actualExports, expectedExports, "public export surface changed");

for (const exportName of expectedExports) {
  assert.equal(typeof mod[exportName], "function", `${exportName} should be a function`);
}

console.log(`Smoke test passed for ${expectedExports.length} exports.`);
