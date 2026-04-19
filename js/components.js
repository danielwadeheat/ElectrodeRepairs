/* =====================================================
   Electrode Repairs – Shared Components
   Injects the site header and footer into every page.
   ===================================================== */

(function () {
  'use strict';

  /* ----- Header HTML ----- */
  const headerHTML = `
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <div class="top-bar">
      <div class="container">
        <span>📍 <a href="location.html">1025 N Main St, Newcastle, OK 73065</a></span>
        <span>🕐 Tue–Sat 10 AM–6 PM &nbsp;|&nbsp; Sun–Mon Closed</span>
        <span>📞 <a href="tel:+14052686305">(405) 268-6305</a></span>
        <span>✉️ <a href="mailto:Info@electroderepairs.com">Info@electroderepairs.com</a></span>
      </div>
    </div>

    <header class="site-header">
      <div class="container">
        <a href="index.html" class="site-logo" aria-label="Electrode Repairs – Home">
          ⚡ Electrode<span>Repairs</span>
        </a>

        <button class="hamburger" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="main-nav">
          <span></span><span></span><span></span>
        </button>

        <nav class="main-nav" id="main-nav" aria-label="Main navigation">
          <div class="nav-dropdown">
            <a href="repairs.html">Repairs</a>
            <ul class="dropdown-menu" role="menu">
              <li><a href="iphone-repair.html" role="menuitem">iPhone Repair</a></li>
              <li><a href="android-repair.html" role="menuitem">Android Repair</a></li>
              <li><a href="tablet-repair.html" role="menuitem">Tablet Repair</a></li>
              <li><a href="computer-repair.html" role="menuitem">Computer Repair</a></li>
              <li><a href="macbook-repair.html" role="menuitem">MacBook Repair</a></li>
              <li><a href="game-console-repair.html" role="menuitem">Game Console Repair</a></li>
            </ul>
          </div>
          <a href="buy.html">Buy</a>
          <a href="sell.html">Sell</a>
          <a href="financing.html">Financing</a>
          <a href="about.html">About</a>
          <a href="location.html">Location</a>
          <a href="contact.html">Contact</a>
          <a href="quote.html" class="nav-cta">Get Instant Quote</a>
        </nav>
      </div>
    </header>

    <div class="mobile-cta-bar" aria-label="Quick actions">
      <a href="tel:+14052686305" class="btn btn-primary">📞 Call Now</a>
      <a href="quote.html" class="btn btn-white">Get Quote</a>
    </div>
  `;

  /* ----- Footer HTML ----- */
  const footerHTML = `
    <footer class="site-footer" aria-label="Site footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="site-logo">⚡ Electrode<span style="color:var(--color-primary)">Repairs</span></div>
            <p>Your trusted local repair shop in Newcastle, OK. We buy, sell, and repair smartphones, tablets, computers, and game consoles.</p>
            <div class="footer-social" style="margin-top:1rem;">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">in</a>
              <a href="#" aria-label="Google" style="font-size:0.85rem;">G</a>
            </div>
          </div>

          <div class="footer-col">
            <h4>Repairs</h4>
            <ul>
              <li><a href="iphone-repair.html">iPhone Repair</a></li>
              <li><a href="android-repair.html">Android Repair</a></li>
              <li><a href="tablet-repair.html">Tablet Repair</a></li>
              <li><a href="computer-repair.html">Computer Repair</a></li>
              <li><a href="macbook-repair.html">MacBook Repair</a></li>
              <li><a href="game-console-repair.html">Game Console Repair</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="buy.html">Buy a Device</a></li>
              <li><a href="sell.html">Sell a Device</a></li>
              <li><a href="financing.html">Financing</a></li>
              <li><a href="quote.html">Instant Quote</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="about.html">About Us</a></li>
              <li><a href="location.html">Location &amp; Hours</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="privacy.html">Privacy Pledge</a></li>
              <li><a href="terms.html">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Electrode Repairs. All rights reserved.</p>
          <div>
            <a href="privacy.html">Privacy Pledge</a> &nbsp;|&nbsp;
            <a href="terms.html">Terms of Use</a>
          </div>
          <p>1025 N Main St, Newcastle, OK 73065 &bull; <a href="tel:+14052686305">(405) 268-6305</a></p>
        </div>
      </div>
    </footer>
  `;

  /* ----- Injection ----- */
  const headerRoot = document.getElementById('site-header-root');
  if (headerRoot) headerRoot.innerHTML = headerHTML;

  const footerRoot = document.getElementById('site-footer-root');
  if (footerRoot) footerRoot.innerHTML = footerHTML;

})();
