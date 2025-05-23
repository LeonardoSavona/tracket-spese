const spese = [];
const SECRET_TOKEN = "QUI-IL-TUO-TOKEN";

function aggiungiSpesa() {
  const descrizione = document.getElementById("descrizione").value;
  const importo = document.getElementById("importo").value;
  if (descrizione && importo) {
    spese.push({ descrizione, importo });
    aggiornaLista();
  }
}

function aggiornaLista() {
  const ul = document.getElementById("lista-spese");
  ul.innerHTML = "";
  spese.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `${s.descrizione} - €${s.importo}`;
    ul.appendChild(li);
  });
}

function sync() {
  fetch("https://TUO-BACKEND.onrender.com/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: SECRET_TOKEN, spese })
  }).then(res => res.json()).then(res => {
    alert("Sincronizzazione completata");
  }).catch(err => {
    alert("Errore durante il sync");
    console.error(err);
  });
}
