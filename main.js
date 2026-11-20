/* =========================================================
   Caro Creativa — Portafolio
   JS sin dependencias: intro de estrella scroll-driven,
   scramble tipográfico, reveals, cursor, tema y pequeñas
   interacciones. El contenido de los proyectos vive en
   src/data/proyectos.js.
   ========================================================= */

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = window.matchMedia('(min-width: 901px)');

  const html = document.documentElement;
  const body = document.body;
  const nav = $('#nav');
  const stage = $('#star-stage');

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  };

  /* -------------------------------------------------------
     Split de palabras para reveals tipográficos
     ------------------------------------------------------- */

  function splitWords(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && node.nodeValue.trim()) nodes.push(node);
    }

    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const word = document.createElement('span');
        word.className = 'word';
        const inner = document.createElement('span');
        inner.className = 'word__in';
        inner.textContent = part;
        word.appendChild(inner);
        frag.appendChild(word);
      });
      node.parentNode.replaceChild(frag, node);
    });

    $$('.word__in', root).forEach((word, i) => {
      const base = Number(root.dataset.splitDelay) || 0;
      word.style.transitionDelay = `${base + Math.min(i, 14) * 38}ms`;
    });
  }

  $$('[data-split]').forEach(splitWords);

  /* -------------------------------------------------------
     Scramble del título: cajas tipográficas
     ------------------------------------------------------- */

  const heroBoxes = $$('.hero__boxes .box');
  heroBoxes.forEach((box) => {
    box.style.setProperty('--i', Number(box.dataset.index) || 0);
  });
  let scrambled = false;

  function startScramble() {
    if (scrambled || !heroBoxes.length) return;
    scrambled = true;

    if (reduceMotion) {
      heroBoxes.forEach((box) => box.classList.add('is-done'));
      return;
    }

    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*+=?/<>[]{}';
    const items = heroBoxes.map((box) => {
      const index = Number(box.dataset.index) || 0;
      return {
        box,
        char: $('.box__char', box),
        final: box.dataset.char || '',
        delay: index * 45,
        duration: 320 + Math.random() * 320,
        next: 0
      };
    });

    const randomGlyph = () => glyphs[(Math.random() * glyphs.length) | 0];
    const startTime = performance.now();

    function frame(now) {
      let running = false;
      const elapsed = now - startTime;

      items.forEach((item) => {
        if (elapsed < item.delay) {
          running = true;
          item.box.classList.add('is-scrambling');
          if (now >= item.next) {
            item.char.textContent = randomGlyph();
            item.next = now + 42 + Math.random() * 45;
          }
          return;
        }

        const local = elapsed - item.delay;
        if (local < item.duration) {
          running = true;
          item.box.classList.add('is-scrambling');
          if (now >= item.next) {
            item.char.textContent = randomGlyph();
            item.next = now + 38 + Math.random() * 52;
          }
        } else {
          item.box.classList.remove('is-scrambling');
          item.box.classList.add('is-done');
          item.char.textContent = item.final;
        }
      });

      if (running) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  /* -------------------------------------------------------
     Arranque general
     ------------------------------------------------------- */

  let started = false;
  let revealObserver = null;

  function start() {
    if (started) return;
    started = true;
    html.classList.add('app-ready');
    body.classList.remove('is-loading');
    initReveals();

    const hero = $('.hero');
    if (hero) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => hero.classList.add('is-playing'));
      });
    }

    if (reduceMotion) {
      startScramble();
    } else {
      window.setTimeout(startScramble, 700);
    }

    if (canHover && !reduceMotion) body.classList.add('has-cursor');
  }

  /* -------------------------------------------------------
     Intro: estrella scroll-driven
     ------------------------------------------------------- */

  const skipIntroParam = new URLSearchParams(window.location.search).get('intro') === '0';
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('caro-creativa-intro') === '1'; } catch (e) {}

  if (!stage || skipIntroParam || reduceMotion || introSeen) {
    if (stage) stage.remove();
    start();
  } else {
    setupStarIntro(stage);
  }

  function setupStarIntro(stageEl) {
    window.__caroIntro = true;

    const scaleEl = $('#star-scale');
    const layers = $$('.star-layer', stageEl);
    const bg = $('.star-stage__bg', stageEl);
    const flash = $('.star-stage__flash', stageEl);
    const skipBtn = $('#star-skip', stageEl);

    let progress = 0;
    let target = 0;
    let introDone = false;
    let touchY = null;
    let lastFrame = 0;

    try { history.scrollRestoration = 'manual'; } catch (e) {}
    if (window.scrollY > 0) window.scrollTo(0, 0);

    function addProgress(amount) {
      if (introDone) return;
      target = clamp(target + amount, 0, 1);
    }

    function onWheel(event) {
      if (introDone) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = Math.max(Math.abs(event.deltaY || 0), Math.abs(event.deltaX || 0)) * unit;
      addProgress(clamp(delta * 0.004, 0.06, 0.2));
    }

    function onKey(event) {
      if (introDone) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target && event.target.closest && event.target.closest('button, a, input, textarea, select')) return;

      const keys = ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'Enter'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      addProgress(event.key === 'Enter' ? 0.25 : 0.16);
    }

    function onTouchStart(event) {
      if (introDone || !event.touches.length) return;
      touchY = event.touches[0].clientY;
    }

    function onTouchMove(event) {
      if (introDone || !event.touches.length) return;
      event.preventDefault();
      const y = event.touches[0].clientY;
      if (touchY !== null) {
        const delta = touchY - y;
        if (delta > 0) addProgress(clamp(delta * 0.006, 0, 0.16));
      }
      touchY = y;
    }

    function onStageClick(event) {
      if (introDone) return;
      if (event.target.closest && event.target.closest('#star-skip')) return;
      addProgress(0.07);
    }

    function finishIntro() {
      if (introDone) return;
      introDone = true;

      try { sessionStorage.setItem('caro-creativa-intro', '1'); } catch (e) {}

      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      stageEl.removeEventListener('click', onStageClick);

      html.classList.add('star-exploded');
      stageEl.classList.add('is-done');
      body.classList.remove('is-loading');
      start();

      window.setTimeout(() => {
        if (stageEl.isConnected) stageEl.remove();
      }, 750);
    }

    function introLoop(now) {
      if (introDone) return;

      // Suavizado independiente del framerate
      if (!lastFrame) lastFrame = now;
      const dt = Math.min(100, now - lastFrame);
      lastFrame = now;
      const ease = 1 - Math.exp(-dt / 90);
      progress += (target - progress) * ease;

      const p = clamp(progress, 0, 1);
      const grow = p < 0.3 ? 0 : Math.pow((p - 0.3) / 0.7, 2.1);
      const time = now * 0.001;

      // Temblor que se apaga a medida que la estrella crece
      const tremble = (1 - grow) * (0.7 + p * 3.2) * (0.35 + p);
      const shakeX = (Math.sin(time * 31.7) + Math.sin(time * 17.3) * 0.6) * tremble;
      const shakeY = (Math.cos(time * 27.1) + Math.sin(time * 13.7) * 0.6) * tremble;
      const shakeRot = Math.sin(time * 19.3) * tremble * 0.9;

      if (scaleEl) {
        scaleEl.style.transform =
          `translate3d(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px, 0) ` +
          `rotate(${shakeRot.toFixed(2)}deg) scale(${(1 + grow * 17).toFixed(3)})`;
      }

      layers.forEach((layer, index) => {
        const dx = parseFloat(layer.dataset.dx || '0');
        const dy = parseFloat(layer.dataset.dy || '0');
        const rot = parseFloat(layer.dataset.rot || '0');
        const layerScale = 1 + grow * (1.1 + (index % 3) * 0.4);
        layer.style.transform =
          `translate3d(${(dx * grow).toFixed(1)}%, ${(dy * grow).toFixed(1)}%, 0) ` +
          `rotate(${(rot * grow).toFixed(1)}deg) scale(${layerScale.toFixed(3)})`;
        layer.style.opacity = String(1 - smoothstep(0.46, 0.98, p) * 0.96);
      });

      if (bg) bg.style.opacity = String(1 - smoothstep(0.34, 0.92, p));

      if (flash) {
        const flashAmount = smoothstep(0.7, 0.9, p) * (1 - smoothstep(0.9, 1, p));
        flash.style.opacity = String(flashAmount * 0.85);
      }

      stageEl.classList.toggle('is-growing', grow > 0.035);

      if (p > 0.9) {
        finishIntro();
        return;
      }

      window.requestAnimationFrame(introLoop);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    stageEl.addEventListener('click', onStageClick);

    if (skipBtn) {
      skipBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        finishIntro();
      });
    }

    window.requestAnimationFrame(introLoop);
  }

  /* -------------------------------------------------------
     Reveals
     ------------------------------------------------------- */

  function initReveals() {
    const targets = $$('[data-reveal], [data-split], [data-stagger]')
      .filter((el) => !el.closest('.hero'));
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => revealObserver.observe(el));
  }

  /* -------------------------------------------------------
     Navegación: fondo, progreso, sección activa, menú
     ------------------------------------------------------- */

  const progressBar = $('.progress span');
  let scrollQueued = false;

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
      scrollQueued = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navLinks = $$('.nav__links a');
  const sections = $$('main section[id]');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const navToggle = $('#nav-toggle');
  const menu = $('#menu');

  function setMenu(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      setMenu(!nav.classList.contains('is-open'));
    });
  }

  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav && nav.classList.contains('is-open')) setMenu(false);
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  /* -------------------------------------------------------
     Tema día / noche
     ------------------------------------------------------- */

  const themeToggle = $('#theme-toggle');
  const themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme, persist = true) {
    html.dataset.theme = theme;
    const night = theme === 'night';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(night));
      themeToggle.setAttribute('aria-label', night ? 'Cambiar a tema día' : 'Cambiar a tema noche');
    }
    if (themeMeta) themeMeta.setAttribute('content', night ? '#141414' : '#f4f1e8');
    if (persist) {
      try { localStorage.setItem('tema', theme); } catch (e) {}
    }
  }

  applyTheme(html.dataset.theme === 'night' ? 'night' : 'day', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.dataset.theme === 'night' ? 'day' : 'night';
      applyTheme(next);
    });
  }

  /* -------------------------------------------------------
     Cursor personalizado
     ------------------------------------------------------- */

  const cursor = $('#cursor');

  if (cursor && canHover && !reduceMotion) {
    const ring = $('.cursor__ring', cursor);
    const dot = $('.cursor__dot', cursor);
    const label = $('.cursor__label', cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;

    window.addEventListener('pointermove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      if (!visible) {
        visible = true;
        cursor.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      visible = false;
      cursor.style.opacity = '0';
    });

    document.addEventListener('pointerenter', () => {
      visible = true;
      cursor.style.opacity = '1';
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      window.requestAnimationFrame(loop);
    }
    loop();

    const interactive = $$('a, button, [data-cursor]');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const mode = el.dataset.cursor;
        if (el.hasAttribute('data-cursor')) {
          cursor.classList.add('is-view');
          label.textContent = mode === 'ver' ? 'ver' : (mode || '');
        } else {
          cursor.classList.add('is-link');
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-link', 'is-view');
        label.textContent = '';
      });
    });
  }

  /* -------------------------------------------------------
     Botones magnéticos
     ------------------------------------------------------- */

  if (canHover && !reduceMotion) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* -------------------------------------------------------
     Parallax suave del hero y tilt de tarjetas
     ------------------------------------------------------- */

  if (canHover && !reduceMotion) {
    const hero = $('.hero');
    const visual = $('.hero__visual');
    const grid = $('.hero__grid');

    if (hero && visual) {
      hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        visual.style.translate = `${x * 10}px ${y * 8}px`;
        if (grid) grid.style.translate = `${x * -14}px ${y * -10}px`;
      }, { passive: true });

      hero.addEventListener('pointerleave', () => {
        visual.style.translate = '';
        if (grid) grid.style.translate = '';
      });
    }

  }

  /* -------------------------------------------------------
     Reviews: el componente <review-drawer> gestiona sus
     propias pestañas, springs y accesibilidad.
     ------------------------------------------------------- */

  /* -------------------------------------------------------
     Correo de contacto: ajusta el tamaño para que no se parta
     ------------------------------------------------------- */

  const mailLink = document.querySelector('.contact__mail');

  if (mailLink) {
    const fitMail = () => {
      mailLink.style.fontSize = '';
      const base = parseFloat(getComputedStyle(mailLink).fontSize) || 16;
      const probe = mailLink.cloneNode(true);
      probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;pointer-events:none;max-width:none;';
      document.body.appendChild(probe);
      const natural = probe.getBoundingClientRect().width;
      probe.remove();

      const room = mailLink.clientWidth;
      if (!natural || !room) return;

      if (natural > room) {
        mailLink.style.fontSize = `${base * (room / natural) * 0.985}px`;
      }
    };

    fitMail();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMail);

    let mailFrame = 0;
    window.addEventListener('resize', () => {
      window.cancelAnimationFrame(mailFrame);
      mailFrame = window.requestAnimationFrame(fitMail);
    }, { passive: true });
  }

  /* -------------------------------------------------------
     Reloj de Bogotá y año
     ------------------------------------------------------- */

  const clock = $('#clock');
  const clockHero = $('#clock-hero');
  const year = $('#year');

  if (year) year.textContent = String(new Date().getFullYear());

  if (clock || clockHero) {
    const format = new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const tick = () => {
      const now = format.format(new Date());
      if (clock) clock.textContent = now;
      if (clockHero) clockHero.textContent = now;
    };
    tick();
    window.setInterval(tick, 30000);
  }

})();
