/* =========================================================
   GiftsCarousel — hélice de ADN en 3D
   Componente vanilla, sin dependencias ni build.
   Portado a JS/CSS puros desde la lógica del DNA Carousel.

   Ajusta CONFIG para la física. Las imágenes y los textos vienen
   de src/data/proyectos.js.
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Parámetros ajustables
     ------------------------------------------------------- */
  const CONFIG = {
    cardWidth: 300,
    cardHeight: 396,
    gap: 30,
    radius: 18,

    curveDepth: 210,
    curveHeight: 68,
    helixSpread: 106,
    perspective: 1214,

    activeScale: 1,
    inactiveScale: 0.76,
    rotation: 32,
    tilt: 9,

    blur: 4.5,
    chroma: 3,
    inactiveOpacity: 0.4,

    dragSensitivity: 1.35,
    inertia: 0.93,
    snapStrength: 0.18,
    wheelSensitivity: 0.0025,

    autoPlay: true,
    autoSpeed: 0.22,
    autoPause: 2400,

    maxImages: 12,
    chromaA: 'rgba(238, 77, 159, 0.38)',
    chromaB: 'rgba(123, 71, 240, 0.38)',
    shadowColor: 'rgba(42, 11, 82, 0.36)'
  };

  /* -------------------------------------------------------
     Proyectos del carrusel.
     El contenido vive en src/data/proyectos.js. Cada ficha es
     un enlace real a su página, así que el carrusel no abre
     ningún diálogo ni necesita lógica de modal.
     ------------------------------------------------------- */
  const projectsSource = Array.isArray(window.PROYECTOS) ? window.PROYECTOS : [];

  const GIFTS = projectsSource
    .filter((item) => item && item.id && typeof item.cover === 'string' && item.cover.trim())
    .map((item) => ({
      id: item.id,
      href: item.href || `proyectos/${item.id}.html`,
      src: item.cover,
      text: item.title || item.shortTitle || item.id,
      category: item.category || '',
      tag: item.category || '',
      year: item.year || '',
      alt: item.coverAlt || item.title || item.id
    }));

  /* -------------------------------------------------------
     Utilidades
     ------------------------------------------------------- */
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function wrap(value, length) {
    if (length <= 0) return 0;
    const result = value % length;
    return result < 0 ? result + length : result;
  }

  function shortestDistance(index, position, count) {
    let distance = index - position;
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    return distance;
  }

  const easeOutCubic = (value) => {
    const t = clamp(value, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  };

  const pad2 = (value) => String(value).padStart(2, '0');

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  let instanceCount = 0;

  /* -------------------------------------------------------
     Carrusel
     ------------------------------------------------------- */
  class GiftsCarousel {
    constructor(root) {
      this.root = root;
      this.stage = root.querySelector('[data-gifts-stage]');
      this.live = root.querySelector('[data-gifts-live]');
      this.scope = root.closest('.gifts__orbit') || root.parentElement || root;
      this.countEl = this.scope.querySelector('[data-gifts-count]');
      this.prevBtn = this.scope.querySelector('[data-gifts-prev]');
      this.nextBtn = this.scope.querySelector('[data-gifts-next]');
      this.uid = `gift${++instanceCount}`;
      this.images = Array.isArray(GIFTS)
        ? GIFTS.filter((item) => item && item.id && typeof item.src === 'string' && item.src.trim()).slice(0, CONFIG.maxImages)
        : [];

      if (!this.stage || !this.images.length) {
        root.hidden = true;
        return;
      }

      this.cards = [];
      this.position = 0;
      this.velocity = 0;
      this.dragging = false;
      this.pointerId = null;
      this.startX = 0;
      this.startPosition = 0;
      this.lastX = 0;
      this.lastPointerTime = 0;
      this.keyTarget = null;
      this.lastInteraction = 0;
      this.hovered = false;
      this.focused = false;
      this.activeIndex = -1;
      this.metrics = null;
      this.raf = null;
      this.lastFrame = 0;
      this.dragMoved = false;
      this.suppressClick = false;
      this.visible = !('IntersectionObserver' in window);
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      this.root.style.setProperty('--gift-perspective', `${CONFIG.perspective}px`);
      this.build();
      this.bind();
      this.measure();
      this.render();
      this.observe();
      this.start();
    }

    /* --- Markup --- */
    build() {
      const total = this.images.length;
      this.stage.innerHTML = this.images.map((item, index) => {
        const title = item.text || item.alt || `Proyecto ${index + 1}`;
        const alt = item.alt || title;
        const loading = index < 3 ? 'eager' : 'lazy';
        const meta = [item.category, item.year].filter(Boolean).join(' · ');
        const label = `Ver proyecto ${title}${item.category ? `, ${item.category}` : ''}`;
        const href = item.href || `proyectos/${item.id}.html`;
        return `<a class="gift-card" id="${this.uid}-${index}"
          href="${escapeHTML(href)}"
          data-index="${index}" data-project-id="${escapeHTML(item.id)}"
          data-active="${index === 0 ? 'true' : 'false'}"
          data-cursor="ver"
          draggable="false" aria-label="${escapeHTML(label)}">
          <span class="gift-card__frame">
            <img src="${escapeHTML(item.src)}" alt="${escapeHTML(alt)}" loading="${loading}" decoding="async" draggable="false">
            <span class="gift-card__overlay" aria-hidden="true">
              <span class="gift-card__category">${escapeHTML(meta)}</span>
              <span class="gift-card__title">${escapeHTML(title)}</span>
              <span class="gift-card__cta">ver proyecto ↗</span>
            </span>
          </span>
        </a>`;
      }).join('');
      this.cards = Array.from(this.stage.querySelectorAll('.gift-card'));
      this.frames = Array.from(this.stage.querySelectorAll('.gift-card__frame'));
      if (this.countEl) this.countEl.textContent = `01 / ${pad2(total)}`;
    }

    /* --- Medidas responsive --- */
    measure() {
      const first = this.cards[0];
      const width = first ? first.offsetWidth : CONFIG.cardWidth;
      const scale = width / CONFIG.cardWidth;
      this.metrics = {
        width,
        travel: width + CONFIG.gap * scale,
        depth: CONFIG.curveDepth * scale,
        curve: CONFIG.curveHeight * scale,
        spread: CONFIG.helixSpread * scale
      };
    }

    /* --- Render de la hélice --- */
    render() {
      if (!this.cards.length || !this.metrics) return;

      const count = this.cards.length;
      const position = wrap(this.position, count);
      const maxVisibleDistance = Math.max(3, Math.ceil(count / 2));
      const { depth, curve, spread, travel } = this.metrics;

      this.cards.forEach((card, index) => {
        const distance = shortestDistance(index, position, count);
        const absolute = Math.abs(distance);
        const normalized = clamp(absolute / maxVisibleDistance, 0, 1);

        const phase = distance * Math.PI * 0.48;
        const wave = Math.sin(phase);
        const depthWave = Math.cos(phase);
        const strand = index % 2 === 0 ? 1 : -1;

        const x = distance * travel * 0.72;
        const y = wave * curve * strand;
        const z = depthWave * depth;
        const strandY = strand * spread * Math.cos(phase * 0.5) * 0.5;
        const rotateY = depthWave * CONFIG.rotation * strand;
        const rotateZ = wave * CONFIG.tilt * strand;
        const rotateX = wave * CONFIG.tilt * 0.35;

        const activeAmount = clamp(1 - absolute, 0, 1);
        const smoothActive = easeOutCubic(activeAmount);
        const scale = CONFIG.inactiveScale + (CONFIG.activeScale - CONFIG.inactiveScale) * smoothActive;
        const opacity = CONFIG.inactiveOpacity + (1 - CONFIG.inactiveOpacity) * smoothActive;

        const depthNormalized = clamp((z + depth) / (depth * 2), 0, 1);
        const zScale = 0.88 + depthNormalized * 0.12;
        const finalScale = scale * zScale;

        const blurAmount = CONFIG.blur * normalized * (1 - smoothActive);
        const chroma = CONFIG.chroma * normalized * (1 - smoothActive);
        const zIndex = Math.round(100 - absolute * 10 + depthWave * 4);

        card.style.transform = `translate3d(${x.toFixed(2)}px, ${(y + strandY).toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${finalScale.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(zIndex);

        let filter = `blur(${blurAmount.toFixed(2)}px) `;
        if (chroma > 0.02) {
          filter += `drop-shadow(${-chroma.toFixed(2)}px 0 0 ${CONFIG.chromaA}) `;
          filter += `drop-shadow(${chroma.toFixed(2)}px 0 0 ${CONFIG.chromaB}) `;
        }
        filter += `drop-shadow(0 ${(8 + smoothActive * 10).toFixed(1)}px ${(18 + smoothActive * 15).toFixed(1)}px ${CONFIG.shadowColor})`;
        if (this.frames[index]) this.frames[index].style.filter = filter;

        const isActive = absolute < 0.5;
        card.dataset.active = isActive ? 'true' : 'false';
      });

      const active = ((Math.round(position) % count) + count) % count;
      if (active !== this.activeIndex) {
        this.activeIndex = active;
        const item = this.images[active];
        const title = item.text || item.alt || `Proyecto ${active + 1}`;
        if (this.live) {
          this.live.textContent = `Proyecto ${active + 1} de ${count}: ${title}`;
        }
        if (this.countEl) {
          this.countEl.textContent = `${pad2(active + 1)} / ${pad2(count)}`;
        }
        this.cards.forEach((card, index) => {
          card.setAttribute('aria-current', index === active ? 'true' : 'false');
        });
      }
    }

    /* --- Bucle de animación --- */
    tick = (now) => {
      this.raf = window.requestAnimationFrame(this.tick);
      if (!this.visible || this.reducedMotion.matches) {
        this.lastFrame = now;
        return;
      }

      const dt = clamp((now - (this.lastFrame || now)) / 1000, 0, 0.05);
      this.lastFrame = now;

      if (this.dragging) return;

      const autoActive = CONFIG.autoPlay
        && now - this.lastInteraction > CONFIG.autoPause
        && !this.focused;

      if (autoActive) {
        this.position += CONFIG.autoSpeed * dt;
        this.velocity = 0;
        this.keyTarget = null;
      } else if (this.keyTarget !== null) {
        const difference = this.keyTarget - this.position;
        const amount = 1 - Math.exp(-12 * dt);
        this.position += difference * amount;
        this.velocity = 0;
        if (Math.abs(difference) < 0.001) {
          this.position = this.keyTarget;
          this.keyTarget = null;
        }
      } else {
        if (Math.abs(this.velocity) > 0.0001) {
          this.position += this.velocity * dt;
          this.velocity *= Math.pow(CONFIG.inertia, dt * 60);
        }

        if (Math.abs(this.velocity) < 0.03) {
          const target = Math.round(this.position);
          const difference = target - this.position;
          const amount = 1 - Math.exp(-CONFIG.snapStrength * 60 * dt);
          this.position += difference * amount;
          if (Math.abs(difference) < 0.0005) {
            this.position = target;
            this.velocity = 0;
          }
        }
      }

      this.render();
    };

    start() {
      if (this.raf || this.reducedMotion.matches) return;
      this.lastFrame = performance.now();
      this.raf = window.requestAnimationFrame(this.tick);
    }

    stop() {
      if (this.raf) window.cancelAnimationFrame(this.raf);
      this.raf = null;
    }

    /* --- Observadores --- */
    observe() {
      if ('IntersectionObserver' in window) {
        this.io = new IntersectionObserver((entries) => {
          this.visible = Boolean(entries[0] && entries[0].isIntersecting);
          if (this.visible) this.lastFrame = performance.now();
        }, { threshold: 0 });
        this.io.observe(this.root);
      }

      if ('ResizeObserver' in window) {
        this.ro = new ResizeObserver(() => {
          this.measure();
          this.render();
        });
        this.ro.observe(this.root);
      }

      this.onMotionChange = () => {
        if (this.reducedMotion.matches) {
          this.stop();
          this.position = Math.round(this.position);
          this.velocity = 0;
          this.keyTarget = null;
          this.render();
        } else {
          this.start();
        }
      };
      this.reducedMotion.addEventListener('change', this.onMotionChange);
    }

    /* --- Interacciones --- */
    bind() {
      this.root.addEventListener('pointerdown', (event) => this.onPointerDown(event));
      window.addEventListener('pointermove', (event) => this.onPointerMove(event), { passive: false });
      window.addEventListener('pointerup', (event) => this.onPointerUp(event));
      window.addEventListener('pointercancel', (event) => this.onPointerUp(event));

      this.root.addEventListener('wheel', (event) => this.onWheel(event), { passive: false });
      this.root.addEventListener('keydown', (event) => this.onKeyDown(event));

      this.root.addEventListener('pointerenter', () => { this.hovered = true; });
      this.root.addEventListener('pointerleave', () => { this.hovered = false; });
      this.root.addEventListener('focusin', (event) => {
        this.focused = Boolean(event.target.matches(':focus-visible'));
      });
      this.root.addEventListener('focusout', (event) => {
        if (!this.root.contains(event.relatedTarget)) this.focused = false;
      });

      this.stage.addEventListener('click', (event) => this.onStageClick(event));

      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.step(-1));
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.step(1));
    }

    onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      const trigger = event.target.closest('[data-project-id]');
      this.dragging = true;
      this.pointerId = event.pointerId;
      this.startX = event.clientX;
      this.startPosition = this.position;
      this.lastX = event.clientX;
      this.lastPointerTime = performance.now();
      this.dragMoved = false;
      this.suppressClick = false;
      this.velocity = 0;
      this.keyTarget = null;
      this.lastInteraction = performance.now();

      this.root.classList.add('is-dragging');
      if (!trigger) this.root.focus({ preventScroll: true });
    }

    onPointerMove(event) {
      if (!this.dragging || event.pointerId !== this.pointerId) return;

      const now = performance.now();
      const dx = event.clientX - this.startX;
      const travel = Math.max(1, this.metrics ? this.metrics.travel : CONFIG.cardWidth + CONFIG.gap);

      if (Math.abs(dx) > 10) this.dragMoved = true;
      this.position = this.startPosition - (dx / travel) * CONFIG.dragSensitivity;

      if (
        Math.abs(dx) > 10
        && this.pointerId !== null
        && this.root.hasPointerCapture
        && !this.root.hasPointerCapture(this.pointerId)
      ) {
        try {
          this.root.setPointerCapture(this.pointerId);
        } catch (error) {
          /* No pasa nada si el navegador no permite capturar el puntero. */
        }
      }

      const deltaX = event.clientX - this.lastX;
      const deltaTime = Math.max(1, now - this.lastPointerTime);
      const instantVelocity = (-(deltaX / travel) / (deltaTime / 1000)) * CONFIG.dragSensitivity;
      this.velocity = this.velocity * 0.72 + instantVelocity * 0.28;
      this.velocity = clamp(this.velocity, -3.2, 3.2);

      this.lastX = event.clientX;
      this.lastPointerTime = now;
      this.lastInteraction = now;

      this.render();
      if (Math.abs(dx) > 10 && event.pointerType !== 'touch') event.preventDefault();
    }

    onPointerUp(event) {
      if (!this.dragging) return;
      if (event && event.pointerId !== this.pointerId) return;

      const cancelled = event && event.type === 'pointercancel';

      this.dragging = false;
      this.root.classList.remove('is-dragging');

      if (this.pointerId !== null && this.root.hasPointerCapture && this.root.hasPointerCapture(this.pointerId)) {
        try {
          this.root.releasePointerCapture(this.pointerId);
        } catch (error) {
          /* Ignora si la captura ya se liberó. */
        }
      }

      this.pointerId = null;
      this.velocity = clamp(this.velocity, -2.5, 2.5);
      this.lastInteraction = performance.now();

      this.suppressClick = this.dragMoved && !cancelled;
      if (this.suppressClick) {
        window.setTimeout(() => { this.suppressClick = false; }, 180);
      }

      if (this.reducedMotion.matches) {
        this.position = Math.round(this.position);
        this.velocity = 0;
        this.render();
      }
    }

    onStageClick(event) {
      const trigger = event.target.closest('[data-project-id]');
      if (!trigger) return;

      if (this.suppressClick) {
        this.suppressClick = false;
        event.preventDefault();
        event.stopPropagation();
      }
    }

    onWheel(event) {
      // solo intercepta la rueda sobre las tarjetas; el resto del lienzo deja bajar la página
      if (!event.target.closest || !event.target.closest('.gift-card')) return;

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 0.01) return;

      event.preventDefault();
      this.position += delta * CONFIG.wheelSensitivity * CONFIG.dragSensitivity;
      this.lastInteraction = performance.now();
      this.keyTarget = null;

      if (this.reducedMotion.matches) {
        this.position = Math.round(this.position);
        this.velocity = 0;
      } else {
        this.velocity += delta * 0.00035 * CONFIG.dragSensitivity;
        this.velocity = clamp(this.velocity, -1.8, 1.8);
      }

      this.render();
    }

    onKeyDown(event) {
      let direction = 0;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') direction = 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') direction = -1;
      if (!direction) return;

      event.preventDefault();
      this.step(direction);
    }

    step(direction) {
      const base = this.keyTarget !== null ? this.keyTarget : Math.round(this.position);
      this.keyTarget = base + direction;
      this.velocity = 0;
      this.lastInteraction = performance.now();

      if (this.reducedMotion.matches) {
        this.position = this.keyTarget;
        this.keyTarget = null;
        this.render();
      }
    }
  }

  /* -------------------------------------------------------
     Inicialización
     ------------------------------------------------------- */
  function init() {
    document.querySelectorAll('[data-gifts]').forEach((root) => {
      if (root.giftsCarousel) return;
      root.giftsCarousel = new GiftsCarousel(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.GiftsCarousel = { init, CONFIG, GIFTS };
})();
