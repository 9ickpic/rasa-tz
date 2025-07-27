// Включаем аккордеон только если ширина < 768px
function setupAccordion() {
  const isMobile = window.innerWidth < 768;
  const buttons = document.querySelectorAll(".footer__menu-toggle");

  buttons.forEach((button) => {
    const section = button.parentElement;

    // сбросить при ресайзе
    section.classList.remove("open");

    if (isMobile) {
      button.onclick = () => section.classList.toggle("open");
    } else {
      button.onclick = null;
    }
  });
}

window.addEventListener("resize", setupAccordion);
window.addEventListener("DOMContentLoaded", setupAccordion);
