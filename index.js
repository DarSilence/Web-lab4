document.title = "Прогноз погоды";

// ==================== КОНСТАНТЫ И ПЕРЕМЕННЫЕ ====================
const DAYS_IN_WEEK = 7;
const DAYPARTS_COUNT = 4;
const MAX_CITIES = 3;
const HOURS_IN_DAY = 24;
const EXTRA_HOURS = 2;

// Константы данных
const daypart = ["Утро", "День", "Вечер", "Ночь"];
const daypart_periods = [5, 12, 17, 22, 29];
const weatherInterpretate = {
    0: "clear",
    1: "cloud", 2: "cloud", 3: "cloud",
    45: "fog", 48: "fog",
    51: "rain", 53: "rain", 55: "rain", 56: "rain", 57: "rain", 61: "rain", 63: "rain", 65: "rain", 66: "rain", 67: "rain", 80: "rain", 81: "rain", 82: "rain",
    71: "snow", 73: "snow", 75: "snow", 77: "snow", 85: "snow", 86: "snow",
    95: "storm", 96: "storm", 99: "storm",
};
const monthes = ["января", "февраля", "марта", "апреля", "мая", "июня",
                 "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг",
              "Пятница", "Суббота", "Вчера", "Сегодня", "Завтра"];

// Глобальные переменные состояния
let readyness = [false, false, false, false];
let errors = [false, false, false, false];
let selectedCountry = null;
let selectedCity = null;
let findingGeo = false;
let in_process = false;
let startime = Date.now();

// Тестовые данные (можно удалить после подключения реального API)
const dataPr = getTestData();

// Данные для выпадающих списков
const dropbox_countries = [
    {id: 0, name: "Россия"},
    {id: 1, name: "Беларусь"},
    {id: 2, name: "Казахстан"},
    {id: 3, name: "Германия"},
    {id: 4, name: "Франция"},
    {id: 5, name: "Италия"},
    {id: 6, name: "Испания"},
    {id: 7, name: "Великобритания"},
    {id: 8, name: "США"}
];

const dropbox_cities = [
    {id: 0, name: "Москва", country: "Россия"},
    {id: 1, name: "Санкт-Петербург", country: "Россия"},
    {id: 2, name: "Новосибирск", country: "Россия"},
    {id: 3, name: "Екатеринбург", country: "Россия"},
    {id: 4, name: "Казань", country: "Россия"},
    {id: 5, name: "Нижний Новгород", country: "Россия"},
    {id: 6, name: "Минск", country: "Беларусь"},
    {id: 7, name: "Гомель", country: "Беларусь"},
    {id: 8, name: "Могилёв", country: "Беларусь"},
    {id: 9, name: "Витебск", country: "Беларусь"},
    {id: 10, name: "Гродно", country: "Беларусь"},
    {id: 11, name: "Брест", country: "Беларусь"},
    {id: 12, name: "Алматы", country: "Казахстан"},
    {id: 13, name: "Нур-Султан", country: "Казахстан"},
    {id: 14, name: "Шымкент", country: "Казахстан"},
    {id: 15, name: "Актобе", country: "Казахстан"},
    {id: 16, name: "Караганда", country: "Казахстан"},
    {id: 17, name: "Тараз", country: "Казахстан"},
    {id: 18, name: "Берлин", country: "Германия"},
    {id: 19, name: "Гамбург", country: "Германия"},
    {id: 20, name: "Мюнхен", country: "Германия"},
    {id: 21, name: "Кёльн", country: "Германия"},
    {id: 22, name: "Франкфурт-на-Майне", country: "Германия"},
    {id: 23, name: "Штутгарт", country: "Германия"},
    {id: 24, name: "Париж", country: "Франция"},
    {id: 25, name: "Марсель", country: "Франция"},
    {id: 26, name: "Лион", country: "Франция"},
    {id: 27, name: "Тулуза", country: "Франция"},
    {id: 28, name: "Ницца", country: "Франция"},
    {id: 29, name: "Нант", country: "Франция"},
    {id: 30, name: "Рим", country: "Италия"},
    {id: 31, name: "Милан", country: "Италия"},
    {id: 32, name: "Неаполь", country: "Италия"},
    {id: 33, name: "Турин", country: "Италия"},
    {id: 34, name: "Палермо", country: "Италия"},
    {id: 35, name: "Генуя", country: "Италия"},
    {id: 36, name: "Болонья", country: "Италия"},
    {id: 37, name: "Мадрид", country: "Испания"},
    {id: 38, name: "Барселона", country: "Испания"},
    {id: 39, name: "Валенсия", country: "Испания"},
    {id: 40, name: "Севилья", country: "Испания"},
    {id: 41, name: "Сарагоса", country: "Испания"},
    {id: 42, name: "Малага", country: "Испания"},
    {id: 43, name: "Лондон", country: "Великобритания"},
    {id: 44, name: "Бирмингем", country: "Великобритания"},
    {id: 45, name: "Манчестер", country: "Великобритания"},
    {id: 46, name: "Глазго", country: "Великобритания"},
    {id: 47, name: "Ливерпуль", country: "Великобритания"},
    {id: 48, name: "Лидз", country: "Великобритания"},
    {id: 49, name: "Нью-Йорк", country: "США"},
    {id: 50, name: "Лос-Анджелес", country: "США"},
    {id: 51, name: "Чикаго", country: "США"},
    {id: 52, name: "Хьюстон", country: "США"},
    {id: 53, name: "Финикс", country: "США"},
    {id: 54, name: "Филадельфия", country: "США"},
    {id: 55, name: "Сан-Антонио", country: "США"}
];

