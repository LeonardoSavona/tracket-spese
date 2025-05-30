import { BACKEND_URL, mostraApp } from "./script.js";

let isLoggedIn = false;
let pingInterval;

export function checkLogin() {
    const password = getPassword();
    if (password) {
        loginSuccess(password);
    } else {
        login();
    }
}

export function login() {
  const pass = getPassword();
  if (pass) {
    fetch(BACKEND_URL + "/auth", {
        method: "POST",
        headers: {
        "Authorization": "Bearer " + pass
        }
    })
    .then(res => {
        if (res.ok) {
            loginSuccess(pass);
        } else {
            document.getElementById("login-error").style.display = "block";
        }
    })
    .catch((e) => {
        alert("Errore di rete: "+e);
    });
  }
}

function loginSuccess(pass) {
    localStorage.setItem("userPassword", pass);
    mostraApp();
    isLoggedIn = true;
    initPingServer();
}

export function logout() {
  isLoggedIn = false;
  clearInterval(pingInterval);
  localStorage.removeItem("userPassword");
  document.getElementById("app").style.display = "none";
  document.getElementById("login").style.display = "block";
}

function pingServer() {
  const pass = getPassword();
  fetch(BACKEND_URL + '/ping', {
    headers: {
      "Authorization": "Bearer " + pass
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        console.log('Ping successo');
      } else {
        console.error('Ping fallito:', data.message);
        clearInterval(this.pingInterval);
      }
    })
    .catch(error => {
      console.error('Errore durante il ping:', error);
      clearInterval(this.pingInterval);
    });
}

function initPingServer() {
 pingInterval = setInterval(() => {
    pingServer();
  }, 1000 * 60 * 1); // ogni 5 minuti
}

export function getPassword() {
    return localStorage.getItem("userPassword") || document.getElementById("password").value;
}