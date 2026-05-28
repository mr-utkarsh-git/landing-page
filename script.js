document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Navbar Scroll Effect
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. Mobile Toggle Menu
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  const toggleMenu = () => {
    mobileToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  };

  const closeMenu = () => {
    mobileToggle.classList.remove('open');
    navMenu.classList.remove('open');
  };

  mobileToggle.addEventListener('click', toggleMenu);
  
  // Close menu when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ==========================================================================
     3. Tactical Holo-Deck Sandbox (Combat Matrix)
     ========================================================================== */
  const sandbox = document.getElementById('sandbox');
  const combatNodeLabels = [
    '🛡️ Shield Barrier',
    '💥 Singularity Grenade',
    '🛰️ Recon Drone',
    '⚡ Railgun Turret',
    '🔋 Fusion Cell',
    '🌀 Gravity Rift',
    '🚀 Jetpack Booster',
    '👾 AI Drone Core'
  ];
  let nodeCount = 0;

  sandbox.addEventListener('click', (e) => {
    // If clicking on an existing node, just flash its border with energy
    if (e.target.classList.contains('sandbox-node')) {
      e.target.style.borderColor = 'var(--accent-orange)';
      e.target.style.boxShadow = '0 0 20px rgba(255, 78, 80, 0.5)';
      setTimeout(() => {
        e.target.style.borderColor = 'var(--border)';
        e.target.style.boxShadow = '0 0 20px rgba(0, 242, 254, 0.2)';
      }, 800);
      return;
    }

    const rect = sandbox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Remove instructions text on first click
    const instructions = sandbox.querySelector('.sandbox-instructions');
    if (instructions) {
      instructions.remove();
    }

    // 1. Spawn visual splash particle
    createCombatParticle(x, y);

    // 2. Spawn a floating custom node (limit active nodes to 8)
    if (nodeCount < 8) {
      createFloatingCombatNode(x, y);
      nodeCount++;
    }
  });

  function createCombatParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'sandbox-particle';
    
    // Randomly alternate particle color (Orange/Cyan)
    if (Math.random() > 0.5) {
      particle.classList.add('secondary');
    }
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    sandbox.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }

  function createFloatingCombatNode(x, y) {
    const node = document.createElement('div');
    node.className = 'sandbox-node';
    
    // Select a randomized tactical combat tag
    const labelIndex = Math.floor(Math.random() * combatNodeLabels.length);
    node.textContent = combatNodeLabels[labelIndex];

    const finalX = Math.min(Math.max(x - 60, 15), sandbox.clientWidth - 160);
    const finalY = Math.min(Math.max(y - 20, 15), sandbox.clientHeight - 60);

    node.style.left = `${finalX}px`;
    node.style.top = `${finalY}px`;
    
    // Dynamic weightless speed and delay
    const floatDuration = 5 + Math.random() * 5;
    const floatDelay = Math.random() * -4;
    node.style.animation = `weightless ${floatDuration}s ease-in-out ${floatDelay}s infinite alternate`;

    sandbox.appendChild(node);
  }

  /* ==========================================================================
     4. Interactive Battle Pack Calculator
     ========================================================================== */
  const teamSlider = document.getElementById('team-slider');
  const teamCount = document.getElementById('team-count');
  const calculatedPrice = document.getElementById('calculated-price');
  const calculatedPeriod = document.getElementById('calculated-period');
  const savingsDisplay = document.getElementById('savings-display');
  const billingToggle = document.getElementById('billing-toggle');
  const billingMonthly = document.getElementById('billing-monthly');
  const billingYearly = document.getElementById('billing-yearly');

  let isSquadPack = false;
  const BASE_PRICE = 39; // Solo License
  const SQUAD_PRICE = 31; // Squad Discounted License (~20% off)

  function updatePrice() {
    const seats = parseInt(teamSlider.value);
    const costPerLicense = isSquadPack ? SQUAD_PRICE : BASE_PRICE;
    const totalCost = seats * costPerLicense;

    teamCount.textContent = seats;
    calculatedPrice.textContent = totalCost;

    if (isSquadPack) {
      calculatedPeriod.textContent = '/ squad license';
      const savings = (BASE_PRICE - SQUAD_PRICE) * seats;
      savingsDisplay.textContent = `Squad bundle saves $${savings} on deployment!`;
      savingsDisplay.style.color = 'var(--accent-orange)';
    } else {
      calculatedPeriod.textContent = '/ standard license';
      savingsDisplay.textContent = `Save 20% by enabling Squad License Pack`;
      savingsDisplay.style.color = 'var(--text-muted)';
    }
  }

  // Toggle Billing Mode
  function toggleBilling() {
    isSquadPack = !isSquadPack;
    billingToggle.classList.toggle('yearly', isSquadPack);
    
    if (isSquadPack) {
      billingYearly.classList.add('active');
      billingMonthly.classList.remove('active');
    } else {
      billingMonthly.classList.add('active');
      billingYearly.classList.remove('active');
    }
    updatePrice();
  }

  billingToggle.addEventListener('click', toggleBilling);
  billingMonthly.addEventListener('click', () => {
    if (isSquadPack) toggleBilling();
  });
  billingYearly.addEventListener('click', () => {
    if (!isSquadPack) toggleBilling();
  });

  teamSlider.addEventListener('input', updatePrice);

  // Initialize Pricing Calculator Display
  updatePrice();

  /* ==========================================================================
     5. FAQ Accordion Panels
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all accordion panels to keep a clean structure
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });

      // Toggle current panel open state
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     6. Beta Registration Form Submission Handling
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const formSuccess = document.getElementById('form-success');
  const userEmailInput = document.getElementById('user-email');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = userEmailInput.value.trim();
    if (!email) return;

    // Simulate key generation transmission
    const submitBtn = newsletterForm.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmitting...';

    setTimeout(() => {
      newsletterForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enlist Now';
      
      formSuccess.style.display = 'block';
      formSuccess.style.opacity = '0';
      formSuccess.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        formSuccess.style.opacity = '1';
      }, 50);

      // Hide message after 6 seconds
      setTimeout(() => {
        formSuccess.style.opacity = '0';
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 500);
      }, 6000);

    }, 1000);
  });

});
