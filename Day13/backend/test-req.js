const url = "https://backend-mocha-seven-xkpnlo0zyd.vercel.app/api/auth/register";
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "test", email: "test@gmail.com", password: "password123" })
})
.then(res => res.text().then(text => ({ status: res.status, body: text })))
.then(console.log)
.catch(console.error);