const city_coords = {
    "Москва": {latitude: 55.7558, longitude: 37.6173},
    "Санкт-Петербург": {latitude: 59.9343, longitude: 30.3351},
    "Новосибирск": {latitude: 55.0084, longitude: 82.9357},
    "Екатеринбург": {latitude: 56.8389, longitude: 60.6057},
    "Казань": {latitude: 55.8304, longitude: 49.0661},
    "Нижний Новгород": {latitude: 56.2965, longitude: 43.9361},
    "Минск": {latitude: 53.9023, longitude: 27.5619},
    "Гомель": {latitude: 52.4242, longitude: 31.0143},
    "Могилёв": {latitude: 53.9007, longitude: 30.3311},
    "Витебск": {latitude: 55.1833, longitude: 30.1667},
    "Гродно": {latitude: 53.6884, longitude: 23.8258},
    "Брест": {latitude: 52.0976, longitude: 23.7341},
    "Алматы": {latitude: 43.2389, longitude: 76.8897},
    "Нур-Султан": {latitude: 51.1694, longitude: 71.4491},
    "Шымкент": {latitude: 42.3417, longitude: 69.5901},
    "Актобе": {latitude: 50.2833, longitude: 57.1667},
    "Караганда": {latitude: 49.8019, longitude: 73.1021},
    "Тараз": {latitude: 42.9000, longitude: 71.3667},
    "Берлин": {latitude: 52.5200, longitude: 13.4050},
    "Гамбург": {latitude: 53.5511, longitude: 9.9937},
    "Мюнхен": {latitude: 48.1351, longitude: 11.5820},
    "Кёльн": {latitude: 50.9375, longitude: 6.9603},
    "Франкфурт-на-Майне": {latitude: 50.1109, longitude: 8.6821},
    "Штутгарт": {latitude: 48.7758, longitude: 9.1829},
    "Париж": {latitude: 48.8566, longitude: 2.3522},
    "Марсель": {latitude: 43.2965, longitude: 5.3698},
    "Лион": {latitude: 45.7640, longitude: 4.8357},
    "Тулуза": {latitude: 43.6047, longitude: 1.4442},
    "Ницца": {latitude: 43.7102, longitude: 7.2620},
    "Нант": {latitude: 47.2184, longitude: -1.5536},
    "Рим": {latitude: 41.9028, longitude: 12.4964},
    "Милан": {latitude: 45.4642, longitude: 9.1900},
    "Неаполь": {latitude: 40.8518, longitude: 14.2681},
    "Турин": {latitude: 45.0703, longitude: 7.6869},
    "Палермо": {latitude: 38.1157, longitude: 13.3615},
    "Генуя": {latitude: 44.4056, longitude: 8.9463},
    "Болонья": {latitude: 44.4949, longitude: 11.3426},
    "Мадрид": {latitude: 40.4168, longitude: -3.7038},
    "Барселона": {latitude: 41.3851, longitude: 2.1734},
    "Валенсия": {latitude: 39.4699, longitude: -0.3763},
    "Севилья": {latitude: 37.3891, longitude: -5.9845},
    "Сарагоса": {latitude: 41.6488, longitude: -0.8891},
    "Малага": {latitude: 36.7213, longitude: -4.4214},
    "Лондон": {latitude: 51.5074, longitude: -0.1278},
    "Бирмингем": {latitude: 52.4862, longitude: -1.8904},
    "Манчестер": {latitude: 53.4808, longitude: -2.2426},
    "Глазго": {latitude: 55.8642, longitude: -4.2518},
    "Ливерпуль": {latitude: 53.4084, longitude: -2.9916},
    "Лидз": {latitude: 53.8008, longitude: -1.5491},
    "Нью-Йорк": {latitude: 40.7128, longitude: -74.0060},
    "Лос-Анджелес": {latitude: 34.0522, longitude: -118.2437},
    "Чикаго": {latitude: 41.8781, longitude: -87.6298},
    "Хьюстон": {latitude: 29.7604, longitude: -95.3698},
    "Финикс": {latitude: 33.4484, longitude: -112.0740},
    "Филадельфия": {latitude: 39.9526, longitude: -75.1652},
    "Сан-Антонио": {latitude: 29.4241, longitude: -98.4936}
};

// Глобальное состояние приложения
globalThis.cities = [];
globalThis.geoloc = false;
globalThis.glatitude = 0;
globalThis.glongitude = 0;
globalThis.currentForecast = 0; // 0 - geoloc, 1-3 - cities
globalThis.currentDay = 0; // 0-6 days
globalThis.processedData = {};

