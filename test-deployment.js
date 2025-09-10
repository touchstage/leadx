#!/usr/bin/env node

/**
 * LeadX Deployment Test Script
 * Tests all critical endpoints after deployment
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_ENDPOINTS = [
  '/api/platform/stats',
  '/api/intel/list',
  '/api/demands/list',
  '/api/search',
];

async function testEndpoint(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: data.substring(0, 100) + (data.length > 100 ? '...' : '')
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing LeadX Deployment...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const results = [];

  for (const endpoint of TEST_ENDPOINTS) {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Testing: ${url}`);
    
    const result = await testEndpoint(url);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status} - OK\n`);
    } else {
      console.log(`❌ ${result.status} - ${result.error || 'Failed'}\n`);
    }
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All tests passed! Your deployment is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }

  // Detailed results
  console.log('\n📋 Detailed Results:');
  console.log('===================');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status}`);
    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
}

// Run tests
runTests().catch(console.error);
