document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("gpt-input");
  const btn = document.getElementById("gpt-submit");
  const response = document.getElementById("gpt-response");

  btn.addEventListener("click", () => {
    const prompt = input.value.trim();
    if (!prompt) {
      response.textContent = "Scrivi qualcosa prima!";
      return;
    }

    // Finta risposta (puoi collegare un backend dopo)
    response.innerHTML = "<em>Sto pensando...</em>";

    setTimeout(() => {
      response.textContent = `🤖 Risposta a: "${prompt}"\n\nMi pare che sia una bella domanda!`;
    }, 1200);
  });
});
