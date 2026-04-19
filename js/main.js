/* =====================================================
   Electrode Repairs – Main JavaScript
   Navigation, FAQ Accordion, Form helpers
   ===================================================== */

(function () {
  'use strict';

  /* ----- Navigation Toggle (Mobile) ----- */
  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked (mobile)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 900) {
          mainNav.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close nav on outside click
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----- Dropdown Toggle (Mobile) ----- */
  document.querySelectorAll('.nav-dropdown > a').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const dropdown = toggle.closest('.nav-dropdown');
        dropdown.classList.toggle('open');
      }
    });
  });

  /* ----- Active Nav Link ----- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ----- Sticky Header Shadow ----- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* ----- FAQ Accordion ----- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');

      // Close all other open answers
      document.querySelectorAll('.faq-answer.open').forEach(function (a) {
        a.classList.remove('open');
        a.previousElementSibling.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        answer.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ----- Contact / Quote Form Submission ----- */
  document.querySelectorAll('.contact-form, .quote-form, .inquiry-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate async send (replace with real fetch/API later)
      setTimeout(function () {
        const msg = document.createElement('p');
        msg.textContent = '✅ Thank you! We will be in touch shortly.';
        msg.style.cssText = 'color:#163A5F;font-weight:700;margin-top:1rem;';
        form.appendChild(msg);
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1000);
    });
  });

})();
