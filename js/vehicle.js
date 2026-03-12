(async function () {
  const shell = document.getElementById("vehicle-shell");
  const id = qs("id");

  if (!id) {
    shell.innerHTML = '<div class="empty-state">Vehicle not found.</div>';
    return;
  }

  try {
    const data = await fetchListings();
    const car = data.listings.find(x => String(x.id) === String(id));

    if (!car) {
      shell.innerHTML = '<div class="empty-state">Vehicle not found.</div>';
      return;
    }

    const title = `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ""}`;
    const images = (car.images && car.images.length) ? car.images : [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80"
    ];

    document.title = `${title} | Auto Planet`;

    shell.innerHTML = `
      <div class="vehicle-layout">
        <section class="gallery-card glass">
          <div class="main-image">
            <img id="main-vehicle-image" src="${images[0]}" alt="${escapeHtml(title)}" />
          </div>
          <div class="thumb-row">
            ${images.map(src => `
              <button class="thumb" type="button" data-src="${src}">
                <img src="${src}" alt="${escapeHtml(title)} thumbnail" />
              </button>
            `).join("")}
          </div>
        </section>

        <section class="details-card glass">
          <span class="eyebrow">VEHICLE DETAILS</span>
          <h1 class="vehicle-title">${escapeHtml(title)}</h1>
          <div class="vehicle-price">${formatPrice(car.price)}</div>

          <div class="detail-grid">
            <div class="detail-item"><span>Mileage</span><strong>${formatKm(car.mileage)}</strong></div>
            <div class="detail-item"><span>Transmission</span><strong>${escapeHtml(car.transmission || "Not listed")}</strong></div>
            <div class="detail-item"><span>Fuel Type</span><strong>${escapeHtml(car.fuelType || "Not listed")}</strong></div>
            <div class="detail-item"><span>Drivetrain</span><strong>${escapeHtml(car.drivetrain || "Not listed")}</strong></div>
            <div class="detail-item"><span>Exterior</span><strong>${escapeHtml(car.exteriorColor || "Not listed")}</strong></div>
            <div class="detail-item"><span>Interior</span><strong>${escapeHtml(car.interiorColor || "Not listed")}</strong></div>
            <div class="detail-item"><span>Condition</span><strong>${escapeHtml(car.condition || "Not listed")}</strong></div>
            <div class="detail-item"><span>Stock #</span><strong>${escapeHtml(car.stockNumber || "Not listed")}</strong></div>
          </div>

          <div class="vehicle-description">${escapeHtml(car.description || "No description provided.").replaceAll("\n", "<br>")}</div>
        </section>
      </div>

      <section class="summary-card glass">
        <span class="eyebrow">CONTACT SELLER</span>
        <h3>Khalid Mahmood</h3>
        <p>Interested in this vehicle? Reach out directly to Auto Planet for pricing confirmation, availability, and a viewing.</p>
        <div class="contact-stack">
          <a href="tel:15878995515">587-899-5515</a>
          <a href="mailto:autoplanet@gmail.com">autoplanet@gmail.com</a>
          <span>Calgary, Alberta</span>
        </div>
      </section>
    `;

    document.querySelectorAll(".thumb").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("main-vehicle-image").src = btn.dataset.src;
      });
    });
  } catch (error) {
    shell.innerHTML = '<div class="empty-state">Could not load vehicle details.</div>';
  }
})();
