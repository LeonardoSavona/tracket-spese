import { BACKEND_URL } from "./script.js";
import { getPassword } from "./auth.js";

window.loadSettings = loadSettings;

async function loadSettings() {
    const password = getPassword();
    
    const overlay = document.getElementById("loading-overlay");
    overlay.style.display = "block";
    
    try {
        const response = await fetch(BACKEND_URL + '/settings', {
            headers: {
                Authorization: 'Bearer ' + password
            }
        });

        const data = await response.json();

        const container = document.getElementById('settings-container');
        container.innerHTML = ''; // Pulisce prima di caricare
        
        // Separiamo gli intervalli carte
        const intervalliCarte = data['Intervalli Carte'];
        delete data['Intervalli Carte']; // Così non viene mostrato due volte

        // Mostra tutte le altre impostazioni (prima)
        for (const [chiave, valore] of Object.entries(data)) {
            const riga = document.createElement('div');
            riga.className = 'settings-row';

            const keyDiv = document.createElement('div');
            keyDiv.className = 'settings-key';
            keyDiv.textContent = chiave;
            keyDiv.title = chiave;

            const valueDiv = document.createElement('input');
            valueDiv.className = 'settings-value';
            valueDiv.value = valore;
            valueDiv.title = valore;
            valueDiv.addEventListener('focus', (e) => {
                e.target.select();
            });

            riga.appendChild(keyDiv);
            riga.appendChild(valueDiv);
            container.appendChild(riga);
        }

        // Se esistono gli intervalli, aggiungiamoli alla fine
        if (intervalliCarte) {
            const titleRow = document.createElement('div');
            titleRow.className = 'settings-row';
            titleRow.textContent = 'Intervalli Carte:';
            titleRow.style.fontWeight = 'bold';
            titleRow.style.marginLeft = '1rem';

            const titleKey = document.createElement('div');
            titleRow.appendChild(titleKey);
            container.appendChild(titleRow);

            for (const [carta, intervallo] of Object.entries(intervalliCarte)) {
                const riga = document.createElement('div');
                riga.className = 'settings-row';

                const keyDiv = document.createElement('div');
                keyDiv.className = 'settings-key';
                keyDiv.textContent = carta;
                keyDiv.title = carta;

                const valueDiv = document.createElement('input');
                valueDiv.className = 'settings-value';
                valueDiv.value = intervallo
                valueDiv.title = intervallo;
                valueDiv.addEventListener('focus', (e) => {
                    e.target.select();
                });

                riga.appendChild(keyDiv);
                riga.appendChild(valueDiv);
                container.appendChild(riga);
            }
        }

    } catch (err) {
        console.error('Errore nel recupero impostazioni:', err);
    } finally {
        overlay.style.display = "none";
    }
}

// ON LOAD FUNCTIONS
window.onload = function () {
    loadSettings();
    document.getElementById("save-settings-btn").addEventListener("click", () => {
        alert("Funzione di salvataggio non ancora implementata.");
    });
};