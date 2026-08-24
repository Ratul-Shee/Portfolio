/* =========================================================
   RATUL SHEE — PORTFOLIO SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     Boot screen typing sequence
     ========================================================= */
  const bootScreen = document.getElementById('bootScreen');
  const bootLine1 = document.getElementById('bootLine1');
  const bootLine2Wrap = document.getElementById('bootLine2Wrap');
  const bootLine2 = document.getElementById('bootLine2');
  const bootFill = document.getElementById('bootFill');
  const heroTyped = document.getElementById('heroTyped');

  bootLine2Wrap.style.opacity = '0';

  function typeText(el, text, speed, cb) {
    let i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (cb) cb();
    })();
  }

  function runBoot() {
    if (prefersReduced) {
      bootScreen.classList.add('done');
      heroTyped.textContent = 'Full-Stack MERN Developer, based in India.';
      return;
    }
    typeText(bootLine1, 'loading ratul_shee.profile...', 28, () => {
      bootLine2Wrap.style.opacity = '1';
      typeText(bootLine2, 'status: ready', 40, () => {
        let progress = 0;
        const fillTimer = setInterval(() => {
          progress += 4;
          bootFill.style.width = Math.min(progress, 100) + '%';
          if (progress >= 100) {
            clearInterval(fillTimer);
            setTimeout(() => {
              bootScreen.classList.add('done');
              typeText(heroTyped, 'Full-Stack MERN Developer, based in India.', 32);
            }, 250);
          }
        }, 22);
      });
    });
  }
  runBoot();

  /* =========================================================
     Scroll progress bar + nav hide/show
     ========================================================= */
  const scrollBar = document.getElementById('scrollBar');
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    scrollBar.style.width = pct + '%';

    nav.classList.toggle('scrolled', scrollTop > 40);

    if (scrollTop > lastScroll && scrollTop > 200) {
      nav.classList.add('hide');
    } else {
      nav.classList.remove('hide');
    }
    lastScroll = scrollTop;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* =========================================================
     Mobile nav toggle
     ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* =========================================================
     Scroll reveal via IntersectionObserver
     ========================================================= */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in'), i * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* =========================================================
     Custom cursor (desktop only)
     ========================================================= */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(max-width:860px)').matches;

  if (!isTouch && !prefersReduced) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .tilt-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  /* =========================================================
     Magnetic buttons
     ========================================================= */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* =========================================================
     3D tilt project cards
     ========================================================= */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rotX = ((y / r.height) - 0.5) * -10;
        const rotY = ((x / r.width) - 0.5) * 12;
        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* =========================================================
     Ambient network canvas background
     ========================================================= */
  const canvas = document.getElementById('net-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const PARTICLE_COUNT = prefersReduced ? 0 : (window.innerWidth < 700 ? 32 : 65);

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }
  initParticles();
  window.addEventListener('resize', () => { initParticles(); });

  function drawNet() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(57,255,156,0.5)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(51,212,255,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawNet);
  }
  if (!prefersReduced) drawNet();

});
