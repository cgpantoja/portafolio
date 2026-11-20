/* =========================================================
   Páginas de proyecto
   Rellena la plantilla con los datos de src/data/proyectos.js
   y añade tema, progreso y entradas suaves.
   ========================================================= */

(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const body = document.body;
  const root = body.dataset.root || '../';
  const projects = Array.isArray(window.PROYECTOS) ? window.PROYECTOS.filter((item) => item && item.id) : [];
  const project = projects.find((item) => item.id === body.dataset.project);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const escapeHTML = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  const pad2 = (value) => String(value).padStart(2, '0');

  function assetPath(path) {
    if (!path) return '';
    if (/^(https?:|data:|blob:|\/|\.\.\/)/i.test(path)) return path;
    return `${root}${String(path).replace(/^\.?\//, '')}`;
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value == null ? '' : String(value);
  }

  function titleMarkup(item) {
    const title = escapeHTML(item.title);
    const markValue = Object.prototype.hasOwnProperty.call(item, 'titleMark') ? item.titleMark : item.shortTitle;
    const mark = escapeHTML(markValue || '');
    if (mark && mark !== title && title.includes(mark)) {
      return title.replace(mark, `<em>${mark}</em>`);
    }
    return title;
  }

  /* -------------------------------------------------------
     Si el proyecto no existe o faltan los datos
     ------------------------------------------------------- */

  if (!project) {
    document.title = 'Proyecto no encontrado — Caro Creativa';
    const main = $('.project-main');
    if (main) {
      main.innerHTML = `
        <article class="project-article">
          <header class="project-hero">
            <p class="project-hero__meta"><span class="project-hero__index">404</span> Proyecto no encontrado</p>
            <h1 class="project-title">Este proyecto no existe.</h1>
            <p class="project-summary">Puede que el enlace esté mal escrito o que el proyecto haya cambiado de nombre.</p>
            <p style="margin-top:28px"><a class="project-nav__back" href="../index.html#trabajos"><span aria-hidden="true">←</span> Volver a todos los casos</a></p>
          </header>
        </article>`;
    }
    return;
  }

  /* -------------------------------------------------------
     Color de acento del proyecto
     ------------------------------------------------------- */

  document.documentElement.style.setProperty('--project-accent', project.accent || 'var(--lime)');
  document.documentElement.style.setProperty('--project-accent-ink', project.accentInk || 'var(--black)');
  document.documentElement.style.setProperty('--project-accent-secondary', project.accentSecondary || project.accent || 'var(--lime)');

  /* -------------------------------------------------------
     Metadatos de la página
     ------------------------------------------------------- */

  document.title = `${project.title} — Caro Creativa`;
  const description = project.summary || project.tagline || '';
  const metaDescription = $('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', description);
  const ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${project.title} — Caro Creativa`);
  const ogDescription = $('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);

  /* -------------------------------------------------------
     Cabecera
     ------------------------------------------------------- */

  setText('[data-project-order]', project.order || '');
  setText('[data-project-category]', project.category || '');
  setText('[data-project-type]', project.type || '');
  setText('[data-project-year]', project.year || '');
  setText('[data-project-tagline]', project.tagline || '');
  setText('[data-project-summary]', project.summary || '');

  const title = $('[data-project-title]');
  if (title) title.innerHTML = titleMarkup(project);

  const tags = $('[data-project-tags]');
  if (tags) {
    const items = [...new Set([project.category, project.type, project.year].filter(Boolean))];
    tags.innerHTML = items.map((item) => `<li>${escapeHTML(item)}</li>`).join('');
  }

  const cover = $('[data-project-cover]');
  if (cover) {
    cover.src = assetPath(project.cover);
    cover.alt = project.coverAlt || `Portada de ${project.title}`;
    cover.loading = 'eager';
    cover.decoding = 'async';

    if (project.coverLayout === 'portrait') {
      $('.project-hero-layout')?.classList.add('project-hero-layout--portrait');
      $('.project-cover')?.classList.add('project-cover--portrait');
    }
  }

  /* -------------------------------------------------------
     Introducción y ficha
     ------------------------------------------------------- */

  const intro = $('[data-project-intro]');
  if (intro) {
    const paragraphs = Array.isArray(project.intro) && project.intro.length
      ? project.intro
      : [project.summary || ''];
    intro.innerHTML = paragraphs
      .filter(Boolean)
      .map((paragraph) => {
        if (paragraph && typeof paragraph === 'object') {
          const cls = paragraph.highlight ? ' class="project-prose__highlight"' : '';
          return `<p${cls}>${escapeHTML(paragraph.text || '')}</p>`;
        }
        return `<p>${escapeHTML(paragraph)}</p>`;
      })
      .join('');
  }

  setText('[data-project-role]', project.facts && project.facts.role ? project.facts.role : '—');
  setText('[data-project-tools]', project.facts && project.facts.tools ? project.facts.tools : '—');
  setText('[data-project-duration]', project.facts && project.facts.duration ? project.facts.duration : '—');
  setText('[data-project-context]', project.facts && project.facts.context ? project.facts.context : '—');

  /* -------------------------------------------------------
     Prototipo interactivo (opcional)
     ------------------------------------------------------- */

  const prototypeSection = $('[data-project-prototype]');

  if (prototypeSection) {
    const prototype = project.prototype;

    if (prototype && prototype.embed) {
      prototypeSection.hidden = false;
      setText('[data-prototype-title]', prototype.title || 'Prototipo interactivo');
      setText('[data-prototype-desc]', prototype.description || '');

      const prototypeLink = $('[data-prototype-link]');
      if (prototypeLink) {
        prototypeLink.href = prototype.href || prototype.embed;
        prototypeLink.textContent = `${prototype.cta || 'Abrir en Figma'} ↗`;
      }

      const prototypeFrame = $('[data-prototype-iframe]');
      if (prototypeFrame) {
        prototypeFrame.src = prototype.embed;
        prototypeFrame.title = prototype.title || `Prototipo de ${project.title}`;
      }
    } else {
      prototypeSection.remove();
    }
  }

  /* -------------------------------------------------------
     Libro hojeable (opcional)
     ------------------------------------------------------- */

  const bookSection = $('[data-project-book]');

  if (bookSection) {
    const bookData = project.book;

    if (!bookData || !bookData.folder) {
      bookSection.remove();
    } else {
      const totalPages = Number(bookData.pages) > 2 ? Math.floor(Number(bookData.pages)) : 68;
      const folder = assetPath(bookData.folder).replace(/\/$/, '');
      const pageSrc = (page) => `${folder}/pagina-${pad2(page)}.webp`;

      // Vistas: portada sola, spreads interiores y contraportada sola.
      const views = [{ left: null, right: 1 }];
      for (let left = 2; left <= totalPages - 2; left += 2) {
        views.push({ left, right: left + 1 });
      }
      views.push({ left: totalPages, right: null });

      const book = $('[data-book]', bookSection);
      const viewport = $('[data-book-viewport]', bookSection);
      const turn = $('[data-book-turn]', bookSection);
      const counter = $('[data-book-counter]', bookSection);
      const fill = $('[data-book-fill]', bookSection);
      const prevButton = $('[data-book-prev]', bookSection);
      const nextButton = $('[data-book-next]', bookSection);
      const zonePrev = $('[data-book-zone="prev"]', bookSection);
      const zoneNext = $('[data-book-zone="next"]', bookSection);

      const sides = {
        left: $('[data-book-base="left"]', bookSection),
        right: $('[data-book-base="right"]', bookSection)
      };

      const images = {
        left: $('[data-book-img="left"]', bookSection),
        right: $('[data-book-img="right"]', bookSection),
        front: $('[data-book-img="front"]', bookSection),
        back: $('[data-book-img="back"]', bookSection)
      };

      bookSection.hidden = false;
      if (bookData.ratio) book.style.setProperty('--book-ratio', String(bookData.ratio));
      setText('[data-book-label]', bookData.label || 'Publicación completa');
      setText('[data-book-title]', bookData.title || 'Hojear');
      setText('[data-book-note]', bookData.note || '');
      setText('[data-book-desc]', bookData.description || '');

      const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
      const imageCache = new Map();

      function preload(page) {
        if (!page) return Promise.resolve();
        if (imageCache.has(page)) return imageCache.get(page);

        const image = new Image();
        image.decoding = 'async';
        image.src = pageSrc(page);

        const ready = typeof image.decode === 'function'
          ? image.decode().catch(() => {})
          : new Promise((resolve) => {
              image.onload = resolve;
              image.onerror = resolve;
            });

        imageCache.set(page, ready);
        return ready;
      }

      function paint(slot, page) {
        const image = images[slot];
        if (!image) return;

        const side = sides[slot];
        if (side) side.classList.toggle('is-empty', !page);

        if (!page) {
          image.removeAttribute('src');
          image.alt = '';
          delete image.dataset.page;
          return;
        }

        image.alt = '';
        image.dataset.page = String(page);
        const next = pageSrc(page);
        if (image.getAttribute('src') !== next) image.src = next;
      }

      function viewLabel(view) {
        if (!view.left) return 'Portada';
        if (!view.right) return 'Contraportada';
        return `Páginas ${view.left} y ${view.right}`;
      }

      let index = 0;
      let animating = false;
      let suppressClick = false;

      function applyShift(view) {
        book.style.setProperty('--book-shift', !view.left ? '-25%' : !view.right ? '25%' : '0%');
      }

      function syncChrome() {
        const view = views[index];
        const spread = Boolean(view.left && view.right);
        const label = viewLabel(view);

        book.classList.toggle('is-spread', spread);
        applyShift(view);
        book.setAttribute('aria-label', `${label}. Vista ${index + 1} de ${views.length}.`);

        if (counter) counter.textContent = `${label} · ${pad2(index + 1)} / ${pad2(views.length)}`;
        if (fill) fill.style.width = `${(index / (views.length - 1)) * 100}%`;
        if (prevButton) prevButton.disabled = index === 0;
        if (nextButton) nextButton.disabled = index === views.length - 1;
        if (zonePrev) zonePrev.disabled = index === 0;
        if (zoneNext) zoneNext.disabled = index === views.length - 1;
      }

      function renderBase() {
        const view = views[index];
        paint('left', view.left);
        paint('right', view.right);
      }

      function prefetchAround() {
        [-1, 1, 2].forEach((offset) => {
          const view = views[index + offset];
          if (!view) return;
          if (view.left) preload(view.left);
          if (view.right) preload(view.right);
        });
      }

      function settle(target) {
        index = target;
        renderBase();
        turn.classList.remove('is-active');
        turn.style.transform = '';
        animating = false;
        syncChrome();
        prefetchAround();
      }

      async function goTo(target) {
        if (animating || target === index || target < 0 || target >= views.length) return;

        const forward = target > index;
        const from = views[index];
        const to = views[target];
        const frontPage = forward ? from.right : to.right;
        const backPage = forward ? to.left : from.left;

        if (!frontPage || !backPage) return;
        animating = true;

        await Promise.race([Promise.all([preload(frontPage), preload(backPage)]), wait(140)]);

        applyShift(to);
        paint('left', forward ? from.left : to.left);
        paint('right', forward ? to.right : from.right);
        paint('front', frontPage);
        paint('back', backPage);

        turn.classList.add('is-active');
        turn.style.transform = forward ? 'rotateY(0deg)' : 'rotateY(-180deg)';

        if (reduceMotion) {
          settle(target);
          return;
        }

        const animation = turn.animate(
          forward
            ? [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-180deg)' }]
            : [{ transform: 'rotateY(-180deg)' }, { transform: 'rotateY(0deg)' }],
          { duration: 720, easing: 'cubic-bezier(.45,.04,.22,1)', fill: 'both' }
        );

        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          try { animation.cancel(); } catch (error) { /* Animación ya cancelada. */ }
          settle(target);
        };

        animation.addEventListener('finish', finish);
        window.setTimeout(finish, 1100);
      }

      prevButton?.addEventListener('click', () => goTo(index - 1));
      nextButton?.addEventListener('click', () => goTo(index + 1));

      [zonePrev, zoneNext].forEach((zone, zoneIndex) => {
        if (!zone) return;
        zone.addEventListener('click', () => {
          if (suppressClick) return;
          goTo(zoneIndex === 0 ? index - 1 : index + 1);
        });
      });

      bookSection.addEventListener('keydown', (event) => {
        if (event.target.closest('input, textarea, select')) return;

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goTo(index + 1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goTo(index - 1);
        } else if (event.key === 'Home') {
          event.preventDefault();
          goTo(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          goTo(views.length - 1);
        }
      });

      // Arrastre y gestos: el deslizamiento horizontal pasa la hoja.
      let pointerStart = null;

      viewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (!event.isPrimary) return;
        pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, time: Date.now() };
      });

      viewport.addEventListener('pointerup', (event) => {
        if (!pointerStart || pointerStart.id !== event.pointerId) return;

        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        const elapsed = Date.now() - pointerStart.time;
        pointerStart = null;

        if (elapsed > 1000 || Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy) * 1.3) return;

        suppressClick = true;
        window.setTimeout(() => { suppressClick = false; }, 420);
        goTo(index + (dx < 0 ? 1 : -1));
      });

      viewport.addEventListener('pointercancel', () => { pointerStart = null; });

      renderBase();
      syncChrome();
      prefetchAround();
      preload(views[0].right);
      window.requestAnimationFrame(() => book.classList.add('is-ready'));
    }
  }

  /* -------------------------------------------------------
     Capítulos de proceso
     ------------------------------------------------------- */

  const chapterIcons = [
    '<svg viewBox="0 0 160 160" aria-hidden="true"><path d="M92 14a58 58 0 1 0 42 98A48 48 0 1 1 92 14Z" fill="#bdf522" stroke="#141414" stroke-width="7" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 160 160" aria-hidden="true"><path fill-rule="evenodd" d="M80 12a68 68 0 1 0 0 136 68 68 0 1 0 0-136Zm0 38a30 30 0 1 1 0 60 30 30 0 1 1 0-60Z" fill="#fa51a2" stroke="#141414" stroke-width="7"/></svg>',
    '<svg viewBox="0 0 160 160" aria-hidden="true"><path d="M80 10c9 44 20 55 64 64-44 9-55 20-64 64-9-44-20-55-64-64 44-9 55-20 64-64Z" fill="#fe8616" stroke="#141414" stroke-width="7" stroke-linejoin="round"/></svg>'
  ];

  const chapterPhases = ['Inicio', 'Desarrollo', 'Cierre'];

  const chapters = $('[data-project-chapters]');
  if (chapters && Array.isArray(project.sections)) {
    chapters.innerHTML = project.sections.map((section, index) => {
      const body = Array.isArray(section.body) ? section.body : [section.body];
      const bodyHTML = body
        .filter(Boolean)
        .map((paragraph) => `<p class="project-chapter__body">${escapeHTML(paragraph)}</p>`)
        .join('');
      const statsHTML = Array.isArray(section.stats) && section.stats.length
        ? `<div class="project-chapter__stats">${section.stats.map((stat) => `
            <div class="project-stat${stat.wide ? ' project-stat--wide' : ''}">
              ${stat.group ? `<span class="project-stat__group">${escapeHTML(stat.group)}</span>` : ''}
              <strong class="project-stat__value">${escapeHTML(stat.value || '')}</strong>
              <span class="project-stat__label">${escapeHTML(stat.label || '')}</span>
              ${stat.note ? `<small class="project-stat__note">${escapeHTML(stat.note)}</small>` : ''}
            </div>
          `).join('')}</div>`
        : '';

      const phase = section.phase || chapterPhases[index] || `Paso ${index + 1}`;

      return `
        <section class="project-chapter" data-reveal>
          <div class="project-chapter__aside">
            <p class="project-chapter__phase">${pad2(index + 1)} / ${escapeHTML(phase)}</p>
            <span class="project-chapter__symbol" aria-hidden="true">${chapterIcons[index % chapterIcons.length]}</span>
          </div>
          <div class="project-chapter__content">
            <h2 class="project-chapter__title">${escapeHTML(section.title || '')}</h2>
            ${bodyHTML}
            ${statsHTML}
          </div>
        </section>
      `;
    }).join('');
  } else if (chapters) {
    const wrap = chapters.closest('.project-chapters');
    if (wrap) wrap.remove();
  }

  /* -------------------------------------------------------
     Galería
     ------------------------------------------------------- */

  const gallery = $('[data-project-gallery]');
  if (gallery && project.galleryLayout) {
    gallery.classList.add(`project-gallery__grid--${project.galleryLayout}`);
  }
  if (gallery && Array.isArray(project.gallery)) {
    gallery.innerHTML = project.gallery.map((item, index) => {
      const src = assetPath(item.src);
      const alt = item.alt || `Imagen de ${project.title}`;
      const caption = item.caption || `Imagen ${index + 1}`;
      const inline = [];
      if (item.focus) inline.push(`object-position: ${item.focus}`);
      if (item.fit) inline.push(`object-fit: ${item.fit}`);
      const styleAttr = inline.length ? ` style="${escapeHTML(inline.join('; '))}"` : '';
      const fitAttr = item.fit ? ` data-fit="${escapeHTML(item.fit)}"` : '';

      return `
        <figure class="project-gallery__item" data-reveal${fitAttr}>
          <button class="project-gallery__open" type="button"
            data-lightbox-index="${index}"
            data-lightbox-src="${escapeHTML(src)}"
            data-lightbox-alt="${escapeHTML(alt)}"
            data-lightbox-caption="${escapeHTML(caption)}"
            aria-label="Ver imagen completa: ${escapeHTML(alt)}">
            <span class="project-gallery__media">
              <img src="${escapeHTML(src)}"
                   alt="${escapeHTML(alt)}"
                   loading="${index === 0 ? 'eager' : 'lazy'}"
                   decoding="async"${styleAttr}>
            </span>
            <span class="project-gallery__caption">${escapeHTML(caption)}</span>
          </button>
        </figure>
      `;
    }).join('');
    setText('[data-project-gallery-count]', `${pad2(project.gallery.length)} piezas`);
  }

  /* -------------------------------------------------------
     Collage de la galería: piezas de distintos tamaños
     ------------------------------------------------------- */

  const galleryGrid = $('[data-project-gallery]');
  const compactGallery = galleryGrid && galleryGrid.classList.contains('project-gallery__grid--compact');

  if (galleryGrid && !compactGallery) {
    const collageItems = $$('.project-gallery__item', galleryGrid);
    const spanOffsets = [1, -1, 0, 1, -2, 2, 0, -1];
    const baseSpan = (ratio) => (ratio >= 1.55 ? 7 : ratio >= 1.2 ? 6 : ratio >= 0.95 ? 5 : 4);
    let collageFrame = 0;

    const layoutCollage = () => {
      const gap = parseFloat(getComputedStyle(galleryGrid).columnGap) || 16;
      const width = galleryGrid.clientWidth;
      const compact = window.matchMedia('(max-width: 900px)').matches;
      const single = window.matchMedia('(max-width: 560px)').matches;
      const columnWidth = (width - gap * 11) / 12;
      const heights = new Array(12).fill(0);

      collageItems.forEach((item, index) => {
        const image = item.querySelector('img');
        const ratio = image && image.naturalWidth && image.naturalHeight
          ? image.naturalWidth / image.naturalHeight
          : 1.4;
        let span;

        if (single) {
          span = 12;
        } else if (compact) {
          span = index === 0 && ratio >= 1.1 ? 12 : 6;
        } else {
          span = Math.min(8, Math.max(3, baseSpan(ratio) + spanOffsets[index % spanOffsets.length]));
        }

        const preferred = span;
        const candidates = (single || compact)
          ? [span]
          : [...new Set([
              Math.max(3, span - 1),
              span,
              Math.min(8, span + 1),
              span >= 6 ? 4 : null
            ])].filter((value) => value != null);
        let best = null;

        candidates.forEach((candidateSpan) => {
          const candidateWidth = columnWidth * candidateSpan + gap * (candidateSpan - 1);
          const candidateHeight = Math.round(candidateWidth / ratio);
          const penalty = Math.abs(candidateSpan - preferred) * 12
            + (candidateSpan === 4 && preferred >= 6 ? 45 : 0);

          for (let column = 0; column <= 12 - candidateSpan; column += 1) {
            let candidateTop = 0;
            for (let offset = 0; offset < candidateSpan; offset += 1) {
              candidateTop = Math.max(candidateTop, heights[column + offset]);
            }

            const score = candidateTop + penalty;
            if (!best
              || score < best.score - 0.5
              || (Math.abs(score - best.score) <= 0.5 && candidateSpan > best.span)) {
              best = { column, top: candidateTop, span: candidateSpan, width: candidateWidth, height: candidateHeight, score };
            }
          }
        });

        span = best.span;
        item.style.left = `${Math.round(best.column * (columnWidth + gap))}px`;
        item.style.top = `${Math.round(best.top)}px`;
        item.style.width = `${Math.round(best.width)}px`;
        item.style.height = `${best.height}px`;

        for (let column = best.column; column < best.column + span; column += 1) {
          heights[column] = best.top + best.height + gap;
        }
      });

      galleryGrid.style.height = `${Math.max(...heights) - gap}px`;
    };

    const scheduleCollage = () => {
      window.cancelAnimationFrame(collageFrame);
      collageFrame = window.requestAnimationFrame(layoutCollage);
    };

    collageItems.forEach((item) => {
      const image = item.querySelector('img');
      if (!image || (image.complete && image.naturalWidth)) return;
      image.addEventListener('load', scheduleCollage, { once: true });
      image.addEventListener('error', scheduleCollage, { once: true });
    });

    window.addEventListener('resize', scheduleCollage, { passive: true });
    window.addEventListener('load', scheduleCollage, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleCollage);
    scheduleCollage();
  }

  /* -------------------------------------------------------
     Visor de imagen completa
     ------------------------------------------------------- */

  const lightbox = $('[data-project-lightbox]');

  if (lightbox) {
    const lightboxImage = $('[data-lightbox-image]', lightbox);
    const lightboxCaption = $('[data-lightbox-caption]', lightbox);
    const lightboxCount = $('[data-lightbox-count]', lightbox);
    const lightboxClose = $('[data-lightbox-close]', lightbox);
    const lightboxPrev = $('[data-lightbox-prev]', lightbox);
    const lightboxNext = $('[data-lightbox-next]', lightbox);

    const lightboxItems = Array.isArray(project.gallery)
      ? project.gallery.map((item) => ({
          src: assetPath(item.src),
          alt: item.alt || `Imagen de ${project.title}`,
          caption: item.caption || ''
        }))
      : [];

    let lightboxIndex = 0;
    let lightboxTrigger = null;

    const updateLightbox = (index) => {
      if (!lightboxItems.length) return;
      lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
      const item = lightboxItems[lightboxIndex];

      if (lightboxImage) {
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
      }

      if (lightboxCaption) lightboxCaption.textContent = item.caption;

      if (lightboxCount) {
        lightboxCount.textContent = `${pad2(lightboxIndex + 1)} / ${pad2(lightboxItems.length)}`;
      }
    };

    const openLightbox = (index, trigger) => {
      lightboxTrigger = trigger || null;
      updateLightbox(index);

      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else lightbox.setAttribute('open', '');
    };

    const closeLightbox = () => {
      if (typeof lightbox.close === 'function') lightbox.close();
      else lightbox.removeAttribute('open');
    };

    $$('.project-gallery__open').forEach((button) => {
      button.addEventListener('click', () => {
        openLightbox(Number(button.dataset.lightboxIndex) || 0, button);
      });
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => updateLightbox(lightboxIndex - 1));
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => updateLightbox(lightboxIndex + 1));
    }

    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        updateLightbox(lightboxIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        updateLightbox(lightboxIndex + 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        updateLightbox(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        updateLightbox(lightboxItems.length - 1);
      }
    });

    lightbox.addEventListener('close', () => {
      if (lightboxTrigger && lightboxTrigger.isConnected) {
        lightboxTrigger.focus({ preventScroll: true });
      }
      lightboxTrigger = null;
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  /* -------------------------------------------------------
     Anterior / siguiente
     ------------------------------------------------------- */

  if (projects.length > 1) {
    const index = projects.indexOf(project);
    const previous = projects[(index - 1 + projects.length) % projects.length];
    const next = projects[(index + 1) % projects.length];

    const fillPager = (selector, item, direction) => {
      const link = $(selector);
      if (!link || !item) return;
      link.href = `${item.id}.html`;
      const titleEl = $('.project-pager__title', link);
      const metaEl = $('.project-pager__meta', link);
      if (titleEl) titleEl.textContent = item.title;
      if (metaEl) metaEl.textContent = `${item.order || ''} · ${item.category || ''}`;
      link.setAttribute('aria-label', `${direction}: ${item.title}`);
    };

    fillPager('[data-project-prev]', previous, 'Proyecto anterior');
    fillPager('[data-project-next]', next, 'Siguiente proyecto');
  }

  /* -------------------------------------------------------
     Año del pie
     ------------------------------------------------------- */

  setText('[data-project-year-copy]', String(new Date().getFullYear()));

  /* -------------------------------------------------------
     Tema día / noche
     ------------------------------------------------------- */

  const html = document.documentElement;
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
      try { localStorage.setItem('tema', theme); } catch (error) { /* Sin almacenamiento. */ }
    }
  }

  applyTheme(html.dataset.theme === 'night' ? 'night' : 'day', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(html.dataset.theme === 'night' ? 'day' : 'night');
    });
  }

  /* -------------------------------------------------------
     Progreso de lectura y sombra de la barra
     ------------------------------------------------------- */

  const progress = $('[data-project-progress]');
  const nav = $('.project-nav');
  let scrollQueued = false;

  function updateProgress() {
    scrollQueued = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  /* -------------------------------------------------------
     Entradas suaves
     ------------------------------------------------------- */

  const revealTargets = $$('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-in'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach((element) => observer.observe(element));
  }

  // Respaldo: si el observer no revela el mosaico, lo mostramos al entrar en pantalla.
  const gallerySection = $('.project-gallery');
  const galleryItems = $$('.project-gallery__item');

  if (gallerySection && galleryItems.length) {
    const revealGallery = () => {
      const rect = gallerySection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        galleryItems.forEach((element) => element.classList.add('is-in'));
        window.removeEventListener('scroll', revealGallery);
        window.removeEventListener('resize', revealGallery);
      }
    };

    window.addEventListener('scroll', revealGallery, { passive: true });
    window.addEventListener('resize', revealGallery, { passive: true });
    window.setTimeout(revealGallery, 1200);
  }
})();
