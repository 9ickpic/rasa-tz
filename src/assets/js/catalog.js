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
  const response = await fetch("./data/catalog.json");
  if (!response.ok) {
    const error = document.createElement("div");

    const message = document.createElement("p");
    errorText.textContent = "Не удалось загрузить каталог";

    error.append(message);
    catalog.append(error);

    console.error("Не удалось получить данные из каталога");
    return;
  }

  /**
   * @type {Car[]}
   */
  const cars = await response.json();

  for (const car of cars) {
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
    catalog.appendChild(card);
  }
}

loadCatalog();
