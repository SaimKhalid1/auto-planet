const API = {
  getListings: "/.netlify/functions/get-listings",
  login: "/.netlify/functions/login",
  createListing: "/.netlify/functions/create-listing",
  deleteListing: "/.netlify/functions/delete-listing"
};

function formatPrice(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function formatKm(value) {
  return `${Number(value || 0).toLocaleString("en-CA")} km`;
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function fetchListings() {
  const res = await fetch(API.getListings);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

function getAuthToken() {
  return localStorage.getItem("ap_admin_token") || "";
}

function setAuthToken(token) {
  localStorage.setItem("ap_admin_token", token);
}

function clearAuthToken() {
  localStorage.removeItem("ap_admin_token");
}

function attachMobileNav() {
  const btn = document.getElementById("mobile-toggle");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
}
attachMobileNav();

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cardHtml(car) {
  const image = car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";
  const title = `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ""}`;
  return `
    <article class="car-card glass">
      <div class="car-media">
        <img src="${image}" alt="${escapeHtml(title)}" />
        <span class="price-badge">${formatPrice(car.price)}</span>
        ${car.sold ? '<span class="status-badge">SOLD</span>' : ""}
      </div>
      <div class="car-body">
        <h3 class="car-title">${escapeHtml(title)}</h3>
        <div class="car-meta">
          <span class="spec-pill">${formatKm(car.mileage)}</span>
          ${car.transmission ? `<span class="spec-pill">${escapeHtml(car.transmission)}</span>` : ""}
          ${car.fuelType ? `<span class="spec-pill">${escapeHtml(car.fuelType)}</span>` : ""}
        </div>
        <p class="car-description">${escapeHtml((car.description || "").slice(0, 120))}${(car.description || "").length > 120 ? "..." : ""}</p>
        <a class="card-link" href="vehicle.html?id=${encodeURIComponent(car.id)}">View Details →</a>
      </div>
    </article>
  `;
}

async function compressImageToDataUrl(file, maxWidth = 1600, quality = 0.82) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const scale = Math.min(1, maxWidth / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}
