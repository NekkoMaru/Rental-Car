const rental = require("../rentalPrice");

test('Driver under 18 cannot rent a car', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-02-02', 'Compact','2024-02-02', 15))
        .toBe('Driver too young - cannot quote the price');
});

test('Driver rents a "TeslaCar" ', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-02-02', 'TeslaCar','2000-02-02', 60))
        .toBe('No such car');
});

test('Driver rents a "TeslaCar" ', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-02-02', 'TeslaCar','2000-02-02', 60))
        .toBe('No such car');
});

test('23 years old driver rents racer car during High season.', () => {
    expect(rental.calculatePrice('2024-06-01', '2024-06-02', 'Racer','2020-02-02', 23))
        .toBe("$69");
});

test('23 years old driver rents racer car during Low season.', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-01-02', 'Racer','2020-02-02', 23))
        .toBe("$46");
});

test('5 days is not long rental', () => {
    expect(rental.isLongPeriod(5))
        .toBe(false);
});

test('15 days is long rental', () => {
    expect(rental.isLongPeriod(15))
        .toBe(true);
});

test('Driver aged 18 can rent only compact cars', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-02-02', 'Compact','2023-02-02', 18))
        .toBe('$694.98')
})

test('Driver aged 18 can rent only compact cars', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-02-02', 'Racer','2023-02-02', 18))
        .toBe('Drivers 21 y/o or less can only rent Compact vehicles')
})

test('Driver aged 18 can rent only compact cars', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-02-02', 'Electric','2023-02-02', 18))
        .toBe('Drivers 21 y/o or less can only rent Compact vehicles')
})

test('Driver aged 18 can rent only compact cars', () => {
    expect(rental.calculatePrice('2024-01-01', '2024-02-02', 'Cabrio','2023-02-02', 18))
        .toBe('Drivers 21 y/o or less can only rent Compact vehicles')
})

test('Driver age is less than 18', () => {
    expect(rental.isDriverAgeLessThan(17, 18))
        .toBe(true)
})

test('Driver age is more than 18', () => {
    expect(rental.isDriverAgeLessThan(20, 18))
        .toBe(false)
})

test("Days between 2024-01-01 and 2024-01-02 is equals to 2", () => {
    expect(rental.getDays("2024-01-01", "2024-01-02"))
        .toBe(2)
})

test("Season in January is Low", () => {
    expect(rental.getSeason("2024-01-01", "2024-01-02"))
        .toBe("Low")
})

test("Season in June is High", () => {
    expect(rental.getSeason("2024-06-01", "2024-06-02"))
        .toBe("High")
})

test("50 year old driver rents a car for 3 days during high season", () => {
    expect(rental.calculatePrice("2024-05-06", "2024-05-08", "Compact", "2001-02-01", 50))
        .toBe("$172.5")
})

test("Years from date 2023-02-01 is equals to 1", () => {
    expect(rental.calculateYearsFromDate("2023-02-01"))
        .toBe(1)
})

test("Years from date 2021-02-01 is equals to 3", () => {
    expect(rental.calculateYearsFromDate("2021-02-01"))
        .toBe(3)
})

test("Driver with driver's license issued less than a year ago is ineligible to rent", () => {
    expect(rental.calculatePrice("2024-05-06", "2024-05-08", "Compact", "2024-02-01", 25))
        .toBe("Individuals holding a driver's license for less than a year are ineligible to rent.")
})

test("Driver with driver's license issued less than 3 year ago during high season trying to rent a car. Total price =  ", () => {
    expect(rental.calculatePrice("2024-05-06", "2024-05-08", "Compact", "2022-02-01", 30))
        .toBe("$118.5")
})

test("50 year old driver rents a car from april to november", () => {
    expect(rental.calculatePrice("2024-04-06", "2024-10-08", "Compact", "2002-02-01", 50))
        .toBe("$10695")
})

// TDD


test('verify that monday is a weekday', () => {
    expect(rental.isWeekend('2024-02-19')).toBe(false)
})

test('verify that saturday is a weekday', () => {
    expect(rental.isWeekend('2024-02-17')).toBe(true)
})

test('50 year old driver rents a car for three days: Monday, Tuesday, Wednesday - Total price $150 ', () => {
    expect(rental.calculateTotalPrice(50, 3,  "2024-05-06", "2024-05-08")).toBe(150)
})

test('50 year old driver rents a car for three days: Thursday, Friday, Saturday - Total price $152.50 ', () => {
    expect(rental.calculateTotalPrice(50, 3,  "2024-05-02", "2024-05-04")).toBe(152.5)
})

test('50 year old driver rents a car for three days: Friday, Saturday, Sunday - Total price $155 ', () => {
    expect(rental.calculateTotalPrice(50, 3,  "2024-05-03", "2024-05-05")).toBe(155)
})