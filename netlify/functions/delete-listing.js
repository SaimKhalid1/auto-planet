const { json, parseBody, requireAuth } = require("./_utils");
const { loadListings, saveListings } = require("./_store");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!requireAuth(event)) {
    return json(401, { error: "Unauthorized" });
  }

  try {
    const body = parseBody(event);
    const id = String(body.id || "");

    if (!id) return json(400, { error: "Missing id" });

    const listings = await loadListings();
    const next = listings.filter(item => String(item.id) !== id);

    await saveListings(next);
    return json(200, { ok: true });
  } catch (error) {
    return json(500, { error: "Could not delete listing" });
  }
};