// DOM элементы
const cityLine = document.createElement("div");
const dayLine = document.createElement("div");
const hourLine = document.createElement("div");
const errorLabel = document.createElement("div");
const errorLabelTitle = document.createElement("h2");
const cityDialog = document.createElement("dialog");
const geoDialog = document.createElement("dialog");
const filterCountry = document.createElement("div");
const inputCountry = document.createElement("input");
const listCountry = document.createElement("div");
const filterCity = document.createElement("div");
const inputCity = document.createElement("input");
const errorBlock = document.createElement('div');
const inputError = document.createElement("label");
const listCity = document.createElement("div");
const approveButton = document.createElement("button");
const cancelButton = document.createElement("button");

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function getTestData() {
    const daily = {
        "sunrise": ['2025-12-28T10:02', '2025-12-29T10:01', '2025-12-30T10:01', '2025-12-31T10:01', '2026-01-01T10:00', '2026-01-02T10:00', '2026-01-03T09:59'],
        "sunset": ['2025-12-28T15:57', '2025-12-29T15:58', '2025-12-30T15:59', '2025-12-31T16:00', '2026-01-01T16:02', '2026-01-02T16:03', '2026-01-03T16:05'],
        // "temperature_2m_max": [0.6, -0.3, -2.5, -4.3, -10, -9.1, -3],
        // "temperature_2m_min": [-4.4, -5.7, -4.7, -9.6, -14.6, -13.2, -8.7],
        "time": ['2025-12-28', '2025-12-29', '2025-12-30', '2025-12-31', '2026-01-01', '2026-01-02', '2026-01-03'],
        "weathercode": [73, 73, 73, 73, 3, 73, 73]
    };

    const hourly = {
        "temperature_2m": [-0.7, -0.3, -0.1, -0.1, 0.1, 0.3, 0.3, 0.5, 0.6, 0.5, 0.5,
                           0.4, 0.3, -0.2, -0.7, -1.3, -1.8, -2.1, -2.4, -2.6, -2.8,
                           -2.9, -3.6, -4.4, -5.3, -5.7, -5.7, -5.6, -5.1, -4.4, -3.6,
                           -2.9, -2.4, -2, -1.7, -1.2, -0.7, -0.3, -0.4, -1, -1.5, -1.8,
                           -2, -2.3, -2.8, -3, -3.3, -3.2, -3.3, -3.7, -3.9, -4.1, -4.5,
                           -4.7, -4.6, -4.4, -4.2, -3.7, -2.9, -2.6, -2.5, -2.7, -2.7,
                           -2.7, -2.9, -3.2, -3.4, -3.7, -4, -4.3, -4.3, -4.3, -4.3, -4.3,
                           -4.7, -5.2, -5.6, -5.6, -5.7, -6.1, -6.2, -6.6, -7.1, -7.2, -7.6,
                           -7.3, -7.2, -7.7, -7.8, -7.9, -8, -8.3, -8.8, -9.1, -9.4, -9.6,
                           -10, -10.5, -11.1, -11.6, -11.9, -12, -12.2, -12.7, -13.2, -13.6,
                           -14, -14.4, -14.6, -14.6, -14.6, -14.6, -14.6, -14.6, -14.5, -14.4,
                           -14.3, -14.1, -13.9, -13.6, -13.2, -13.1, -12.9, -12.6, -12.2,
                           -11.8, -11.5, -11.5, -11.6, -11.6, -11.4, -11.1, -10.8, -10.6,
                           -10.6, -10.6, -10.6, -10.6, -10.6, -10.4, -10.1, -9.8, -9.4, -9.1,
                           -8.7, -8.4, -8.1, -7.7, -7.3, -6.9, -6.6, -6.2, -5.8, -5.6, -5.2,
                           -5, -4.8, -4.6, -4.3, -4.2, -4, -3.8, -3.7, -3.5, -3.5, -3.3, -3.2, -3,
                           -3, -3, -3, -3, -3],
        "time": ["2025-12-28T00:00", "2025-12-28T01:00", "2025-12-28T02:00", "2025-12-28T03:00",
                 "2025-12-28T04:00", "2025-12-28T05:00", "2025-12-28T06:00", "2025-12-28T07:00",
                 "2025-12-28T08:00", "2025-12-28T09:00", "2025-12-28T10:00", "2025-12-28T11:00",
                 "2025-12-28T12:00", "2025-12-28T13:00", "2025-12-28T14:00", "2025-12-28T15:00",
                 "2025-12-28T16:00", "2025-12-28T17:00", "2025-12-28T18:00", "2025-12-28T19:00",
                 "2025-12-28T20:00", "2025-12-28T21:00", "2025-12-28T22:00", "2025-12-28T23:00",
                 "2025-12-29T00:00", "2025-12-29T01:00", "2025-12-29T02:00", "2025-12-29T03:00",
                 "2025-12-29T04:00", "2025-12-29T05:00", "2025-12-29T06:00", "2025-12-29T07:00",
                 "2025-12-29T08:00", "2025-12-29T09:00", "2025-12-29T10:00", "2025-12-29T11:00",
                 "2025-12-29T12:00", "2025-12-29T13:00", "2025-12-29T14:00", "2025-12-29T15:00",
                 "2025-12-29T16:00", "2025-12-29T17:00", "2025-12-29T18:00", "2025-12-29T19:00",
                 "2025-12-29T20:00", "2025-12-29T21:00", "2025-12-29T22:00", "2025-12-29T23:00",
                 "2025-12-30T00:00", "2025-12-30T01:00", "2025-12-30T02:00", "2025-12-30T03:00",
                 "2025-12-30T04:00", "2025-12-30T05:00", "2025-12-30T06:00", "2025-12-30T07:00",
                 "2025-12-30T08:00", "2025-12-30T09:00", "2025-12-30T10:00", "2025-12-30T11:00",
                 "2025-12-30T12:00", "2025-12-30T13:00", "2025-12-30T14:00", "2025-12-30T15:00",
                 "2025-12-30T16:00", "2025-12-30T17:00", "2025-12-30T18:00", "2025-12-30T19:00",
                 "2025-12-30T20:00", "2025-12-30T21:00", "2025-12-30T22:00", "2025-12-30T23:00",
                 "2025-12-31T00:00", "2025-12-31T01:00", "2025-12-31T02:00", "2025-12-31T03:00",
                 "2025-12-31T04:00", "2025-12-31T05:00", "2025-12-31T06:00", "2025-12-31T07:00",
                 "2025-12-31T08:00", "2025-12-31T09:00", "2025-12-31T10:00", "2025-12-31T11:00",
                 "2025-12-31T12:00", "2025-12-31T13:00", "2025-12-31T14:00", "2025-12-31T15:00",
                 "2025-12-31T16:00", "2025-12-31T17:00", "2025-12-31T18:00", "2025-12-31T19:00",
                 "2025-12-31T20:00", "2025-12-31T21:00", "2025-12-31T22:00", "2025-12-31T23:00",
                 "2026-01-01T00:00", "2026-01-01T01:00", "2026-01-01T02:00", "2026-01-01T03:00",
                 "2026-01-01T04:00", "2026-01-01T05:00", "2026-01-01T06:00", "2026-01-01T07:00",
                 "2026-01-01T08:00", "2026-01-01T09:00", "2026-01-01T10:00", "2026-01-01T11:00",
                 "2026-01-01T12:00", "2026-01-01T13:00", "2026-01-01T14:00", "2026-01-01T15:00",
                 "2026-01-01T16:00", "2026-01-01T17:00", "2026-01-01T18:00", "2026-01-01T19:00",
                 "2026-01-01T20:00", "2026-01-01T21:00", "2026-01-01T22:00", "2026-01-01T23:00",
                 "2026-01-02T00:00", "2026-01-02T01:00", "2026-01-02T02:00", "2026-01-02T03:00",
                 "2026-01-02T04:00", "2026-01-02T05:00", "2026-01-02T06:00", "2026-01-02T07:00",
                 "2026-01-02T08:00", "2026-01-02T09:00", "2026-01-02T10:00", "2026-01-02T11:00",
                 "2026-01-02T12:00", "2026-01-02T13:00", "2026-01-02T14:00", "2026-01-02T15:00",
                 "2026-01-02T16:00", "2026-01-02T17:00", "2026-01-02T18:00", "2026-01-02T19:00",
                 "2026-01-02T20:00", "2026-01-02T21:00", "2026-01-02T22:00", "2026-01-02T23:00",
                 "2026-01-03T00:00", "2026-01-03T01:00", "2026-01-03T02:00", "2026-01-03T03:00",
                 "2026-01-03T04:00", "2026-01-03T05:00", "2026-01-03T06:00", "2026-01-03T07:00",
                 "2026-01-03T08:00", "2026-01-03T09:00", "2026-01-03T10:00", "2026-01-03T11:00",
                 "2026-01-03T12:00", "2026-01-03T13:00", "2026-01-03T14:00", "2026-01-03T15:00",
                 "2026-01-03T16:00", "2026-01-03T17:00", "2026-01-03T18:00", "2026-01-03T19:00",
                 "2026-01-03T20:00", "2026-01-03T21:00", "2026-01-03T22:00", "2026-01-03T23:00",
                 "2026-01-04T00:00", "2026-01-04T01:00", "2026-01-04T02:00", "2026-01-04T03:00",
                 "2026-01-03T04:00"],
        "weathercode": [3, 3, 71, 73, 51, 51, 51, 51, 51, 55, 51, 51,
                        53, 73, 71, 71, 73, 71, 71, 71, 71, 3, 3, 1,
                        0, 0, 2, 2, 3, 3, 3, 3, 71, 73, 73, 73,
                        71, 71, 73, 73, 73, 73, 73, 73, 73, 73, 71, 71,
                        3, 3, 71, 71, 73, 71, 71, 71, 71, 71, 71, 71,
                        71, 73, 71, 71, 73, 73, 73, 73, 71, 71, 73, 73,
                        73, 73, 73, 73, 73, 71, 71, 71, 71, 73, 73, 73,
                        73, 71, 73, 73, 71, 71, 71, 51, 3, 3, 3, 3,
                        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2,
                        1, 1, 0, 0, 1, 2, 3, 3, 3, 3, 2, 1,
                        1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3,
                        3, 3, 3, 3, 71, 71, 71, 71,71, 71, 73, 73,
                        73, 73, 73, 73, 71, 71, 71, 71, 71, 71, 71, 71,
                        71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71, 71,
                        71, 71, 71, 71, 71]
    };

    return { daily, hourly };
}

