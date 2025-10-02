document.addEventListener('DOMContentLoaded', function () {

  let token = localStorage.getItem("token"); // from login
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const form = document.getElementById('activity-form');
  const logContainer = document.getElementById('activity-log-container');
  const totalEl = document.getElementById('total-emissions');
  const filter = document.getElementById('category-filter');

  const emissionsFactors = {
    car: 0.2,
    bus: 0.1,
    flight: 0.25,
    meat: 27,
    dairy: 13,
    vegetables: 2,
    electricity: 0.5,
    gas: 2.1
  };

  let activities = [];
  const isLocal = window.location.hostname.includes("localhost") || 
                window.location.hostname.includes("127.0.0.1");

  const API_BASE_URL = isLocal
    ? 'http://localhost:5000'  
    : 'https://carbon-footprint-backend-rfpb.onrender.com';

  async function fetchActivities() {
    const res = await fetch(`${API_BASE_URL}/api/activities`, {
      headers: { Authorization: token }
    });
    activities = await res.json();
    renderActivities();
    updateChart();
  }

  async function fetchWeeklySummary() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/activities/weekly`, {
        headers: { Authorization: token }
      });
      const data = await res.json();
     
      let weekEl = document.getElementById('weekly-total');
      if (!weekEl) {
        const cont = document.querySelector('.visualization .total-section');
        weekEl = document.createElement('div');
        weekEl.id = 'weekly-total';
        cont.appendChild(weekEl);
      }
      weekEl.textContent = `Weekly total: ${data.weeklyTotal?.toFixed(2) || 0} kg CO₂`;
    } catch (err) {
      console.error('Failed to fetch weekly summary', err);
    }
  }

  async function fetchCommunityAverage() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/activities/community`);
      const data = await res.json();

      let commEl = document.getElementById('community-average');
      if (!commEl) {
        const cont = document.querySelector('.visualization .total-section');
        commEl = document.createElement('div');
        commEl.id = 'community-average';
        cont.appendChild(commEl);
      }
      commEl.textContent = `Community average: ${data.communityAverage.toFixed(2)} kg CO₂`;
    } catch (err) {
      console.error('Failed to fetch community average', err);
    }
  }

  async function fetchLeaderboard() {
    const res = await fetch(`${API_BASE_URL}/api/activities/leaderboard`, {
      headers: { Authorization: token }
    });
    const data = await res.json();
    renderLeaderboard(data);
  }

  function renderLeaderboard(data) {
    const lbContainer = document.getElementById('leaderboard');
    lbContainer.innerHTML = '';
    data.forEach((u, i) => {
      const row = document.createElement('div');
      row.className = 'leaderboard-row';
      row.textContent = `${i + 1}. ${u.username} - ${u.total.toFixed(2)} kg CO₂`;
      lbContainer.appendChild(row);
    });
  }

  async function addActivity(type, amount, co2, category) {
    await fetch(`${API_BASE_URL}/api/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ activity: type, category, co2Value: co2 })
    });
    fetchActivities();
  }


  function calculateTotal() {
    return activities.reduce((sum, act) => sum + act.co2Value, 0).toFixed(2);
  }

  function renderActivities() {
    logContainer.innerHTML = '';
    const selected = filter.value;
    const filtered = selected === 'all' ? activities : activities.filter(a => a.category === selected);

    filtered.forEach(act => {
      const div = document.createElement('div');
      div.className = 'activity-log';
      div.textContent = `${act.activity} (${act.amount}) - ${act.co2Value.toFixed(2)} kg CO₂`;
      logContainer.appendChild(div);
    });

    totalEl.textContent = calculateTotal();
    updateChart(filtered);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const type = document.getElementById('activity-type').value;
    const amount = parseFloat(document.getElementById('activity-amount').value);
    const co2 = emissionsFactors[type] * amount;
    const category = document.querySelector(`#activity-type option[value="${type}"]`).dataset.category;
    // activities.push({ type, amount, co2, category });
    // form.reset();
    // saveAndRender();
    addActivity(type, amount, co2, category);
    form.reset();
  });

  filter.addEventListener('change', renderActivities);

  const ctx = document.getElementById('emissionsChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'CO₂ Emissions by Activity',
        data: [],
        backgroundColor: '#90c8d1'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'kg CO₂'
          }
        }
      }
    }
  });

  function updateChart(list = activities) {
    const totals = {};
    list.forEach(act => {
      if (!totals[act.activity]) totals[act.activity] = 0;
      totals[act.activity] += act.co2Value;
    });
    chart.data.labels = Object.keys(totals);
    chart.data.datasets[0].data = Object.values(totals);
    chart.update();
  }

  async function login(email, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html"; 
    } else {
      alert(data.error);
    }
  }


  // User info in header
  const userInfo = document.getElementById("user-info");
  const username = localStorage.getItem("username");

  if (username && token) {
    userInfo.innerHTML = `
      <p><span class="status"> Logged in as <br><strong>${username}</strong></span></p>
      <button id="logout-btn">Logout</button>
    `;

    document.getElementById("logout-btn").addEventListener("click", showLogoutPopup(username));
  } else {
    window.location.href = "login.html";
  }

  //Logout functionality
  function showLogoutPopup(username) {
    const popup = document.createElement("div");
    popup.classList.add("logout-popup");
    popup.innerHTML = `
      <div class="popup-content">
        <img src="Images/logout-image.png" alt="logout image image" style="width:60%">
        <h4>Thank you for making the world a better place</h4>
        <h4><b class="popup-username">${username}</b></h4>
        <h4>You are a STAR</h4>
        <br>
        <p class="popup-confirmation-question">Are you sure you want to log out?</p>
        <button id="confirm-logout">Yes</button>
        <button id="cancel-logout">Cancel</button>
      </div>
    `;
    document.body.appendChild(popup);

    document.getElementById("confirm-logout").addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "login.html";
    });

    document.getElementById("cancel-logout").addEventListener("click", () => {
      popup.remove();
    });
  }

  fetchActivities();
  fetchWeeklySummary();
  fetchLeaderboard();
  fetchCommunityAverage();

  // if (token) {
  //   fetchActivities();
  //   fetchWeeklySummary();
  //   fetchLeaderboard();
  //   fetchCommunityAverage();
  // } else {
  //   alert("Please log in first.");
  //   window.location.href = "login.html";
  // }
});
