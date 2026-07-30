const http = require('http');

const data = JSON.stringify({
  assetId: "647f12345678901234567890",
  companyId: "647f12345678901234567891",
  requestedStartDate: "2026-08-12",
  requestedEndDate: "2026-09-26"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/waiting-list',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${responseData}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
