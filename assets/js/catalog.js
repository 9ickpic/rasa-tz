/**
 * Загрузка и рендер машин из каталога JSON формата
 * @async
 */
async function loadCatalog() {
  const catalog = document.getElementById("main-catalog");
  if (!catalog) {
    alert("Извините, что-то не так с версткой каталога :(");
    console.error("Элемент каталога не найден!");
    return;
  }

  /**
   * @typedef {Object} Car
   * @property {string} image - Путь до изображения.
   * @property {string} alt - Альтернативный текст для изображения.
   * @property {string} name - Модель машины.
   * @property {string} address - Адрес, где находится машина.
   * @property {string} price - Цена машины.
   */

  let cars = [];
  let displayedCount = 0;
  let totalCars = 0;

  try {
    const response = await fetch("./data/catalog.json");
    if (!response.ok) {
      throw new Error("Не удалось загрузить каталог");
    }

    /**
     * @type {Car[]}
     */
    cars = await response.json();
    totalCars = cars.length;
  } catch (error) {
    const errorDiv = document.createElement("div");
    const message = document.createElement("p");
    message.textContent = "Не удалось загрузить каталог";
    errorDiv.append(message);
    catalog.append(errorDiv);
    console.error("Не удалось получить данные из каталога");
    return;
  }

  /**
   * Определяет количество элементов для показа в зависимости от размера экрана
   * @returns {number}
   */
  function getInitialItemsCount() {
    const width = window.innerWidth;
    if (width <= 767) {
      // Мобильные устройства
      return 3;
    } else if (width <= 1024) {
      // Планшеты
      return 6;
    } else {
      // Десктоп
      return cars.length; // Показываем все
    }
  }

  /**
   * Создает карточку машины
   * @param {Car} car
   * @returns {HTMLElement}
   */
  function createCarCard(car) {
    const card = document.createElement("div");
    card.classList.add("catalog__card");

    const img = document.createElement("img");
    img.src = car.image;
    img.alt = car.alt;

    const title = document.createElement("h4");
    title.textContent = car.name;

    const address = document.createElement("span");
    address.classList.add("catalog__card--address");
    address.textContent = car.address;

    const footer = document.createElement("div");
    footer.classList.add("flex-row", "justify-between", "mt-8");

    const price = document.createElement("span");
    price.classList.add("catalog__card--price", "semibold-text");
    price.textContent = car.price;

    const link = document.createElement("a");
    link.href = "#";
    link.textContent = "Подробнее";

    footer.append(price, link);
    card.append(img, title, address, footer);

    return card;
  }

  /**
   * Отображает машины в каталоге
   * @param {number} count - количество машин для отображения
   */
  function displayCars(count) {
    // Очищаем каталог от карточек (но не от кнопки)
    const existingCards = catalog.querySelectorAll(".catalog__card");
    existingCards.forEach((card) => card.remove());

    // Добавляем карточки
    for (let i = 0; i < Math.min(count, totalCars); i++) {
      const card = createCarCard(cars[i]);
      catalog.appendChild(card);
    }

    displayedCount = Math.min(count, totalCars);
    updateShowMoreButton();
  }

  /**
   * Создает и управляет кнопкой "показать больше"
   */
  function updateShowMoreButton() {
    let showMoreBtn = document.getElementById("show-more-btn");

    // Удаляем существующую кнопку если есть
    if (showMoreBtn) {
      showMoreBtn.remove();
    }

    // Проверяем нужна ли кнопка
    const shouldShowButton =
      window.innerWidth <= 1024 && displayedCount < totalCars;

    if (shouldShowButton) {
      showMoreBtn = document.createElement("button");
      showMoreBtn.id = "show-more-btn";
      showMoreBtn.textContent = "Показать все машины";
      showMoreBtn.style.cssText = `
        display: block;
        margin: 0 auto;
        margin-bottom: 34px;
        padding: 15px 0;
        width: 100%;
        background-color: white;
        color: black;
        font-weight: 500;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 15px;
        transition: background-color 0.3s ease;
        grid-column-start: 1;
        grid-column-end: 3;
      `;

      showMoreBtn.addEventListener("click", () => {
        displayCars(totalCars); // Показываем все машины
      });

      showMoreBtn.addEventListener("mouseenter", () => {
        showMoreBtn.style.backgroundColor = "#0056b3";
      });

      showMoreBtn.addEventListener("mouseleave", () => {
        showMoreBtn.style.backgroundColor = "#007bff";
      });

      catalog.appendChild(showMoreBtn);
    }
  }

  /**
   * Инициализирует каталог
   */
  function initCatalog() {
    const initialCount = getInitialItemsCount();
    displayCars(initialCount);
  }

  // Обработчик изменения размера окна
  window.addEventListener("resize", () => {
    const newCount = getInitialItemsCount();
    if (newCount !== displayedCount || window.innerWidth > 1024) {
      displayCars(newCount);
    }
  });

  // Инициализируем каталог
  initCatalog();
}

loadCatalog();
