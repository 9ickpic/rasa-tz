/**
 * Простой слайдер с автопрокруткой и поддержкой touch-событий для мобильных устройств
 * @class SimpleSlider
 * @author Yaroslav Selyutin | Claude AI
 * @version 1.2.0
 * @since 2025-07-26
 */
class SimpleSlider {
  /**
   * Создает экземпляр слайдера
   * @constructor
   * @param {HTMLElement} container - DOM элемент контейнера слайдера
   * @param {Object} options - Опции для настройки слайдера
   * @param {boolean} [options.autoplay=true] - Включить автопрокрутку
   * @param {number} [options.autoplayDelay=4000] - Задержка автопрокрутки в миллисекундах
   * @param {boolean} [options.pauseOnHover=true] - Приостанавливать автопрокрутку при наведении
   * @param {boolean} [options.enableTouch=true] - Включить touch-события для мобильных устройств
   * @param {number} [options.touchThreshold=50] - Минимальное расстояние для срабатывания swipe в пикселях
   * @throws {Error} Если контейнер не найден или не содержит необходимые элементы
   */
  constructor(container, options = {}) {
    // Проверка валидности контейнера
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error("SimpleSlider: Container must be a valid DOM element");
    }

    /**
     * Основной контейнер слайдера
     * @type {HTMLElement}
     * @private
     */
    this.container = container;

    /**
     * Элемент слайдера (содержит все слайды)
     * @type {HTMLElement}
     * @private
     */
    this.slider = container.querySelector(".slider");

    /**
     * Коллекция всех слайдов
     * @type {NodeList}
     * @private
     */
    this.slides = container.querySelectorAll(".slider img");

    /**
     * Кнопка "Предыдущий слайд"
     * @type {HTMLElement}
     * @private
     */
    this.prevBtn = container.querySelector(".prev");

    /**
     * Кнопка "Следующий слайд"
     * @type {HTMLElement}
     * @private
     */
    this.nextBtn = container.querySelector(".next");

    // Проверка наличия необходимых элементов
    if (!this.slider || !this.slides.length || !this.prevBtn || !this.nextBtn) {
      throw new Error(
        "SimpleSlider: Required elements (.slider, .slider img, .prev, .next) not found"
      );
    }

    /**
     * Настройки слайдера
     * @type {Object}
     * @private
     */
    this.options = {
      autoplay: true,
      autoplayDelay: 4000,
      pauseOnHover: true,
      enableTouch: true,
      touchThreshold: 50,
      ...options,
    };

    /**
     * Текущий индекс активного слайда
     * @type {number}
     * @private
     */
    this.currentIndex = 0;

    /**
     * Общее количество слайдов
     * @type {number}
     * @private
     */
    this.totalSlides = this.slides.length;

    /**
     * ID интервала автопрокрутки
     * @type {number|null}
     * @private
     */
    this.autoplayInterval = null;

    /**
     * Флаг для определения, приостановлена ли автопрокрутка
     * @type {boolean}
     * @private
     */
    this.isPaused = false;

