document.addEventListener('DOMContentLoaded', () => {

  const loader = document.getElementById('loader');
  const siteWrapper = document.getElementById('siteWrapper');

  const hideLoader = () => {
    loader.classList.add('hidden');
    siteWrapper.style.opacity = '1';
  };

  const minTime = new Promise(res => setTimeout(res, 800));
  const loaded = new Promise(res => {
    if (document.readyState === 'complete') res();
    else window.addEventListener('load', res);
  });

  Promise.all([minTime, loaded]).then(hideLoader);
  if (siteWrapper) siteWrapper.style.opacity = '0';

  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let currentSlide = 0;
  let autoplayTimer;

  if (slides.length) {
    const goToSlide = (index) => {
      slides[currentSlide].classList.remove('hero__slide--active');
      dots[currentSlide].classList.remove('hero__dot--active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('hero__slide--active');
      dots[currentSlide].classList.add('hero__dot--active');
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 5000);
    };
    const stopAutoplay = () => clearInterval(autoplayTimer);

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
    });

    const sliderEl = document.getElementById('heroSlider');
    if (sliderEl) {
      let touchStartX = 0;
      sliderEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      sliderEl.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? nextSlide() : prevSlide();
          startAutoplay();
        }
      }, { passive: true });
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });

    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  const modal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  const orderModal = document.getElementById('orderModal');
  const orderModalBackdrop = document.getElementById('orderModalBackdrop');
  const orderModalClose = document.getElementById('orderModalClose');

  function openOrderModal(productName, productPrice, productImage) {
    if (!orderModal) return;
    document.getElementById('orderProductName').textContent = productName;
    document.getElementById('orderProductPrice').textContent = productPrice;
    document.getElementById('orderProductImage').src = productImage;
    orderModal.classList.add('open');
    orderModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeOrderModal() {
    if (!orderModal) return;
    orderModal.classList.remove('open');
    orderModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);
  if (orderModalBackdrop) orderModalBackdrop.addEventListener('click', closeOrderModal);

  document.querySelectorAll('.product-card__btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const card = this.closest('.product-card');
      if (!card) return;
      const name = card.querySelector('.product-card__name')?.textContent || 'Товар';
      const price = card.querySelector('.product-card__price')?.textContent || 'Цена';
      const img = card.querySelector('.product-card__img')?.src || '';
      openOrderModal(name, price, img);
    });
  });

  const infoModal = document.getElementById('infoModal');
  const infoModalBackdrop = document.getElementById('infoModalBackdrop');
  const infoModalClose = document.getElementById('infoModalClose');

  function openInfoModal() {
    if (!infoModal) return;
    infoModal.classList.add('open');
    infoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeInfoModal() {
    if (!infoModal) return;
    infoModal.classList.remove('open');
    infoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (infoModalClose) infoModalClose.addEventListener('click', closeInfoModal);
  if (infoModalBackdrop) infoModalBackdrop.addEventListener('click', closeInfoModal);

  document.querySelector('.design-project__banner .btn--orange')?.addEventListener('click', function(e) {
    e.preventDefault();
    openInfoModal();
  });

  document.querySelectorAll('[data-modal="info"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openInfoModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeOrderModal();
      closeInfoModal();
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '');
    const re = /^[78]\d{10}$/;
    return re.test(clean);
  }

  function showError(input, message) {
    const oldError = input.parentElement.querySelector('.error-message');
    if (oldError) oldError.remove();

    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.cssText = `
      color: red;
      font-size: 12px;
      margin-top: 4px;
      display: block;
      font-family: Arial, sans-serif;
    `;
    error.textContent = message;
    input.parentElement.appendChild(error);
  }

  function clearErrors(form) {
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('input').forEach(input => {
      input.style.borderColor = '';
    });
  }

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      clearErrors(this);

      let isValid = true;
      const errors = [];
      const inputs = this.querySelectorAll('input');

      inputs.forEach(input => {
        if (input.type === 'hidden' || input.type === 'checkbox') return;

        const value = input.value.trim();
        const fieldName = input.placeholder || input.name || 'поле';

        if (input.hasAttribute('required') && value === '') {
          isValid = false;
          input.style.borderColor = 'red';
          showError(input, 'Заполните это поле');
          errors.push(`${fieldName}: пустое поле`);
          return;
        }

        if (input.type === 'email' && value !== '') {
          if (!validateEmail(value)) {
            isValid = false;
            input.style.borderColor = 'red';
            showError(input, 'Введите корректный email');
            errors.push(`${fieldName}: некорректный email`);
          }
        }

        if (input.type === 'tel' && value !== '') {
          if (!validatePhone(value)) {
            isValid = false;
            input.style.borderColor = 'red';
            showError(input, 'Введите корректный номер телефона');
            errors.push(`${fieldName}: некорректный телефон`);
          }
        }
      });

      const consentCheckbox = this.querySelector('input[type="checkbox"]');
      if (consentCheckbox && consentCheckbox.hasAttribute('required') && !consentCheckbox.checked) {
        isValid = false;
        consentCheckbox.style.outline = '2px solid red';
        showError(consentCheckbox, 'Необходимо дать согласие');
        errors.push('Согласие не дано');
      }

      if (isValid) {
        console.log('✅ Форма валидна!');
        alert('✅ Форма успешно отправлена!');
        this.reset();
        clearErrors(this);

        const modal = this.closest('.modal');
        if (modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      } else {
        console.log('❌ Ошибки валидации:', errors);
        const firstError = this.querySelector('[style*="border-color: red"]');
        if (firstError) firstError.focus();
      }
    });
  });

  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
      this.style.borderColor = '';
      const error = this.parentElement.querySelector('.error-message');
      if (error) error.remove();
    });

    if (input.type === 'checkbox') {
      input.addEventListener('change', function() {
        this.style.outline = '';
        const error = this.parentElement.querySelector('.error-message');
        if (error) error.remove();
      });
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 12px rgba(0,0,0,0.12)'
        : '0 1px 4px rgba(0,0,0,0.06)';
    }, { passive: true });
  }

  document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      const icon = item.querySelector('.faq__icon');
      if (icon) {
        icon.textContent = item.open ? '−' : '+';
      }
    });
  });

});
