// ── Position Calculation ──────────────────────────────────────────────
function calculate() {
    const risk  = parseFloat(document.getElementById('risk').value);
    const sl    = parseFloat(document.getElementById('sl').value);
    const entry = parseFloat(document.getElementById('entry').value);

    if (risk > 0 && sl > 0 && entry > 0) {
        const posSize = risk / (sl / 100);
        const qty     = posSize / entry;
        document.getElementById('res-usd').innerText = `$${posSize.toFixed(2)}`;
        document.getElementById('res-qty').innerText = qty.toFixed(6);
    } else {
        document.getElementById('res-usd').innerText = '$0.00';
        document.getElementById('res-qty').innerText = '0.0000';
    }
}

// ── Service Worker ────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Nexus SW Active'))
            .catch(err => console.log('SW Error', err));
    });
}

// ── Install Button Logic ──────────────────────────────────────────────
const installBtn = document.getElementById('installBtn');
const installMsg = document.getElementById('install-msg');
let deferredPrompt = null;

function setInstallState(state) {
    switch (state) {
        case 'ready':
            installBtn.disabled = false;
            installMsg.textContent = 'TAP TO INSTALL AS APP';
            break;
        case 'unsupported':
            installBtn.disabled = true;
            installMsg.textContent = 'USE "ADD TO HOME SCREEN" IN BROWSER MENU';
            break;
        case 'installed':
            installBtn.disabled = true;
            installMsg.textContent = 'ALREADY INSTALLED ✓';
            break;
        default:
            installBtn.disabled = true;
            installMsg.textContent = 'AWAITING INSTALL SIGNAL...';
    }
}

// Default state on load
setInstallState('waiting');

// Browser signals it can be installed
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setInstallState('ready');
});

// User clicks install
installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                setInstallState('installed');
            } else {
                setInstallState('ready'); // keep available if dismissed
            }
            deferredPrompt = null;
        });
    } else {
        // Fallback: guide user to browser menu
        setInstallState('unsupported');
    }
});

// Already installed (standalone mode)
if (window.matchMedia('(display-mode: standalone)').matches) {
    setInstallState('installed');
}

window.addEventListener('appinstalled', () => {
    setInstallState('installed');
    deferredPrompt = null;
});

// ── Connectivity UI ───────────────────────────────────────────────────
const statusEl = document.getElementById('online-status');

window.addEventListener('offline', () => {
    statusEl.innerText = 'OFFLINE';
    statusEl.style.color = 'red';
});

window.addEventListener('online', () => {
    statusEl.innerText = 'ONLINE';
    statusEl.style.color = '';
});