function price(pickupDate, dropoffDate, type, age, licensedate) {
    function getCarClass(type) {
        switch (type) {
            case "compact":
                return "compact";
            case "electric":
                return "electric";
            case "cabrio":
                return "cabrio";
            case "racer":
                return "racer";
            default:
                return "unknown";
        }
    }

    function getRentalDays(pickupDate, dropoffDate) {
        console.log("pickupDate:", pickupDate);
        console.log("dropoffDate:", dropoffDate);
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(pickupDate);
        const secondDate = new Date(dropoffDate);
        const differenceMs = Math.abs(firstDate.getTime() - secondDate.getTime());
        return Math.round(differenceMs / oneDay) + 1;
    }
    
    

    function getRentalSeason(pickupDate, dropoffDate) {
        const pickup = new Date(pickupDate);
        const dropoff = new Date(dropoffDate);

        const start = 4; // April
        const end = 10; // October

        const pickupMonth = pickup.getMonth();
        const dropoffMonth = dropoff.getMonth();

        if (
            (pickupMonth >= start && pickupMonth <= end) ||
            (dropoffMonth >= start && dropoffMonth <= end) ||
            (pickupMonth < start && dropoffMonth > end)
        ) {
            return "High";
        } else {
            return "Low";
        }
    }

    function getLicenseYears(pickupDate, licensedate) {
        const pickup = new Date(pickupDate);
        const licenseDate = new Date(licensedate);
        const licenseYears = (pickup - licenseDate) / (365 * 24 * 60 * 60 * 1000); //days*hours*minutes*seconds*milliseconds
        return licenseYears;
    }

    const carClass = getCarClass(type);
    const rentalDays = getRentalDays(pickupDate, dropoffDate);
    const rentalSeason = getRentalSeason(pickupDate, dropoffDate);
    const licenseYears = getLicenseYears(pickupDate, licensedate);
    let rentalPrice = age; // Minimum rental price per day is equivalent to the age of the driver

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

    if (licenseYears < 3 && rentalSeason === "High") {
        rentalPrice += 15; // Add 15 euros to the daily rental price during high season and if driver had driver license for less than 3 years
    }

    if (carClass === "racer" && age <= 25 && rentalSeason === "High") {
        rentalPrice *= 1.5; // Increase price by 50% for racer car and driver aged 25 or younger during high season
    }

    if (rentalSeason === "High") {
        rentalPrice *= 1.15; // Increase price by 15% during high season
    }

    if (rentalDays > 10 && rentalSeason === "Low") {
        rentalPrice *= 0.9; // Decrease price by 10% for rentals longer than 10 days during low season
    }

    rentalPrice *= rentalDays; // Multiply by the number of rental days

    // Use method toFixed to format the rental price
    return '$' + rentalPrice.toFixed(2);
}

exports.price = price;
