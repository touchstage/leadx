// Backend Integration Test Script
// Run this with: node test-backend-integration.js

const BASE_URL = 'http://localhost:3000/api';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    console.log(`✅ ${method} ${endpoint}:`, response.status, data);
    return { success: true, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Starting Backend Integration Tests...\n');

  // Test 1: Search API
  console.log('1. Testing Search API...');
  await testAPI('/search', 'POST', { query: 'fintech companies UAE CRM' });

  // Test 2: Intel List API
  console.log('\n2. Testing Intel List API...');
  await testAPI('/intel/list');

  // Test 3: Demands List API
  console.log('\n3. Testing Demands List API...');
  await testAPI('/demands/list');

  // Test 4: Intel Creation (without auth - should fail)
  console.log('\n4. Testing Intel Creation (no auth - should fail)...');
  await testAPI('/intel/create', 'POST', {
    title: 'Test Intel',
    description: 'Test Description',
    category: 'Technology',
    priceCredits: 100
  });

  // Test 5: Demand Creation (without auth - should fail)
  console.log('\n5. Testing Demand Creation (no auth - should fail)...');
  await testAPI('/demands/create', 'POST', {
    title: 'Test Demand',
    description: 'Test Description',
    bountyCredits: 100,
    category: 'Technology'
  });

  // Test 6: Payment Order Creation (without auth - should fail)
  console.log('\n6. Testing Payment Order Creation (no auth - should fail)...');
  await testAPI('/payments/create-order', 'POST', {
    amount: 100,
    description: 'Test Payment'
  });

  // Test 7: Wallet Cashout (without auth - should fail)
  console.log('\n7. Testing Wallet Cashout (no auth - should fail)...');
  await testAPI('/wallet/cashout', 'POST', {
    credits: 100
  });

  console.log('\n🎉 Backend Integration Tests Complete!');
  console.log('\n📝 Notes:');
  console.log('- Auth-protected endpoints should return 401 (unauthorized)');
  console.log('- Public endpoints should return 200 with data');
  console.log('- Make sure to test with authenticated user for full functionality');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}

module.exports = { testAPI, runTests };
