function toggleMenu() {
  const menuItems = document.querySelectorAll('.h');
  const menu = document.querySelector('ul.menu');

  menuItems.forEach((item) => {
    item.classList.toggle('active');
  });

  menu.classList.toggle('active');
}
