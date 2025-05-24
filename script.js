const BACKEND_URL = "https://tracker-spese-be.onrender.com"; // cambia con il tuo URL

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
  document.getElementById("data-spesa").value = "";
}

function aggiornaListaSpese() {
  const lista = document.getElementById("lista-spese");
  lista.innerHTML = "";
  spese.forEach((voce, index) => {
    const li = document.createElement("li");
    li.textContent = `[${voce.carta}] ${voce.descrizione} - ${voce.importo}€ (${voce.data})`;
    li.onclick = () => {
      if (confirm("Vuoi eliminare questa spesa?")) {
        spese.splice(index, 1);
        salva();
        aggiornaListaSpese();
      }
    };
    lista.appendChild(li);
  });
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

function mostraSezione(sezione) {
  const spese = document.getElementById("sezione-spese");
  const daPagare = document.getElementById("sezione-da-pagare");
  const btnSpese = document.getElementById("btn-spese");
  const btnDaPagare = document.getElementById("btn-da-pagare");

  if (sezione === "spese") {
    spese.style.display = "block";
    daPagare.style.display = "none";
    btnSpese.classList.add("active");
    btnDaPagare.classList.remove("active");
  } else {
    spese.style.display = "none";
    daPagare.style.display = "block";
    btnSpese.classList.remove("active");
    btnDaPagare.classList.add("active");
  }
}

function login() {
  mostraApp()
  // const pass = document.getElementById("password").value;

  // fetch(BACKEND_URL + "/auth", {
  //   method: "POST",
  //   headers: {
  //     "Authorization": "Bearer " + pass
  //   }
  // })
  //   .then(res => {
  //     if (res.ok) {
  //       localStorage.setItem("userPassword", pass);
  //       mostraApp();
  //     } else {
  //       document.getElementById("login-error").style.display = "block";
  //     }
  //   })
  //   .catch(() => {
  //     alert("Errore di rete");
  //   });
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
