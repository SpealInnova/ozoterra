/**
 * OZOTERRA – Landing Page JavaScript (v2)
 * Interactividad moderna, calculadora de dosis, visor de etiquetas y WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll detection
  const header = document.querySelector('.header-main');

  function syncHeaderScrollState() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (header) {
    syncHeaderScrollState();
    window.addEventListener('scroll', syncHeaderScrollState);
  }

  // 2. Mobile navigation toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // 3. Hero Bottle View Switcher
  const heroBottleImg = document.getElementById('heroBottleImg');
  const heroFrontBtn = document.getElementById('heroFrontBtn');
  const heroBackBtn = document.getElementById('heroBackBtn');

  if (heroBottleImg && heroFrontBtn && heroBackBtn) {
    heroFrontBtn.addEventListener('click', () => {
      heroBottleImg.src = 'assets/img/ozoterra_bottle_250ml_front.png';
      heroBottleImg.alt = 'Envase real de OZOTERRA Aceite Vegetal Ozonizado 250 mL';
      heroFrontBtn.classList.add('active');
      heroBackBtn.classList.remove('active');
    });

    heroBackBtn.addEventListener('click', () => {
      heroBottleImg.src = 'assets/img/ozoterra_bottle_250ml_back.png';
      heroBottleImg.alt = 'Envase real de OZOTERRA Aceite Vegetal Ozonizado 250 mL - Vista Posterior';
      heroBackBtn.classList.add('active');
      heroFrontBtn.classList.remove('active');
    });
  }

  // 4. Product Showcase View Tabs
  const previewImg = document.getElementById('previewDisplayImg');
  const previewTabs = document.querySelectorAll('.btn-preview-tab');

  const previewSources = {
    'bottle-front': {
      src: 'assets/img/ozoterra_bottle_250ml_front.png',
      alt: 'Envase real de OZOTERRA Aceite Vegetal Ozonizado 250 mL',
      title: 'Envase Frontal 250 mL - OZOTERRA'
    },
    'bottle-back': {
      src: 'assets/img/ozoterra_bottle_250ml_back.png',
      alt: 'Envase real de OZOTERRA Aceite Vegetal Ozonizado 250 mL - Vista Posterior',
      title: 'Envase Posterior 250 mL - OZOTERRA'
    },
    'label-front': {
      src: 'assets/img/label_front_clean.png',
      alt: 'Etiqueta Frontal de Alta Resolución - OZOTERRA',
      title: 'Etiqueta Frontal Oficial - OZOTERRA'
    },
    'label-back': {
      src: 'assets/img/label_back_clean.png',
      alt: 'Etiqueta Técnica Completa - OZOTERRA',
      title: 'Etiqueta Técnica Oficial - OZOTERRA'
    }
  };

  let currentPreviewKey = 'bottle-front';

  previewTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.view;
      if (previewSources[key] && previewImg) {
        previewTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentPreviewKey = key;

        previewImg.style.opacity = '0';
        setTimeout(() => {
          previewImg.src = previewSources[key].src;
          previewImg.alt = previewSources[key].alt;
          previewImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  // 5. Modal for High Definition Label / Image Zoom
  const modalOverlay = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');

  function openModal(src, title) {
    if (modalOverlay && modalImg) {
      modalImg.src = src;
      if (modalTitle) modalTitle.textContent = title || 'Visualizador en Alta Definición';
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (previewImg) {
    previewImg.addEventListener('click', () => {
      const info = previewSources[currentPreviewKey];
      openModal(info.src, info.title);
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // 6. Interactive Dosage Calculator
  // Dose formula from label: 1 Litro de Ozoterra por cada 200 Litros de agua (5 mL por Litro)
  const calcSlider = document.getElementById('calcWaterSlider');
  const calcNumber = document.getElementById('calcWaterNumber');
  const calcDoseValue = document.getElementById('calcDoseValue');
  const calcDoseSubtext = document.getElementById('calcDoseSubtext');
  const presetButtons = document.querySelectorAll('.btn-preset');

  function updateDose(litersOfWater) {
    const liters = Math.max(1, Math.min(2000, Number(litersOfWater) || 1));
    const totalMl = liters * 5; // 5 mL per L

    if (calcSlider) calcSlider.value = liters;
    if (calcNumber) calcNumber.value = liters;

    if (calcDoseValue && calcDoseSubtext) {
      if (totalMl >= 1000) {
        const litersOzoterra = (totalMl / 1000).toFixed(2).replace(/\.00$/, '');
        calcDoseValue.innerHTML = `${litersOzoterra} <span style="font-size:1.3rem;font-weight:600;">L</span>`;
        calcDoseSubtext.textContent = `Equivalente a ${totalMl.toLocaleString()} mL para ${liters.toLocaleString()} L de agua`;
      } else {
        calcDoseValue.innerHTML = `${totalMl} <span style="font-size:1.3rem;font-weight:600;">mL</span>`;
        const bottlesCount = (totalMl / 250).toFixed(1).replace(/\.0$/, '');
        calcDoseSubtext.textContent = `Aprox. ${bottlesCount} ${bottlesCount === '1' ? 'envase' : 'envases'} de 250 mL para ${liters} L de agua`;
      }
    }
  }

  if (calcSlider && calcNumber) {
    calcSlider.addEventListener('input', (e) => {
      updateDose(e.target.value);
      highlightPreset(e.target.value);
    });

    calcNumber.addEventListener('input', (e) => {
      updateDose(e.target.value);
      highlightPreset(e.target.value);
    });

    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetVal = Number(btn.dataset.liters);
        updateDose(presetVal);
        highlightPreset(presetVal);
      });
    });

    function highlightPreset(val) {
      presetButtons.forEach(b => {
        if (Number(b.dataset.liters) === Number(val)) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    // Initialize with 200 L (standard barrel / caneca)
    updateDose(200);
    highlightPreset(200);
  }

  // 7. Contact Form Logic & WhatsApp Routing
  const contactForm = document.getElementById('contactForm');
  const btnFormWa = document.getElementById('btnFormWa');
  const formStatus = document.getElementById('formStatus');

  const waPhone = '573168787885'; // SPEAL S.A.S. Customer Service from label

  function getFormData() {
    const name = (document.getElementById('inputName')?.value || '').trim();
    const city = (document.getElementById('inputCity')?.value || '').trim();
    const phone = (document.getElementById('inputPhone')?.value || '').trim();
    const message = (document.getElementById('inputMessage')?.value || '').trim();

    return { name, city, phone, message };
  }

  function validateFormData(data) {
    if (!data.name) {
      alert('Por favor, ingresa tu nombre completo.');
      return false;
    }
    if (!data.phone) {
      alert('Por favor, ingresa un número de teléfono o celular.');
      return false;
    }
    return true;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!validateFormData(data)) return;

      // Show success feedback
      if (formStatus) {
        formStatus.textContent = '¡Gracias por contactarnos! Tu solicitud ha sido registrada correctamente. Un asesor técnico de SPEAL S.A.S. se comunicará contigo a la brevedad.';
        formStatus.className = 'form-status-msg success';
        contactForm.reset();
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 8000);
      }
    });
  }

  if (btnFormWa) {
    btnFormWa.addEventListener('click', () => {
      const data = getFormData();
      let text = `Hola, equipo SPEAL S.A.S. Estoy interesado en conocer más sobre *OZOTERRA* (Aceite Vegetal Ozonizado).`;

      if (data.name) text += `\n*Nombre:* ${data.name}`;
      if (data.city) text += `\n*Ciudad:* ${data.city}`;
      if (data.phone) text += `\n*Teléfono:* ${data.phone}`;
      if (data.message) text += `\n*Consulta:* ${data.message}`;

      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  }
});
