// Tactical Telemetry Boot Sequence
console.log("%c[ SYSTEM INIT ] DHANDHA SCHOOL V1.0", "color: #E61919; font-weight: bold; font-family: monospace; font-size: 14px;");

// Initialize Lenis for Smooth Scrolling
const lenis = window.Lenis
  ? new window.Lenis()
  : {
      raf() {},
      on(eventName, callback) {
        if (eventName === 'scroll') {
          window.addEventListener('scroll', callback, { passive: true });
        }
      },
      scrollTo(target, options = {}) {
        const top = typeof target === 'number' ? target : target?.offsetTop || 0;
        window.scrollTo({
          top,
          behavior: options.duration ? 'smooth' : 'auto',
        });
      },
    };

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

console.log("%c>>> LOADING MACRO-TYPOGRAPHY", "color: #050505; font-family: monospace;");
console.log("%c>>> ESTABLISHING GRID DETERMINISM", "color: #050505; font-family: monospace;");
console.log("%c[ STATUS: ONLINE ]", "color: #4AF626; font-weight: bold; font-family: monospace; font-size: 12px;");

// Mobile hamburger menu
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  hamburgerBtn?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburgerBtn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburgerBtn?.addEventListener('click', openMobileMenu);
mobileMenuClose?.addEventListener('click', closeMobileMenu);
mobileMenu?.querySelectorAll('.mobile-menu-item').forEach(link => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    closeMobileMenu();

    if (href?.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        requestAnimationFrame(() => {
          if (isMobile()) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            lenis.scrollTo(target, { duration: 1 });
          }
        });
      }
    }
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const icon = item.querySelector('.icon');
  const isNativeDetails = item.tagName.toLowerCase() === 'details';

  const syncItem = () => {
    const isOpen = isNativeDetails ? item.open : item.classList.contains('open');
    item.classList.toggle('open', isOpen);
    item.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (icon) icon.textContent = isOpen ? '-' : '+';
  };

  if (isNativeDetails) {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
      document.querySelectorAll('.faq-item').forEach(other => {
        const otherIcon = other.querySelector('.icon');
        const otherOpen = other.tagName.toLowerCase() === 'details'
          ? other.open
          : other.classList.contains('open');
        other.classList.toggle('open', otherOpen);
        other.setAttribute('aria-expanded', otherOpen ? 'true' : 'false');
        if (otherIcon) otherIcon.textContent = otherOpen ? '-' : '+';
      });
    });
    syncItem();
    return;
  }

  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.addEventListener('click', () => {
    const shouldOpen = !item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('open'));
    item.classList.toggle('open', shouldOpen);
    syncItem();
  });
});

// Mobile detection — disable scroll-jacking on small screens
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

// Horizontal Scroll Logic
const wrapper = document.querySelector('.h-scroll-wrapper');
const sticky = document.querySelector('.h-scroll-sticky');
const content = document.querySelector('.h-scroll-content');

