const carTypes = ["Compact", "Electric", "Cabrio", "Racer"];

function calculatePrice(pickUpDate, dropOffDate, type, licenseIssuingDate, age) {
    const days = getDays(pickUpDate, dropOffDate);
    const season = getSeason(pickUpDate, dropOffDate);

    if (!carTypes.includes(type)) {
        return "No such car"
    }

    if (isDriverAgeLessThan(age, 18)) {
        return "Driver too young - cannot quote the price";
    } else if (isDriverAgeLessThan(age, 22) && type !== "Compact") {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }

    let rentalPrice = calculateTotalPrice(age, days);

    if (type === "Racer" && isDriverAgeLessThan(age, 26) && season === "High") {
        rentalPrice *= 1.5;
    } else if (season === "High") {
        rentalPrice *= 1.15;
    }

    if (isLongPeriod(days) && season === "Low") {
        rentalPrice *= 0.9;
    }

    if (calculateYearsFromDate(licenseIssuingDate) < 1) {
        return "Individuals holding a driver's license for less than a year are ineligible to rent."
    } else if (calculateYearsFromDate(licenseIssuingDate) < 2) {
        rentalPrice *= 1.3;
    } else if (calculateYearsFromDate(licenseIssuingDate) < 3 && season === "High") {
        rentalPrice += 15;
    }

    return '$' + (Math.round(rentalPrice * 100) / 100);
}


function isLongPeriod(days) {
    return days > 10
}

function isDriverAgeLessThan(driverAge, ageToCheck) {
    return driverAge < ageToCheck;
}

function getDays(pickUpDate, dropOffDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickUpDate);
    const secondDate = new Date(dropOffDate);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSeason(pickUpDate, dropOffDate) {
    const pickUp = new Date(pickUpDate);
    const dropOff = new Date(dropOffDate);

    const start = 4;
    const end = 10;

    const pickUpMonth = pickUp.getMonth();
    const dropOffMonth = dropOff.getMonth();

    if (
        (pickUpMonth >= start && pickUpMonth <= end) ||
        (dropOffMonth >= start && dropOffMonth <= end) ||
        (pickUpMonth < start && dropOffMonth > end)
    ) {
        return "High";
    } else {
        return "Low";
    }
}

function isWeekend(date) {
    const day = new Date(date).getDay();
    return day % 6 === 0;
}

function calculateTotalPrice(age, days, pickUpDate, dropOffDate) {
    let rentalPrice = age * days;

    const startDate = new Date(pickUpDate);
    const endDate = new Date(dropOffDate);

    const loopDate = new Date(startDate);

    while (loopDate <= endDate) {
        if (isWeekend(loopDate)) {
            rentalPrice = (rentalPrice - age) + (age * 1.05);
        }
        loopDate.setDate(loopDate.getDate() + 1);

        if (loopDate.getFullYear() === endDate.getFullYear() && loopDate.getMonth() === endDate.getMonth() &&
            loopDate.getDay()-1 === endDate.getDay()) {
            break;
        }

    }

    return rentalPrice;
}

function calculateYearsFromDate(date) {
    const currentDate = new Date();
    const issuingDate = new Date(date);
    years = currentDate.getFullYear() - issuingDate.getFullYear();
    return years;
}

exports.calculatePrice = calculatePrice;
exports.isLongPeriod = isLongPeriod;
exports.isDriverAgeLessThan = isDriverAgeLessThan;
exports.getDays = getDays;
exports.getSeason = getSeason;
exports.calculateYearsFromDate = calculateYearsFromDate;
exports.isWeekend = isWeekend;
exports.calculateTotalPrice = calculateTotalPrice