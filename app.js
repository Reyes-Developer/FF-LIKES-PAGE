// Configuración de particles.js
document.addEventListener('DOMContentLoaded', function() {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 45, density: { enable: true, value_area: 800 } },
        color: { value: '#9fbbe8' },
        shape: { type: 'circle' },
        opacity: { value: 0.25 },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#9fbbe8",
          opacity: 0.4,
          width: 1
        },
        move: { enable: true, speed: 1.2 }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 90 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  const pid = document.getElementById('pid');
  const submitBtn = document.getElementById('submitBtn');
  const sendInfo = document.getElementById('sendInfo');
  const result = document.getElementById('result');
  const server = document.getElementById('server');
  const type = document.getElementById('type');
  const lockscreen = document.getElementById('lockscreen');
  const mainContent = document.getElementById('mainContent');
  const passwordInput = document.getElementById('passwordInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const errorMsg = document.getElementById('errorMsg');

  function validate() {
    return pid.value && pid.value.trim().length >= 3;
  }

  function showResultLoader() {
    result.innerHTML = `
      <div class="result-card">
        <div class="spinner" style="margin:auto;"></div>
        <div class="muted" style="margin-top:8px;">Fetching data...</div>
      </div>
    `;
  }

  submitBtn.addEventListener('click', async () => {
    if (!validate()) {
      result.innerHTML = `<div class="result-card error">Invalid Player ID</div>`;
      return;
    }

    submitBtn.disabled = true;
    sendInfo.textContent = 'Sending...';
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    submitBtn.prepend(spinner);

    try {
      const uid = pid.value.trim();
      const region = server.value.trim(); // Aquí va lo que tú seleccionas

      if (type.value === 'info') {
        showResultLoader();
        const apiUrl = `https://jnl-info-v4.vercel.app/player-info?uid=${uid}&region=${region}`;
        const res = await fetch(apiUrl);

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
          throw new Error('Player not found.');
        }

        result.innerHTML = `
          <div class="result-card">
            <h3>${data.name || 'N/A'}</h3>
            <p><strong>Level:</strong> ${data.level || 'N/A'}</p>
            <p><strong>Likes:</strong> ${data.likes || 'N/A'}</p>
            <p><strong>Views:</strong> ${data.views || 'N/A'}</p>
          </div>
        `;
        sendInfo.textContent = 'Player info fetched';
      } else {
        await new Promise(r => setTimeout(r, 1200));
        result.innerHTML = `<div class="result-card success">Sent: /like ${uid}</div>`;
        sendInfo.textContent = 'Last sent just now';
      }
    } catch (error) {
      result.innerHTML = `<div class="result-card error">${error.message || 'Failed to send'}</div>`;
      sendInfo.textContent = 'Error';
    } finally {
      submitBtn.disabled = false;
      spinner.remove();
    }
  });

  unlockBtn.addEventListener('click', unlockDashboard);
  passwordInput.addEventListener('keydown', (e) => e.key === 'Enter' && unlockDashboard());

  function unlockDashboard() {
    if (passwordInput.value === 'reyes1234') {
      lockscreen.style.display = 'none';
      mainContent.style.display = 'flex';
      errorMsg.textContent = '';
      passwordInput.value = '';
    } else {
      errorMsg.textContent = 'Incorrect password. Try again.';
      passwordInput.value = '';
      passwordInput.focus();
    }
  }
});
