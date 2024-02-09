const express = require('express');
const { price } = require('./rentalPrice');

const app = express();
const port = 3000;

// Разрешить обработку данных формы
app.use(express.urlencoded({ extended: true }));

// Обрабатываем POST-запрос с данными из формы
app.post('/', (req, res) => {
    // Получаем данные из формы
    const { pickupDate, dropoffDate, type, age, licensedate } = req.body;

    // Вызываем функцию price
    const totalPrice = price(pickupDate, dropoffDate, type, age, licensedate);

    // Отправляем результат обратно на клиент
    res.send(`<h1>Total Price: ${totalPrice}</h1>`);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
