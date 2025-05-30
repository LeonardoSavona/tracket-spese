import { BACKEND_URL } from "./script.js";

let spese = JSON.parse(localStorage.getItem("spese")) || [];
let daPagare = JSON.parse(localStorage.getItem("daPagare")) || [];

// SPESE
export function aggiungiSpesa() {
  const carta = document.getElementById("carta").value;
  const descrizione = document.getElementById("descrizione-spesa").value;
  const importo = document.getElementById("importo-spesa").value;
  const data = document.getElementById("data-spesa").value || new Date().toISOString().split("T")[0];

  if (!descrizione || !importo) {
    alert("Inserisci almeno descrizione e importo.");
    return;
  }

  const voce = {
    carta,
    descrizione,
    importo,
    data
  };

  spese.push(voce);
  salva();
  aggiornaListaSpese();

  // Pulisci i campi
  document.getElementById("descrizione-spesa").value = "";
  document.getElementById("importo-spesa").value = "";
  document.getElementById("data-spesa").value = new Date().toISOString().split("T")[0];
}

function aggiornaListaSpese() {
  const lista = document.getElementById("lista-spese");
  lista.innerHTML = "";
  spese.forEach((voce, index) => {
    const li = document.createElement("li");
    li.className = "riga-dati";
    li.innerHTML = `
      <div class="col">${voce.carta}</div>
      <div class="col">${voce.descrizione}</div>
      <div class="col">${Number(voce.importo).toFixed(2)}€</div>
      <div class="col">${voce.data}</div>
      <button onclick="rimuoviSpesa(${index})">✖</button>
    `;
    lista.appendChild(li);
  });
}

export function rimuoviSpesa(index) {
  spese.splice(index, 1);
  salva();
  aggiornaListaSpese();
}

// DA PAGARE
export function aggiungiDaPagare() {
  const descrizione = document.getElementById("descrizione-da-pagare").value;
  const importo = document.getElementById("importo-da-pagare").value;
  const scadenza = document.getElementById("scadenza-da-pagare").value || new Date().toISOString().split("T")[0];

  if (!descrizione || !importo) {
    alert("Inserisci almeno descrizione e importo.");
    return;
  }

  const voce = {
    descrizione,
    importo,
    scadenza
  };

  daPagare.push(voce);
  salva();
  aggiornaListaDaPagare();

  // Pulisci i campi
  document.getElementById("descrizione-da-pagare").value = "";
  document.getElementById("importo-da-pagare").value = "";
  document.getElementById("scadenza-da-pagare").value = new Date().toISOString().split("T")[0];
}

function aggiornaListaDaPagare() {
  const lista = document.getElementById("lista-da-pagare");
  lista.innerHTML = "";
  daPagare.forEach((voce, index) => {
    const li = document.createElement("li");
    li.className = "riga-dati";
    li.innerHTML = `
      <div class="col">${voce.descrizione}</div>
      <div class="col">${Number(voce.importo).toFixed(2)}€</div>
      <div class="col">${voce.scadenza}</div>
      <button onclick="rimuoviDaPagare(${index})">✖</button>
    `;
    lista.appendChild(li);
  });
}

export function rimuoviDaPagare(index) {
  daPagare.splice(index, 1);
  salva();
  aggiornaListaDaPagare();
}

export function aggiornaListe() {
  aggiornaListaSpese();
  aggiornaListaDaPagare();
}

// Sync
export async function sincronizza() {
  const password = localStorage.getItem("userPassword");
  if (!password) {
    alert("Non sei loggato!");
    return;
  }

  if ((!spese || spese.length === 0) && (!daPagare || daPagare.length === 0)) {
    alert("Nessuna voce da sincronizzare");
    return;
  }

  const dati = {
    spese: spese,
    da_pagare: daPagare
  };

  const overlay = document.getElementById("loading-overlay");
  overlay.style.display = "block";

  try {
    const res = await fetch(BACKEND_URL + "/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + password
      },
      body: JSON.stringify(dati)
    });

    const data = await res.json();
    if (!res.ok) {
      alert("Errore durante la sincronizzazione: " + (data.message || "Errore sconosciuto"));
      return;
    }

    if (data.status === "ok") {
      mostraPopupSuccesso();
      spese = [];
      daPagare = [];
      salva();
      aggiornaListe();
    }

  } catch (error) {
    console.error("Errore durante il sync:", error);
    alert("Errore di rete");
  } finally {
    overlay.style.display = "none";
  }
}

function salva() {
  localStorage.setItem("spese", JSON.stringify(spese));
  localStorage.setItem("daPagare", JSON.stringify(daPagare));
}

function mostraPopupSuccesso() {
  const popup = document.getElementById("success-popup");
  popup.style.display = "block";
  popup.style.opacity = "1";

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.style.display = "none";
    }, 300); // aspetta che l'opacità arrivi a 0
  }, 2000); // visibile per 2 secondi
}