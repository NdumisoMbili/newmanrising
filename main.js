// ═══════════════════════════════════════════════════════════
// NEW MAN RISING — main.js
// Premium UI/UX · Performance · Accessibility
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─── Page class detection ───────────────────────────────────────────────────
  const path = location.pathname.replace(/\/$/, '').split('/').pop() || '';
  const pageMap = { '': 'page-home', 'index.html': 'page-home', 'about.html': 'page-about', 'programs.html': 'page-programs', 'events.html': 'page-events', 'contact.html': 'page-contact' };
  const pageClass = pageMap[path] || 'page-home';
  if (!document.body.classList.contains(pageClass)) document.body.classList.add(pageClass);

  // ─── Reduced motion preference ─────────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Scroll Progress Bar ───────────────────────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-label', 'Page scroll progress');
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', '100');
  document.body.prepend(progressBar);

  // ─── Ambient Orbs (skip if reduced motion) ─────────────────────────────────
  if (!prefersReducedMotion) {
    ['ambient-orb-1', 'ambient-orb-2', 'ambient-orb-3'].forEach(cls => {
      const orb = document.createElement('div');
      orb.className = `ambient-orb ${cls}`;
      orb.setAttribute('aria-hidden', 'true');
      document.body.append(orb);
    });
  }

  // ─── Custom Cursor (desktop only) ──────────────────────────────────────────
  const isTouch = window.matchMedia('(hover: none)').matches;
  let cursor, cursorRing;
  if (!isTouch && !prefersReducedMotion) {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    cursorRing.setAttribute('aria-hidden', 'true');
    document.body.append(cursor, cursorRing);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, [role="button"], .half-clock-card, .glass-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('focus',  () => document.body.classList.add('cursor-text'));
      el.addEventListener('blur',   () => document.body.classList.remove('cursor-text'));
    });
  }

  // ─── Page Transition Curtain ───────────────────────────────────────────────
  const curtain = document.createElement('div');
  curtain.id = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.prepend(curtain);

  // Reveal current page
  curtain.classList.add('is-exiting');
  setTimeout(() => curtain.classList.remove('is-exiting'), 500);

  // Intercept internal navigation
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      curtain.classList.add('is-entering');
      setTimeout(() => { window.location.href = href; }, prefersReducedMotion ? 0 : 460);
    });
  });

  // ─── Scroll events (batched with RAF) ─────────────────────────────────────
  const nav         = document.querySelector('nav');
  const navLinks    = document.getElementById('nav-links');
  const yearEl      = document.getElementById('current-year');
  let lastScrollY   = window.scrollY;
  let ticking       = false;

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        const scrollingDown = sy > lastScrollY;

        // Progress bar
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (sy / docH * 100) : 0;
        progressBar.style.width = pct + '%';
        progressBar.setAttribute('aria-valuenow', Math.round(pct));

        // Nav appearance
        if (nav) {
          if (sy > 60) {
            nav.style.background    = 'rgba(10,10,11,0.92)';
            nav.style.borderColor   = 'rgba(242,202,80,0.12)';
            nav.style.boxShadow     = '0 24px 70px rgba(0,0,0,0.18)';
          } else {
            nav.style.background    = '';
            nav.style.borderColor   = '';
            nav.style.boxShadow     = '';
          }
          if (navLinks) {
            if (sy > 90 && scrollingDown) nav.classList.add('nav-collapsed');
            else if (!scrollingDown || sy <= 90) nav.classList.remove('nav-collapsed');
          }
        }

        // Parallax
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.15;
          el.style.transform = `translateY(${sy * speed}px)`;
        });

        lastScrollY = sy;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Parallax elements ─────────────────────────────────────────────────────
  const parallaxEls = prefersReducedMotion ? [] : Array.from(document.querySelectorAll('[data-parallax]'));

  // ─── Mobile Menu ───────────────────────────────────────────────────────────
  const menuBtn    = document.getElementById('mobile-menu-btn');
  const menuClose  = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.removeAttribute('hidden');
    mobileMenu.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
    menuBtn?.setAttribute('aria-expanded', 'true');
    menuClose?.focus();
  };

  const closeMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
    menuBtn?.setAttribute('aria-expanded', 'false');
    setTimeout(() => mobileMenu.setAttribute('hidden', ''), 300);
    menuBtn?.focus();
  };

  menuBtn?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

  // Trap focus inside mobile menu
  mobileMenu?.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
    if (e.key === 'Tab') {
      const focusable = Array.from(mobileMenu.querySelectorAll('a, button'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ─── Scroll Reveal ─────────────────────────────────────────────────────────
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-slide-up, .reveal-fade, .reveal-blur, .reveal-stagger, .reveal-zoom-in, .reveal-tilt';
  const revealEls = document.querySelectorAll(revealSelectors);

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    if (prefersReducedMotion) el.classList.add('is-visible');
    else revealObs.observe(el);
  });

  // ─── Cinematic H1 Word Split ───────────────────────────────────────────────
  if (!prefersReducedMotion) {
    document.querySelectorAll('h1.reveal-slide-up').forEach(el => {
      // Preserve existing HTML (spans, etc.) — only split plain text nodes
      if (el.children.length > 0) return; // skip already marked-up h1s
      const words = el.textContent.trim().split(/(\s+)/);
      el.innerHTML = words.map((w, i) => {
        if (/^\s+$/.test(w)) return ' ';
        return `<span class="cinematic-word" style="transition-delay:${180 + Math.floor(i / 2) * 80}ms">${w}</span>`;
      }).join('');

      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.cinematic-word').forEach(s => s.classList.add('is-visible'));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }

  // ─── Smooth Anchor Scroll ──────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const tgt = document.querySelector(id);
      if (tgt) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight + 16 : 80;
        const top = tgt.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        // Update focus for accessibility
        tgt.setAttribute('tabindex', '-1');
        tgt.focus({ preventScroll: true });
      }
    });
  });

  // ─── Counter Animation ─────────────────────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObs.observe(el));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = prefersReducedMotion ? 0 : 2200;
    const start    = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else {
        el.textContent = prefix + target.toLocaleString() + suffix;
        el.closest('.stat-number-animated')?.classList.add('counted');
      }
    }
    requestAnimationFrame(tick);
  }

  // Wrap counter parents
  counters.forEach(el => {
    const p = el.parentElement;
    if (p && !p.classList.contains('stat-number-animated')) p.classList.add('stat-number-animated');
  });

  // ─── Magnetic Buttons ─────────────────────────────────────────────────────
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
        btn.style.transform = `translate(${dx}px,${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ─── Gold border hover on glass cards ─────────────────────────────────────
  document.querySelectorAll('.glass-card').forEach(card => {
    card.classList.add('gold-border-hover', 'program-card-forge');
  });

  // ─── Timeline dot glow ────────────────────────────────────────────────────
  document.querySelectorAll('.timeline-dot').forEach(dot => dot.classList.add('timeline-dot-glow'));

  // ─── Lazy image fade ──────────────────────────────────────────────────────
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!img.complete) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';
      img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
    }
  });

  // ─── Contact Form ─────────────────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn      = contactForm.querySelector('button[type="submit"]');
      const textEl   = document.getElementById('submit-text') || btn;
      const origText = textEl.textContent;
      textEl.textContent = 'SENT ✓';
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.style.opacity = '0.6';
      setTimeout(() => {
        textEl.textContent = origText;
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
        btn.style.opacity = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ─── Launch Countdown (June 19 2026 00:00 SAST = UTC+2) ───────────────────
  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  if (cdDays) {
    const launchUTC = Date.UTC(2026, 5, 18, 22, 0, 0); // June 19 00:00 SAST (UTC+2)

    const tickCountdown = () => {
      const now  = Date.now();
      const diff = launchUTC - now;

      if (diff <= 0) {
        cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '00';
        const section = document.getElementById('countdown-display')?.closest('section');
        if (section) {
          section.querySelector('h2').textContent = 'The Movement Is Live. Rise!';
        }
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      cdDays.textContent  = String(d).padStart(2, '0');
      cdHours.textContent = String(h).padStart(2, '0');
      cdMins.textContent  = String(m).padStart(2, '0');
      cdSecs.textContent  = String(s).padStart(2, '0');

      setTimeout(tickCountdown, 1000);
    };
    tickCountdown();
  }

  // ─── Events Horizontal Drag Scroll ────────────────────────────────────────
  const eventsTrack = document.getElementById('eventsTrack');
  const eventDots   = document.getElementById('eventDots');

  if (eventsTrack) {
    let isDown = false, startX = 0, scrollLeft = 0;

    eventsTrack.addEventListener('mousedown', e => {
      isDown = true;
      eventsTrack.classList.add('is-grabbing');
      startX     = e.pageX - eventsTrack.offsetLeft;
      scrollLeft = eventsTrack.scrollLeft;
    });
    document.addEventListener('mouseup',   () => { isDown = false; eventsTrack.classList.remove('is-grabbing'); });
    document.addEventListener('mouseleave', () => { isDown = false; eventsTrack.classList.remove('is-grabbing'); });
    eventsTrack.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - eventsTrack.offsetLeft;
      const walk = (x - startX) * 1.4;
      eventsTrack.scrollLeft = scrollLeft - walk;
    });

    // Touch swipe
    let touchStartX = 0;
    eventsTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    eventsTrack.addEventListener('touchmove',  e => {
      const dx = touchStartX - e.touches[0].clientX;
      eventsTrack.scrollLeft += dx * 0.5;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    // Dot indicators sync
    if (eventDots) {
      const dots     = Array.from(eventDots.querySelectorAll('button'));
      const cards    = Array.from(eventsTrack.querySelectorAll('.event-hscroll-card'));
      const cardW    = () => cards[0]?.offsetWidth + 24 || 400; // card + gap

      const syncDots = () => {
        const idx = Math.round(eventsTrack.scrollLeft / cardW());
        dots.forEach((dot, i) => {
          const active = i === idx;
          dot.style.width           = active ? '24px' : '6px';
          dot.style.height          = '6px';
          dot.style.background      = active ? 'var(--color-primary, #f2ca50)' : 'rgba(255,255,255,0.2)';
          dot.style.borderRadius    = '999px';
          dot.style.transition      = 'all 0.3s ease';
          dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
      };

      eventsTrack.addEventListener('scroll', syncDots, { passive: true });

      // Dot click navigation
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          eventsTrack.scrollTo({ left: i * cardW(), behavior: 'smooth' });
        });
      });

      // Keyboard arrow navigation
      document.addEventListener('keydown', e => {
        if (!document.querySelector('.events-hscroll-wrap:hover') && document.activeElement?.closest('#eventsTrack') === null) return;
        if (e.key === 'ArrowRight') eventsTrack.scrollBy({ left: cardW(), behavior: 'smooth' });
        if (e.key === 'ArrowLeft')  eventsTrack.scrollBy({ left: -cardW(), behavior: 'smooth' });
      });

      syncDots();
    }
  }

  // ─── Testimonial Marquee: duplicate for infinite loop ────────────────────
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  // ─── Half-Clock Radial Carousel ───────────────────────────────────────────
  const radialCarousel = document.getElementById('radialCarousel');
  if (radialCarousel) {
    const cards      = Array.from(document.querySelectorAll('.half-clock-card'));
    const prevBtn    = radialCarousel.querySelector('.carousel-prev');
    const nextBtn    = radialCarousel.querySelector('.carousel-next');
    let   offset     = 0;
    const total      = cards.length;

    const rotate = (off) => {
      const norm = ((off % total) + total) % total;
      cards.forEach((card, i) => {
        const pos = (i + norm) % total;
        card.setAttribute('data-position', pos);
        card.classList.toggle('featured', pos === 3);
        card.setAttribute('aria-selected', pos === 3 ? 'true' : 'false');
      });
    };

    const next = () => { offset = (offset + 1) % total; rotate(offset); };
    const prev = () => { offset = (offset - 1 + total) % total; rotate(offset); };

    cards.forEach((card, i) => {
      card.setAttribute('role', 'option');
      card.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        offset = (3 - i + total) % total;
        rotate(offset);
      });
    });

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    radialCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    rotate(0);
  }

  // ─── Contact page: smooth scroll intent tabs ─────────────────────────────
  document.querySelectorAll('.contact-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.contact-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

});