    /**
     * Данные touch-событий для мобильных устройств
     * @type {Object}
     * @private
     */
    this.touchData = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      isDragging: false,
    };

    // Проверка поддержки touch-событий
    /**
     * Поддерживаются ли touch-события в браузере
     * @type {boolean}
     * @private
     */
    this.isTouchSupported =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Инициализация слайдера
    this.init();
  }

  /**
   * Инициализирует слайдер и все его функции
   * @private
   */
  init() {
    this.updateSlider();
    this.bindEvents();

    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  /**
   * Привязывает все события к элементам слайдера
   * @private
   */
  bindEvents() {
    // События кнопок навигации
    this.prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.prevSlide();
    });

    this.nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.nextSlide();
    });

    // События для паузы автопрокрутки при наведении
    if (this.options.pauseOnHover && this.options.autoplay) {
      this.container.addEventListener("mouseenter", () => this.pauseAutoplay());
      this.container.addEventListener("mouseleave", () =>
        this.resumeAutoplay()
      );
    }

    // Touch-события для мобильных устройств
    if (this.options.enableTouch && this.isTouchSupported) {
      this.bindTouchEvents();
    }

    // События клавиатуры для доступности
    this.bindKeyboardEvents();
  }

  /**
   * Привязывает touch-события для мобильных устройств
   * @private
   */
  bindTouchEvents() {
    // Начало касания
    this.slider.addEventListener(
      "touchstart",
      (e) => {
        this.touchData.startX = e.touches[0].clientX;
        this.touchData.startY = e.touches[0].clientY;
        this.touchData.isDragging = true;

        // Приостанавливаем автопрокрутку во время касания
        if (this.options.autoplay) {
          this.pauseAutoplay();
        }
      },
      { passive: true }
    );

    // Движение пальца
    this.slider.addEventListener(
      "touchmove",
      (e) => {
        if (!this.touchData.isDragging) return;

        this.touchData.endX = e.touches[0].clientX;
        this.touchData.endY = e.touches[0].clientY;
      },
      { passive: true }
    );

    // Конец касания
    this.slider.addEventListener(
      "touchend",
      (e) => {
        if (!this.touchData.isDragging) return;

        this.handleSwipe();
        this.touchData.isDragging = false;

        // Возобновляем автопрокрутку после касания
        if (this.options.autoplay && !this.isPaused) {
          this.resumeAutoplay();
        }
      },
      { passive: true }
    );

    // Отмена касания
    this.slider.addEventListener(
      "touchcancel",
      () => {
        this.touchData.isDragging = false;

        if (this.options.autoplay && !this.isPaused) {
          this.resumeAutoplay();
        }
      },
      { passive: true }
    );
  }

  /**
   * Привязывает события клавиатуры для доступности
   * @private
   */
  bindKeyboardEvents() {
    this.container.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          this.prevSlide();
          break;
        case "ArrowRight":
          e.preventDefault();
          this.nextSlide();
          break;
        case " ": // Пробел
          e.preventDefault();
          this.toggleAutoplay();
          break;
      }
    });

    // Делаем контейнер фокусируемым для клавиатурной навигации
    this.container.setAttribute("tabindex", "0");
  }

  /**
   * Обрабатывает swipe-жесты на мобильных устройствах
   * @private
   */
  handleSwipe() {
    const deltaX = this.touchData.endX - this.touchData.startX;
    const deltaY = this.touchData.endY - this.touchData.startY;

    // Проверяем, что это горизонтальный swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > this.options.touchThreshold) {
        if (deltaX > 0) {
          this.prevSlide(); // Swipe вправо - предыдущий слайд
        } else {
          this.nextSlide(); // Swipe влево - следующий слайд
        }
      }
    }
  }

  /**
   * Переключает на предыдущий слайд
   * @public
   */
  prevSlide() {
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.totalSlides - 1;
    this.updateSlider();
    this.resetAutoplay();
  }

  /**
   * Переключает на следующий слайд
   * @public
   */
  nextSlide() {
    this.currentIndex =
      this.currentIndex < this.totalSlides - 1 ? this.currentIndex + 1 : 0;
    this.updateSlider();
    this.resetAutoplay();
  }

  /**
   * Переходит к указанному слайду
   * @param {number} index - Индекс слайда (0-based)
   * @public
   */
  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides && index !== this.currentIndex) {
      this.currentIndex = index;
      this.updateSlider();
      this.resetAutoplay();
    }
  }

  /**
   * Обновляет положение слайдера
   * @private
   */
  updateSlider() {
    const translateX = -this.currentIndex * 100;
    this.slider.style.transform = `translateX(${translateX}%)`;

    // Обновляем aria-атрибуты для доступности
    this.slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", index !== this.currentIndex);
    });
  }

  /**
   * Запускает автопрокрутку
   * @public
   */
  startAutoplay() {
    if (!this.options.autoplay || this.autoplayInterval) return;

    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, this.options.autoplayDelay);
  }

  /**
   * Останавливает автопрокрутку
   * @public
   */
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  /**
   * Приостанавливает автопрокрутку (временно)
   * @public
   */
  pauseAutoplay() {
    this.isPaused = true;
  }

  /**
   * Возобновляет автопрокрутку
   * @public
   */
  resumeAutoplay() {
    this.isPaused = false;
    if (this.options.autoplay && !this.autoplayInterval) {
      this.startAutoplay();
    }
  }

  /**
   * Переключает состояние автопрокрутки (вкл/выкл)
   * @public
   */
  toggleAutoplay() {
    if (this.autoplayInterval) {
      this.stopAutoplay();
      this.isPaused = true;
    } else {
      this.isPaused = false;
      this.startAutoplay();
    }
  }

  /**
   * Перезапускает автопрокрутку (сбрасывает таймер)
   * @private
   */
  resetAutoplay() {
    if (this.options.autoplay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  /**
   * Получает текущий индекс активного слайда
   * @returns {number} Индекс текущего слайда
   * @public
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Получает общее количество слайдов
   * @returns {number} Количество слайдов
   * @public
   */
  getTotalSlides() {
    return this.totalSlides;
  }

  /**
   * Проверяет, запущена ли автопрокрутка
   * @returns {boolean} true, если автопрокрутка активна
   * @public
   */
  isAutoplayActive() {
    return Boolean(this.autoplayInterval);
  }

  /**
   * Проверяет, приостановлена ли автопрокрутка
   * @returns {boolean} true, если автопрокрутка приостановлена
   * @public
   */
  isAutoplayPaused() {
    return this.isPaused;
  }

  /**
   * Уничтожает слайдер и очищает все события
   * @public
   */
  destroy() {
    this.stopAutoplay();

    // Удаляем все события
    this.prevBtn.removeEventListener("click", this.prevSlide);
    this.nextBtn.removeEventListener("click", this.nextSlide);

    // Очищаем стили
    this.slider.style.transform = "";

    // Очищаем aria-атрибуты
    this.slides.forEach((slide) => {
      slide.removeAttribute("aria-hidden");
    });

    this.container.removeAttribute("tabindex");
  }
}

/**
 * Инициализация всех слайдеров на странице
 * @function initSliders
 * @description Автоматически находит и инициализирует все слайдеры с классом .slider-container
 */
function initSliders() {
  const sliderContainers = document.querySelectorAll(".slider-container");
  const sliders = [];

  sliderContainers.forEach((container, index) => {
    try {
      // Настройки для каждого слайдера (можно кастомизировать)
      const options = {
        autoplay: true,
        autoplayDelay: 4000,
        pauseOnHover: true,
        enableTouch: true,
        touchThreshold: 50,
      };

      const slider = new SimpleSlider(container, options);
      sliders.push(slider);

      // Добавляем слайдер в глобальную область для отладки
      container.sliderInstance = slider;
    } catch (error) {
      console.error(`Error initializing slider ${index}:`, error);
    }
  });

  // Возвращаем массив созданных слайдеров
  return sliders;
}

/**
 * Точка входа в приложение
 * @event DOMContentLoaded
 * @description Инициализирует все слайдеры после загрузки DOM
 */
document.addEventListener("DOMContentLoaded", function () {
  // Инициализируем слайдеры
  const sliders = initSliders();

  // Добавляем слайдеры в глобальную область для доступа из консоли
  window.sliders = sliders;

  // Логируем информацию о созданных слайдерах
  console.log(`SimpleSlider: Initialized ${sliders.length} slider(s)`);
});

// Экспортируем класс для использования в других модулях
window.SimpleSlider = SimpleSlider;
