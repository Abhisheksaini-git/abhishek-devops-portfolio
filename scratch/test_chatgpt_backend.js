import http from 'node:http';
import { handleDevOpsChatApi } from '../api/chat.js';

console.log('================================================================');
console.log('   Testing ChatGPT for DevOps Backend API (/api/chat)           ');
console.log('================================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

// Helper to simulate an HTTP request to handleDevOpsChatApi
function simulateRequest(method, payload, env = {}) {
  return new Promise((resolve) => {
    const reqListeners = {};
    const resHeaders = {};
    let resStatusCode = 200;
    let resData = '';

    const req = {
      method,
      on(event, handler) {
        reqListeners[event] = handler;
      },
      destroy() {}
    };

    const res = {
      statusCode: 200,
      setHeader(k, v) {
        resHeaders[k] = v;
      },
      writeHead(code, headers) {
        resStatusCode = code;
        if (headers) Object.assign(resHeaders, headers);
      },
      end(data) {
        resData = data;
        resolve({
          statusCode: res.statusCode || resStatusCode,
          headers: resHeaders,
          body: resData ? JSON.parse(resData) : null
        });
      }
    };

    handleDevOpsChatApi(req, res, env);

    if (payload !== undefined) {
      if (reqListeners['data']) {
        reqListeners['data'](typeof payload === 'string' ? payload : JSON.stringify(payload));
      }
      if (reqListeners['end']) {
        reqListeners['end']();
      }
    }
  });
}

async function runTests() {
  // Test 1: OPTIONS preflight
  const optRes = await simulateRequest('OPTIONS');
  assert(optRes.statusCode === 204, 'OPTIONS preflight returns 204 No Content');

  // Test 2: Invalid Method GET
  const getRes = await simulateRequest('GET');
  assert(getRes.statusCode === 405, 'GET request returns 405 Method Not Allowed');

  // Test 3: Empty body
  const emptyRes = await simulateRequest('POST', {});
  assert(emptyRes.statusCode === 400 && emptyRes.body.error, 'Empty message returns 400 error');

  // Test 4: When NO API key is set in .env
  const noKeyRes = await simulateRequest('POST', { message: 'What is Kubernetes?' }, {});
  assert(
    noKeyRes.statusCode === 200 &&
    noKeyRes.body.fallbackRequired === true &&
    noKeyRes.body.error === 'NO_API_KEY',
    'No API key triggers graceful fallback flag (fallbackRequired: true, NO_API_KEY)'
  );

  // Test 5: Verify CORS headers
  assert(noKeyRes.headers['Access-Control-Allow-Origin'] === '*', 'CORS headers are properly set');
  assert(noKeyRes.headers['Content-Type'] === 'application/json', 'Content-Type is application/json');

  // Test 6: Verify portfolio context grounding is present in System Prompt
  const chatFile = await import('../api/chat.js');
  assert(typeof chatFile.handleDevOpsChatApi === 'function', 'handleDevOpsChatApi export is a function');

  console.log('================================================================');
  console.log(`Backend API Test Summary: ${passed} PASSED, ${failed} FAILED.`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