function delay() {
    in_process = true;
    startime = Date.now();
    const timer = setInterval(() => {
        if (Date.now() - startime >= 300) {
            in_process = false;
            clearInterval(timer);
        }
    }, 100);
}

// ==================== РАБОТА С LOCALSTORAGE ====================

function saveInfo() {
    try {
        const storageValue = {
            cities: globalThis.cities,
            geoloc: globalThis.geoloc,
            longitude: globalThis.glongitude,
            latitude: globalThis.glatitude,
            currentForecast: globalThis.currentForecast,
            currentDay: globalThis.currentDay,
        };
        localStorage.setItem('t4', JSON.stringify(storageValue));
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
}

function readInfo() {
    try {
        const storageValue = localStorage.getItem("t4");
        if (storageValue) {
            const parseValue = JSON.parse(storageValue);
            globalThis.cities = parseValue.cities || [];
            globalThis.geoloc = parseValue.geoloc || false;
            globalThis.glongitude = parseValue.longitude ? Number(parseValue.longitude) : 0;
            globalThis.glatitude = parseValue.latitude ? Number(parseValue.latitude) : 0;
            globalThis.currentForecast = Number(parseValue.currentForecast) || 0;
            globalThis.currentDay = Number(parseValue.currentDay) || 0;
        } else {
            throw "No data found";
        }
    } catch (error) {
        console.error('Ошибка считывания из localStorage:', error);
    }
}

// ==================== ОБРАБОТКА ДАННЫХ ПОГОДЫ ====================

function prepareWeatherData(rawData, currentF, cur_city) {
    const prepearedHourly = prepareHourlyData(rawData);
    const prepearedDaily = prepareDailyData(rawData);
    const prepearedDaytime = prepareDaytimeData(rawData);
    
    const prepearedData = {
        daily: prepearedDaily,
        hourly: prepearedHourly,
        daytime: prepearedDaytime
    };

    globalThis.processedData[cur_city] = prepearedData;
    updateReadyness(currentF);
}

function prepareHourlyData(rawData) {
    const prepearedHT = [];
    const prepearedHT2 = [];
    const prepearedHWC = [];

    for (let secIndex = 0; secIndex < DAYS_IN_WEEK * HOURS_IN_DAY + daypart_periods[0]; secIndex++) {
        prepearedHT.push(new Date(rawData.hourly.time[secIndex]));
        prepearedHT2.push(Number(rawData.hourly.temperature_2m[secIndex].toFixed(0)));
        prepearedHWC.push(weatherInterpretate[rawData.hourly.weathercode[secIndex]]);
    }

    return {
        temperature_2m: prepearedHT2,
        weathercode: prepearedHWC,
        time: prepearedHT
    };
}

function prepareDailyData(rawData) {
    const prepearedDWC = [];
    const prepearedDSR = [];
    const prepearedDSS = [];
    const prepearedDT = [];

    for (let index = 0; index < DAYS_IN_WEEK; index++) {
        prepearedDWC.push(weatherInterpretate[rawData.daily.weathercode[index]]);
        prepearedDSR.push(new Date(rawData.daily.sunrise[index]));
        prepearedDSS.push(new Date(rawData.daily.sunset[index]));
        prepearedDT.push(new Date(rawData.daily.time[index] + "T00:00"));
    }

    return {
        weathercode: prepearedDWC,
        sunrise: prepearedDSR,
        sunset: prepearedDSS,
        time: prepearedDT
    };
}

function prepareDaytimeData(rawData) {
    const prepearedDTT2 = [];
    const prepearedDTWC = [];
    const prepearedDTDP = [];

    for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex++) {
        for (let hourIndex = 0; hourIndex < DAYPARTS_COUNT; hourIndex++) {
            const startIdx = dayIndex * HOURS_IN_DAY + daypart_periods[hourIndex];
            const endIdx = dayIndex * HOURS_IN_DAY + daypart_periods[hourIndex + 1];
            
            const daytimeTemp = rawData.hourly.temperature_2m.slice(startIdx, endIdx);
            const daytimeWeather = rawData.hourly.weathercode.slice(startIdx, endIdx);
            
            const meanTemp = calculateMeanTemperature(daytimeTemp);
            const mostCommonWeather = getMostCommonWeather(daytimeWeather);
            
            prepearedDTDP.push(daypart[hourIndex]);
            prepearedDTT2.push(Number(meanTemp.toFixed(0)));
            prepearedDTWC.push(mostCommonWeather);
        }
    }

    return {
        temperature_2m: prepearedDTT2,
        weathercode: prepearedDTWC,
        daypart: prepearedDTDP
    };
}

function calculateMeanTemperature(temperatures) {
    return temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
}

function getMostCommonWeather(weatherCodes) {
    const codeCounts = {};
    let maxCount = 0;
    let mostCommonCode = weatherInterpretate[weatherCodes[0]] || "clear";

    weatherCodes.forEach(code => {
        const weatherType = weatherInterpretate[code] || "clear";
        codeCounts[weatherType] = (codeCounts[weatherType] || 0) + 1;
        
        if (codeCounts[weatherType] > maxCount) {
            maxCount = codeCounts[weatherType];
            mostCommonCode = weatherType;
        }
    });

    return mostCommonCode;
}

function updateReadyness(currentF) {
    const hasReadyData = readyness.some(elem => elem == true);
    readyness[currentF] = true;
    
    if (!hasReadyData) {
        unhidBlocks();
    }
    updateBlocks();
}

// ==================== РАБОТА С API ====================

function getWeather(lat, long, index, cur_city) {
    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
                      `&longitude=${long}` +
                      `&daily=weathercode,sunrise,sunset` +
                      `&hourly=temperature_2m,weathercode` +
                      `&timezone=auto` +
                      `&forecast_days=8`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                prepareWeatherData(data, index, cur_city);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
                errors[index] = true;
                updateBlocks();
            });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        errors[index] = true;
        updateBlocks();
    }
}

