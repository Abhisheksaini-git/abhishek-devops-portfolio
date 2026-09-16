import { CyberpunkScene } from './3d/scene.js';
import { Hero3DStage } from './3d/heroStage.js';
import { portfolioData } from './data/portfolioData.js';
import { sound } from './utils/audio.js';
import { initInteractiveTerminal } from './terminal/devopsTerminal.js';
import confetti from 'canvas-confetti';

function initApp() {
  // 1. Interactive DevOps Terminal Console (Highest Priority)
  try {
    initInteractiveTerminal();
  } catch (err) {
    console.error('Interactive DevOps Terminal error:', err);
  }

  // 2. Initialize Interactive 3D Hero Stage (Central 3D Viewport)
  let hero3D = null;
  const stageMount = document.getElementById('hero-3d-canvas-mount');
  const hudElement = document.getElementById('hero-3d-hud');
  if (stageMount) {
    try {
      hero3D = new Hero3DStage(stageMount, hudElement);
      setupHero3DControls(hero3D);
    } catch (err) {
      console.error('Hero 3D stage initialization error:', err);
    }
  }

  // 3. Initialize Ambient Three.js 3D Background Particle Field
  const canvasContainer = document.getElementById('webgl-canvas-container');
  let sceneInstance = null;
  if (canvasContainer) {
    try {
      sceneInstance = new CyberpunkScene(canvasContainer);
    } catch (err) {
      console.warn('Three.js WebGL background initialization skipped:', err);
    }
  }

  // Audio stays muted by default

  // 6. Navigation Active Tracking on Scroll & Click
  try {
    setupNavigation();
  } catch (err) {
    console.error('Navigation setup error:', err);
  }

  // 7. Resume Modal Controls
  try {
    setupResumeModal();
  } catch (err) {
    console.error('Resume modal error:', err);
  }

  // 8. Contact Form Submission Handling
  try {
    setupContactForm();
  } catch (err) {
    console.error('Contact form error:', err);
  }
}

// Hero 3D Controls setup
function setupHero3DControls(hero3D) {
  if (!hero3D) return;

  const hudStatus = document.getElementById('hud-status-text');

  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      hero3D.setMode(mode);

      if (hudStatus) {
        if (mode === 'k8s') {
          hudStatus.textContent = '3D ARCHITECTURE: KUBERNETES CLUSTER ACTIVE';
        } else if (mode === 'aws') {
          hudStatus.textContent = '3D ARCHITECTURE: AWS MULTI-AZ ARCHITECTURE ACTIVE';
        } else if (mode === 'docker') {
          hudStatus.textContent = '3D ARCHITECTURE: DOCKER COMPOSE MESH ACTIVE';
        }
      }

      showToast(`3D Mode: ${mode.toUpperCase()} Architecture Loaded`);
    });
  });

  const rotateBtn = document.getElementById('btn-toggle-rotate');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      const isRotating = hero3D.toggleAutoRotate();
      rotateBtn.textContent = isRotating ? '⏸ Pause Spin' : '↻ Auto-Spin';
      showToast(isRotating ? '3D Auto-Rotation: ON' : '3D Auto-Rotation: OFF');
    });
  }

  const resetBtn = document.getElementById('btn-reset-camera');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      hero3D.resetCamera();
      showToast('3D Viewport Angle Reset');
    });
  }
}

// Resilient initialization: execute immediately if DOM is already parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Toast notification helper
function showToast(message, duration = 3500) {
  const container = document.getElementById('toast-notifications');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--neon-cyan);">⚡</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 3D Tilt Card Effect
function attach3DTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
}




