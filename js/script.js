import * as auth from "./auth.js"; 
import * as sync from "./sync.js";
      
window.logout = auth.logout;
window.login = auth.login;
window.aggiungiSpesa = sync.aggiungiSpesa;
window.aggiungiDaPagare = sync.aggiungiDaPagare;
window.sincronizza = sync.sincronizza;
window.mostraSezione = mostraSezione;

export const BACKEND_URL = "http://localhost:5000"; // cambia con il tuo URL

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

export function mostraApp() {
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
  sync.aggiornaListe();
}

// Gestione e controllo per IMPORTI e DATE inseriti
function troncaADueDecimali(e) {
  const value = e.target.value;
  const parts = value.split(/[.,]/);
  if (parts.length === 2 && parts[1].length > 0) {
    e.target.value = parts[0] + "." + parts[1].slice(0, 2);
  }
}

const inputImportoSpesa = document.getElementById("importo-spesa");
inputImportoSpesa.addEventListener("input", troncaADueDecimali);

const inputImportoDaPagare = document.getElementById("importo-da-pagare");
inputImportoDaPagare.addEventListener("input", troncaADueDecimali);

document.addEventListener("DOMContentLoaded", () => {
  const oggi = new Date().toISOString().split("T")[0];
  const dataSpesa = document.getElementById("data-spesa");
  if (dataSpesa) dataSpesa.value = oggi;

  const dataDaPagare = document.getElementById("scadenza-da-pagare");
  if (dataDaPagare) dataDaPagare.value = oggi;
});
