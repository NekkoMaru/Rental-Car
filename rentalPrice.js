function price(pickup, dropoff, pickupDate, dropoffDate, type, age, licensedate) {
    const clazz = getClazz(type);
    const days = get_days(pickupDate, dropoffDate);
    const season = getSeason(pickupDate, dropoffDate);
    const licenseYears = LicenseYears(licensedate);
    let rentalprice = age * days;

    //Rental cars are categorized into 4 classes: Compact, Electric, Cabrio, Racer.
    function getClazz(type) {
        switch (type) {
            case "Compact":
                return "Compact";
            case "Electric":
                return "Electric";
            case "Cabrio":
                return "Cabrio";
            case "Racer":
                return "Racer";
            default:
                return "Unknown";
        }
    }

    //Individuals under the age of 18 are ineligible to rent a car.
    if (age < 18) {
        return "Driver too young - cannot quote the price";
    }
    
    //Those aged 18-21 can only rent Compact cars.
    if (age <= 21 && clazz !== "Compact") {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }

    /*For Racers, the price is increased by 50% if the driver 
    is 25 years old or younger (except during the low season).*/
    if (clazz === "Racer" && age <= 25 && season === "High") {
        rentalprice *= 1.5;
    }
  
    //If renting in High season, price is increased by 15%.
    if (season === "High") {
      rentalprice *= 1.15;
    }

    /*Individuals holding a driver's license for less than a year are ineligible to rent.
    If the driver's license has been held for less than two years, the rental price is 
    increased by 30%.
    If the driver's license has been held for less than three years, then an additional
    15 euros will 
    be added to the daily rental price during high season.*/
    if (licenseYears < 1) {
        return "You need more experience";
    } else if (licenseYears < 2) {
        rentalprice *= 1.3;
    } else if (licenseYears > 3 && season === "High") {
        rentalprice += 15;
    }
    

    //If renting for more than 10 days, price is decresed by 10% (expect during the high season).
    if (days > 10 && season === "Low") {
        rentalprice *= 0.9;
    }
    return '$' + rentalprice;
  

  function get_days(pickupDate, dropoffDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickupDate);
    const secondDate = new Date(dropoffDate);
  
    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
  }
  
  /*Low season is from November until end of March.
    High season is from April until end of October.*/
  function getSeason(pickupDate, dropoffDate) {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
  
    const start = 4; 
    const end = 10;
  
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
  
  //Calculating license years
  function LicenseYears(licensedate) {
    const licenseDate = new Date(licensedate);
    const currentDate = new Date();
    const licenseYears = (currentDate - licenseDate) / (365 * 24 * 60 * 60 * 1000); //days*hours*minutes*seconds*milliseconds
    return licenseYears;
  }
}

  exports.price = price;