if (wrapper && sticky && content) {
  let stickyTop = 0;
  let currentZone = -1;

  function updateLayout() {
    if (isMobile()) {
      // Native vertical stacking — clear desktop scroll-jack styles
      wrapper.style.height = 'auto';
      sticky.style.top = '';
      content.style.transform = '';
      return;
    }
    const diff = window.innerHeight - sticky.offsetHeight;
    stickyTop = diff < 0 ? diff : 0;
    sticky.style.top = `${stickyTop}px`;

    // Map horizontal scroll distance to vertical scroll distance.
    const maxHorizontalScroll = content.scrollWidth - window.innerWidth;
    const animationScrollDistance = window.innerHeight * 1.5;
    wrapper.style.height = `${sticky.offsetHeight + maxHorizontalScroll + animationScrollDistance}px`;
  }

  window.addEventListener('resize', updateLayout);
  setTimeout(updateLayout, 100);

  // Instructor nav click — scroll to reveal instructor panel without breaking h-scroll
  document.querySelector('a[href="#instructor"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (isMobile()) {
      document.getElementById('instructor').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const maxHScroll = content.scrollWidth - window.innerWidth;
    const targetY = wrapper.offsetTop + Math.abs(stickyTop) + maxHScroll + 80;
    lenis.scrollTo(targetY, { duration: 1.5 });
  });

  window.addEventListener('scroll', () => {
    if (isMobile()) return;
    if (wrapper.offsetParent === null) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const releaseBottom = stickyTop + sticky.offsetHeight;

    if (wrapperRect.top <= stickyTop && wrapperRect.bottom >= releaseBottom) {
      const totalScrollDistance = wrapperRect.height - sticky.offsetHeight;
      const amountScrolled = stickyTop - wrapperRect.top;

      const maxHorizontalScroll = content.scrollWidth - window.innerWidth;

      if (amountScrolled <= maxHorizontalScroll) {
        // Horizontal sliding phase
        const horizontalProgress = amountScrolled / maxHorizontalScroll;
        content.style.transform = `translateX(${-amountScrolled}px)`;

        if (currentZone !== 0) {
          currentZone = 0;
          resetAnim(document.getElementById('vcard-iisc'));
          resetAnim(document.getElementById('vcard-iim'));
          resetAnim(document.getElementById('vcard-mckinsey'));
          const nameEl = document.getElementById('instructor-name');
          if (nameEl) nameEl.style.color = '';

          document.getElementById('logo-iisc')?.classList.remove('active');
          document.getElementById('logo-iim')?.classList.remove('active');
          document.getElementById('logo-mckinsey')?.classList.remove('active');
          document.body.classList.remove('show-iisc-bg', 'show-iim-bg', 'show-mckinsey-bg');
        }

        if (horizontalProgress > 0.5) {
          document.body.classList.add('inverted-theme');
        } else {
          document.body.classList.remove('inverted-theme');
        }
      } else {
        // Locked animation phase
        content.style.transform = `translateX(${-maxHorizontalScroll}px)`;
        document.body.classList.add('inverted-theme');

        const animationScrolled = amountScrolled - maxHorizontalScroll;
        const animationProgress = animationScrolled / (totalScrollDistance - maxHorizontalScroll);

        let newZone = 0;
        if (animationProgress > 0.7) newZone = 3;
        else if (animationProgress > 0.4) newZone = 2;
        else if (animationProgress > 0.1) newZone = 1;

        if (newZone !== currentZone) {
          const iiscEl = document.getElementById('vcard-iisc');
          const iimEl = document.getElementById('vcard-iim');
          const mckinseyEl = document.getElementById('vcard-mckinsey');
          const nameEl = document.getElementById('instructor-name');

          resetAnim(iiscEl);
          resetAnim(iimEl);
          resetAnim(mckinseyEl);
          if (nameEl) nameEl.style.color = '';

          document.getElementById('logo-iisc')?.classList.remove('active');
          document.getElementById('logo-iim')?.classList.remove('active');
          document.getElementById('logo-mckinsey')?.classList.remove('active');

          if (newZone >= 1) {
             if (newZone === 1 && currentZone < 1) playAnim(iiscEl, '#125c99');
             else setStatic(iiscEl, '#125c99');
             if (nameEl) nameEl.style.color = '#125c99';
             document.getElementById('logo-iisc')?.classList.add('active');
          }
          if (newZone >= 2) {
             if (newZone === 2 && currentZone < 2) playAnim(iimEl, '#b52c31');
             else setStatic(iimEl, '#b52c31');
             if (nameEl) nameEl.style.color = '#b52c31';
             document.getElementById('logo-iim')?.classList.add('active');
          }
          if (newZone >= 3) {
             if (newZone === 3 && currentZone < 3) playAnim(mckinseyEl, '#2c457d');
             else setStatic(mckinseyEl, '#2c457d');
             if (nameEl) nameEl.style.color = '#2c457d';
             document.getElementById('logo-mckinsey')?.classList.add('active');
          }

          if (newZone === 1) {
            document.body.classList.add('show-iisc-bg');
          } else {
            document.body.classList.remove('show-iisc-bg');
          }

          if (newZone === 2) {
            document.body.classList.add('show-iim-bg');
          } else {
            document.body.classList.remove('show-iim-bg');
          }

          if (newZone === 3) {
            document.body.classList.add('show-mckinsey-bg');
          } else {
            document.body.classList.remove('show-mckinsey-bg');
          }

          currentZone = newZone;
        }
      }
    } else if (wrapperRect.top > stickyTop) {
      content.style.transform = `translateX(0px)`;
      document.body.classList.remove('inverted-theme');

      if (currentZone !== 0) {
        currentZone = 0;
        resetAnim(document.getElementById('vcard-iisc'));
        resetAnim(document.getElementById('vcard-iim'));
        resetAnim(document.getElementById('vcard-mckinsey'));
        const nameEl = document.getElementById('instructor-name');
        if (nameEl) nameEl.style.color = '';

        document.getElementById('logo-iisc')?.classList.remove('active');
        document.getElementById('logo-iim')?.classList.remove('active');
        document.getElementById('logo-mckinsey')?.classList.remove('active');
        document.body.classList.remove('show-iisc-bg', 'show-iim-bg', 'show-mckinsey-bg');
      }
    } else if (wrapperRect.bottom < releaseBottom) {
      const maxScroll = content.scrollWidth - window.innerWidth;
      content.style.transform = `translateX(${-maxScroll}px)`;

      if (currentZone !== 3) {
        currentZone = 3;
        setStatic(document.getElementById('vcard-iisc'), '#125c99');
        setStatic(document.getElementById('vcard-iim'), '#b52c31');
        setStatic(document.getElementById('vcard-mckinsey'), '#2c457d');
        const nameEl = document.getElementById('instructor-name');
        if (nameEl) nameEl.style.color = '#2c457d';

        document.getElementById('logo-iisc')?.classList.add('active');
        document.getElementById('logo-iim')?.classList.add('active');
        document.getElementById('logo-mckinsey')?.classList.add('active');
        document.body.classList.remove('show-iisc-bg', 'show-iim-bg');
        document.body.classList.add('show-mckinsey-bg');
      }

      if (wrapperRect.bottom < window.innerHeight / 2) {
        document.body.classList.remove('inverted-theme');
      } else {
        document.body.classList.add('inverted-theme');
      }
    }
  });
}