function rememberWeather(lat, long, index, cur_city) {
    prepareWeatherData(dataPr, index, cur_city);
}

function updateAllCitiesWeather() {
    for (let index = 1; index <= globalThis.cities.length; index++) {
        const city = globalThis.cities[index - 1];
        getWeather(city_coords[city].latitude, city_coords[city].longitude, index, city);
    }
}

// ==================== ГЕОЛОКАЦИЯ ====================

function success({ coords }) {
    globalThis.geoloc = true;
    const { latitude, longitude } = coords;
    globalThis.glatitude = latitude;
    globalThis.glongitude = longitude;
    geoDialog.close();

    if (globalThis.geoloc) {
        getWeather(globalThis.glatitude, globalThis.glongitude, 0, "geoloc");
    }
    
    updateAllCitiesWeather();
    updateBlocks();
    saveInfo();
}

function error({ message }) {
    if (message == "Timeout expired") {
        errorLabelTitle.textContent = "Определение геопозиции...";
        getGeolocation();
        geoDialog.close();
        updateAllCitiesWeather();
        unhidBlocks();
        updateBlocks();
    } else {
        errorLabelTitle.textContent = "Невозможно получить данные о геолокации.";
        findingGeo = false;
        geoDialog.close();
        handleGeolocationError();
        updateBlocks();
    }
    globalThis.geoloc = false;
}

function handleGeolocationError() {
    if (globalThis.cities.length == 0) {
        addCity();
    } else {
        if (globalThis.currentForecast == 0 || globalThis.currentForecast >= globalThis.cities.length) {
            globalThis.currentForecast = 1;
        }
        updateAllCitiesWeather();
        updateBlocks();
    }
}

function updateGeo() {
    if ("geolocation" in navigator) {
        const geoText = document.getElementById('geoDialogText');
        if (geoText) geoText.textContent = "Получение геолокации...";

        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true
        });
    } else {
        errorLabelTitle.textContent = "Невозможно получить данные о геолокации.";
        geoDialog.close();
        addCity();
    }
}

function getGeolocation() {
    findingGeo = true;
    errorLabelTitle.textContent = "Определение геопозиции...";
    navigator.geolocation.getCurrentPosition(success, error);
    cityDialog.close();
}

// ==================== ДИАЛОГИ И ФОРМЫ ====================

function createGeoDialogContent() {
    const geoContent = document.createElement("div");
    geoContent.classList.add("geoDialogContent");

    const geoTitle = document.createElement("h2");
    geoTitle.classList.add("geoDialogTitle");
    geoTitle.textContent = "Определение местоположения";
    geoContent.appendChild(geoTitle);

    const geoText = document.createElement('p');
    geoText.classList.add("geoDialogText");
    geoText.id = "geoDialogText";
    geoText.textContent = "Пожалуйста разрешите доступ к геолокации для автоматического определения поиска прогноза по вашему местоположению.";
    geoContent.appendChild(geoText);

    return geoContent;
}

function createCityDialogContent() {
    const container = document.createElement("div");
    container.classList.add("container");

    const dTitle = document.createElement("h2");
    dTitle.classList.add("dTitle");
    dTitle.textContent = "Добавить город";
    container.appendChild(dTitle);

    const dDescription = document.createElement("p");
    dDescription.classList.add("dDescription");
    dDescription.textContent = "Введите данные для получения прогноза";
    container.appendChild(dDescription);

    // Страны
    filterCountry.classList.add("filterBlock");
    filterCountry.id = "filterCountry";

    inputCountry.classList.add("inputCountry");
    inputCountry.id = "inputCountry";
    inputCountry.type = "text";
    inputCountry.placeholder = "Введите страну";
    filterCountry.appendChild(inputCountry);

    listCountry.classList.add("listCountry");
    listCountry.id = "listCountry";
    filterCountry.appendChild(listCountry);
    container.appendChild(filterCountry);

    // Города
    filterCity.classList.add("filterBlock");
    filterCity.id = "filterCity";

    inputCity.classList.add("inputCity");
    inputCity.id = "inputCity";
    inputCity.type = "text";
    inputCity.placeholder = "Введите город";
    filterCity.appendChild(inputCity);

    listCity.classList.add("listCity");
    listCity.id = "listCity";
    filterCity.appendChild(listCity);
    container.appendChild(filterCity);

    // Сообщение об ошибке
    errorBlock.classList.add("errorBlock");

    inputError.classList.add("inputError");
    inputError.textContent = "Введённый город не найден.";
    errorBlock.appendChild(inputError);
    errorBlock.hidden = true;

    container.appendChild(errorBlock)

    // Кнопки
    const dButtons = document.createElement('div');
    dButtons.classList.add("dButtons");

    approveButton.classList.add("approveButton");
    approveButton.id = "approveButton";
    approveButton.textContent = "Добавить";
    dButtons.appendChild(approveButton);

    cancelButton.classList.add("cancelButton");
    cancelButton.id = "cancelButton";
    cancelButton.textContent = "Отмена";
    cancelButton.hidden = globalThis.cities.length >= 1 ? false : true;
    dButtons.appendChild(cancelButton);

    container.appendChild(dButtons);

    return container;
}

function setupCityDialogEvents() {
    inputCountry.addEventListener('input', (e) => {
        delay();
        filterCountries(e.target.value);
    });
    
    inputCountry.addEventListener('focus', () => {
        delay();
        if (!errorBlock.hidden) errorBlock.hidden = true;
        filterCountries(inputCountry.value);
    });
    
    listCountry.addEventListener('click', (e) => {
        delay();
        selectCountry(e.target.dataset.id);
    });

    inputCity.addEventListener('input', (e) => {
        delay();
        filterCities(e.target.value);
    });
    
    inputCity.addEventListener('focus', () => {
        delay();
        if (!errorBlock.hidden) errorBlock.hidden = true;
        filterCities(inputCity.value);
    });
    
    listCity.addEventListener('click', (e) => {
        delay();
        selectCity(e.target.dataset.id);
    });

    approveButton.addEventListener("click", handleApproveCity);
    cancelButton.addEventListener("click", handleCancelCity);

    cityDialog.addEventListener('click', (e) => {
        if (!in_process) {
            delay();
            if (!e.target.closest('.filterBlock')) {
                hideDropdowns();
            }
        }
    });
}

