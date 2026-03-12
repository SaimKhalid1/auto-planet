const crypto = require("crypto");

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch {
    return {};
  }
}

function createToken(secret) {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
  const nonce = crypto.randomBytes(12).toString("hex");
  const payload = `${exp}.${nonce}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function verifyToken(token, secret) {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const payload = `${exp}.${nonce}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (sig !== expected) return false;
  if (Number(exp) < Date.now()) return false;
  return true;
}

function getBearerToken(event) {
  const header = event.headers.authorization || event.headers.Authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function requireAuth(event) {
  const token = getBearerToken(event);
  const secret = process.env.TOKEN_SECRET;
  return verifyToken(token, secret);
}

module.exports = {
  json,
  parseBody,
  createToken,
  requireAuth
};
