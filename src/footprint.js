document.addEventListener('DOMContentLoaded', function () {
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

  let activities = JSON.parse(localStorage.getItem('activities')) || [];

  function saveAndRender() {
    localStorage.setItem('activities', JSON.stringify(activities));
    renderActivities();
    updateChart();
  }

  function calculateTotal() {
    return activities.reduce((sum, act) => sum + act.co2, 0).toFixed(2);
  }

  function renderActivities() {
    logContainer.innerHTML = '';
    const selected = filter.value;
    const filtered = selected === 'all' ? activities : activities.filter(a => a.category === selected);

    filtered.forEach(act => {
      const div = document.createElement('div');
      div.className = 'activity-log';
      div.textContent = `${act.type} (${act.amount}) - ${act.co2.toFixed(2)} kg CO₂`;
      logContainer.appendChild(div);
    });

    totalEl.textContent = calculateTotal();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const type = document.getElementById('activity-type').value;
    const amount = parseFloat(document.getElementById('activity-amount').value);
    const co2 = emissionsFactors[type] * amount;
    const category = document.querySelector(`#activity-type option[value="${type}"]`).dataset.category;
    activities.push({ type, amount, co2, category });
    form.reset();
    saveAndRender();
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

  function updateChart() {
    const totals = {};
    activities.forEach(act => {
      if (!totals[act.type]) totals[act.type] = 0;
      totals[act.type] += act.co2;
    });
    chart.data.labels = Object.keys(totals);
    chart.data.datasets[0].data = Object.values(totals);
    chart.update();
  }

  saveAndRender();
});
