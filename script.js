/* Blossom Unisex Salon - website interactions */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuToggle = $('.menu-toggle');
  const nav = $('.site-nav');
  if (menuToggle && nav) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => {
      const opened = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(opened));
      menuToggle.classList.toggle('is-open', opened);
    });
    $$('.site-nav a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Service price tabs
  const tabs = $$('.service-tab[data-category]');
  const panels = $$('.service-content[data-category]');
  function activateTab(category) {
    tabs.forEach(tab => {
      const active = tab.dataset.category === category;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });
    panels.forEach(panel => {
      const active = panel.dataset.category === category;
      panel.hidden = !active;
      panel.setAttribute('aria-hidden', String(!active));
    });
  }
  if (tabs.length && panels.length) {
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab.dataset.category));
      tab.addEventListener('keydown', event => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        tabs[next].focus();
        activateTab(tabs[next].dataset.category);
      });
    });
    activateTab($('.service-tab.active')?.dataset.category || tabs[0].dataset.category);
  }

  // Gallery lightbox
  const lightbox = $('.lightbox');
  const lightboxImage = $('img', lightbox || document);
  const galleryItems = $$('.gallery-item');
  let galleryIndex = 0;
  function getGalleryImage(item) {
    const image = $('img', item);
    return image ? { src: image.currentSrc || image.src, alt: image.alt || item.textContent.trim() } : null;
  }
  function showGalleryImage(index) {
    if (!galleryItems.length || !lightbox || !lightboxImage) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const data = getGalleryImage(galleryItems[galleryIndex]);
    if (!data) return;
    lightboxImage.src = data.src;
    lightboxImage.alt = data.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    $('.lightbox-close', lightbox)?.focus();
  }
  function closeGallery() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }
  galleryItems.forEach((item, index) => item.addEventListener('click', () => showGalleryImage(index)));
  $('.lightbox-close', lightbox || document)?.addEventListener('click', closeGallery);
  $('.lightbox-prev', lightbox || document)?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
  $('.lightbox-next', lightbox || document)?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeGallery(); });
  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') showGalleryImage(galleryIndex - 1);
    if (event.key === 'ArrowRight') showGalleryImage(galleryIndex + 1);
  });

  // Review carousel controls (if present)
  const reviewTrack = $('.review-track, .reviews-track, .testimonial-track');
  const reviewCards = reviewTrack ? $$(':scope > *', reviewTrack) : [];
  const reviewDots = $$('.slider-dot');
  const reviewArrows = $$('.slider-arrow');
  if (reviewTrack && reviewCards.length) {
    let reviewIndex = 0;
    const goReview = index => {
      reviewIndex = Math.max(0, Math.min(reviewCards.length - 1, index));
      reviewTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
      reviewDots.forEach((dot, i) => dot.classList.toggle('active', i === reviewIndex));
    };
    reviewDots.forEach((dot, i) => dot.addEventListener('click', () => goReview(i)));
    reviewArrows.forEach((arrow, i) => arrow.addEventListener('click', () => goReview(reviewIndex + (i === 0 ? -1 : 1))));
  }

  // Current year
  const year = $('#current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
