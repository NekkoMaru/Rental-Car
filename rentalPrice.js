function getRentalDays(pickupDate, dropoffDate) {
    console.log("pickupDate:", pickupDate);
    console.log("dropoffDate:", dropoffDate);
    const oneDay = 24 * 60 * 60 * 1000; //hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickupDate);
    const secondDate = new Date(dropoffDate);
    const differenceMs = Math.abs(firstDate.getTime() - secondDate.getTime());
    return Math.round(differenceMs / oneDay) + 1;
}

function getRentalSeason(pickupDate, dropoffDate) {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    const start = 3; // April
    const end = 9; // October

    const pickupMonth = pickup.getMonth();
    const dropoffMonth = dropoff.getMonth();

    return (
        (pickupMonth >= start && pickupMonth <= end) ||
        (dropoffMonth >= start && dropoffMonth <= end) || 
        (pickupMonth < start && dropoffMonth > end)
    ) 
}

function getLicenseYears(pickupDate, licensedate) {
    const pickup = new Date(pickupDate);
    const licenseDate = new Date(licensedate);
    const oneYear = 365 * 24 * 60 * 60 * 1000; //days*hours*minutes*seconds*milliseconds
    const licenseYears = (pickup - licenseDate) / oneYear; 
    return licenseYears;
}

function calculateRentalPrice(age, carClass, rentalDays, rentalSeason, licenseYears) {
    let rentalPrice = age; // Minimum rental price per day  age of the driver

    if (age < 18) {
        return "Driver too young - cannot quote the price";
    }

    if (age >= 18 && age <= 21 && carClass !== "compact") {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }

    if (licenseYears < 1) {
        return "Individuals holding a driver's license for less than a year are ineligible to rent.";
    }

    if (licenseYears < 2) {
        rentalPrice *= 1.3; // Increase price by 30%, if driver had driver license for less than 2 years
    }

    if (licenseYears < 3 && rentalSeason) {
        rentalPrice += 15; // Add 15 euros to the daily rental price during high season and if driver had driver license for less than 3 years
    }

    if (carClass === "racer" && age <= 25 && rentalSeason) {
        rentalPrice *= 1.5; // Increase price by 50% for racer car and driver aged 25 or younger during high season
    }

    if (rentalSeason) {
        rentalPrice *= 1.15; // Increase price by 15% during high season
    }

    if (rentalDays > 10 && !rentalSeason) {
        rentalPrice *= 0.9; // Decrease price by 10% for rentals longer than 10 days during low season
    }

    rentalPrice *= rentalDays; // Multiply by the number of rental days

    return '$' + rentalPrice.toFixed(2);
}


function price(pickupDate, dropoffDate, type, age, licensedate) {
    const carClass = getCarClass(type);
    const rentalDays = getRentalDays(pickupDate, dropoffDate);
    const rentalSeason = getRentalSeason(pickupDate, dropoffDate);
    const licenseYears = getLicenseYears(pickupDate, licensedate);
    
    return calculateRentalPrice(age, carClass, rentalDays, rentalSeason, licenseYears);
}

exports.price = price;
