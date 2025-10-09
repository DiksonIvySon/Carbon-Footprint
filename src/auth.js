document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const errorMessage = document.getElementById("error-message");

  // ✅ Detect environment
  const isLocal =
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1");

  // ✅ Automatically use correct backend
  const API_BASE_URL = isLocal
    ? "http://localhost:5000"
    : "https://carbon-footprint-backend-rfpb.onrender.com";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registration successful! Please log in.");
        window.location.href = "login.html";
      } else {
        errorMessage.textContent = data.error || "Registration failed.";
        errorMessage.style.display = "block";
      }
    } catch (err) {
      errorMessage.textContent = "Something went wrong. Try again.";
      errorMessage.style.display = "block";
    }
  });
});


