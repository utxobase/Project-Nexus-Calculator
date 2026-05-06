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
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('✅ Nexus SW Active:', reg.scope))
            .catch(err => console.error('❌ SW Error:', err));
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

setInstallState('waiting');

// If already running as installed PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
    setInstallState('installed');
}

// Browser fires this when PWA is installable
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('✅ beforeinstallprompt fired');
    setInstallState('ready');
});

// User clicks install button
installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                setInstallState('installed');
            } else {
                setInstallState('ready');
            }
            deferredPrompt = null;
        });
    } else {
        setInstallState('unsupported');
    }
});

window.addEventListener('appinstalled', () => {
    setInstallState('installed');
    deferredPrompt = null;
    console.log('✅ App installed successfully');
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