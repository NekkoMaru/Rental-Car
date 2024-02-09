const { price } = require('./rentalPrice');

describe('price function tests', () => {
    test('Calculate rental price for compact car with driver older than 21', () => {
        const result = price("2024-02-10", "2024-02-15", "compact", 25, "2023-02-09");
        expect(result).toEqual("$195.00");
    });

    test('Reject rental for driver younger than 18', () => {
        const result = price("2024-02-10", "2024-02-15", "compact", 17, "2023-02-09");
        expect(result).toEqual("Driver too young - cannot quote the price");
    });

    test('Reject rental for driver with less than 1 year of driving experience', () => {
        const result = price("2024-02-10", "2024-02-15", "compact", 25, "2023-02-11");
        expect(result).toEqual("Individuals holding a driver's license for less than a year are ineligible to rent.");
    });

    test('Calculate rental price with discount for low season and long duration', () => {
        const result = price("2024-01-10", "2024-01-20", "electric", 30, "2020-01-10");
        expect(result).toEqual("$297.00");
    });

    test('Calculate rental price with additional charges for high season and driver younger than 25 for racer car', () => {
        const result = price("2024-07-10", "2024-07-20", "racer", 24, "2023-07-09");
        expect(result).toEqual((24*1.50*1.15*1.3)*11+(15*11)); // Working
    });
});
