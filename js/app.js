/* ================================================================
   FRANCO & DAY — Wedding Love Story
   "Dos almas libres. Una misma aventura."
   
   Main Application — Animations, Interactivity & Magic
   ================================================================ */

(function () {
  'use strict';

  /* ─── Configuration ─── */
  const CONFIG = {
    wedding: {
      date: new Date('2026-09-25T12:00:00-03:00'),
      groom: 'Franco',
      bride: 'Day',
    },
    rsvp: {
      // Connect RSVP to WhatsApp
      action: 'whatsapp', // 'whatsapp' | 'url' | 'custom'
      whatsappNumber: '5492804718472', // WhatsApp number for RSVP
      formUrl: '', // Add form URL here
    },
    music: {
      autoplayAfterInteraction: true,
    },
  };

  /* ─── DOM Ready ─── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initLoadingScreen();
    initScrollReveal();
    initParallax();
    initCountdown();
    initMusicPlayer();
    initNavigation();
    initScrollToTop();
    initLightbox();
    initGallery();
    initCustomCursor();
    initCompass();
    initCampingStars();
    initHeroDust();
    initCampfireEmbers();
    initConstellations();
    init3DTilt();
    initInteractiveStamps();
    initConfetti();
    initRSVP();
  }

  /* ═══════════════════════════════════════
     LOADING SCREEN
     ═══════════════════════════════════════ */
  function initLoadingScreen() {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;

    // Wait for hero image to load, then reveal
    const heroImg = document.querySelector('.hero__image');
    
    function reveal() {
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 1800);
    }

    if (heroImg && heroImg.complete) {
      reveal();
    } else if (heroImg) {
      heroImg.addEventListener('load', reveal);
      // Fallback: reveal after 4 seconds regardless
      setTimeout(reveal, 4000);
    } else {
      reveal();
    }
  }

  /* ═══════════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
     ═══════════════════════════════════════ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      reveals.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ═══════════════════════════════════════
     PARALLAX EFFECTS
     ═══════════════════════════════════════ */
  function initParallax() {
    const heroImage = document.getElementById('heroImage');
    const seaImage = document.getElementById('seaImage');
    const atardecerImage = document.getElementById('atardecerImage');
    
    // Use passive scroll listener for performance
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowH = window.innerHeight;

          // Hero parallax
          if (heroImage && scrollY < windowH * 1.5) {
            const offset = scrollY * 0.3;
            heroImage.style.transform = `scale(1.1) translateY(${offset}px)`;
          }

          // Sea section parallax
          if (seaImage) {
            const seaSection = seaImage.closest('.sea');
            if (seaSection) {
              const rect = seaSection.getBoundingClientRect();
              if (rect.top < windowH && rect.bottom > 0) {
                const progress = (windowH - rect.top) / (windowH + rect.height);
                const offset = (progress - 0.5) * 60;
                seaImage.style.transform = `scale(1.05) translateY(${offset}px)`;
              }
            }
          }

          // Atardecer section parallax
          if (atardecerImage) {
            const section = atardecerImage.closest('.atardecer');
            if (section) {
              const rect = section.getBoundingClientRect();
              if (rect.top < windowH && rect.bottom > 0) {
                const progress = (windowH - rect.top) / (windowH + rect.height);
                const offset = (progress - 0.5) * 50;
                atardecerImage.style.transform = `scale(1.05) translateY(${offset}px)`;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════
     COUNTDOWN TIMER
     ═══════════════════════════════════════ */
  function initCountdown() {
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');
    const section = document.getElementById('countdown');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function update() {
      const now = new Date();
      const diff = CONFIG.wedding.date - now;

      if (diff <= 0) {
        // Wedding day!
        if (section) section.classList.add('finished');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════
     MUSIC PLAYER
     ═══════════════════════════════════════ */
  function initMusicPlayer() {
    const btn = document.getElementById('musicPlayer');
    const audio = document.getElementById('bgMusic');

    if (!btn || !audio) return;

    audio.volume = 0.38;

    let hasStarted = false;

    function startAudio() {
      if (hasStarted && !audio.paused) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          hasStarted = true;
          btn.classList.add('playing');
          removeTriggerListeners();
        }).catch(() => {
          // Autoplay policy prevented immediate playback;
          // will trigger on the very next scroll or touch movement
        });
      }
    }

    // 1. Try playing immediately on page load
    startAudio();

    // 2. Comprehensive interaction and scroll listeners (desktop wheel, mobile touch swipe, scroll, click)
    const triggerEvents = [
      'scroll',
      'wheel',
      'touchmove',
      'touchstart',
      'touchend',
      'pointerdown',
      'mousedown',
      'click',
      'keydown'
    ];

    function onUserActivity() {
      if (!hasStarted || audio.paused) {
        startAudio();
      }
    }

    function removeTriggerListeners() {
      triggerEvents.forEach((evt) => {
        window.removeEventListener(evt, onUserActivity, { passive: true });
        document.removeEventListener(evt, onUserActivity, { passive: true });
      });
      window.removeEventListener('scroll', checkScroll, { passive: true });
    }

    triggerEvents.forEach((evt) => {
      window.addEventListener(evt, onUserActivity, { passive: true });
      document.addEventListener(evt, onUserActivity, { passive: true });
    });

    // Also trigger if scroll position moves
    function checkScroll() {
      if (!hasStarted && (window.scrollY > 2 || document.documentElement.scrollTop > 2)) {
        startAudio();
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });

    // Toggle button manually if user wants to pause/play
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused) {
        audio.play().then(() => {
          hasStarted = true;
          btn.classList.add('playing');
        }).catch((err) => {
          console.log('Audio play failed:', err);
        });
      } else {
        audio.pause();
        btn.classList.remove('playing');
      }
    });

    // Synchronize button bars state with audio playback
    audio.addEventListener('pause', () => btn.classList.remove('playing'));
    audio.addEventListener('play', () => {
      hasStarted = true;
      btn.classList.add('playing');
    });
  }

  /* ═══════════════════════════════════════
     FLOATING NAVIGATION
     ═══════════════════════════════════════ */
  function initNavigation() {
    const nav = document.getElementById('floatingNav');
    if (!nav) return;

    const heroHeight = window.innerHeight;
    const links = nav.querySelectorAll('.floating-nav__link');
    const sections = {};

    // Map nav links to sections
    links.forEach((link) => {
      const id = link.getAttribute('data-nav');
      const section = document.getElementById(id);
      if (section) sections[id] = section;
    });

    // Smooth scroll for nav links
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-nav');
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Show/hide nav and update active state on scroll
    let navTicking = false;
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Show nav after hero
          if (scrollY > heroHeight * 0.8) {
            nav.classList.add('visible');
          } else {
            nav.classList.remove('visible');
          }

          // Update active link
          let currentSection = '';
          Object.keys(sections).forEach((id) => {
            const section = sections[id];
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150) {
              currentSection = id;
            }
          });

          links.forEach((link) => {
            const id = link.getAttribute('data-nav');
            if (id === currentSection) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          navTicking = false;
        });
        navTicking = true;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════
     SCROLL TO TOP
     ═══════════════════════════════════════ */
  function initScrollToTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════
     LIGHTBOX
     ═══════════════════════════════════════ */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImage || !lightboxClose) return;

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('open');
      setTimeout(() => {
        lightboxImage.src = '';
      }, 400);
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });

    // Expose open function
    window.openLightbox = function (src, alt) {
      lightboxImage.src = src;
      lightboxImage.alt = alt || 'Fotografía ampliada';
      lightbox.classList.add('open');
    };
  }

  /* ═══════════════════════════════════════
     GALLERY — Click to open lightbox
     ═══════════════════════════════════════ */
  function initGallery() {
    const items = document.querySelectorAll('.gallery__item');

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-full');
        const img = item.querySelector('img');
        const alt = img ? img.alt : '';
        if (src && window.openLightbox) {
          window.openLightbox(src, alt);
        }
      });
    });
  }

  /* ═══════════════════════════════════════
     CUSTOM CURSOR (Desktop Only)
     ═══════════════════════════════════════ */
  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;

    // Only on devices with hover capability
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth follow
    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Enlarge on interactive elements
    const interactives = document.querySelectorAll('a, button, .gallery__item, .boda__map-link');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  /* ═══════════════════════════════════════
     COMPASS EASTER EGG
     ═══════════════════════════════════════ */
  function initCompass() {
    const needle = document.getElementById('compassNeedle');
    if (!needle) return;

    let compassTicking = false;
    window.addEventListener('scroll', () => {
      if (!compassTicking) {
        requestAnimationFrame(() => {
          const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
          const rotation = scrollPercent * 720; // Two full rotations through the page
          needle.style.transform = `rotate(${rotation}deg)`;
          compassTicking = false;
        });
        compassTicking = true;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════
     CAMPING STARS
     ═══════════════════════════════════════ */
  function initCampingStars() {
    const container = document.getElementById('campingStars');
    if (!container) return;

    const starCount = 60;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'camping__star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (2 + Math.random() * 3) + 's';
      
      // Vary star size
      const size = 1 + Math.random() * 2;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      
      fragment.appendChild(star);
    }

    container.appendChild(fragment);
  }

  /* ═══════════════════════════════════════
     CONSTELLATIONS (Canvas)
     ═══════════════════════════════════════ */
  function initConstellations() {
    const canvas = document.getElementById('constellationCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let constellationStars = [];
    let animationStarted = false;
    let animationProgress = 0;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }

    resize();
    window.addEventListener('resize', resize);

    // Generate background stars
    function generateStars() {
      stars = [];
      const count = Math.floor((width * height) / 4000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.6 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Define F & D constellation points (relative to center)
    function generateConstellation() {
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.15;

      // F shape (left side)
      const fPoints = [
        { x: cx - scale * 1.2, y: cy - scale * 0.8 },
        { x: cx - scale * 1.2, y: cy },
        { x: cx - scale * 1.2, y: cy + scale * 0.8 },
        { x: cx - scale * 0.6, y: cy - scale * 0.8 },
        { x: cx - scale * 0.6, y: cy },
      ];

      // & symbol (center) - just a point
      const ampersand = [
        { x: cx, y: cy - scale * 0.2 },
      ];

      // D shape (right side)
      const dPoints = [
        { x: cx + scale * 0.5, y: cy - scale * 0.8 },
        { x: cx + scale * 0.5, y: cy },
        { x: cx + scale * 0.5, y: cy + scale * 0.8 },
        { x: cx + scale * 1.0, y: cy - scale * 0.5 },
        { x: cx + scale * 1.2, y: cy },
        { x: cx + scale * 1.0, y: cy + scale * 0.5 },
      ];

      constellationStars = [...fPoints, ...ampersand, ...dPoints].map((p) => ({
        ...p,
        size: 2,
        opacity: 0,
        targetOpacity: 0.9,
      }));

      // Define connections (lines between constellation stars)
      // F: 0-1, 1-2, 0-3, 1-4
      // D: 5-6, 6-7, 5-8, 8-9, 9-10, 10-7
      constellationStars.connections = [
        [0, 1], [1, 2], [0, 3], [1, 4],
        [6, 7], [7, 8], [5, 8], [8, 9], [9, 10], [10, 7],
        [4, 5], // Connect F to & to D
        [5, 6],
      ];
    }

    generateStars();
    generateConstellation();

    // Observe when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            animationStarted = true;
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(canvas.parentElement);

    // Shooting stars state
    const shootingStars = [];
    let lastShootingStarTime = 0;

    function maybeSpawnShootingStar(time) {
      if (time - lastShootingStarTime > 2800 && Math.random() < 0.45) {
        lastShootingStarTime = time;
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          len: Math.random() * 90 + 60,
          speed: Math.random() * 9 + 7,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
          life: 1,
          decay: Math.random() * 0.02 + 0.012,
        });
      }
    }

    // Animation loop
    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      // Draw background stars
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.opacity + twinkle * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 251, 247, ${Math.max(0, opacity)})`;
        ctx.fill();
      });

      // Animate shooting stars
      if (animationStarted) {
        maybeSpawnShootingStar(time);
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.life -= s.decay;

          if (s.life <= 0 || s.x > width + 100 || s.y > height + 100) {
            shootingStars.splice(i, 1);
            continue;
          }

          const tailX = s.x - Math.cos(s.angle) * s.len;
          const tailY = s.y - Math.sin(s.angle) * s.len;
          const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, 'rgba(253, 251, 247, 0)');
          grad.addColorStop(1, `rgba(253, 251, 247, ${s.life * 0.85})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }

      // Animate constellation
      if (animationStarted && animationProgress < 1) {
        animationProgress = Math.min(1, animationProgress + 0.005);
      }

      if (animationProgress > 0) {
        const visibleCount = Math.floor(animationProgress * constellationStars.length);

        // Draw constellation stars
        constellationStars.forEach((star, i) => {
          if (i > visibleCount) return;
          
          const fadeIn = i === visibleCount 
            ? (animationProgress * constellationStars.length) % 1
            : 1;

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size + 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 130, 103, ${fadeIn * star.targetOpacity})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 130, 103, ${fadeIn * 0.1})`;
          ctx.fill();
        });

        // Draw connections
        if (constellationStars.connections) {
          constellationStars.connections.forEach(([a, b]) => {
            if (a > visibleCount || b > visibleCount) return;
            
            const starA = constellationStars[a];
            const starB = constellationStars[b];
            
            ctx.beginPath();
            ctx.moveTo(starA.x, starA.y);
            ctx.lineTo(starB.x, starB.y);
            ctx.strokeStyle = `rgba(201, 130, 103, ${animationProgress * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        }
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* ═══════════════════════════════════════
     HERO DUST PARTICLES (Golden Sun Motes)
     ═══════════════════════════════════════ */
  function initHeroDust() {
    const canvas = document.getElementById('heroDustCanvas');
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);
    let isVisible = true;

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.5 + 0.1,
        baseAlpha: Math.random() * 0.45 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas.parentElement);

    function loop(time) {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed) * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 248, 220, ${Math.max(0, alpha)})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ═══════════════════════════════════════
     CAMPFIRE EMBERS PARTICLE SYSTEM
     ═══════════════════════════════════════ */
  function initCampfireEmbers() {
    const canvas = document.getElementById('campfireEmbersCanvas');
    const campfire = document.getElementById('campfireElement');
    if (!canvas || !campfire || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);
    let isVisible = false;

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const embers = [];
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.15 });
    observer.observe(canvas.parentElement);

    function spawnEmber() {
      const rect = campfire.getBoundingClientRect();
      const parentRect = canvas.parentElement.getBoundingClientRect();
      const originX = rect.left - parentRect.left + rect.width / 2 + (Math.random() - 0.5) * 24;
      const originY = rect.bottom - parentRect.top - 18;

      embers.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(Math.random() * 2.2 + 1.2),
        size: Math.random() * 2.5 + 1.2,
        life: 1,
        decay: Math.random() * 0.012 + 0.007,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let lastSpawn = 0;
    function loop(time) {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        if (time - lastSpawn > 100 && embers.length < 60) {
          lastSpawn = time;
          spawnEmber();
        }

        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i];
          e.y += e.vy;
          e.x += e.vx + Math.sin(time * e.wobbleSpeed + e.phase) * 0.6;
          e.life -= e.decay;

          if (e.life <= 0) {
            embers.splice(i, 1);
            continue;
          }

          const r = 255;
          const g = Math.floor(120 + e.life * 120);
          const b = Math.floor(e.life * 45);

          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size * Math.max(0.2, e.life), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${e.life * 0.9})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 100, 20, 0.6)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ═══════════════════════════════════════
     3D TACTILE TILT ON POLAROIDS
     ═══════════════════════════════════════ */
  function init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      const glare = card.querySelector('.polaroid__glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;

        if (glare) {
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`;
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        if (glare) {
          glare.style.opacity = '0';
        }
      });
    });
  }

  /* ═══════════════════════════════════════
     INTERACTIVE PASSPORT STAMPS & WAX SEAL
     ═══════════════════════════════════════ */
  function initInteractiveStamps() {
    const stamps = document.querySelectorAll('.stamp-interactive');
    stamps.forEach((stamp) => {
      stamp.addEventListener('click', (e) => {
        stamp.classList.remove('stamped');
        void stamp.offsetWidth;
        stamp.classList.add('stamped');

        // Launch celebratory confetti if it's the wax seal
        if (stamp.classList.contains('wax-seal') && window.launchCelebrationConfetti) {
          window.launchCelebrationConfetti(e.clientX, e.clientY);
        }
      });
    });
  }

  /* ═══════════════════════════════════════
     CONFETTI CELEBRATION ENGINE
     ═══════════════════════════════════════ */
  function initConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    let particles = [];
    const colors = ['#D4AF37', '#C98267', '#FAF8F2', '#527783', '#EFE5D5', '#E2583E'];

    window.launchCelebrationConfetti = function (originX, originY) {
      const count = 90;
      const ox = originX || width / 2;
      const oy = originY || height * 0.6;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 4;
        particles.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          gravity: 0.24,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 7 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          life: 1,
          decay: Math.random() * 0.015 + 0.008,
          isHeart: Math.random() < 0.25,
        });
      }
    };

    function drawHeart(ctx, x, y, size, color, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2, 0, size);
      ctx.bezierCurveTo(0, (size + topCurveHeight) / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function loop() {
      if (particles.length > 0) {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.98;
          p.rotation += p.rotationSpeed;
          p.life -= p.decay;

          if (p.life <= 0 || p.y > height + 20) {
            particles.splice(i, 1);
            continue;
          }

          if (p.isHeart) {
            drawHeart(ctx, p.x, p.y, p.size, p.color, p.life);
          } else {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            ctx.restore();
          }
        }
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ═══════════════════════════════════════
     RSVP
     ═══════════════════════════════════════ */
  function initRSVP() {
    const btn = document.getElementById('rsvpButton');
    const toast = document.getElementById('rsvpToast');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      // Launch celebratory confetti
      if (window.launchCelebrationConfetti) {
        window.launchCelebrationConfetti(e.clientX, e.clientY);
      }

      // Automatic WhatsApp message: "Si asistire"
      const msg = encodeURIComponent('Si asistire');
      const whatsappUrl = CONFIG.rsvp.whatsappNumber
        ? `https://wa.me/${CONFIG.rsvp.whatsappNumber}?text=${msg}`
        : `https://api.whatsapp.com/send?text=${msg}`;

      showToast();

      // Open WhatsApp automatically
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 400);
    });

    function showToast() {
      if (!toast) return;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }

})();
