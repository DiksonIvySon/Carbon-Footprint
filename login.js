document.getElementById("login-form").addEventListener("submit", async function (e) {
e.preventDefault();

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();
const errorEl = document.getElementById("error-message");

errorEl.textContent = ""; // clear old errors

try {
    // Example: call backend login API (adjust URL for your project)
    const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
    errorEl.textContent = data.message || "Invalid login credentials.";
    return;
    }

    // Save token or user info (depending on backend)
    localStorage.setItem("token", data.token);

    // Redirect to dashboard or home page
    window.location.href = "index.html";
} catch (err) {
    errorEl.textContent = "Something went wrong. Please try again later.";
    console.error(err);
}
});

