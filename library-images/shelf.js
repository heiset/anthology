(() => {
  if (typeof SHELF_MAP === 'undefined') return;

  const IMAGES = {
    1: { src: '../library-images/bookshelf1.jpg', w: 4000, h: 3869, label: 'Novels & Extended Writing' },
    2: { src: '../library-images/bookshelf2.jpg', w: 10964, h: 3357, label: 'Everything else' },
  };

  const byImage = { 1: [], 2: [] };
  SHELF_MAP.forEach((r) => byImage[r.img].push(r));
  const byId = {};
  SHELF_MAP.forEach((r) => { byId[r.id] = r; });

  const lightbox = document.getElementById('shelfLightbox');
  if (!lightbox) return;
  const scrollEl = lightbox.querySelector('.shelf-lightbox-scroll');
  const stage = lightbox.querySelector('.shelf-lightbox-stage');
  const imgEl = stage.querySelector('img');
  // Firefox-family browsers (e.g. Zen) ignore the WebKit-only
  // `-webkit-user-drag: none` in the CSS and start a native image drag on
  // mousedown+move, which steals the gesture from our pointer-based pan.
  // draggable="false" in the markup covers most cases; this is the
  // standards-based belt-and-suspenders backup.
  imgEl.addEventListener('dragstart', (e) => e.preventDefault());
  const captionEl = lightbox.querySelector('.shelf-lightbox-caption');
  const closeBtn = lightbox.querySelector('.shelf-lightbox-close');
  const hintEl = lightbox.querySelector('.shelf-lightbox-hint');
  const zoomInBtn = lightbox.querySelector('[data-zoom-in]');
  const zoomOutBtn = lightbox.querySelector('[data-zoom-out]');

  let currentImg = null;
  let state = { scale: 1, tx: 0, ty: 0, min: 1, max: 6 };
  let lastFocusedEl = null;

  function applyTransform() {
    stage.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
  }

  function constrain() {
    const info = IMAGES[currentImg];
    const stageW = info.w * state.scale;
    const stageH = info.h * state.scale;
    const vw = scrollEl.clientWidth;
    const vh = scrollEl.clientHeight;
    state.tx = stageW <= vw ? (vw - stageW) / 2 : Math.min(0, Math.max(vw - stageW, state.tx));
    state.ty = stageH <= vh ? (vh - stageH) / 2 : Math.min(0, Math.max(vh - stageH, state.ty));
  }

  function setZoomAt(newScale, clientX, clientY) {
    newScale = Math.min(state.max, Math.max(state.min, newScale));
    const rect = scrollEl.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const sx = (px - state.tx) / state.scale;
    const sy = (py - state.ty) / state.scale;
    state.scale = newScale;
    state.tx = px - sx * newScale;
    state.ty = py - sy * newScale;
    constrain();
    applyTransform();
  }

  function renderHotspots() {
    stage.querySelectorAll('.shelf-hotspot').forEach((n) => n.remove());
    byImage[currentImg].forEach((r) => {
      const li = document.getElementById(r.id);
      if (!li) return;
      const titleEl = li.querySelector('.book-title');
      const title = titleEl ? titleEl.childNodes[0].textContent.trim() : '';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shelf-hotspot';
      btn.style.left = r.x + '%';
      btn.style.top = r.y + '%';
      btn.style.width = r.w + '%';
      btn.style.height = r.h + '%';
      btn.dataset.bookId = r.id;
      btn.setAttribute('aria-label', 'Find "' + title + '" in the list');
      btn.title = title;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToBook(r.id);
      });
      stage.appendChild(btn);
    });
  }

  function showHint() {
    hintEl.style.opacity = '1';
    clearTimeout(showHint._t);
    showHint._t = setTimeout(() => { hintEl.style.opacity = '0'; }, 2800);
  }

  function openLightbox(imgKey, focusId) {
    const info = IMAGES[imgKey];
    if (!info) return;
    lastFocusedEl = document.activeElement;
    currentImg = imgKey;
    imgEl.src = info.src;
    imgEl.alt = info.label + ' bookshelf, zoomed in';
    captionEl.textContent = info.label;
    stage.style.width = info.w + 'px';
    stage.style.height = info.h + 'px';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    renderHotspots();

    requestAnimationFrame(() => {
      const vw = scrollEl.clientWidth;
      const vh = scrollEl.clientHeight;
      const fit = Math.min(vw / info.w, vh / info.h);
      state = {
        scale: fit,
        tx: (vw - info.w * fit) / 2,
        ty: (vh - info.h * fit) / 2,
        min: fit,
        max: fit * 7,
      };
      applyTransform();
      if (focusId) {
        focusBook(focusId);
      }
      showHint();
      closeBtn.focus();
    });
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    imgEl.removeAttribute('src');
    if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
  }

  function focusBook(id) {
    const rec = byId[id];
    if (!rec) return;
    if (currentImg !== rec.img) {
      openLightbox(rec.img, id);
      return;
    }
    const info = IMAGES[rec.img];
    const vw = scrollEl.clientWidth;
    const vh = scrollEl.clientHeight;
    const cx = (rec.x + rec.w / 2) / 100 * info.w;
    const cy = (rec.y + rec.h / 2) / 100 * info.h;
    const desiredSpinePx = Math.min(260, vw * 0.4);
    let targetScale = desiredSpinePx / (rec.w / 100 * info.w);
    targetScale = Math.min(state.max, Math.max(state.min, targetScale));
    state.scale = targetScale;
    state.tx = vw / 2 - cx * targetScale;
    state.ty = vh / 2 - cy * targetScale;
    constrain();
    applyTransform();
    flashHotspot(id);
  }

  function flashHotspot(id) {
    const btn = stage.querySelector('[data-book-id="' + id + '"]');
    if (!btn) return;
    btn.classList.remove('is-active');
    void btn.offsetWidth;
    btn.classList.add('is-active');
    setTimeout(() => btn.classList.remove('is-active'), 1800);
  }

  function goToBook(id) {
    closeLightbox();
    const li = document.getElementById(id);
    if (!li) return;
    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
    li.classList.remove('is-highlighted');
    void li.offsetWidth;
    li.classList.add('is-highlighted');
    setTimeout(() => li.classList.remove('is-highlighted'), 1700);
  }

  // Thumbnails open the lightbox
  document.querySelectorAll('.shelf-photo').forEach((fig) => {
    const key = Number(fig.dataset.shelfImg);
    const activate = () => openLightbox(key);
    fig.addEventListener('click', activate);
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  // "View on shelf" pin next to each mapped title
  SHELF_MAP.forEach((rec) => {
    const li = document.getElementById(rec.id);
    if (!li) return;
    const titleSpan = li.querySelector('.book-title');
    if (!titleSpan || titleSpan.querySelector('.book-shelf-link')) return;
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'book-shelf-link';
    pin.setAttribute('aria-label', 'View on shelf photo');
    pin.title = 'View on shelf photo';
    pin.textContent = '📍';
    pin.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(rec.img, rec.id);
    });
    titleSpan.appendChild(pin);
  });

  // Close handlers
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (!lightbox.hidden && e.key === 'Escape') closeLightbox();
  });

  // Zoom buttons
  zoomInBtn.addEventListener('click', () => {
    const rect = scrollEl.getBoundingClientRect();
    setZoomAt(state.scale * 1.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  zoomOutBtn.addEventListener('click', () => {
    const rect = scrollEl.getBoundingClientRect();
    setZoomAt(state.scale / 1.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  // Wheel / trackpad zoom
  scrollEl.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0018);
    setZoomAt(state.scale * factor, e.clientX, e.clientY);
  }, { passive: false });

  // Double-click / double-tap to toggle zoom
  scrollEl.addEventListener('dblclick', (e) => {
    const target = state.scale > state.min * 1.4 ? state.min : state.min * 3;
    setZoomAt(target, e.clientX, e.clientY);
  });

  // Pointer-based pan + pinch zoom (covers touch and mouse).
  //
  // Hotspot buttons tile almost the entire photo, so we can't decide
  // "is this a tap on a button or the start of a drag/pinch" from the
  // target alone — nearly every touch starts on some button. Instead every
  // pointer is tracked regardless of target, and a gesture only becomes a
  // pan/pinch once it moves past a small threshold; a release before that
  // threshold is left alone so the pointer's native click still reaches
  // whatever hotspot it started on. If a gesture DOES cross the threshold,
  // the next click is suppressed so a drag/pinch that happens to end over
  // a hotspot doesn't also "click" it. That suppression has to happen on
  // a capturing listener on scrollEl (an ANCESTOR of the hotspots) rather
  // than on the hotspot itself — a same-element listener added after the
  // hotspot's own click listener would fire after it, too late to stop it,
  // since same-element listeners run in registration order regardless of
  // the capture flag.
  const DRAG_THRESHOLD = 8; // px
  const pointers = new Map();
  let dragStart = null;
  let pinchStart = null;
  let suppressClick = false;

  scrollEl.addEventListener('click', (e) => {
    if (!suppressClick) return;
    suppressClick = false;
    e.preventDefault();
    e.stopPropagation();
  }, { capture: true });

  scrollEl.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false });

    if (pointers.size === 1) {
      dragStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
    } else if (pointers.size === 2) {
      dragStart = null;
      scrollEl.classList.remove('dragging');
      const pts = [...pointers.values()];
      pinchStart = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        scale: state.scale,
      };
    }
  });

  scrollEl.addEventListener('pointermove', (e) => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    if (!p.moved && Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > DRAG_THRESHOLD) {
      p.moved = true;
      try { scrollEl.setPointerCapture(e.pointerId); } catch (err) { /* capture is a nicety, not required */ }
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 400);
    }

    if (pointers.size === 1 && dragStart) {
      if (!p.moved) return;
      scrollEl.classList.add('dragging');
      state.tx = dragStart.tx + (e.clientX - dragStart.x);
      state.ty = dragStart.ty + (e.clientY - dragStart.y);
      constrain();
      applyTransform();
    } else if (pointers.size === 2 && pinchStart) {
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const newScale = pinchStart.scale * (dist / pinchStart.dist);
      setZoomAt(newScale, midX, midY);
    }
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      dragStart = null;
      scrollEl.classList.remove('dragging');
    } else if (pointers.size === 1) {
      // Dropping from a pinch (2 fingers) back to a pan (1 finger) — treat
      // the remaining pointer's current position as a fresh drag start so
      // panning continues instead of freezing until it's lifted and replaced.
      const [p] = pointers.values();
      dragStart = { x: p.x, y: p.y, tx: state.tx, ty: state.ty };
    }
    if (pointers.size < 2) pinchStart = null;
  }
  scrollEl.addEventListener('pointerup', endPointer);
  scrollEl.addEventListener('pointercancel', endPointer);
  scrollEl.addEventListener('pointerleave', endPointer);

  window.addEventListener('resize', () => {
    if (lightbox.hidden || !currentImg) return;
    constrain();
    applyTransform();
  });
})();
