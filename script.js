const BACKEND_URL = "https://tracker-spese-be.onrender.com/"; // cambia con il tuo URL

let spese = JSON.parse(localStorage.getItem("spese")) || [];
let daPagare = JSON.parse(localStorage.getItem("daPagare")) || [];

function salva() {
  localStorage.setItem("spese", JSON.stringify(spese));
  localStorage.setItem("daPagare", JSON.stringify(daPagare));
}

function aggiornaListe() {
  const speseUl = document.getElementById("lista-spese");
  speseUl.innerHTML = "";
  spese.forEach((s, i) => {
    speseUl.innerHTML += `<li>${s} <button onclick="rimuoviSpesa(${i})">✖</button></li>`;
  });

  const daPagareUl = document.getElementById("lista-da-pagare");
  daPagareUl.innerHTML = "";
  daPagare.forEach((s, i) => {
    daPagareUl.innerHTML += `<li>${s} <button onclick="rimuoviDaPagare(${i})">✖</button></li>`;
  });
}

function aggiungiSpesa() {
  const val = document.getElementById("nuova-spesa").value;
  if (val) {
    spese.push(val);
    document.getElementById("nuova-spesa").value = "";
    salva();
    aggiornaListe();
  }
}

function aggiungiDaPagare() {
  const val = document.getElementById("nuova-da-pagare").value;
  if (val) {
    daPagare.push(val);
    document.getElementById("nuova-da-pagare").value = "";
    salva();
    aggiornaListe();
  }
}

function rimuoviSpesa(index) {
  spese.splice(index, 1);
  salva();
  aggiornaListe();
}

function rimuoviDaPagare(index) {
  daPagare.splice(index, 1);
  salva();
  aggiornaListe();
}

function sincronizza() {
  const password = localStorage.getItem("userPassword");
  if (!password) {
    alert("Non sei loggato!");
    return;
  }

  const dati = {
    spese: spese,
    da_pagare: daPagare
  };

  fetch(BACKEND_URL + "/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + password
    },
    body: JSON.stringify(dati)
  })
    .then(async res => {
      if (!res.ok) {
        alert("Errore durante la sincronizzazione");
        return;
      }
      return res.json();
    })
    .then(data => {
      if (data && data.status === "ok") {
        alert("Sincronizzazione completata!");
        spese = [];
        salva();
        aggiornaListe();
      }
    })
    .catch(err => {
      console.error(err);
      alert("Errore di rete");
    });
}

function login() {
  const pass = document.getElementById("password").value;

  fetch(BACKEND_URL + "/auth", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + pass
    }
  })
    .then(res => {
      if (res.ok) {
        localStorage.setItem("userPassword", pass);
        mostraApp();
      } else {
        document.getElementById("login-error").style.display = "block";
      }
    })
    .catch(() => {
      alert("Errore di rete");
    });
}

function mostraApp() {
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
  aggiornaListe();
}

function logout() {
  localStorage.removeItem("userPassword");
  document.getElementById("app").style.display = "none";
  document.getElementById("login").style.display = "block";
}

window.onload = function () {
  const pass = localStorage.getItem("userPassword");
  if (pass) {
    fetch(BACKEND_URL + "/auth", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + pass
      }
    })
      .then(res => {
        if (res.ok) {
          mostraApp();
        } else {
          localStorage.removeItem("userPassword");
        }
      });
  }
};
