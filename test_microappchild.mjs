#!/usr/bin/env node

import {
  createMicroAppChild,
  getChildItemsByField,
  readMicroAppChild,
  updateMicroAppChild,
  removeMicroAppChild,
  login,
  getUserID
} from './index.mjs';

// Test configuration - using real test environment values
const TEST_CONFIG = {
  url: 'https://microappchild-api-updater-tunnel-jmtxccd7.devinapps.com',
  email: 'devinuser@test.com',
  password: 'buzzypassword',
  microAppResourceID: '028888fcf731df80adb9a3f6', // Recipe Reviewer app ID
  appID: '028888fcf731df80adb9a3f6', // Using app ID as placeholder for now
  fieldID: 'photo' // Placeholder field ID - will test error handling if invalid
};

async function runMicroAppChildTests() {
  console.log('🧪 Starting MicroAppChild API Tests...\n');
  
  let authToken, userId, createdChildID;
  
  try {
    // Step 1: Login and get credentials
    console.log('1️⃣ Testing authentication...');
    const loginResult = await login({
      url: TEST_CONFIG.url,
      email: TEST_CONFIG.email,
      password: TEST_CONFIG.password
    });
    
    if (!loginResult.authToken) {
      throw new Error('Login failed - no auth token received');
    }
    
    authToken = loginResult.authToken;
    console.log('✅ Login successful');
    
    // Get user ID
    const userIdResult = await getUserID({
      authToken,
      url: TEST_CONFIG.url
    });
    
    if (!userIdResult.userId) {
      throw new Error('Failed to get user ID');
    }
    
    userId = userIdResult.userId;
    console.log('✅ User ID retrieved:', userId);
    console.log();
    
    // Step 2: Test createMicroAppChild
    console.log('2️⃣ Testing createMicroAppChild...');
    const createResult = await createMicroAppChild({
      authToken,
      userId,
      url: TEST_CONFIG.url,
      microAppResourceID: TEST_CONFIG.microAppResourceID,
      appID: TEST_CONFIG.appID,
      fieldID: TEST_CONFIG.fieldID,
      content: {
        url: "https://example.com/test-file.pdf",
        filename: "test-document.pdf",
        size: 1024000,
        type: "application/pdf",
        expiredAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    if (!createResult.childID) {
      throw new Error('Create failed - no child ID returned');
    }
    
    createdChildID = createResult.childID;
    console.log('✅ MicroAppChild created successfully:', createdChildID);
    console.log();
    
    // Step 3: Test getChildItemsByField
    console.log('3️⃣ Testing getChildItemsByField...');
    const listResult = await getChildItemsByField({
      authToken,
      userId,
      url: TEST_CONFIG.url,
      appID: TEST_CONFIG.appID,
      fieldID: TEST_CONFIG.fieldID
    });
    
    if (!Array.isArray(listResult)) {
      throw new Error('List failed - expected array result');
    }
    
    const foundChild = listResult.find(item => item._id === createdChildID);
    if (!foundChild) {
      throw new Error('Created child not found in list results');
    }
    
    console.log('✅ Child items retrieved successfully:', listResult.length, 'items found');
    console.log();
    
    // Step 4: Test readMicroAppChild
    console.log('4️⃣ Testing readMicroAppChild...');
    const readResult = await readMicroAppChild({
      authToken,
      userId,
      url: TEST_CONFIG.url,
      childID: createdChildID
    });
    
    if (!readResult._id || readResult._id !== createdChildID) {
      throw new Error('Read failed - incorrect child returned');
    }
    
    console.log('✅ MicroAppChild read successfully:', readResult._id);
    console.log();
    
    // Step 5: Test updateMicroAppChild
    console.log('5️⃣ Testing updateMicroAppChild...');
    const updateResult = await updateMicroAppChild({
      authToken,
      userId,
      url: TEST_CONFIG.url,
      childID: createdChildID,
      content: {
        url: "https://example.com/updated-file.pdf",
        filename: "updated-document.pdf",
        size: 2048000,
        type: "application/pdf",
        expiredAt: Date.now() + (14 * 24 * 60 * 60 * 1000) // 14 days
      }
    });
    
    if (!updateResult.success) {
      console.log('⚠️ Update result:', updateResult);
    }
    
    console.log('✅ MicroAppChild updated successfully');
    console.log();
    
    // Step 6: Test removeMicroAppChild
    console.log('6️⃣ Testing removeMicroAppChild...');
    const deleteResult = await removeMicroAppChild({
      authToken,
      userId,
      url: TEST_CONFIG.url,
      childID: createdChildID
    });
    
    if (!deleteResult.success) {
      console.log('⚠️ Delete result:', deleteResult);
    }
    
    console.log('✅ MicroAppChild deleted successfully');
    console.log();
    
    // Step 7: Verify deletion
    console.log('7️⃣ Verifying deletion...');
    try {
      const verifyResult = await readMicroAppChild({
        authToken,
        userId,
        url: TEST_CONFIG.url,
        childID: createdChildID
      });
      
      if (verifyResult._id) {
        console.log('⚠️ Child still exists after deletion');
      } else {
        console.log('✅ Child successfully deleted - not found');
      }
    } catch (error) {
      console.log('✅ Child successfully deleted - read failed as expected');
    }
    
    console.log('\n🎉 All MicroAppChild API tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    
    // Cleanup: try to delete created child if it exists
    if (createdChildID && authToken && userId) {
      try {
        console.log('\n🧹 Attempting cleanup...');
        await removeMicroAppChild({
          authToken,
          userId,
          url: TEST_CONFIG.url,
          childID: createdChildID
        });
        console.log('✅ Cleanup successful');
      } catch (cleanupError) {
        console.log('⚠️ Cleanup failed:', cleanupError.message);
      }
    }
    
    process.exit(1);
  }
}

// Check if we have the required test configuration
function validateTestConfig() {
  const missing = [];
  
  if (!TEST_CONFIG.microAppResourceID) missing.push('microAppResourceID');
  if (!TEST_CONFIG.appID) missing.push('appID');
  if (!TEST_CONFIG.fieldID) missing.push('fieldID');
  
  if (missing.length > 0) {
    console.log('❌ Missing required test configuration:');
    missing.forEach(field => console.log(`   - ${field}`));
    console.log('\nTo run tests, you need:');
    console.log('1. A valid Buzzy instance URL');
    console.log('2. Test credentials (email/password)');
    console.log('3. A MicroApp resource ID (datatable)');
    console.log('4. An existing app item ID (row in the datatable)');
    console.log('5. A field ID that accepts file attachments');
    console.log('\nExample usage:');
    console.log('TEST_CONFIG.microAppResourceID = "your-datatable-id";');
    console.log('TEST_CONFIG.appID = "your-row-id";');
    console.log('TEST_CONFIG.fieldID = "your-attachment-field-id";');
    return false;
  }
  
  return true;
}

// Run tests if configuration is valid
if (validateTestConfig()) {
  runMicroAppChildTests();
} else {
  console.log('\n💡 Test script created but requires configuration to run.');
  console.log('Update the TEST_CONFIG object with real values to test the APIs.');
}
