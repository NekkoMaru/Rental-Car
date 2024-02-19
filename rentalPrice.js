const _ALL_CAR_CLASSES = ['compact', 'electric', 'cabrio', 'racer'];

function calculatePrice(pickupDate, dropoffDate, type, age, LicenseDateObtaining) {
    const licenseYears = getLicenseYears(pickupDate, LicenseDateObtaining);

    const rentalDays = getRentalDays(pickupDate, dropoffDate);
    const rentalSeason = getRentalSeason(pickupDate, dropoffDate);

    // Rental cars are categorized into 4 classes: Compact, Electric, Cabrio, Racer.
    if (!carClassExists(type)) {
        return false; // Selected car class does not exist
    }

    // The minimum rental price per day is equivalent to the age of the driver.
    let rentalPrice = age;

    const ageReqMet = ageReqCheck(age, type, rentalSeason, rentalPrice);
    if (typeof ageReqMet !== 'number') {
        return false; // Age requirement not met
    } else {
        rentalPrice = ageReqMet;
    }

    const licenseReq = licenseReqCheck(rentalDays, rentalSeason, licenseYears, rentalPrice)
    if (typeof licenseReq !== 'number') {
        return false; // License requirement not met
    } else {
        rentalPrice = licenseReq;
    }

    rentalPrice = calculateSeasonPrice(rentalSeason, rentalDays, rentalPrice);

    return rentalPrice.toFixed(2); // Returning the rental price as a string
}

function calculateSeasonPrice(rentalSeason, rentalDays, rentalPrice) {
    // If renting in High season, price is increased by 15%.
    if (rentalSeason) {
        rentalPrice *= 1.15;
    }
    // If renting for more than 10 days, price is decreased by 10% (except during the high season). 
    else if (rentalDays > 10) {
        rentalPrice *= 0.9;
    }

    return rentalPrice;
}

function licenseReqCheck(rentalDays, rentalSeason, licenseYears, price = 0) {
    // Individuals holding a driver's license for less than a year are ineligible to rent.
    if (licenseYears < 1) {
        return false;
    } else if (licenseYears < 2) {
        price *= 1.3;
    } else if (licenseYears < 3 && rentalSeason) {
        price += (15 * rentalDays);
    }

    return price;
}

function ageReqCheck(age, type, rentalSeason, price) {
    // Individuals under the age of 18 are ineligible to rent a car.
    if (age < 18) {
        return false;
    }
    // Those aged 18-21 can only rent Compact cars.
    else if (age <= 21 && type !== "compact") {
        return false;
    }
    // For Racers, the price is increased by 50% if the driver is 25 years old or younger (except during the low season).
    if (type === "racer" && age <= 25 && !rentalSeason) {
        price *= 1.5;
    }
    return price;
}

function carClassExists(carClass) {
    return _ALL_CAR_CLASSES.includes(carClass);
}

function getRentalDays(pickupDate, dropoffDate) {
    const rentDate = new Date(pickupDate);
    const rentOverDate = new Date(dropoffDate);
    const millisecondsPerDay = 24 * 60 * 60 * 1000; //hours*minutes*seconds*milliseconds

    return Math.round(Math.abs((rentDate - rentOverDate) / millisecondsPerDay)) + 1;
}

function getRentalSeason(pickupDate, dropoffDate) {
    const highSeasonStart = 3; // April
    const highSeasonEnd = 9; // October

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
    const oneYear = 365 * 24 * 60 * 60 * 1000; //days*hours*minutes*seconds*milliseconds
    const licenseYears = (pickup - licenseDate) / oneYear; 
    return licenseYears;
}

exports.price = calculatePrice;
