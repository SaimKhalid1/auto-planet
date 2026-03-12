const { json, parseBody, createToken } = require("./_utils");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const body = parseBody(event);
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.TOKEN_SECRET;

  if (!password || !secret) {
    return json(500, { error: "Missing server configuration" });
  }

  if (body.password !== password) {
    return json(401, { error: "Invalid password" });
  }

  const token = createToken(secret);
  return json(200, { token });
};
