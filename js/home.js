(async function () {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  try {
    const data = await fetchListings();
    const featured = data.listings.filter(x => x.featured).slice(0, 3);
    const items = featured.length ? featured : data.listings.slice(0, 3);

    if (!items.length) {
      grid.innerHTML = '<div class="empty-state">No featured inventory yet.</div>';
      return;
    }

    grid.innerHTML = items.map(cardHtml).join("");
  } catch (error) {
    grid.innerHTML = '<div class="empty-state">Unable to load featured inventory right now.</div>';
  }
})();
