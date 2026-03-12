const { getStore } = require("@netlify/blobs");

const STORE_NAME = "auto-planet-data";
const KEY = "listings.json";

const starterListings = [
  {
    id: "seed-bmw-m340i",
    year: 2020,
    make: "BMW",
    model: "M340i",
    trim: "xDrive",
    price: 38900,
    mileage: 72000,
    transmission: "Automatic",
    fuelType: "Gasoline",
    drivetrain: "AWD",
    condition: "Excellent",
    exteriorColor: "Black Sapphire Metallic",
    interiorColor: "Black",
    vin: "",
    stockNumber: "AP-1001",
    featured: true,
    sold: false,
    description: "Clean local vehicle with strong styling, sharp spec, and premium interior. A perfect example starter listing for Auto Planet.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-mercedes-c300",
    year: 2019,
    make: "Mercedes-Benz",
    model: "C300",
    trim: "4MATIC",
    price: 32900,
    mileage: 68000,
    transmission: "Automatic",
    fuelType: "Gasoline",
    drivetrain: "AWD",
    condition: "Excellent",
    exteriorColor: "Polar White",
    interiorColor: "Black",
    vin: "",
    stockNumber: "AP-1002",
    featured: true,
    sold: false,
    description: "Premium daily driver with luxury styling and a clean, upscale presence. Great sample inventory for first launch.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1400&q=80"
    ],
    createdAt: new Date().toISOString()
  }
];

async function loadListings() {
  const store = getStore(STORE_NAME);
  const raw = await store.get(KEY, { type: "json" });
  if (raw && Array.isArray(raw)) return raw;

  await store.setJSON(KEY, starterListings);
  return starterListings;
}

async function saveListings(listings) {
  const store = getStore(STORE_NAME);
  await store.setJSON(KEY, listings);
}

module.exports = {
  loadListings,
  saveListings
};
