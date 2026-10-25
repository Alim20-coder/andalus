/**
 * الأندلس لنقل العفش والمكيفات بالرياض
 * Al-Andalus Movers & AC Services Riyadh
 * Main JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 60
    });
  }

  // 2. Language Switcher (Arabic <-> English)
  let currentLang = localStorage.getItem('alandalus_lang') || 'ar';
  applyLanguage(currentLang);

  window.toggleLang = function () {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('alandalus_lang', currentLang);
    applyLanguage(currentLang);
  };

  function applyLanguage(lang) {
    const html = document.documentElement;
    const body = document.body;

    if (lang === 'en') {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      body.classList.add('lang-en');
      updateLangButtons('AR');
    } else {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      body.classList.remove('lang-en');
      updateLangButtons('EN');
    }

    // Translate all elements with data-ar and data-en
    const translatableElements = document.querySelectorAll('[data-ar][data-en]');
    translatableElements.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        // Keep child icons if any
        const icon = el.querySelector('i');
        if (icon) {
          el.innerHTML = '';
          el.appendChild(icon);
          el.appendChild(document.createTextNode(' ' + text));
        } else {
          el.textContent = text;
        }
      }
    });

    // Update input placeholders
    const inputs = document.querySelectorAll('[data-placeholder-ar]');
    inputs.forEach(input => {
      const placeholder = input.getAttribute(`data-placeholder-${lang}`);
      if (placeholder) {
        input.setAttribute('placeholder', placeholder);
      }
    });

    // Dynamic widgets (defined further down) refresh their own text
    if (typeof window.renderQuote === 'function') window.renderQuote();
  }

  function updateLangButtons(label) {
    const mobileBtn = document.getElementById('langToggleMobile');
    const desktopBtn = document.getElementById('langToggleDesktop');
    if (mobileBtn) {
      mobileBtn.innerHTML = `<span>${label}</span>`;
    }
    if (desktopBtn) {
      desktopBtn.innerHTML = `<i class="fas fa-globe"></i> <span>${label}</span>`;
    }
  }

  // 3. Hamburger Menu & Bottom Sheet Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileMenuOverlay) {
    hamburgerBtn.addEventListener('click', function () {
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    function closeMobileMenu() {
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }

    mobileMenuOverlay.addEventListener('click', function (e) {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // 4. Navbar Scroll Effect & Active Link Highlight
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // ScrollSpy active state
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });

    // Scroll to Top Button Visibility
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  // 5. Portfolio Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.classList.remove('hide');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // 6. Portfolio Lightbox Modal
  const portfolioModal = document.getElementById('portfolioModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');

  window.openModal = function (src, captionAr, captionEn) {
    if (portfolioModal && modalImg) {
      modalImg.src = src;
      const captionText = currentLang === 'en' ? captionEn : captionAr;
      modalCaption.textContent = captionText;
      portfolioModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function () {
    if (portfolioModal) {
      portfolioModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modal on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.closeModal();
    }
  });

  // 7. Counter Animation with Intersection Observer
  const counterElements = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(currentVal);
        }
      }, stepTime);
    });
  }

  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else {
    runCounters();
  }

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const serviceSelect = document.getElementById('contactService');
      const service = serviceSelect.value ? serviceSelect.options[serviceSelect.selectedIndex].text.trim() : '-';
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !phone) {
        alert(currentLang === 'en' ? 'Please fill in required fields.' : 'يرجى ملء الحقول المطلوبة.');
        return;
      }

      // Show success
      if (formSuccess) {
        formSuccess.style.display = 'block';
        contactForm.style.display = 'none';
      }

      // Optional WhatsApp forwarding
      const whatsappText = encodeURIComponent(
        `السلام عليكم، أنا ${name}\nرقم الهاتف: ${phone}\nالخدمة: ${service}\nالتفاصيل: ${message}`
      );
      setTimeout(() => {
        window.open(`https://wa.me/966577806346?text=${whatsappText}`, '_blank');
      }, 1200);
    });
  }

  // 9. Parallax Scroll Effect Polish (Disappearing/floating up effect)
  const parallaxSections = document.querySelectorAll('.parallax-section');
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    parallaxSections.forEach(section => {
      const offsetTop = section.offsetTop;
      const height = section.offsetHeight;
      if (scrolled > offsetTop - window.innerHeight && scrolled < offsetTop + height) {
        const yPos = (scrolled - offsetTop) * 0.25;
        section.style.backgroundPositionY = `${yPos}px`;
      }
    });
  });

  // 10. Scroll progress (truck riding along the navbar edge)
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    scrollProgress.style.setProperty('--p', p.toFixed(4));
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();

  // 11. Quote builder: collects the request and opens a ready-made WhatsApp message
  const qbRoot = document.getElementById('quoteBuilder');
  if (qbRoot) {
    const TEXT = {
      ar: {
        intro: 'السلام عليكم، أريد عرض سعر:',
        services: 'الخدمة', rooms: 'الغرف', acs: 'المكيفات', elevator: 'المصعد', when: 'الموعد', area: 'الحي',
        yes: 'يوجد', no: 'لا يوجد (درج)',
        svc: { moving: 'نقل عفش', ac: 'فك وتركيب مكيفات', kitchen: 'تركيب مطابخ', wrapping: 'تغليف', storage: 'تخزين أثاث', bedroom: 'غرف نوم' },
        whenv: { today: 'اليوم', soon: 'خلال 3 أيام', week: 'هذا الأسبوع', flex: 'مرن' }
      },
      en: {
        intro: 'Hello, I would like a quote:',
        services: 'Service', rooms: 'Rooms', acs: 'ACs', elevator: 'Elevator', when: 'When', area: 'District',
        yes: 'Yes', no: 'No (stairs)',
        svc: { moving: 'Furniture moving', ac: 'AC removal & installation', kitchen: 'Kitchen installation', wrapping: 'Wrapping', storage: 'Storage', bedroom: 'Bedroom assembly' },
        whenv: { today: 'Today', soon: 'Within 3 days', week: 'This week', flex: 'Flexible' }
      }
    };
    const qb = { services: new Set(), rooms: 3, acs: 0, elevator: 'yes', when: 'soon' };
    const qbLines = document.getElementById('qbLines');
    const qbEmpty = document.getElementById('qbEmpty');
    const qbSend = document.getElementById('qbSend');
    const qbArea = document.getElementById('qbArea');

    window.renderQuote = function () {
      const t = TEXT[currentLang] || TEXT.ar;
      const services = Array.from(qb.services).map(k => t.svc[k]).join(currentLang === 'en' ? ', ' : '، ');
      const area = qbArea ? qbArea.value.trim() : '';
      const rows = [];
      if (services) rows.push([t.services, services]);
      rows.push([t.rooms, String(qb.rooms)]);
      if (qb.acs > 0) rows.push([t.acs, String(qb.acs)]);
      rows.push([t.elevator, qb.elevator === 'yes' ? t.yes : t.no]);
      rows.push([t.when, t.whenv[qb.when]]);
      if (area) rows.push([t.area, area]);

      const ready = qb.services.size > 0;
      qbLines.textContent = '';
      if (ready) {
        rows.forEach(r => {
          const li = document.createElement('li');
          const a = document.createElement('span');
          const b = document.createElement('span');
          a.textContent = r[0];
          b.textContent = r[1];
          li.appendChild(a);
          li.appendChild(b);
          qbLines.appendChild(li);
        });
      }
      qbEmpty.style.display = ready ? 'none' : 'block';
      qbSend.setAttribute('aria-disabled', ready ? 'false' : 'true');
      const message = t.intro + '\n' + rows.map(r => '• ' + r[0] + ': ' + r[1]).join('\n');
      qbSend.href = ready ? 'https://wa.me/966577806346?text=' + encodeURIComponent(message) : '#quote';
    };

    function syncPressed(attr, value) {
      qbRoot.querySelectorAll('[' + attr + ']').forEach(btn => {
        btn.setAttribute('aria-pressed', btn.getAttribute(attr) === value ? 'true' : 'false');
      });
    }

    qbRoot.addEventListener('click', function (e) {
      const chip = e.target.closest('.qb-chip');
      const stepBtn = e.target.closest('.qb-step-btn');
      if (chip) {
        if (chip.dataset.service) {
          const key = chip.dataset.service;
          if (qb.services.has(key)) qb.services.delete(key); else qb.services.add(key);
          chip.setAttribute('aria-pressed', qb.services.has(key) ? 'true' : 'false');
          if (key === 'ac' && qb.services.has('ac') && qb.acs === 0) {
            qb.acs = 1;
            document.getElementById('qbAcs').textContent = qb.acs;
          }
        } else if (chip.dataset.elevator) {
          qb.elevator = chip.dataset.elevator;
          syncPressed('data-elevator', qb.elevator);
        } else if (chip.dataset.when) {
          qb.when = chip.dataset.when;
          syncPressed('data-when', qb.when);
        }
      } else if (stepBtn) {
        const key = stepBtn.dataset.step;
        const limits = { rooms: [1, 12], acs: [0, 30] }[key];
        qb[key] = Math.min(limits[1], Math.max(limits[0], qb[key] + Number(stepBtn.dataset.dir)));
        document.getElementById(key === 'rooms' ? 'qbRooms' : 'qbAcs').textContent = qb[key];
      } else {
        return;
      }
      window.renderQuote();
    });
    if (qbArea) qbArea.addEventListener('input', window.renderQuote);
    window.renderQuote();
  }

  // 12. Move checklist: progress ring + remembered ticks
  const clList = document.getElementById('clList');
  if (clList) {
    const CL_KEY = 'alandalus_checklist';
    const boxes = Array.from(clList.querySelectorAll('input[type="checkbox"]'));
    const ringBar = document.getElementById('clRingBar');
    const clPct = document.getElementById('clPct');
    const clCount = document.getElementById('clCount');
    const clMsg = document.getElementById('clMsg');
    const CIRC = 439.8;
    const MSGS = [
      ['ابدأ بأول خطوة', 'Start with the first step'],
      ['بداية ممتازة، كمّل', 'Great start, keep going'],
      ['وصلت للنصف تقريباً', 'Almost halfway there'],
      ['باقي القليل!', 'Just a few left!'],
      ['نقلتك جاهزة! اتصل بنا لنحجز موعدك', 'You are ready! Call us to book your slot']
    ];

    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(CL_KEY) || '[]'); } catch (err) { saved = []; }
    boxes.forEach(b => { b.checked = saved.indexOf(b.id) !== -1; });

    function updateChecklist() {
      const done = boxes.filter(b => b.checked).length;
      const ratio = boxes.length ? done / boxes.length : 0;
      ringBar.style.strokeDashoffset = (CIRC * (1 - ratio)).toFixed(1);
      clPct.textContent = Math.round(ratio * 100) + '%';
      clCount.textContent = done + '/' + boxes.length;
      const idx = ratio === 0 ? 0 : ratio >= 1 ? 4 : ratio < 0.4 ? 1 : ratio < 0.7 ? 2 : 3;
      clMsg.setAttribute('data-ar', MSGS[idx][0]);
      clMsg.setAttribute('data-en', MSGS[idx][1]);
      clMsg.textContent = MSGS[idx][currentLang === 'en' ? 1 : 0];
    }

    clList.addEventListener('change', function () {
      try {
        localStorage.setItem(CL_KEY, JSON.stringify(boxes.filter(b => b.checked).map(b => b.id)));
      } catch (err) { /* storage can be blocked; the list still works for this visit */ }
      updateChecklist();
    });

    const clReset = document.getElementById('clReset');
    if (clReset) {
      clReset.addEventListener('click', function () {
        boxes.forEach(b => { b.checked = false; });
        try { localStorage.removeItem(CL_KEY); } catch (err) { /* ignore */ }
        updateChecklist();
      });
    }
    updateChecklist();
  }

});