/**
 * Praxis Lair – Main JavaScript
 * Lightweight interactions: navbar scroll, mobile menu, scroll animations, form handling
 */

(function () {
  'use strict';

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // --- Back to top button ---
  var backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    window.addEventListener('scroll', handleBackToTop, { passive: true });
    handleBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Active navigation state ---
  var navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
  var sections = [];

  navLinks.forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ el: target, link: link });
  });

  function updateActiveNav() {
    var scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(function (item) {
      var top = item.el.offsetTop;
      var bottom = top + item.el.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        item.link.classList.add('active');
      }
    });
  }

  if (sections.length > 0) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  // --- Mobile menu toggle ---
  const toggle = document.getElementById('navbarToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll animations (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements if IntersectionObserver not supported
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Cookie Consent Management ---
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptBtn = document.getElementById('cookieAccept');
  const cookieDeclineBtn = document.getElementById('cookieDecline');
  const cookieSettingsLink = document.getElementById('cookieSettings');
  const COOKIE_CONSENT_KEY = 'praxis-lair-cookie-consent';
  const COOKIE_EXPIRY_DAYS = 365;

  function setCookieConsent(accepted) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    
    const cookieValue = accepted ? 'accepted' : 'declined';
    document.cookie = `${COOKIE_CONSENT_KEY}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    
    hideCookieBanner();
    
    if (accepted) {
      loadAnalytics();
    }
  }

  function getCookieConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.split('=').map(c => c.trim());
      if (key === COOKIE_CONSENT_KEY) {
        return value;
      }
    }
    return null;
  }

  function showCookieBanner() {
    if (cookieBanner) {
      cookieBanner.setAttribute('aria-hidden', 'false');
    }
  }

  function hideCookieBanner() {
    if (cookieBanner) {
      cookieBanner.setAttribute('aria-hidden', 'true');
    }
  }

  function loadAnalytics() {
    // Hier können Sie Google Analytics oder andere Analytics-Scripts laden
    // Beispiel: Laden Sie Google Analytics nach Cookie-Zustimmung
    console.log('Analytics loaded - Cookie consent given');
  }

  // Event listener für Cookie-Buttons
  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', function () {
      setCookieConsent(true);
    });
  }

  if (cookieDeclineBtn) {
    cookieDeclineBtn.addEventListener('click', function () {
      setCookieConsent(false);
    });
  }

  // Cookie-Einstellungen Link
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showCookieBanner();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Banner anzeigen, wenn keine Zustimmung erteilt ist
  if (!getCookieConsent()) {
    // Kleine Verzögerung, um Banner angenehm zu wirken
    setTimeout(function () {
      showCookieBanner();
    }, 1000);
  }

  // --- Smooth scroll for anchor links (polyfill for older browsers) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = navbar.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Simple contact form handling ---
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var isValid = true;

      // Basic validation
      [name, email, message].forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          isValid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      // Simple email pattern check
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#e74c3c';
        isValid = false;
      }

      if (!isValid) return;

      // Visual feedback — in production, replace with actual form submission
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Gesendet ✓';
      submitBtn.disabled = true;
      submitBtn.style.background = '#4A9B8E';

      setTimeout(function () {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        contactForm.reset();
      }, 3000);
    });

    // Clear error styles on input
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    });
  }
})();
