(async function () {
  const grid = document.getElementById("inventory-grid");
  const count = document.getElementById("inventory-count");
  const search = document.getElementById("search");
  const maxPrice = document.getElementById("max-price");
  const maxMileage = document.getElementById("max-mileage");
  const sort = document.getElementById("sort");

  let all = [];

  function render() {
    const term = search.value.trim().toLowerCase();
    const priceCap = Number(maxPrice.value || 0);
    const mileageCap = Number(maxMileage.value || 0);
    const sortBy = sort.value;

    let items = all.filter(car => {
      const blob = `${car.year} ${car.make} ${car.model} ${car.trim || ""}`.toLowerCase();
      const searchOk = !term || blob.includes(term);
      const priceOk = !priceCap || Number(car.price) <= priceCap;
      const mileageOk = !mileageCap || Number(car.mileage) <= mileageCap;
      return searchOk && priceOk && mileageOk;
    });

    items.sort((a, b) => {
      if (sortBy === "priceLow") return Number(a.price) - Number(b.price);
      if (sortBy === "priceHigh") return Number(b.price) - Number(a.price);
      if (sortBy === "yearHigh") return Number(b.year) - Number(a.year);
      if (sortBy === "mileageLow") return Number(a.mileage) - Number(b.mileage);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    count.textContent = `${items.length} vehicle${items.length === 1 ? "" : "s"} found`;
    grid.innerHTML = items.length
      ? items.map(cardHtml).join("")
      : '<div class="empty-state">No cars matched those filters.</div>';
  }

  try {
    const data = await fetchListings();
    all = data.listings || [];
    render();
  } catch (error) {
    count.textContent = "Could not load inventory";
    grid.innerHTML = '<div class="empty-state">Inventory is unavailable right now.</div>';
  }

  [search, maxPrice, maxMileage, sort].forEach(el => el.addEventListener("input", render));
})();
