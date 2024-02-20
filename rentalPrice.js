const _ALL_CAR_CLASSES = ['компакт', 'электрический', 'кабриолет', 'гонщик'];

function carClassExists(carClass) {
    return _ALL_CAR_CLASSES.includes(carClass);
}

function calculatePrice(pickupDate, dropoffDate, type, age, LicenseDateObtaining) {
    const licenseYears = getLicenseYears(pickupDate, LicenseDateObtaining);
    const rentalDays = getRentalDays(pickupDate, dropoffDate);
    const rentalSeason = getRentalSeason(pickupDate, dropoffDate);

    // Автомобили в аренду делятся на 4 класса: Компакт, Электрический, Кабриолет, Гонщик.
    if (!carClassExists(type)) {
        return "Выбранный класс автомобиля не существует";
    }
    let rentalPrice = age;

    const ageReqMet = ageReqCheck(age, type, rentalSeason, rentalPrice);
    if (typeof ageReqMet !== 'number') {
        return ageReqMet; // Сообщение о невыполнении требований к возрасту
    } else {
        rentalPrice = ageReqMet;
    }

    const licenseReq = licenseReqCheck(rentalDays, rentalSeason, licenseYears, rentalPrice);
    if (typeof licenseReq !== 'number') {
        return licenseReq; // Сообщение о невыполнении требований к лицензии
    } else {
        rentalPrice = licenseReq;
    }

    rentalPrice = calculateSeasonPrice(rentalSeason, rentalDays, rentalPrice);

    const totalRentalPrice = rentalPrice * rentalDays; // Рассчитываем общую стоимость аренды на весь период

    return '$' + totalRentalPrice.toFixed(2); // Возвращаем текстовое значение с форматированной ценой
}


function calculateSeasonPrice(rentalSeason, rentalDays, rentalPrice) {
    // При аренде в Высокий сезон цена увеличивается на 15%.
    if (rentalSeason) {
        rentalPrice *= 1.15;
    }
    // При аренде более чем на 10 дней цена уменьшается на 10% (кроме высокого сезона). 
    else if (rentalDays > 10) {
        rentalPrice *= 0.9;
    }

    return rentalPrice;
}

function licenseReqCheck(rentalDays, rentalSeason, licenseYears, price = 0) {
    // Лица, удерживающие водительские права менее года, не имеют права на аренду.
    if (licenseYears < 1) {
        return "Лица, удерживающие водительские права менее года, не имеют права на аренду.";
    } else if (rentalSeason && licenseYears < 3) {
        price += (15 * rentalDays) + (price * 0.3); // Добавляет дополнительные расходы за каждый день аренды и 30% от текущей цены
    } else if (licenseYears < 2) {
        price *= 1.3;
    }
    
    return price;
}



function ageReqCheck(age, type, rentalSeason, price) {
    // Лица младше 18 лет не имеют права на аренду автомобиля.
    if (age < 18) {
        return "Водитель слишком молод - невозможно предоставить цену";
    }
    // Лица в возрасте от 18 до 21 года могут арендовать только Компактные автомобили.
    else if (age <= 21 && type !== "компакт") {
        return "Водители в возрасте до 21 года могут арендовать только Компактные автомобили";
    }
    // Для Гонщиков цена увеличивается на 50%, если водитель моложе 25 лет (кроме низкого сезона).
    if (type === "гонщик" && age <= 25 && rentalSeason) {
        price *= 1.5;
    }
    return price;
}


function getRentalDays(pickupDate, dropoffDate) {
    const rentDate = new Date(pickupDate);
    const rentOverDate = new Date(dropoffDate);
    const millisecondsPerDay = 24 * 60 * 60 * 1000; //часы*минуты*секунды*миллисекунды

    return Math.round(Math.abs((rentDate - rentOverDate) / millisecondsPerDay)) + 1;
}

function getRentalSeason(pickupDate, dropoffDate) {
    const highSeasonStart = 3; // Апрель
    const highSeasonEnd = 9; // Октябрь

    const rentDate = new Date(pickupDate);
    const rentOverDate = new Date(dropoffDate);

    const rentMonth = rentDate.getMonth();
    const rentOverMonth = rentOverDate.getMonth();

    return (
        (rentMonth >= highSeasonStart && rentMonth <= highSeasonEnd) ||
        (rentOverMonth >= highSeasonStart && rentOverMonth <= highSeasonEnd)
    );
}

function getLicenseYears(pickupDate, licensedate) {
    const pickup = new Date(pickupDate);
    const licenseDate = new Date(licensedate);
    const oneYear = 365 * 24 * 60 * 60 * 1000; //дни*часы*минуты*секунды*миллисекунды
    const licenseYears = (pickup - licenseDate) / oneYear;
    return licenseYears;
}

exports.price = calculatePrice;
