const form = document.getElementById("login-form");
const statusEl = document.getElementById("login-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Signing in...";

  try {
    const password = document.getElementById("password").value;
    const res = await fetch(API.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setAuthToken(data.token);
    statusEl.textContent = "Login successful. Redirecting...";
    window.location.href = "dashboard.html";
  } catch (error) {
    statusEl.textContent = error.message || "Login failed";
  }
});
