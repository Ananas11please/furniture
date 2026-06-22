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

// ВАЛИДАЦИЯ ВСЕХ ФОРМ

// Функция проверки email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Функция проверки телефона (10 или 11 цифр, начинается с 7 или 8)
function validatePhone(phone) {
  const clean = phone.replace(/[\s\-\(\)\+]/g, '');
  const re = /^[78]\d{10}$/;
  return re.test(clean);
}

// Функция показа ошибки под полем
function showError(input, message) {
  // Удаляем старую ошибку, если есть
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

// Функция удаления всех ошибок в форме
function clearErrors(form) {
  form.querySelectorAll('.error-message').forEach(el => el.remove());
  form.querySelectorAll('input').forEach(input => {
    input.style.borderColor = '';
  });
}


document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Отключаем стандартную отправку

    // Очищаем старые ошибки
    clearErrors(this);

    let isValid = true;
    const errors = [];

    // Получаем все поля ввода в этой форме
    const inputs = this.querySelectorAll('input');

    inputs.forEach(input => {
      // Пропускаем скрытые поля и чекбоксы (их проверим отдельно)
      if (input.type === 'hidden' || input.type === 'checkbox') return;

      const value = input.value.trim();
      const fieldName = input.placeholder || input.name || 'поле';

      // === 1. Проверка на пустое поле (если есть required) ===
      if (input.hasAttribute('required') && value === '') {
        isValid = false;
        input.style.borderColor = 'red';
        showError(input, 'Заполните это поле');
        errors.push(`${fieldName}: пустое поле`);
        return;
      }

      // === 2. Проверка email ===
      if (input.type === 'email' && value !== '') {
        if (!validateEmail(value)) {
          isValid = false;
          input.style.borderColor = 'red';
          showError(input, 'Введите корректный email (например, name@domain.ru)');
          errors.push(`${fieldName}: некорректный email`);
        }
      }

      // === 3. Проверка телефона ===
      if (input.type === 'tel' && value !== '') {
        if (!validatePhone(value)) {
          isValid = false;
          input.style.borderColor = 'red';
          showError(input, 'Введите корректный номер телефона (например, +7 999 123-45-67)');
          errors.push(`${fieldName}: некорректный телефон`);
        }
      }
    });

    // === 4. Проверка чекбокса согласия ===
    const consentCheckbox = this.querySelector('input[type="checkbox"]');
    if (consentCheckbox && consentCheckbox.hasAttribute('required') && !consentCheckbox.checked) {
      isValid = false;
      consentCheckbox.style.outline = '2px solid red';
      // Показываем ошибку рядом с чекбоксом
      const label = consentCheckbox.closest('label') || consentCheckbox.parentElement;
      showError(consentCheckbox, 'Необходимо дать согласие на обработку данных');
      errors.push('Согласие не дано');
    }

    // === 5. Если валидация пройдена ===
    if (isValid) {
      console.log('✅ Форма валидна! Отправляем данные...');
      
      // Собираем данные формы
      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      console.log('📦 Данные формы:', data);

      // Показываем сообщение об успехе
      alert('✅ Форма успешно отправлена! Спасибо!');

      // Очищаем форму
      this.reset();
      clearErrors(this);

      // Закрываем модальное окно, если форма внутри него
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('open');
      }

      // Здесь можно отправить данные на сервер через fetch
      /*
      fetch('/send.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(result => {
        alert('✅ Форма отправлена!');
        this.reset();
      })
      .catch(error => {
        alert('❌ Ошибка отправки. Попробуйте позже.');
      });
      */

    } else {
      // Если есть ошибки — показываем их в консоли
      console.log('❌ Ошибки валидации:', errors);
      
      // Прокручиваем к первому полю с ошибкой
      const firstError = this.querySelector('[style*="border-color: red"]');
      if (firstError) {
        firstError.focus();
      }
    }
  });
});

// ========================================
// УДАЛЕНИЕ ОШИБОК ПРИ ВВОДЕ
// ========================================

document.querySelectorAll('input').forEach(input => {
  // При вводе текста убираем ошибку
  input.addEventListener('input', function() {
    this.style.borderColor = '';
    const error = this.parentElement.querySelector('.error-message');
    if (error) error.remove();
  });

  // При изменении чекбокса убираем ошибку
  if (input.type === 'checkbox') {
    input.addEventListener('change', function() {
      this.style.outline = '';
      const error = this.parentElement.querySelector('.error-message');
      if (error) error.remove();
    });
  }
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
