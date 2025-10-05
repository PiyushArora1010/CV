document.addEventListener('DOMContentLoaded', () => {
    // Mobile nav toggle
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => menu.classList.toggle('open'));
    }
  
    // Typewriter init
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.typewriter').forEach(el => initTypewriter(el, { prefersReduced }));
  
    // Initialize all interactive features
    if (!prefersReduced) {
      initCardTilt();
      initScrollAnimations();
      initSkillBars();
      initStatsCounter();
      initTimelineAnimation();
      initScrollProgress();
      initBackToTop();
      initHighlightsAnimation();
    }
  });
  
  function initTypewriter(el, { prefersReduced }) {
    const full = (el.dataset.text ?? el.textContent ?? '').trim();
  
    if (prefersReduced) {
      el.textContent = full;
      return;
    }
  
    const typeSpeed = parseInt(el.dataset.typeSpeed ?? '25', 10);
  
    el.textContent = '';
    const textNode = document.createTextNode('');
    const caret = document.createElement('span');
    caret.className = 'tw-caret';
    el.appendChild(textNode);
    el.appendChild(caret);
  
    let idx = 0;
    const step = () => {
      if (idx < full.length) {
        idx++;
        textNode.nodeValue = full.slice(0, idx);
        setTimeout(step, typeSpeed);
      } else {
        caret.remove();
      }
    };
  
    step();
  }
  
  // =========================================================
  // 3D Card Tilt Effect
  // =========================================================
  function initCardTilt() {
    const cards = document.querySelectorAll('.card');
  
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
  
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
  
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
  
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });
  
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  
  // =========================================================
  // Scroll Animations (Intersection Observer)
  // =========================================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });
  
    // Observe elements with animation classes
    document.querySelectorAll('.timeline-item, .skill-bar, .stat-box').forEach(el => {
      observer.observe(el);
    });
  }
  
  // =========================================================
  // Animated Skill Bars
  // =========================================================
  function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const fill = bar.querySelector('.skill-bar-fill');
          const percentage = bar.dataset.skill || '0';
          
          fill.style.setProperty('--skill-width', percentage + '%');
          bar.classList.add('animate');
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
  
    document.querySelectorAll('.skill-bar').forEach(bar => {
      observer.observe(bar);
    });
  }
  
  // =========================================================
  // Animated Stats Counter
  // =========================================================
  function initStatsCounter() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector('.stat-number');
          const target = parseInt(statNumber.dataset.count || statNumber.textContent);
          animateCounter(statNumber, 0, target, 2000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  
    document.querySelectorAll('.stat-box').forEach(box => {
      observer.observe(box);
    });
  }
  
  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';
  
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
  
      const current = Math.floor(start + (end - start) * easeOutQuad(progress));
      element.textContent = current + suffix;
  
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
  
    requestAnimationFrame(update);
  }
  
  function easeOutQuad(t) {
    return t * (2 - t);
  }
  
  // =========================================================
  // Timeline Animation
  // =========================================================
  function initTimelineAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.2 });
  
    document.querySelectorAll('.timeline-item').forEach(item => {
      observer.observe(item);
    });
  }
  
  // =========================================================
  // Scroll Progress Bar
  // =========================================================
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.prepend(progressBar);
  
    const bar = progressBar.querySelector('.scroll-progress-bar');
  
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      bar.style.width = scrolled + '%';
    });
  }
  
  // =========================================================
  // Back to Top Button
  // =========================================================
  function initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);
  
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    });
  
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // =========================================================
  // Highlights Animation
  // =========================================================
  function initHighlightsAnimation() {
    const highlights = document.querySelectorAll('.highlights li');
    
    if (highlights.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    highlights.forEach(highlight => {
      observer.observe(highlight);
    });
  }