function handleApproveCity() {
    if (!in_process && selectedCity) {
        delay();
        globalThis.cities.push(selectedCity);
        const prev = document.getElementById(`cityBlock${globalThis.currentForecast}`);
        if (prev) prev.classList.remove("chosenCity");
        
        globalThis.currentForecast = globalThis.cities.length;
        saveInfo();
        updateCities();
        
        getWeather(
            city_coords[selectedCity].latitude,
            city_coords[selectedCity].longitude,
            globalThis.cities.length,
            selectedCity
        );
        
        cityDialog.close();
    }
    if (!selectedCity){
        errorBlock.hidden = false;
    }
}

function handleCancelCity() {
    if (!in_process) {
        delay();
        cityDialog.close();
    }
}

// ==================== ФИЛЬТРАЦИЯ И ВЫБОР ====================

function filterCountries(searchTerm) {
    const isExactMatch = dropbox_countries.find(country => 
        searchTerm == country.name
    );
    
    if (!isExactMatch) {
        selectedCountry = null;
        filterCities("");
    } else {
        selectedCountry = searchTerm;
    }

    const filtered = dropbox_countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    renderCountries(filtered);
    showDropdown(listCountry);
}

function filterCities(searchTerm) {
    const isExactMatch = dropbox_cities.find(city => 
        searchTerm == city.name
    );
    
    if (!isExactMatch) {
        selectedCity = null;
    } else {
        selectedCity = searchTerm;
    }

    let filtered;
    if (selectedCountry) {
        filtered = dropbox_cities.filter(city => 
            city.country == selectedCountry &&
            city.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            globalThis.cities.indexOf(city.name) == -1
        );
    } else {
        filtered = dropbox_cities.filter(city => 
            city.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            globalThis.cities.indexOf(city.name) == -1
        );
    }

    renderCities(filtered);
    showDropdown(listCity);
}

function renderCountries(countries) {
    listCountry.textContent = "";

    if (countries.length == 0) {
        const dropdownItem = document.createElement("div");
        dropdownItem.classList.add("dropdownItem");
        dropdownItem.textContent = "Нет стран";
        dropdownItem.dataset.id = -1;
        listCountry.appendChild(dropdownItem);
        return;
    }

    countries.forEach(country => {
        const item = document.createElement("div");
        item.classList.add("dropdownItem");
        item.textContent = country.name;
        item.dataset.id = country.id;

        if (country.id == selectedCountry) {
            item.classList.add("active");
        }

        listCountry.appendChild(item);
    });
}

function renderCities(cities) {
    listCity.textContent = "";

    if (cities.length == 0) {
        const dropdownItem = document.createElement("div");
        dropdownItem.classList.add("dropdownItem");
        dropdownItem.textContent = "Нет городов";
        dropdownItem.dataset.id = -1;
        listCity.appendChild(dropdownItem);
        return;
    }

    cities.forEach(city => {
        const item = document.createElement("div");
        item.classList.add("dropdownItem");
        item.textContent = city.name;
        item.dataset.id = city.id;

        if (city.id == selectedCity) {
            item.classList.add("active");
        }

        listCity.appendChild(item);
    });
}

function selectCountry(countryId) {
    if (countryId == -1) return;
    
    const country = dropbox_countries.find(c => c.id == countryId);
    if (!country) return;
    
    selectedCountry = country.name;
    inputCountry.value = country.name;
    inputCity.value = "";
    filterCities("");
    inputCity.focus();
}

function selectCity(cityId) {
    if (cityId == -1) return;
    
    const city = dropbox_cities.find(c => c.id == cityId);
    if (!city) return;
    
    selectedCity = city.name;
    inputCity.value = city.name;
    hideDropdowns();
}

function showDropdown(element) {
    if (element == listCity) {
        listCity.style.display = "block";
        listCountry.style.display = "none";
    } else {
        listCity.style.display = "none";
        listCountry.style.display = "block";
    }
}

function hideDropdowns() {
    listCity.style.display = "none";
    listCountry.style.display = "none";
}

// ==================== УПРАВЛЕНИЕ ГОРОДАМИ ====================

function createCityBlock(index) {
    const cityBlock = document.createElement("div");
    cityBlock.classList.add("cityBlock");
    cityBlock.id = `cityBlock${index}`;

    const cityLabel = document.createElement("label");
    cityLabel.classList.add("cityLabel");
    cityLabel.id = `cityLabel${index}`;
    cityBlock.appendChild(cityLabel);

    cityBlock.addEventListener("click", () => {
        if (!in_process) {
            delay();
            const prev = document.getElementById(`cityBlock${globalThis.currentForecast}`);
            if (prev) prev.classList.remove("chosenCity");
            
            globalThis.currentForecast = index;
            cityBlock.classList.add("chosenCity");
            updateDays();
            updateHours();
            saveInfo();
        }
    });

    if (index > 0) {
        const closeButton = createCloseButton(index);
        cityBlock.appendChild(closeButton);
    }

    return cityBlock;
}

function createCloseButton(index) {
    const closeButton = document.createElement("button");
    closeButton.classList.add("cityCloseButton");
    closeButton.id = `cityCloseButton${index}`;
    closeButton.textContent = `X`;

    closeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!in_process) {
            delay();
            removeCity(index);
            updateBlocks();
        }
    });

    return closeButton;
}

function removeCity(index) {
    // Удаляем город из массива
    const cityIndex = index - 1;
    if (cityIndex < 0 || cityIndex >= globalThis.cities.length) return;
    
    // Удаляем данные о погоде для этого города
    delete globalThis.processedData[globalThis.cities[cityIndex]];
    
    // Удаляем город из массива
    readyness.splice(cityIndex, 1);
    readyness.push(false);
    globalThis.cities.splice(cityIndex, 1);
    
    // Обновляем текущий выбранный прогноз
    if (globalThis.currentForecast >= globalThis.cities.length + 1) {
        globalThis.currentForecast = Math.max(0, globalThis.cities.length);
    }
    
    // Обновляем интерфейс
    const addButton = document.getElementById(`addCityButton`);
    if (addButton) addButton.hidden = false;
    
    updateCities();
    saveInfo();
    
    // Если нет городов и нет геолокации - показываем диалог добавления
    if (globalThis.cities.length == 0 && !globalThis.geoloc) {
        addCity();
    }
}

function addCity() {
    selectedCountry = null;
    selectedCity = null;
    inputCountry.value = "";
    inputCity.value = "";

    cancelButton.hidden = globalThis.cities.length < 1 && !globalThis.geoloc;
    
    cityDialog.showModal();
    inputCountry.focus();
    showDropdown(inputCity);
}

