// ── Navbar scroll effect ─────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile menu ──────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ── Counter animation ────────────────────────────────────────────────────────
function animateCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target = +el.dataset.target;
        const dur = 1800;
        const start = performance.now();
        const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * ease);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

// ── Reveal on scroll ─────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card, .step, .price-card, .faq-item, .contact-card')
    .forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

// ── Counter trigger ──────────────────────────────────────────────────────────
let countersDone = false;
new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersDone) { countersDone = true; animateCounters(); }
}, { threshold: 0.5 }).observe(document.querySelector('.hero-stats'));

// ── FAQ accordion ────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
    });
});

// ── Chat demo auto-reveal ────────────────────────────────────────────────────
const msgs = document.querySelectorAll('#chat-demo .msg');
msgs.forEach((m, i) => {
    m.style.animationDelay = `${0.8 + i * 0.6}s`;
});

// ── Smooth scroll for anchor links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── Dynamic footer year ──────────────────────────────────────────────────────
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Chat typing indicator ────────────────────────────────────────────────────
(function addTypingIndicator() {
    const chat = document.getElementById('chat-demo');
    if (!chat) return;
    const msgs = [
        { type: 'in',  text: '¿Y el envío cuánto cuesta?',           time: '14:35' },
        { type: 'out', text: 'El envío certificado son 6,50€, muy económico para enviarte el artículo sin riesgo 📦', time: '14:35', bot: true },
    ];
    let idx = 0;
    function showNext() {
        if (idx >= msgs.length) return;
        const m = msgs[idx++];
        // Indicador de escritura
        const typing = document.createElement('div');
        typing.className = 'msg msg-' + m.type;
        typing.innerHTML = '<span style="letter-spacing:3px;color:var(--text-dim)">···</span>';
        chat.appendChild(typing);
        chat.scrollTop = chat.scrollHeight;
        setTimeout(() => {
            typing.innerHTML = `<p>${m.text}</p><span class="msg-time">${m.time}</span>${m.bot ? '<span class="msg-bot-badge">🤖 WallaBot</span>' : ''}`;
            chat.scrollTop = chat.scrollHeight;
            setTimeout(showNext, 2200);
        }, 1200);
    }
    // Esperar a que el hero sea visible para iniciar el loop
    new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { setTimeout(showNext, 3500); }
    }, { threshold: 0.5 }).observe(chat);
})();