// Laptop Scale Scroll Logic
const laptopWrapper = document.querySelector('.laptop-scroll-wrapper');
const laptopSticky = document.querySelector('.laptop-sticky');
const laptopRender = document.querySelector('.laptop-render');

if (laptopWrapper && laptopSticky && laptopRender) {
  lenis.on('scroll', () => {
    const rect = laptopWrapper.getBoundingClientRect();
    const stickyTop = parseInt(window.getComputedStyle(laptopSticky).top) || 0;
    const amountScrolled = stickyTop - rect.top;
    const maxScroll = laptopWrapper.offsetHeight - window.innerHeight;

    if (amountScrolled >= 0 && amountScrolled <= maxScroll) {
      // User is scrolling within the wrapper
      const progress = amountScrolled / maxScroll;
      // Calculate scale. E.g., start at 1, max scale of 30
      const scaleVal = 1 + (progress * 30);
      laptopRender.style.setProperty('--laptop-scale', scaleVal);
    } else if (amountScrolled < 0) {
      // Before the wrapper
      laptopRender.style.setProperty('--laptop-scale', 1);
    } else {
      // Past the wrapper
      laptopRender.style.setProperty('--laptop-scale', 31);
    }
  });
}

// Helpers for GSAP split text animation (Word-based Blur Reveal)
function splitTextWords(element) {
  if (!element) return [];
  if (element.dataset.split) return element.querySelectorAll('.word');
  const text = element.innerText;
  element.innerHTML = '';
  const words = text.split(' ');
  const wordElements = [];
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word;
    span.className = 'word';
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, filter, opacity';
    element.appendChild(span);
    wordElements.push(span);

    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });
  element.dataset.split = 'true';
  return wordElements;
}

function playAnim(el, color) {
  if (!el) return;
  const words = splitTextWords(el);
  if (!words.length) return;
  if (window.gsap) {
    gsap.killTweensOf(words);
    el.style.color = color;
    el.style.opacity = 1;
    gsap.fromTo(words,
      { opacity: 0, y: -50, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.15, stagger: 0.03, ease: 'power3.out' }
    );
  }
}

function setStatic(el, color) {
  if (!el) return;
  const words = splitTextWords(el);
  if (window.gsap) gsap.killTweensOf(words);
  el.style.color = color;
  el.style.opacity = 1;
  if (window.gsap) gsap.set(words, { opacity: 1, y: 0, filter: 'blur(0px)' });
}

