/* ===========================
   HOVV PATION AND FARMS
   script.js
=========================== */

// ── Navbar Scroll State ──────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// ── Hamburger Menu ───────────────────────────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ── Active Nav Link ──────────────────────────────
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ── Scroll Reveal ────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = entry.target.closest('.exp-grid, .menu-grid, .reviews-grid, .moments-grid, .gallery-grid, .about-grid');
        if (siblings) {
          const all = [...siblings.querySelectorAll('.reveal:not(.visible)')];
          const idx = all.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.07}s`;
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Menu Tabs ────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    menuPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === `tab-${target}`) {
        panel.classList.add('active');
        // Re-trigger reveals inside newly shown panel
        panel.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
          setTimeout(() => {
            el.style.transitionDelay = `${i * 0.07}s`;
            el.classList.add('visible');
          }, 30);
        });
      }
    });
  });
});

// ── Reservation Form ─────────────────────────────
window.handleReservation = function () {
  const inputs = document.querySelectorAll('.form-input');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#c0392b';
      valid = false;
      setTimeout(() => { input.style.borderColor = ''; }, 2500);
    }
  });

  if (!valid) return;

  showToast('✅ Reservation sent! We\'ll call you shortly.');

  // Clear form
  inputs.forEach(input => { input.value = ''; });
};

// ── Toast ────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

// ── Smooth anchor scroll (offset for navbar) ─────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Gallery: Lightbox ─────────────────────────────
const gItems = document.querySelectorAll('.g-item');

const lightbox = document.createElement('div');
lightbox.style.cssText = `
  position:fixed;inset:0;background:rgba(15,7,3,.93);
  z-index:9998;display:none;align-items:center;
  justify-content:center;padding:24px;backdrop-filter:blur(6px);
  cursor:pointer;
`;
const lbImg = document.createElement('img');
lbImg.style.cssText = `
  max-height:90vh;max-width:90vw;object-fit:contain;
  border-radius:12px;box-shadow:0 24px 80px rgba(0,0,0,.6);
  cursor:default;transform:scale(0.92);
  transition:transform .35s cubic-bezier(0.34,1.56,0.64,1);
`;
lightbox.appendChild(lbImg);
document.body.appendChild(lightbox);

gItems.forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    lbImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { lbImg.style.transform = 'scale(1)'; });
  });
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lbImg.style.transform = 'scale(0.92)';
    setTimeout(() => { lightbox.style.display = 'none'; }, 200);
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.style.display === 'flex') {
    lbImg.style.transform = 'scale(0.92)';
    setTimeout(() => { lightbox.style.display = 'none'; }, 200);
    document.body.style.overflow = '';
  }
});

// ── Parallax subtle on hero ───────────────────────
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}

// ── Page Load ─────────────────────────────────────
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
