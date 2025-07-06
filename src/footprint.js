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