function updateCities() {
    for (let index = 0; index < 4; index++) {
        const cityBlock = document.getElementById(`cityBlock${index}`);
        const cityLabel = document.getElementById(`cityLabel${index}`);
        
        if (!cityBlock || !cityLabel) continue;
        
        if (index == globalThis.currentForecast) {
            cityBlock.classList.add("chosenCity");
        } else {
            cityBlock.classList.remove("chosenCity");
        }

        if (index <= globalThis.cities.length) {
            cityBlock.hidden = false;
            cityLabel.textContent = index == 0 ? "Текущее местоположение" : globalThis.cities[index - 1];
        } else {
            cityBlock.hidden = true;
        }
    }
    
    const addButton = document.getElementById(`addCityButton`);
    if (addButton) {
        addButton.hidden = globalThis.cities.length >= MAX_CITIES;
    }
}

// ==================== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ====================

function updateDays() {
    const shouldHideDayLine = 
        (globalThis.currentForecast == 0 && !globalThis.geoloc && !findingGeo) ||
        !readyness[globalThis.currentForecast] ||
        errors[globalThis.currentForecast];
    
    if (shouldHideDayLine) {
        dayLine.hidden = true;
        errorLabel.hidden = false;
        
        if (globalThis.currentForecast == 0 && !globalThis.geoloc && !findingGeo) {
            errorLabelTitle.textContent = "Невозможно получить данные о геолокации.";
        } else if (!readyness[globalThis.currentForecast]) {
            errorLabelTitle.textContent = "Обновление данных...";
        } else if (errors[globalThis.currentForecast]) {
            errorLabelTitle.textContent = "Не удалось получить данные. Обновите данные для повторной попытки.";
        }
        return;
    }
    
    dayLine.hidden = false;
    errorLabel.hidden = true;
    
    const cityKey = globalThis.currentForecast == 0 ? "geoloc" : globalThis.cities[globalThis.currentForecast - 1];
    const updateData = globalThis.processedData[cityKey];
    
    if (!updateData) return;
    
    for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex++) {
        updateDayBlock(dayIndex, updateData);
    }
}

function updateDayBlock(dayIndex, updateData) {
    const dayLabel = document.getElementById(`dayLabel${dayIndex}`);
    if (!dayLabel) return;
    
    const dailyTime = updateData.daily.time[dayIndex];
    const nowDate = new Date(Date.now());
    
    const daysDiff = Math.floor((dailyTime - nowDate) / (1000 * 60 * 60 * 24) - 0.5);
    const dayName = daysDiff < 1 ? days[daysDiff + 9] : days[dailyTime.getDay()];
    
    dayLabel.textContent = `${dayName}, ${dailyTime.getDate()} ${monthes[dailyTime.getMonth()]}`;
    
    for (let partIndex = 0; partIndex < DAYPARTS_COUNT; partIndex++) {
        updateDaytimeBlock(dayIndex, partIndex, updateData);
    }
}

function updateDaytimeBlock(dayIndex, partIndex, updateData) {
    const blockIndex = dayIndex * DAYPARTS_COUNT + partIndex;
    const daytimeLabel = document.getElementById(`daytimeLabel${blockIndex}`);
    const daytimeImage = document.getElementById(`daytimeImage${blockIndex}`);
    
    if (!daytimeLabel || !daytimeImage) return;
    
    daytimeLabel.textContent = `${updateData.daytime.daypart[blockIndex]}    ${updateData.daytime.temperature_2m[blockIndex]}°`;
    daytimeImage.src = `signs/${updateData.daytime.weathercode[blockIndex]}.jpg`;
}

function updateHours() {
    const shouldHideHourLine = 
        (globalThis.currentForecast == 0 && !globalThis.geoloc && !findingGeo) ||
        !readyness[globalThis.currentForecast] ||
        errors[globalThis.currentForecast];
    
    if (shouldHideHourLine) {
        hourLine.hidden = true;
        return;
    }
    
    hourLine.hidden = false;
    
    const cityKey = globalThis.currentForecast == 0 ? "geoloc" : globalThis.cities[globalThis.currentForecast - 1];
    const updateData = globalThis.processedData[cityKey];
    
    if (!updateData) return;
    
    const sunset = updateData.daily.sunset[globalThis.currentDay];
    const sunrise = updateData.daily.sunrise[globalThis.currentDay];
    let supIndex = 0;
    
    for (let hourIndex = 0; hourIndex < HOURS_IN_DAY; hourIndex++) {
        updateHourBlock(hourIndex + supIndex, hourIndex, updateData);
        
        if (hourIndex == sunset.getHours()) {
            supIndex++;
            updateSpecialHourBlock(hourIndex + supIndex, sunset, "sunset");
        }
        
        if (hourIndex == sunrise.getHours()) {
            supIndex++;
            updateSpecialHourBlock(hourIndex + supIndex, sunrise, "sunrise");
        }
    }
}

function updateHourBlock(blockIndex, hourIndex, updateData) {
    const hourBlock = document.getElementById(`hourBlock${blockIndex}`);
    const hourLabel = document.getElementById(`hourLabel${blockIndex}`);
    const hourImage = document.getElementById(`hourImage${blockIndex}`);
    const hourDegrees = document.getElementById(`hourDegrees${blockIndex}`);
    
    if (!hourBlock || !hourLabel || !hourImage || !hourDegrees) return;
    
    hourBlock.classList.remove("special");
    
    const dataIndex = globalThis.currentDay * HOURS_IN_DAY + hourIndex;
    const dailyTime = updateData.hourly.time[dataIndex];
    
    hourLabel.textContent = `${dailyTime.getHours()}:${dailyTime.getMinutes().toString().padStart(2, "0")}`;
    hourImage.src = `signs/${updateData.hourly.weathercode[dataIndex]}.jpg`;
    hourDegrees.textContent = `${updateData.hourly.temperature_2m[dataIndex]}°`;
}

function updateSpecialHourBlock(blockIndex, time, type) {
    const hourBlock = document.getElementById(`hourBlock${blockIndex}`);
    const hourLabel = document.getElementById(`hourLabel${blockIndex}`);
    const hourImage = document.getElementById(`hourImage${blockIndex}`);
    const hourDegrees = document.getElementById(`hourDegrees${blockIndex}`);
    
    if (!hourBlock || !hourLabel || !hourImage || !hourDegrees) return;
    
    hourBlock.classList.add("special");
    hourLabel.textContent = `${time.getHours()}:${time.getMinutes().toString().padStart(2, "0")}`;
    hourImage.src = `signs/${type}.jpg`;
    hourDegrees.textContent = type == "sunrise" ? "Восход" : "Закат";
}

function updateBlocks() {
    updateCities();
    updateDays();
    updateHours();
}

function hidBlocks() {
    cityLine.hidden = true;
    hourLine.hidden = true;
    dayLine.hidden = true;
    errorLabelTitle.textContent = "Обновление данных...";
    errorLabel.hidden = false;
}

