document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  // ✅ Support both localhost and 127.0.0.1 for local testing
  const isLocal = window.location.hostname.includes("localhost") || 
                  window.location.hostname.includes("127.0.0.1");

  const API_BASE_URL = isLocal
    ? "http://localhost:5000" // local backend
    : "https://carbon-footprint-backend-rfpb.onrender.com"; // deployed backend

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // ✅ Successful login
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId);
        window.location.href = "index.html";
      } else {
        // ❌ Show backend error message
        errorMessage.textContent = data.error || "Login failed.";
        errorMessage.style.display = "block";
      }
    } catch (err) {
      // ❌ Network/server error
      errorMessage.textContent = "Something went wrong. Try again.";
      errorMessage.style.display = "block";
    }
  });
});


