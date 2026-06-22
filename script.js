document.addEventListener('DOMContentLoaded', () => {

  /* 1. LOADING SCREEN*/
  const loader      = document.getElementById('loader');
  const siteWrapper = document.getElementById('siteWrapper');

  const hideLoader = () => {
    loader.classList.add('hidden');
    siteWrapper.style.opacity = '1';
  };

  // Minimum display time: 800ms
  const minTime = new Promise(res => setTimeout(res, 800));
  const loaded  = new Promise(res => {
    if (document.readyState === 'complete') res();
    else window.addEventListener('load', res);
  });

  Promise.all([minTime, loaded]).then(hideLoader);

  // Fade in the site
  if (siteWrapper) siteWrapper.style.opacity = '0';

  /* 2. HERO SLIDER */
  const slides     = document.querySelectorAll('.hero__slide');
  const dots       = document.querySelectorAll('.hero__dot');
  const prevBtn    = document.getElementById('heroPrev');
  const nextBtn    = document.getElementById('heroNext');
  let   currentSlide = 0;
  let   autoplayTimer;

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

    // Autoplay every 5s
    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoplay = () => clearInterval(autoplayTimer);

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    // Dot clicks
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
    });

    // Touch/swipe support
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

    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  /* 3. BURGER / MOBILE MENU */
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });

    // Close on nav link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* 4. CONTACT MODAL*/
  const modal         = document.getElementById('contactModal');
  const modalClose    = document.getElementById('modalClose');
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

  // Открытие по кнопкам "Обратный звонок" и другим с классом .open-modal
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalClose)    modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

// ========================================
// ВАЛИДАЦИЯ ФОРМ
// ========================================

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    // Проверяем все поля с атрибутом required
    const requiredInputs = this.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      // Убираем старую подсветку
      input.style.borderColor = '';
      const existingError = input.parentElement.querySelector('.error-message');
      if (existingError) existingError.remove();

      // Проверяем, что поле не пустое
      if (input.value.trim() === '') {
        isValid = false;
        input.style.borderColor = 'red';
        showError(input, 'Заполните это поле');
      }

      // Доп. проверка для email
      if (input.type === 'email' && input.value.trim() !== '') {
        if (!validateEmail(input.value)) {
          isValid = false;
          input.style.borderColor = 'red';
          showError(input, 'Введите корректный email');
        }
      }

      // Доп. проверка для телефона
      if (input.type === 'tel' && input.value.trim() !== '') {
        if (!validatePhone(input.value)) {
          isValid = false;
          input.style.borderColor = 'red';
          showError(input, 'Введите корректный номер телефона');
        }
      }
    });

    if (isValid) {
      console.log('✅ Форма валидна!');
      alert('✅ Форма успешно отправлена!');
      this.reset();
      // Закрываем модалку, если форма внутри неё
      const modal = this.closest('.modal');
      if (modal) modal.classList.remove('open');
    } else {
      console.log('❌ Ошибки валидации');
    }
  });
});

// Функция для отображения ошибки
function showError(input, message) {
  const error = document.createElement('span');
  error.className = 'error-message';
  error.style.cssText = 'color: red; font-size: 12px; margin-top: 4px; display: block;';
  error.textContent = message;
  input.parentElement.appendChild(error);
}

// Функция проверки email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Функция проверки телефона (10 или 11 цифр)
function validatePhone(phone) {
  const clean = phone.replace(/[\s\-\(\)\+]/g, '');
  const re = /^[78]\d{10}$/;
  return re.test(clean);
}

// Убираем ошибку при вводе
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    const error = this.parentElement.querySelector('.error-message');
    if (error) error.remove();
  });
});
  /* 5. NEWSLETTER FORM */
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.includes('@')) {
        // Simple success feedback
        const btn = newsletterForm.querySelector('.btn');
        const original = btn.textContent;
        btn.textContent = 'Готово!';
        btn.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.backgroundColor = '';
          input.value = '';
        }, 3000);
      }
    });
  }

  /* 6. MODAL FORM SUBMIT*/
  const modalForm = document.querySelector('.modal__form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = modalForm.querySelector('.btn');
      const original = btn.textContent;
      btn.textContent = 'Отправлено!';
      btn.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.backgroundColor = '';
        closeModal();
      }, 2000);
    });
  }

  // Модальное окно для заказа
const orderModal = document.getElementById('orderModal');
const orderModalBackdrop = document.getElementById('orderModalBackdrop');
const orderModalClose = document.getElementById('orderModalClose');

// Функция открытия модального окна заказа
function openOrderModal(productName, productPrice, productImage) {
  document.getElementById('orderProductName').textContent = productName;
  document.getElementById('orderProductPrice').textContent = productPrice;
  document.getElementById('orderProductImage').src = productImage;
  orderModal.classList.add('open');
}

// Закрытие модального окна заказа
function closeOrderModal() {
  orderModal.classList.remove('open');
}

orderModalBackdrop.addEventListener('click', closeOrderModal);
orderModalClose.addEventListener('click', closeOrderModal);

// Назначаем кнопкам "Заказать"
document.querySelectorAll('.product-card__btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const card = this.closest('.product-card');
    const name = card.querySelector('.product-card__name').textContent;
    const price = card.querySelector('.product-card__price').textContent;
    const img = card.querySelector('.product-card__img').src;
    openOrderModal(name, price, img);
  });
});

// Модальное окно "Узнать"
const infoModal = document.getElementById('infoModal');
const infoModalBackdrop = document.getElementById('infoModalBackdrop');
const infoModalClose = document.getElementById('infoModalClose');

function openInfoModal() {
  infoModal.classList.add('open');
}

function closeInfoModal() {
  infoModal.classList.remove('open');
}

infoModalBackdrop.addEventListener('click', closeInfoModal);
infoModalClose.addEventListener('click', closeInfoModal);

// Назначаем кнопке "Узнать"
document.querySelector('.design-project__banner .btn--orange').addEventListener('click', function(e) {
  e.preventDefault();
  openInfoModal();
});

// Все кнопки, которые открывают модалку "Узнать"
document.querySelectorAll('[data-modal="info"]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    openInfoModal();
  });
});

  /* ──────────────────────────────────────────────────────
     7. SMOOTH SCROLL — anchor links
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────────────────
     8. HEADER SCROLL SHADOW
  ────────────────────────────────────────────────────── */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
      } else {
        header.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────
     9. FAQ — plus/minus icon toggle
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq__item').forEach(item => {
    item.addEventListener('toggle', () => {
      const icon = item.querySelector('.faq__icon');
      if (icon) {
        icon.textContent = item.open ? '−' : '+';
      }
    });
  });

});