function unhidBlocks() {
    cityLine.hidden = false;
    hourLine.hidden = false;
    dayLine.hidden = false;
    errorLabel.hidden = true;
}

// ==================== ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ====================

function initCities() {
    cityLine.classList.add("cityLine");
    cityLine.id = "cityLine";
    
    // Кнопка обновления
    const reloadButton = document.createElement("button");
    reloadButton.classList.add("reloadButton");
    reloadButton.id = "reloadButton";
    
    reloadButton.addEventListener("click", () => {
        if (!in_process) {
            delay();
            const sup = globalThis.geoloc ? 1 : 0;
            for (let index = 1 - sup; index < 1 + globalThis.cities.length; index++) {
                readyness[index] = false;
                errors[index] = false;
                if (index == 0) {
                    getWeather(globalThis.glatitude, globalThis.glongitude, index, "geoloc");
                } else {
                    getWeather(
                        city_coords[globalThis.cities[index - 1]].latitude,
                        city_coords[globalThis.cities[index - 1]].longitude,
                        index,
                        globalThis.cities[index - 1]
                    );
                }
            }
        }
    });
    
    cityLine.appendChild(reloadButton);
    
    // Блоки городов
    for (let index = 0; index < 4; index++) {
        const cityBlock = createCityBlock(index);
        cityLine.appendChild(cityBlock);
    }
    
    // Кнопка добавления
    const addButton = document.createElement("button");
    addButton.classList.add("addCityButton");
    addButton.id = "addCityButton";
    addButton.textContent = "+";
    
    addButton.addEventListener("click", () => {
        if (!in_process) {
            delay();
            addCity();
        }
    });
    
    cityLine.appendChild(addButton);
    document.body.appendChild(cityLine);
}

function initDays() {
    dayLine.classList.add("dayLine");
    dayLine.id = "dayLine";

    for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex++) {
        const dayBlock = document.createElement("div");
        dayBlock.classList.add("dayBlock");
        dayBlock.id = `dayBlock${dayIndex}`;
        
        if (globalThis.currentDay == dayIndex) {
            dayBlock.classList.add("chosenDay");
        }
        
        const dayLabel = document.createElement("label");
        dayLabel.classList.add("dayLabel");
        dayLabel.id = `dayLabel${dayIndex}`;
        dayBlock.appendChild(dayLabel);
        
        for (let partIndex = 0; partIndex < DAYPARTS_COUNT; partIndex++) {
            const dayTime = document.createElement('div');
            dayTime.classList.add("dayTime");
            
            const daytimeLabel = document.createElement("label");
            daytimeLabel.classList.add("daytimeLabel");
            daytimeLabel.id = `daytimeLabel${dayIndex * DAYPARTS_COUNT + partIndex}`;
            dayTime.appendChild(daytimeLabel);
            
            const daytimeImage = document.createElement("img");
            daytimeImage.classList.add("daytimeImage");
            daytimeImage.id = `daytimeImage${dayIndex * DAYPARTS_COUNT + partIndex}`;
            daytimeImage.alt = "Значок";
            dayTime.appendChild(daytimeImage);
            dayBlock.appendChild(dayTime);
        }
        
        dayBlock.addEventListener("click", () => {
            if (!in_process) {
                delay();
                const prev = document.getElementById(`dayBlock${globalThis.currentDay}`);
                if (prev) prev.classList.remove("chosenDay");
                
                dayBlock.classList.add("chosenDay");
                globalThis.currentDay = dayIndex;
                updateHours();
                saveInfo();
            }
        });
        
        dayLine.appendChild(dayBlock);
    }
    
    document.body.appendChild(dayLine);
}

function initHours() {
    hourLine.classList.add("hourLine");
    hourLine.id = "hourLine";
    
    for (let index = 0; index < HOURS_IN_DAY + EXTRA_HOURS; index++) {
        const hourBlock = document.createElement("div");
        hourBlock.classList.add("hourBlock");
        hourBlock.id = `hourBlock${index}`;
        
        const hourLabel = document.createElement("label");
        hourLabel.classList.add("hourLabel");
        hourLabel.id = `hourLabel${index}`;
        hourBlock.appendChild(hourLabel);
        
        const hourImage = document.createElement("img");
        hourImage.classList.add("hourImage");
        hourImage.id = `hourImage${index}`;
        hourImage.alt = "Значок";
        hourBlock.appendChild(hourImage);
        
        const hourDegrees = document.createElement("label");
        hourDegrees.classList.add("hourDegrees");
        hourDegrees.id = `hourDegrees${index}`;
        hourBlock.appendChild(hourDegrees);
        
        hourLine.appendChild(hourBlock);
    }
    
    document.body.appendChild(hourLine);
}

function initErrorLabel() {
    errorLabelTitle.classList.add("errorLabelTitle");
    errorLabelTitle.id = "errorLabelTitle";
    errorLabel.appendChild(errorLabelTitle);
    
    errorLabel.classList.add("errorLabel");
    errorLabel.id = "errorLabel";
    document.body.appendChild(errorLabel);
    errorLabel.hidden = true;
}

function initDialogs() {
    // Диалог добавления города
    cityDialog.classList.add("cityDialog");
    cityDialog.id = "cityDialog";
    const cityDialogContent = createCityDialogContent();
    cityDialog.appendChild(cityDialogContent);
    document.body.appendChild(cityDialog);
    
    // Диалог геолокации
    geoDialog.classList.add("geoDialog");
    geoDialog.id = "geoDialog";
    const geoDialogContent = createGeoDialogContent();
    geoDialog.appendChild(geoDialogContent);
    document.body.appendChild(geoDialog);
    
    // Настройка событий
    setupCityDialogEvents();
    renderCountries(dropbox_countries);
    renderCities(dropbox_cities);
}

function initApp() {
    readInfo();
    
    initCities();
    initDays();
    initHours();
    initErrorLabel();
    initDialogs();
    
    updateCities();
    hidBlocks();
    
    if (!globalThis.geoloc) {
        geoDialog.showModal();
        updateGeo();
    } else {
        const sup = globalThis.geoloc ? 1 : 0;
        for (let index = 1 - sup; index < globalThis.cities.length + 1; index++) {
            if (index == 0) {
                getWeather(globalThis.glatitude, globalThis.glongitude, index, "geoloc");
            } else {
                getWeather(
                    city_coords[globalThis.cities[index - 1]].latitude,
                    city_coords[globalThis.cities[index - 1]].longitude,
                    index,
                    globalThis.cities[index - 1]
                );
            }
        }
    }
}

// ==================== ЗАПУСК ПРИЛОЖЕНИЯ ====================

initApp();
