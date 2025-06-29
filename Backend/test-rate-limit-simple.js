// test-rate-limit-simple.js
const http = require('http');

const API_BASE_URL = 'localhost';
const API_PORT = 5000;

function makeRequest(requestNumber) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'test@test.com',
      password: 'test'
    });

    const options = {
      hostname: API_BASE_URL,
      port: API_PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting...\n');
  
  let successCount = 0;
  let rateLimitHit = false;
  
  for (let i = 1; i <= 105; i++) {
    try {
      const response = await makeRequest(i);
      
      if (response.statusCode === 429) {
        console.log(`🚫 Request ${i}: RATE LIMIT HIT! Status 429`);
        console.log(`📝 Error Message: ${response.data}`);
        console.log(`📊 Rate Limit Headers:`, response.headers);
        rateLimitHit = true;
        break;
      } else {
        console.log(`✅ Request ${i}: Status ${response.statusCode}`);
        successCount++;
      }
      
    } catch (error) {
      console.log(`❌ Request ${i}: Error - ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('\n📈 Test Results:');
  console.log(`✅ Successful requests: ${successCount}`);
  console.log(`🚫 Rate limit hit: ${rateLimitHit ? 'YES' : 'NO'}`);
  
  if (rateLimitHit) {
    console.log('\n🎉 Rate limiting is working correctly!');
  } else {
    console.log('\n⚠️ Rate limit was not reached. Try increasing the number of requests.');
  }
}

// Run the test
testRateLimit().catch(console.error); 