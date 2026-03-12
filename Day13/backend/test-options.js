import fs from 'fs';

fetch("https://backend-mocha-seven-xkpnlo0zyd.vercel.app/api/auth/register", {
  method: "OPTIONS",
  headers: {
    "Origin": "https://frontend-iota-flax-77qqm7aoj8.vercel.app",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "authorization, content-type"
  }
}).then(res => {
  const headers = {};
  res.headers.forEach((value, name) => {
    headers[name] = value;
  });
  
  fs.writeFileSync('out3.json', JSON.stringify({
    status: res.status,
    headers: headers
  }, null, 2));
}).catch(console.error);
