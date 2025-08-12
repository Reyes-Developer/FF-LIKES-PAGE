// Configuración de particles.js
document.addEventListener("DOMContentLoaded", () => {
  const pidInput = document.getElementById("pid");
  const serverSelect = document.getElementById("server");
  const typeSelect = document.getElementById("type");
  const submitBtn = document.getElementById("submitBtn");
  const sendInfo = document.getElementById("sendInfo");
  const resultDiv = document.getElementById("result");

  submitBtn.addEventListener("click", async () => {
    const pid = pidInput.value.trim();
    const server = serverSelect.value;
    const type = typeSelect.value;

    if (!pid) {
      sendInfo.textContent = "Please enter a Player ID";
      return;
    }

    sendInfo.textContent = "Fetching data...";
    resultDiv.innerHTML = "";

    try {
      if (type === "info") {
        const url = `https://jnl-info-v4.vercel.app/player-info?uid=${pid}&region=${server}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();

        resultDiv.innerHTML = `
          <h3>Player Info</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
      } else {
        resultDiv.innerHTML = `<p>Type selected: <strong>${type}</strong> (No API linked yet for this)</p>`;
      }

      sendInfo.textContent = "Done";
    } catch (err) {
      sendInfo.textContent = "Error fetching data";
      resultDiv.innerHTML = `<pre>${err.message}</pre>`;
    }
  });
});
