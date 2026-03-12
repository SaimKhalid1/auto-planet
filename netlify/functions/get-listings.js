const { json } = require("./_utils");
const { loadListings } = require("./_store");

exports.handler = async function () {
  try {
    const listings = await loadListings();
    listings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return json(200, { listings });
  } catch (error) {
    return json(500, { error: "Unable to load listings" });
  }
};
