document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");
  const API_BASE_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:5000'  
    : 'https://carbon-backend.onrender.com';

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

