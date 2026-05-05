// Position Calculation
function calculate() {
    const risk = parseFloat(document.getElementById('risk').value);
    const sl = parseFloat(document.getElementById('sl').value);
    const entry = parseFloat(document.getElementById('entry').value);

    if (risk > 0 && sl > 0 && entry > 0) {
        const posSize = risk / (sl / 100);
        const qty = posSize / entry;

        document.getElementById('res-usd').innerText = `$${posSize.toFixed(2)}`;
        document.getElementById('res-qty').innerText = qty.toFixed(6);
    } else {
        document.getElementById('res-usd').innerText = "$0.00";
        document.getElementById('res-qty').innerText = "0.0000";
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Nexus SW Active'))
            .catch(err => console.log('SW Error', err));
    });
}

// PWA Install Logic
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') installBtn.style.display = 'none';
            deferredPrompt = null;
        });
    }
});

// Connectivity UI
window.addEventListener('offline', () => {
    document.getElementById('online-status').innerText = 'OFFLINE';
    document.getElementById('online-status').style.color = 'red';
});