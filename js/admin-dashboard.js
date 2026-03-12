(function guard() {
  if (!getAuthToken()) {
    window.location.href = "login.html";
  }
})();

const form = document.getElementById("listing-form");
const formStatus = document.getElementById("form-status");
const preview = document.getElementById("image-preview");
const fileInput = document.getElementById("images");
const adminListings = document.getElementById("admin-listings");
const logoutBtn = document.getElementById("logout-btn");

let preparedImages = [];

logoutBtn.addEventListener("click", () => {
  clearAuthToken();
  window.location.href = "login.html";
});

fileInput.addEventListener("change", async (event) => {
  const files = Array.from(event.target.files || []);
  preview.innerHTML = "";
  preparedImages = [];

  if (!files.length) return;

  for (const file of files.slice(0, 8)) {
    const dataUrl = await compressImageToDataUrl(file);
    preparedImages.push(dataUrl);
    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = "Preview image";
    preview.appendChild(img);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "Publishing listing...";

  const payload = {
    year: Number(document.getElementById("year").value),
    make: document.getElementById("make").value.trim(),
    model: document.getElementById("model").value.trim(),
    trim: document.getElementById("trim").value.trim(),
    price: Number(document.getElementById("price").value),
    mileage: Number(document.getElementById("mileage").value),
    transmission: document.getElementById("transmission").value.trim(),
    fuelType: document.getElementById("fuelType").value.trim(),
    drivetrain: document.getElementById("drivetrain").value.trim(),
    condition: document.getElementById("condition").value.trim(),
    exteriorColor: document.getElementById("exteriorColor").value.trim(),
    interiorColor: document.getElementById("interiorColor").value.trim(),
    vin: document.getElementById("vin").value.trim(),
    stockNumber: document.getElementById("stockNumber").value.trim(),
    description: document.getElementById("description").value.trim(),
    featured: document.getElementById("featured").checked,
    sold: document.getElementById("sold").checked,
    images: preparedImages
  };

  try {
    const res = await fetch(API.createListing, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.status === 401) {
      clearAuthToken();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error(data.error || "Could not publish listing");

    form.reset();
    preview.innerHTML = "";
    preparedImages = [];
    formStatus.textContent = "Listing published.";
    await loadAdminListings();
  } catch (error) {
    formStatus.textContent = error.message || "Could not publish listing";
  }
});

async function loadAdminListings() {
  try {
    const data = await fetchListings();
    const listings = data.listings || [];

    if (!listings.length) {
      adminListings.innerHTML = '<div class="empty-state">No listings yet.</div>';
      return;
    }

    adminListings.innerHTML = listings.map(car => {
      const image = car.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";
      const title = `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ""}`;
      return `
        <article class="admin-listing-item">
          <img src="${image}" alt="${escapeHtml(title)}" />
          <div class="admin-listing-meta">
            <h3>${escapeHtml(title)}</h3>
            <p>${formatPrice(car.price)} · ${formatKm(car.mileage)}${car.sold ? " · SOLD" : ""}</p>
          </div>
          <button class="btn btn-outline delete-btn" type="button" data-id="${car.id}">Delete</button>
        </article>
      `;
    }).join("");

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => removeListing(btn.dataset.id));
    });
  } catch (error) {
    adminListings.innerHTML = '<div class="empty-state">Could not load listings.</div>';
  }
}

async function removeListing(id) {
  if (!confirm("Delete this listing?")) return;

  try {
    const res = await fetch(API.deleteListing, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();

    if (res.status === 401) {
      clearAuthToken();
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error(data.error || "Delete failed");

    await loadAdminListings();
  } catch (error) {
    alert(error.message || "Delete failed");
  }
}

loadAdminListings();