// Production-Quality Active Navigation & Scroll Synchronization
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  let isManualNav = false;
  let manualNavTimer = null;

  // Setup mobile navigation drawer hooks
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (window.toggleMobileMenu) window.toggleMobileMenu();
    });
  }
  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', () => {
      if (window.closeMobileMenu) window.closeMobileMenu();
    });
  }
  document.querySelectorAll('.mobile-nav-link, .mobile-action-btn').forEach(item => {
    item.addEventListener('click', () => {
      if (window.closeMobileMenu) window.closeMobileMenu();
    });
  });

  // Single source of truth for active navigation item
  function setActiveNav(targetId) {
    if (!targetId) return;

    let matched = false;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
        matched = true;
      } else {
        link.classList.remove('active');
      }
    });

    // Fallback: If target is top or hero, ensure Overview is marked
    if (!matched && (targetId === 'hero' || targetId === 'overview')) {
      const heroLink = document.getElementById('nav-link-hero');
      if (heroLink) heroLink.classList.add('active');
    }
  }

  // 1. Handle user clicks on any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        sound.playClick();

        // Immediately update active tab
        setActiveNav(targetId);

        // Lock observer updates temporarily during smooth scroll transition
        isManualNav = true;
        clearTimeout(manualNavTimer);

        // Update URL hash without causing an instant jarring jump
        if (history.pushState) {
          history.pushState(null, '', href);
        } else {
          window.location.hash = href;
        }

        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Re-enable automatic scroll tracking once scroll animation settles
        manualNavTimer = setTimeout(() => {
          isManualNav = false;
        }, 850);
      }
    });
  });

  // Also support clicking brand logo or 'Let's Talk' buttons smoothly
  const brandLogo = document.getElementById('nav-brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveNav('hero');
      const heroElem = document.getElementById('hero');
      if (heroElem) heroElem.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const connectBtn = document.getElementById('nav-connect-btn');
  if (connectBtn) {
    connectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveNav('contact');
      const contactElem = document.getElementById('contact');
      if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 2. IntersectionObserver for automatic scroll tracking
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -40% 0px',
      threshold: [0.1, 0.3, 0.6]
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      if (isManualNav) return;

      const intersectingEntries = entries.filter(entry => entry.isIntersecting);
      if (intersectingEntries.length > 0) {
        // Pick the entry with the highest intersection ratio
        intersectingEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const bestEntry = intersectingEntries[0];
        setActiveNav(bestEntry.target.id);
      }
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // 3. Fallback and Boundary Detection (Top of Page / Bottom of Page)
  window.addEventListener('scroll', () => {
    if (isManualNav) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;

    // Top boundary: near very top of page -> Overview
    if (scrollY < 100) {
      setActiveNav('hero');
      return;
    }

    // Bottom boundary: reached bottom of page -> Contact
    if (scrollY + winHeight >= docHeight - 80) {
      setActiveNav('contact');
      return;
    }

    // Secondary fallback calculation for browsers where IntersectionObserver is slow
    let currentId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= winHeight * 0.35 && rect.bottom >= winHeight * 0.2) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      setActiveNav(currentId);
    }
  }, { passive: true });

  // 4. Initial Load & Deep-Link / URL Hash Preservation
  function syncWithCurrentHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && document.getElementById(hash)) {
      setActiveNav(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      setActiveNav('hero');
    }
  }

  syncWithCurrentHash();

  // 5. Hash change listener (browser back / forward buttons)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && document.getElementById(hash)) {
      setActiveNav(hash);
    }
  });
}

// Resume Modal & Download
function setupResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  const openBtns = document.querySelectorAll('a[href="#resume-modal"]');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const downloadBtn = document.getElementById('download-resume-btn');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('open');
    sound.playClick();
  }

  function closeModal() {
    modal.classList.remove('open');
    sound.playClick();
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      sound.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast('Opening Abhishek Saini\'s DevOps Resume (PDF placeholder)...');
      
      // Attempt to open or download
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Abhishek_Saini_DevOps_Resume.pdf';
      link.target = '_blank';
      link.click();
    });
  }
}

// Contact Form: Transmit directly to Outlook ID (abhishek.sainiii@outlook.com)
function setupContactForm() {
  const form = document.getElementById('contact-form-element');
  if (!form) return;

  const statusBanner = document.getElementById('form-status-banner');
  const submitBtn = document.getElementById('contact-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email-input').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all fields before transmitting.');
      return;
    }

    // Update button to transmitting state
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="btn-spinner"></span>
      <span>Transmitting to Outlook...</span>
    `;

    if (statusBanner) {
      statusBanner.style.display = 'none';
      statusBanner.className = '';
    }

    try {
      // 1. Attempt direct submission to Outlook via FormSubmit AJAX service
      const response = await fetch('https://formsubmit.co/ajax/abhishek.sainiii@outlook.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `New DevOps Portfolio Message from ${name}`,
          message: message,
          _replyto: email,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        // Trigger Cyberpunk Confetti Burst
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#a855f7', '#10b981', '#ffffff']
        });

        showToast(`✓ Transmission Sent! Message delivered to abhishek.sainiii@outlook.com`);

        if (statusBanner) {
          statusBanner.style.display = 'block';
          statusBanner.className = 'form-banner form-banner-success';
          statusBanner.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.6rem;">
              <span style="font-size: 1.2rem; line-height: 1;">✓</span>
              <div>
                <strong>Transmission Successful!</strong><br />
                Your message has been sent directly to <strong>abhishek.sainiii@outlook.com</strong>. Abhishek will review and get back to you shortly.
              </div>
            </div>
          `;
        }

        form.reset();
      } else {
        throw new Error(data.message || 'Server returned status ' + response.status);
      }
    } catch (err) {
      console.warn('FormSubmit AJAX attempt error, providing direct mailto fallback:', err);
      
      // Fallback: Launch default email / Outlook with prefilled details
      const subject = encodeURIComponent(`DevOps Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:abhishek.sainiii@outlook.com?subject=${subject}&body=${body}`;

      showToast(`Opening email client to transmit to abhishek.sainiii@outlook.com...`);

      if (statusBanner) {
        statusBanner.style.display = 'block';
        statusBanner.className = 'form-banner form-banner-info';
        statusBanner.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 0.6rem;">
            <span style="font-size: 1.2rem; line-height: 1;">✉️</span>
            <div>
              <strong>Opening Email Client...</strong><br />
              If your email app didn't open automatically, you can send directly to <a href="mailto:abhishek.sainiii@outlook.com" style="color: var(--neon-cyan); text-decoration: underline;">abhishek.sainiii@outlook.com</a>.
            </div>
          </div>
        `;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });

  // Copy email click
  const emailItem = document.getElementById('contact-email-link');
  if (emailItem) {
    emailItem.addEventListener('click', (e) => {
      navigator.clipboard.writeText(portfolioData.personal.email).then(() => {
        showToast(`Email copied to clipboard: ${portfolioData.personal.email}`);
      }).catch(() => {});
    });
  }
}
