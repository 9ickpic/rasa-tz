// Находим все слайдеры на странице
const sliders = document.querySelectorAll('.car__slider .slider');

// Для каждого слайдера создаем свою логику
sliders.forEach((slider) => {
  const slides = slider.querySelectorAll('.slide');
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  let currentSlide = 0;

  function updateSlide() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    prevBtn.classList.toggle('hidden', currentSlide === 0);
    nextBtn.classList.toggle('hidden', currentSlide === slides.length - 1);
  }

  function nextSlide() {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      updateSlide();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlide();
    }
  }

  // Привязываем события к кнопкам конкретного слайдера
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Инициализируем слайдер
  updateSlide();
});