function resetAnim(el) {
  if (!el) return;
  const words = splitTextWords(el);
  if (window.gsap) gsap.killTweensOf(words);
  el.style.opacity = 0; // Hide the container entirely
  if (window.gsap) gsap.set(words, { opacity: 0, y: -50, filter: 'blur(10px)' });
}

// Mobile instructor reveal — SCROLL-COUPLED, exactly like desktop.
// Desktop ties the reveal to horizontal-scroll zones (newZone 1/2/3 at
// progress 0.1/0.4/0.7). Mobile has no scroll-jack, so we map the instructor
// section's travel through the viewport to the same zones and run the same
// playAnim/setStatic/resetAnim logic — reveal advances as you scroll.
if (isMobile()) {
  const instructorSection = document.getElementById('instructor');
  const iiscEl = document.getElementById('vcard-iisc');
  const iimEl = document.getElementById('vcard-iim');
  const mckinseyEl = document.getElementById('vcard-mckinsey');
  const nameEl = document.getElementById('instructor-name');

  const instructorPanel = document.querySelector('.instructor-panel');

  if (instructorSection && iiscEl) {
    resetAnim(iiscEl);
    resetAnim(iimEl);
    resetAnim(mckinseyEl);

    let mZone = -1;

    const updateInstructorReveal = () => {
      const vh = window.innerHeight;
      // The card is pinned (position: sticky) inside the tall .instructor-panel.
      // Drive zone progress off how far the panel has scrolled past the top — so
      // the reveal advances while the card stays stuck, exactly like desktop's
      // scroll-lock. Card stays pinned until McKinsey (zone 3) has landed.
      const pr = instructorPanel.getBoundingClientRect();
      const scrollable = instructorPanel.offsetHeight - vh;
      const progress = scrollable > 0 ? (-pr.top) / scrollable : 0;

      let newZone = 0;
      if (progress > 0.62) newZone = 3;
      else if (progress > 0.38) newZone = 2;
      else if (progress > 0.12) newZone = 1;

      // Card + page theme and background overlays — exactly like desktop.
      // Active only while the panel is pinned (progress within [0,1]); reverts
      // once scrolled past so pricing/FAQ below stay on the normal light theme.
      const themeActive = newZone >= 1 && progress > 0 && progress < 1.03;
      document.body.classList.toggle('inverted-theme', themeActive);
      document.body.classList.toggle('show-iisc-bg', themeActive && newZone === 1);
      document.body.classList.toggle('show-iim-bg', themeActive && newZone === 2);
      document.body.classList.toggle('show-mckinsey-bg', themeActive && newZone === 3);

      if (newZone === mZone) return;

      resetAnim(iiscEl);
      resetAnim(iimEl);
      resetAnim(mckinseyEl);
      if (nameEl) nameEl.style.color = '';
      document.getElementById('logo-iisc')?.classList.remove('active');
      document.getElementById('logo-iim')?.classList.remove('active');
      document.getElementById('logo-mckinsey')?.classList.remove('active');

      if (newZone >= 1) {
        if (newZone === 1 && mZone < 1) playAnim(iiscEl, '#125c99');
        else setStatic(iiscEl, '#125c99');
        if (nameEl) nameEl.style.color = '#125c99';
        document.getElementById('logo-iisc')?.classList.add('active');
      }
      if (newZone >= 2) {
        if (newZone === 2 && mZone < 2) playAnim(iimEl, '#b52c31');
        else setStatic(iimEl, '#b52c31');
        if (nameEl) nameEl.style.color = '#b52c31';
        document.getElementById('logo-iim')?.classList.add('active');
      }
      if (newZone >= 3) {
        if (newZone === 3 && mZone < 3) playAnim(mckinseyEl, '#2c457d');
        else setStatic(mckinseyEl, '#2c457d');
        if (nameEl) nameEl.style.color = '#2c457d';
        document.getElementById('logo-mckinsey')?.classList.add('active');
      }

      mZone = newZone;
    };

    lenis.on('scroll', updateInstructorReveal);
    updateInstructorReveal();
  }
}

// Development Failsafe
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === '0') {
    e.preventDefault();
    const postContent = document.getElementById('post-laptop-content');
    if (postContent) {
      postContent.style.display = 'block';
      // Force horizontal wrapper layout update
      window.dispatchEvent(new Event('resize'));
      // Force lenis to update its internal height cache
      if (window.lenis) window.lenis.resize();
    }
  }
});
