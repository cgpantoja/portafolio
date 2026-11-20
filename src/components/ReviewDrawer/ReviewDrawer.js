/* =========================================================
   ReviewDrawer — cajón de reseñas papercraft
   Componente vanilla autocontenido (sin dependencias, sin build).
   Se registra como <review-drawer> y también expone
   window.ReviewDrawer.create({ reviews }).

   Edita COLORS y SPRING para personalizar.
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Colores (arriba del archivo, fáciles de cambiar)
     ------------------------------------------------------- */
  const COLORS = {
    canvas: '#9EE388',
    drawer: '#7A2BD0',
    drawerShadow: '#5A1FA0',
    drawerTop: '#8B3BDF',
    drawerDeep: '#5A1FA0',
    lime: '#B9ED1C',
    violet: '#7B47F0',
    pink: '#EE4D9F',
    orange: '#F5821A',
    purple: '#A80BE8',
    dark: '#2A0B52',
    light: '#FFFDF7',
    cream: '#F5F1E6'
  };

  /* -------------------------------------------------------
     Física de las fichas (spring real, no easing lineal)
     ------------------------------------------------------- */
  const SPRING = { stiffness: 320, damping: 28, mass: 1 };
  const EXIT_SPRING = { stiffness: 300, damping: 30, mass: 1 };
  const TAB_SPRING = { stiffness: 320, damping: 28, mass: 1 };

  const CONFIG = {
    maxReviews: 8,
    swipeThreshold: 48,
    cardTravel: 148,
    cardHiddenScale: 0.94,
    tilt: 4,
    hoverLift: 10,
    text: { duration: 340, delay: 90, distance: 14 }
  };

  const COLOR_CYCLE = ['lime', 'violet', 'pink', 'orange', 'purple'];

  /* -------------------------------------------------------
     Reseñas (4 en español)
     ------------------------------------------------------- */
  const RAW_REVIEWS = [
    {
      id: 'peak-daniela',
      name: 'Daniela Porras',
      role: 'Cofundadora',
      company: 'PĒAK',
      rating: 5,
      color: 'lime',
      text: 'Caro logró darle vida a todas esas ideas locas que teníamos en mente y convertirlas en una identidad de marca auténtica y llena de personalidad. PĒAK nació de ideas sueltas, sueños y mucha ilusión, pero gracias a su talento, creatividad y dedicación, todo tomó forma de la mejor manera. No pudimos elegir mejores manos para darle vida a nuestra marca.'
    },
    {
      id: 'compa-carrera-stephanie',
      name: 'Stephannie Castro',
      role: 'Compañera de carrera',
      company: 'Diseño Gráfico, UNAL',
      rating: 5,
      color: 'violet',
      text: 'Necesitamos más creadores como Caro, que devuelvan al mundo el color y exploten las capacidades gráficas de la imagen con frescura y originalidad, por ello creo que trabajar con ella resulta muy enriquecedor.'
    },
    {
      id: 'compa-laura',
      name: 'Laura Ortiz',
      role: 'Compañera',
      company: '',
      rating: 5,
      color: 'pink',
      text: 'Es una experiencia muy agradable trabajar con Caro, trae tanto buenas ideas como un ambiente positivo, lo que permite que la creación de proyectos en conjunto sea eficiente y divertida.'
    },
    {
      id: 'profesor-jorge',
      name: 'Jorge Malagón',
      role: 'Profesor de Taller de Orientación y Diseño de Información',
      company: '',
      rating: 5,
      color: 'orange',
      text: 'La complejidad en las narrativas que construyes se reflejaba en las piezas que tuvimos la oportunidad de desarrollar en el taller. En el presente, en redes, hay una personalidad, un espíritu, un tono particular. En diseño, qué difícil es llegar a eso: que el tono particular del diseñador se sienta en su obra, así como en sus expresiones comunicativas. No es un tema de personalidad, es un tema de cómo hilar y volver eso un discurso real, emocional, que permita conectar.'
    }
  ];

  /* -------------------------------------------------------
     Utilidades
     ------------------------------------------------------- */
  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

  const pad2 = (value) => String(value).padStart(2, '0');

  function colorKey(color, index) {
    if (COLOR_CYCLE.includes(color)) return color;
    return COLOR_CYCLE[index % COLOR_CYCLE.length];
  }

  const starGlyphs = (rating) => {
    const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    let html = '';
    for (let i = 1; i <= 5; i += 1) {
      html += `<span class="rd-star${i <= filled ? ' is-filled' : ''}" aria-hidden="true">★</span>`;
    }
    return { filled, html };
  };

  function starsHTML(rating, options = {}) {
    const { hidden = false, className = '' } = options;
    const { filled, html } = starGlyphs(rating);
    const label = hidden
      ? 'aria-hidden="true"'
      : `role="img" aria-label="${filled} de 5 estrellas"`;
    return `<span class="rd-stars ${className}" ${label}>${html}</span>`;
  }

  /* -------------------------------------------------------
     Avatares dibujados (data URI, sin red)
     Reemplaza review.avatar por una URL si prefieres fotos.
     ------------------------------------------------------- */
  const AVATAR_BG = ['#5A1FA0', '#7A2BD0', '#A80BE8', '#2A0B52', '#7B47F0', '#EE4D9F'];
  const AVATAR_SKIN = ['#F0C29B', '#C98B62', '#8D5A3B', '#F2D0B0', '#A86B47', '#6E442E'];
  const AVATAR_HAIR = ['#2A0B52', '#1B1B1B', '#5A1FA0', '#3B1F1B', '#7A2BD0', '#141414'];
  const AVATAR_SHIRT = ['#B9ED1C', '#F5821A', '#EE4D9F', '#7B47F0', '#FFFDF7', '#B9ED1C'];

  function hairPath(index, color) {
    const variants = [
      `<path d="M29 39c0-12 8-20 19-20s19 8 19 20c0 1.8-.5 3.5-1.4 5-1.8-7.4-8.5-12-17.6-12S32.2 36.6 30.4 44c-.9-1.5-1.4-3.2-1.4-5Z" fill="${color}"/>`,
      `<path d="M28 39c0-13 9-21 20-21s20 8 20 21c-2-5-7-8-12-8-3 0-5 2-8 2s-5-2-8-2c-5 0-10 3-12 8Z" fill="${color}"/><circle cx="48" cy="14" r="6" fill="${color}"/>`,
      `<path d="M27 38c0-13 9-21 21-21s21 8 21 21v22c-3-2-5-6-5-11-2-6-8-10-16-10s-14 4-16 10c0 5-2 9-5 11Z" fill="${color}"/>`,
      `<path d="M30 40c0-12 8-19 18-19s18 7 18 19c-2-5-7-8-12-8-2 0-3 2-6 2s-4-2-6-2c-5 0-10 3-12 8Z" fill="${color}"/><path d="M27 40c0-13 9-21 21-21 2 0 4 0 6 1-10 2-17 9-19 20-2-1-5-1-8 0Z" fill="${color}"/>`,
      `<circle cx="35" cy="26" r="7" fill="${color}"/><circle cx="44" cy="21" r="7" fill="${color}"/><circle cx="54" cy="21" r="7" fill="${color}"/><circle cx="62" cy="26" r="7" fill="${color}"/><path d="M28 39c0-12 9-20 20-20s20 8 20 20c-3-6-10-9-20-9s-17 3-20 9Z" fill="${color}"/>`,
      `<path d="M29 39c0-12 8-20 19-20s19 8 19 20c0 3-1 5-2 7-1-6-4-9-9-10-4-1-7-4-8-7-3 5-7 8-13 9-3 1-5 3-5 6-1-2-1-4-1-5Z" fill="${color}"/>`
    ];
    return variants[index % variants.length];
  }

  function avatarData(index, seed) {
    const bg = AVATAR_BG[index % AVATAR_BG.length];
    const skin = AVATAR_SKIN[index % AVATAR_SKIN.length];
    const hair = AVATAR_HAIR[index % AVATAR_HAIR.length];
    const shirt = AVATAR_SHIRT[index % AVATAR_SHIRT.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><clipPath id="c${index}"><circle cx="48" cy="48" r="48"/></clipPath></defs><g clip-path="url(#c${index})"><rect width="96" height="96" fill="${bg}"/><path d="M16 96c0-19 14-31 32-31s32 12 32 31Z" fill="${shirt}"/><circle cx="48" cy="41" r="19" fill="${skin}"/><circle cx="41" cy="41" r="1.6" fill="${COLORS.dark}"/><circle cx="55" cy="41" r="1.6" fill="${COLORS.dark}"/><path d="M43 48c1.5 1.3 3.2 2 5 2s3.5-.7 5-2" fill="none" stroke="${COLORS.dark}" stroke-width="1.8" stroke-linecap="round"/>${hairPath(index, hair)}</g></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  const DEFAULT_REVIEWS = RAW_REVIEWS.map((review, index) => ({
    ...review,
    avatar: avatarData(index, review.name)
  }));

  /* -------------------------------------------------------
     Plantillas
     ------------------------------------------------------- */
  let instanceCount = 0;

  function cardTemplate(review, index, uid) {
    const color = colorKey(review.color, index);
    return `<article class="rd-card rd-card--${color}" id="rd-panel-${uid}-${index}" role="tabpanel" aria-labelledby="rd-tab-${uid}-${index}" tabindex="0" data-index="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">
      <div class="rd-card__tab">
        <span class="rd-card__tab-name">${esc(review.name)}</span>
        ${starsHTML(review.rating, { hidden: true, className: 'rd-stars--small' })}
      </div>
      <div class="rd-card__body">
        <div class="rd-card__content">
          <div class="rd-card__meta">
            ${starsHTML(review.rating, { className: 'rd-stars--big' })}
            <span class="rd-card__meta-label">Reseña verificada</span>
          </div>
          <blockquote class="rd-card__quote">“${esc(review.text)}”</blockquote>
          <footer class="rd-card__author">
            <img class="rd-card__avatar" src="${esc(review.avatar)}" alt="" width="52" height="52" loading="lazy" decoding="async">
            <span class="rd-card__who">
              <strong>${esc(review.name)}</strong>
              <span>${esc(review.role)}${review.company ? ` · ${esc(review.company)}` : ''}</span>
            </span>
          </footer>
        </div>
      </div>
    </article>`;
  }

  function tabTemplate(review, index, total, uid) {
    const color = colorKey(review.color, index);
    const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));
    return `<button class="rd-tab rd-tab--${color}${index === 0 ? ' is-active' : ''}" id="rd-tab-${uid}-${index}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="rd-panel-${uid}-${index}" aria-label="${esc(review.name)}, ${rating} de 5 estrellas, reseña ${index + 1} de ${total}" tabindex="${index === 0 ? 0 : -1}" data-index="${index}" data-cursor="abrir" style="--rd-i:${index}">
      <span class="rd-tab__folder" aria-hidden="true"></span>
      <span class="rd-tab__name">${esc(review.name)}</span>
      ${starsHTML(review.rating, { hidden: true, className: 'rd-stars--tab' })}
    </button>`;
  }

  function buildTemplate(reviews, uid) {
    const total = reviews.length;
    return `<div class="rd">
      <div class="rd__stage">
        <div class="rd__cards" data-cards>
          ${reviews.map((review, index) => cardTemplate(review, index, uid)).join('')}
        </div>
        <div class="rd__drawer" data-drawer>
          <div class="rd__rim" aria-hidden="true"></div>
          <div class="rd__body">
            <div class="rd__opening">
              <div class="rd__tabs" role="tablist" aria-label="Elige una reseña" aria-orientation="vertical" data-tabs>
                ${reviews.map((review, index) => tabTemplate(review, index, total, uid)).join('')}
              </div>
            </div>
            <div class="rd__front">
              <button class="rd__plate" type="button" data-next data-cursor="abrir" aria-label="Ver más reseñas">
                <span class="rd__plate-label">Ver más reseñas</span>
                <span class="rd__plate-count" data-count>01 / ${pad2(total)}</span>
                <span class="rd__plate-arrow" aria-hidden="true">→</span>
              </button>
              <div class="rd__handle" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
      <p class="rd__status rd-sr-only" aria-live="polite" data-status></p>
    </div>`;
  }

  /* -------------------------------------------------------
     Motor de spring (integración numérica real)
     ------------------------------------------------------- */
  function createAnimator() {
    const running = new Map();

    function stop(key) {
      const item = running.get(key);
      if (!item) return;
      item.cancelled = true;
      cancelAnimationFrame(item.raf);
      running.delete(key);
    }

    function spring(key, from, to, config, onUpdate, onComplete) {
      stop(key);
      let value = from;
      let velocity = config.velocity || 0;
      let last = performance.now();
      const item = { raf: 0, cancelled: false };
      running.set(key, item);

      function frame(now) {
        if (item.cancelled) return;
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;
        const stiffness = config.stiffness || 300;
        const damping = config.damping || 26;
        const mass = config.mass || 1;
        const acceleration = (-stiffness * (value - to) - damping * velocity) / mass;
        velocity += acceleration * dt;
        value += velocity * dt;

        if (Math.abs(velocity) < 0.02 && Math.abs(value - to) < 0.05) {
          running.delete(key);
          onUpdate(to);
          if (onComplete) onComplete();
          return;
        }
        onUpdate(value);
        item.raf = requestAnimationFrame(frame);
      }

      item.raf = requestAnimationFrame(frame);
    }

    return { stop, spring };
  }

  /* -------------------------------------------------------
     Montaje e interacciones de una instancia
     ------------------------------------------------------- */
  function init(root, reviews) {
    const cardsEl = root.querySelector('[data-cards]');
    const cards = Array.from(root.querySelectorAll('.rd-card'));
    const tabs = Array.from(root.querySelectorAll('.rd-tab'));
    const tablist = root.querySelector('[data-tabs]');
    const plate = root.querySelector('[data-next]');
    const countEl = root.querySelector('[data-count]');
    const statusEl = root.querySelector('[data-status]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const animator = createAnimator();
    const cardState = new WeakMap();
    const tabLift = new WeakMap();
    const total = reviews.length;
    let index = 0;
    let uid = 0;
    let swipeStart = null;

    const cardKey = (card) => `rd-card-${card.dataset.index}`;
    const tabKey = (tab) => `rd-tab-${tab.dataset.index}`;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    function syncStageHeight() {
      const card = cards[index];
      if (!card) return;
      cardsEl.style.height = `${card.offsetHeight}px`;
    }

    function applyCard(card, progress) {
      const raw = progress;
      const visible = clamp(raw, 0, 1);
      const y = (1 - raw) * CONFIG.cardTravel;
      const scale = CONFIG.cardHiddenScale + (1 - CONFIG.cardHiddenScale) * raw;
      card.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${Math.max(0.8, scale).toFixed(4)}) rotateX(${CONFIG.tilt}deg)`;
      card.style.opacity = String(visible);
      card.style.setProperty('--rd-p', visible.toFixed(3));
      cardState.set(card, { progress: raw });
    }

    function revealContent(card, instant) {
      const content = card.querySelector('.rd-card__content');
      if (!content) return;
      if (content.getAnimations) content.getAnimations().forEach((animation) => animation.cancel());

      if (instant || reduceMotion.matches || typeof content.animate !== 'function') {
        content.style.opacity = '1';
        content.style.transform = 'none';
        return;
      }

      content.style.opacity = '';
      content.style.transform = '';
      content.animate(
        [
          { opacity: 0, transform: `translateY(${CONFIG.text.distance}px)` },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: CONFIG.text.duration,
          delay: CONFIG.text.delay,
          easing: 'cubic-bezier(.16,1,.3,1)',
          fill: 'both'
        }
      );
    }

    function updateMeta(current) {
      const review = reviews[current];
      const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));
      tabs.forEach((tab, i) => {
        const active = i === current;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      if (countEl) countEl.textContent = `${pad2(current + 1)} / ${pad2(total)}`;
      if (statusEl) {
        statusEl.textContent = `Reseña ${current + 1} de ${total}: ${review.name}. ${rating} de 5 estrellas.`;
      }
      if (plate) {
        const next = reviews[(current + 1) % total];
        plate.setAttribute(
          'aria-label',
          total > 1
            ? `Ver más reseñas. Siguiente: ${next.name}. Reseña ${current + 1} de ${total}.`
            : `Reseña ${current + 1} de ${total}.`
        );
        plate.disabled = total < 2;
      }
    }

    function select(nextIndex, options = {}) {
      const { focusTab = false, instant = false } = options;
      if (!total) return;
      const next = ((nextIndex % total) + total) % total;
      if (next === index && !instant) {
        if (focusTab) tabs[next].focus();
        return;
      }

      const previous = index;
      index = next;
      updateMeta(index);

      const outgoing = cards[previous];
      const incoming = cards[index];
      const instantMode = instant || reduceMotion.matches;

      if (outgoing && outgoing !== incoming) {
        animator.stop(cardKey(outgoing));
        outgoing.inert = true;
        outgoing.setAttribute('aria-hidden', 'true');
        outgoing.style.zIndex = '20';
        if (instantMode) {
          applyCard(outgoing, 0);
          outgoing.style.visibility = 'hidden';
        } else {
          animator.spring(
            cardKey(outgoing),
            cardState.get(outgoing)?.progress ?? 1,
            0,
            EXIT_SPRING,
            (progress) => applyCard(outgoing, progress),
            () => { outgoing.style.visibility = 'hidden'; }
          );
        }
      }

      if (incoming) {
        animator.stop(cardKey(incoming));
        incoming.style.visibility = 'visible';
        incoming.style.zIndex = '30';
        incoming.inert = false;
        incoming.removeAttribute('aria-hidden');

        if (instantMode) {
          applyCard(incoming, 1);
          revealContent(incoming, true);
        } else {
          animator.spring(
            cardKey(incoming),
            cardState.get(incoming)?.progress ?? 0,
            1,
            SPRING,
            (progress) => applyCard(incoming, progress)
          );
          revealContent(incoming, false);
        }
      }

      syncStageHeight();

      if (focusTab) tabs[index].focus();
    }

    function animateTab(tab, target) {
      if (!canHover || reduceMotion.matches) {
        tab.style.setProperty('--rd-lift', '0px');
        return;
      }
      const from = tabLift.get(tab) || 0;
      animator.spring(tabKey(tab), from, target, TAB_SPRING, (value) => {
        tabLift.set(tab, value);
        tab.style.setProperty('--rd-lift', `${value.toFixed(2)}px`);
      });
    }

    /* Estado inicial: primera reseña fuera, el resto dentro */
    cards.forEach((card, i) => {
      const active = i === 0;
      card.style.visibility = active ? 'visible' : 'hidden';
      card.style.zIndex = active ? '30' : '1';
      card.inert = !active;
      card.setAttribute('aria-hidden', String(!active));
      applyCard(card, active ? 1 : 0);
      const content = card.querySelector('.rd-card__content');
      if (content) {
        content.style.opacity = active ? '1' : '0';
        content.style.transform = 'none';
      }
    });
    updateMeta(0);
    syncStageHeight();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncStageHeight).catch(() => {});
    }

    let stageFrame = 0;
    window.addEventListener('resize', () => {
      window.cancelAnimationFrame(stageFrame);
      stageFrame = window.requestAnimationFrame(syncStageHeight);
    }, { passive: true });

    /* Click / teclado en pestañas */
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('pointerenter', () => animateTab(tab, -CONFIG.hoverLift));
      tab.addEventListener('pointerleave', () => animateTab(tab, 0));
      tab.addEventListener('blur', () => animateTab(tab, 0));
    });

    tablist.addEventListener('keydown', (event) => {
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = total - 1;
      select(next, { focusTab: true });
    });

    /* Flechas cuando el foco está en la ficha o en la placa */
    root.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) return;
      if (event.target.closest('.rd__tabs')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        select(index + 1, { focusTab: true });
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        select(index - 1, { focusTab: true });
      }
    });

    plate.addEventListener('click', () => select(index + 1));

    /* Swipe horizontal en móvil */
    cardsEl.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    });
    cardsEl.addEventListener('pointerup', (event) => {
      if (!swipeStart || event.pointerId !== swipeStart.id) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      swipeStart = null;
      if (Math.abs(dx) > CONFIG.swipeThreshold && Math.abs(dx) > Math.abs(dy) * 1.2) {
        select(index + (dx < 0 ? 1 : -1));
      }
    });
    cardsEl.addEventListener('pointercancel', () => { swipeStart = null; });

    return {
      reviews,
      select,
      next: () => select(index + 1),
      prev: () => select(index - 1),
      index: () => index,
      root
    };
  }

  /* -------------------------------------------------------
     API pública + custom element
     ------------------------------------------------------- */
  function createReviewDrawer(options = {}) {
    const source = Array.isArray(options.reviews) && options.reviews.length
      ? options.reviews
      : DEFAULT_REVIEWS;
    const max = Math.max(1, Math.min(Number(options.max) || CONFIG.maxReviews, CONFIG.maxReviews));
    const reviews = source.slice(0, max).map((review, index) => ({
      ...review,
      color: colorKey(review.color, index),
      avatar: review.avatar || avatarData(index, review.name)
    }));
    const uid = `rda${++instanceCount}`;
    const template = document.createElement('template');
    template.innerHTML = buildTemplate(reviews, uid).trim();
    const root = template.content.firstElementChild;
    const api = init(root, reviews);
    root.reviewDrawer = api;
    return root;
  }

  class ReviewDrawerElement extends HTMLElement {
    constructor() {
      super();
      this._reviews = null;
      this._api = null;
    }

    set reviews(value) {
      this._reviews = Array.isArray(value) && value.length ? value : null;
      if (this.isConnected) this.render();
    }

    get reviews() {
      return this._reviews || DEFAULT_REVIEWS;
    }

    connectedCallback() {
      if (!this._api) this.render();
    }

    render() {
      if (!this.isConnected) return;
      this._api = null;
      this.replaceChildren();
      const root = createReviewDrawer({ reviews: this._reviews || DEFAULT_REVIEWS });
      this.appendChild(root);
      this._api = root.reviewDrawer;
    }

    next() { if (this._api) this._api.next(); }
    prev() { if (this._api) this._api.prev(); }
  }

  /* Carga automática del CSS del componente si no está enlazado */
  const currentScript = document.currentScript;
  const cssHref = currentScript && currentScript.src
    ? new URL('ReviewDrawer.css', currentScript.src).href
    : 'ReviewDrawer.css';

  function ensureStyles() {
    if (document.querySelector('link[href*="ReviewDrawer.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.dataset.reviewDrawerCss = '';
    document.head.appendChild(link);
  }
  ensureStyles();

  if (!customElements.get('review-drawer')) {
    customElements.define('review-drawer', ReviewDrawerElement);
  }

  window.ReviewDrawer = {
    create: createReviewDrawer,
    DEFAULT_REVIEWS,
    COLORS,
    SPRING,
    CONFIG
  };
})();
