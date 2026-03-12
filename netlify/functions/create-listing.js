const crypto = require("crypto");
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

    if (!body.year || !body.make || !body.model || !body.price || !body.mileage || !body.description) {
      return json(400, { error: "Missing required fields" });
    }

    const listings = await loadListings();

    const listing = {
      id: crypto.randomUUID(),
      year: Number(body.year),
      make: String(body.make || "").trim(),
      model: String(body.model || "").trim(),
      trim: String(body.trim || "").trim(),
      price: Number(body.price),
      mileage: Number(body.mileage),
      transmission: String(body.transmission || "").trim(),
      fuelType: String(body.fuelType || "").trim(),
      drivetrain: String(body.drivetrain || "").trim(),
      condition: String(body.condition || "").trim(),
      exteriorColor: String(body.exteriorColor || "").trim(),
      interiorColor: String(body.interiorColor || "").trim(),
      vin: String(body.vin || "").trim(),
      stockNumber: String(body.stockNumber || "").trim(),
      description: String(body.description || "").trim(),
      featured: Boolean(body.featured),
      sold: Boolean(body.sold),
      images: Array.isArray(body.images) ? body.images.slice(0, 8) : [],
      createdAt: new Date().toISOString()
    };

    listings.unshift(listing);
    await saveListings(listings);

    return json(200, { ok: true, listing });
  } catch (error) {
    return json(500, { error: "Could not create listing" });
  }
};
