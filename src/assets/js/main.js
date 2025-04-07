// Список автомобилей
const cars = [
  { brand: 'KIA', model: 'Sportage, LUXE+ 2Л', type: 'г. Якутск', price: 2211700, year: 2022, image: '../assets/images/kia_sportage_luxe+2.png' },
  { brand: 'Skoda', model: 'Karoq', type: 'г. Казань', price: 1790000, year: 2021, image: '../assets/images/skoda_karoq.png' },
  { brand: 'Citroen', model: 'C4', type: 'г. Уфа', price: 1523000, year: 2023, image: '../assets/images/cirtroen_c4.png' },
  { brand: 'Mercedes-Benz', model: 'GLS 400 D 4m Luxury', type: 'г. Казань', price: 2211700, year: 2022, image: '../assets/images/mercedes-benz_gls400D4m_luxury.png' },
  { brand: 'Mercedes-Benz', model: 'GLE 350 D 4matic купе', type: 'г. Казань', price: 2211700, year: 2022, image: '../assets/images/mercedes-benz_gle350D4matic_coupe.png' },
  { brand: 'Mercedes-Benz', model: 'GLE 300 D 4matic Sport', type: 'г. Казань', price: 2211700, year: 2022, image: '../assets/images/mercedes-benz_gle300D4matic_sport.png' },
  { brand: 'KIA', model: 'Sportage, LUXE+ 2.4Л', type: 'г. Якутск', price: 2336700, year: 2023, image: '../assets/images/kia_sportage_luxe+2,4.png' },
  { brand: 'KIA', model: 'K5, Prestige, 2.5Л', type: 'г. Якутск', price: 2244200, year: 2023, image: '../assets/images/kia_k5_prestige.png' },
  { brand: 'Honda', model: 'Freed', type: 'С аукциона Японии', price: 650000, year: 2021, image: '../assets/images/honda_freed.png' },
  {
    brand: 'Nissan',
    model: 'Caravan (nv350)',
    type: 'С аукциона Японии',
    price: 1250000,
    year: 2022,
    image: '../assets/images/nissan_caravan.png',
  },
  {
    brand: 'Toyota',
    model: 'Land Cruizer Prado',
    type: 'С аукциона Японии',
    price: 2500000,
    year: 2020,
    image: '../assets/images/toyota_land_cruizer_prado.png',
  },
  {
    brand: 'Toyota',
    model: 'Vitz',
    type: 'С аукциона Японии',
    price: 480000,
    year: 2020,
    image: '../assets/images/toyota_vitz_white.png',
  },
  {
    brand: 'Toyota',
    model: 'Vitz',
    type: 'С аукциона Японии',
    price: 520000,
    year: 2023,
    image: '../assets/images/toyota_vitz_gray.png',
  },
  {
    brand: 'KIA',
    model: 'Sportage. LUXE+ 2Л',
    type: 'С аукциона Японии',
    price: 750000,
    year: 2020,
    image: '../assets/images/mazda.png',
  },
  {
    brand: 'Toyota',
    model: 'Vitz',
    type: 'С аукциона Японии',
    price: 1050000,
    year: 2023,
    image: '../assets/images/toyota_gray.png',
  },
  {
    brand: 'KIA',
    model: 'Sportage. LUXE+ 2Л',
    type: 'С аукциона Японии',
    price: 600000,
    year: 2020,
    image: '../assets/images/honda_white.png',
  },
  {
    brand: 'KIA',
    model: 'Sportage. LUXE+ 2Л',
    type: 'С аукциона Японии',
    price: 440000,
    year: 2021,
    image: '../assets/images/honda_gray.png',
  },
];

// Функция для отображения автомобилей
function displayCars(carsToShow) {
  const carList = document.querySelector('.car__list');
  carList.innerHTML = ''; // Очищаем список

  carsToShow.forEach((car) => {
    const carCard = document.createElement('div');
    carCard.classList.add('car__card');
    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.brand} ${car.model}">
      <h3>${car.brand} ${car.model}</h3>
      <p class="car__type">${car.type}</p>
      <div>
        <p class="car__price">${car.price.toLocaleString('ru-RU')} ₽</p>
        <button>Подробнее</button>
      </div>
    `;
    carList.appendChild(carCard);
  });
}

// Функция фильтрации
function filterCars() {
  const brand = document.querySelector('#car-brand').value;
  const year = document.querySelector('#car-year').value;
  const priceFrom = parseInt(document.querySelector('#price-from').value) || 0;
  const priceTo = parseInt(document.querySelector('#price-to').value) || Infinity;

  const filteredCars = cars.filter((car) => {
    const matchesBrand = brand ? car.brand === brand : true;
    const matchesYear = year ? car.year === parseInt(year) : true;
    const matchesPrice = car.price >= priceFrom && car.price <= priceTo;
    return matchesBrand && matchesYear && matchesPrice;
  });

  displayCars(filteredCars);
}

// Функция для сворачивания/разворачивания списка
function toggleCarList() {
  const carList = document.querySelector('.car__list');
  const button = document.querySelector('.search__panel--title button');
  const svg = button.querySelector('svg');
  const isHidden = carList.classList.toggle('hidden');

  button.querySelector('span').textContent = isHidden ? 'Показать список машин' : 'Свернуть список машин';
  svg.classList.toggle('collapsed');
}

// Привязка событий
document.querySelector('#car-brand').addEventListener('change', filterCars);
document.querySelector('#car-year').addEventListener('change', filterCars);
document.querySelector('#price-from').addEventListener('input', filterCars);
document.querySelector('#price-to').addEventListener('input', filterCars);
document.querySelector('.search__panel--title button').addEventListener('click', toggleCarList);

// Изначально отображаем все автомобили
displayCars(cars);
