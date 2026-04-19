(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('nav-mobile');

  if (header) {
    const onScroll = () => {
      // Use toggle for cleaner logic
      header.classList.toggle('is-scrolled', window.scrollY > 48);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close mobile nav on link click (for single-page navigation)
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const portfolio = document.getElementById('portfolio');
  const prevBtn = document.getElementById('portfolio-prev');
  const nextBtn = document.getElementById('portfolio-next');
  if (portfolio && prevBtn && nextBtn) {
    const step = () => {
      const card = portfolio.querySelector('.portfolio-card');
      // Calculate scroll distance based on card width + gap
      return card ? Math.round(card.getBoundingClientRect().width + 20) : 320;
    };
    prevBtn.addEventListener('click', () => {
      portfolio.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      portfolio.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }

  const counters = document.querySelectorAll('.js-counter');
  const statsEl = document.getElementById('stats');
  if (counters.length && statsEl && 'IntersectionObserver' in window) {
    let done = false;
    const run = () => {
      counters.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        const start = performance.now();
        const dur = 1400;
        function frame(now) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          el.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    };
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done) {
          done = true;
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.12 } // Trigger when 12% of the element is visible
    );
    obs.observe(statsEl);
  }

  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.getElementById('modal-close');
  let lastFocus = null;

  function openModal(src, alt) {
    if (!modal || !modalImg) return;
    lastFocus = document.activeElement;
    modalImg.src = src;
    modalImg.alt = alt || 'Imagem ampliada do portfólio';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (modalImg) {
      modalImg.removeAttribute('src');
      modalImg.alt = '';
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('.js-zoom').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const img = card.querySelector('img');
      if (img) {
        // Use currentSrc to support <picture> elements with WebP, fallback to src
        const targetSrc = img.currentSrc || img.src;
        if (targetSrc) {
          openModal(targetSrc, img.alt);
        }
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    // Close modal on backdrop click
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }
  // Close modal with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });
})();
