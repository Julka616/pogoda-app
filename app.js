const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Informacja w logach przy starcie
const now = new Date();
console.log(`Aplikacja uruchomiona: ${now.toLocaleString()}, autor: Julia, port: ${PORT}`);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Strona główna
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Obsługa formularza
app.post('/pogoda', async (req, res) => {
  const country = req.body.country;
  const city = req.body.city;

  // Przykładowe współrzędne dla wybranych miast
  const cities = {
    "Polska": {
      "Warszawa": { lat: 52.23, lon: 21.01 },
      "Kraków": { lat: 50.06, lon: 19.94 },
      "Gdańsk": { lat: 54.35, lon: 18.65 }
    },
    "Niemcy": {
      "Berlin": { lat: 52.52, lon: 13.41 },
      "Monachium": { lat: 48.14, lon: 11.58 },
      "Hamburg": { lat: 53.55, lon: 9.99 }
    },
    "Francja": {
      "Paryż": { lat: 48.85, lon: 2.35 },
      "Marsylia": { lat: 43.30, lon: 5.37 },
      "Lyon": { lat: 45.75, lon: 4.85 }
    }
  };

  // Sprawdzanie, czy miasto i kraj istnieją w danych
  if (!cities[country] || !cities[country][city]) {
    return res.send("Błąd: Nie znaleziono danych dla wybranego miasta i kraju.");
  }

  const { lat, lon } = cities[country][city];

  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true
      }
    });

    const weather = response.data.current_weather;

    // Formatowanie daty z odpowiedzi API
    const weatherDate = new Date(weather.time);
    const weatherDateFormatted = weatherDate.toLocaleDateString('pl-PL', {
      timeZone: 'Europe/Warsaw' // Wymuszenie strefy czasowej Europy/Warszawy
    });
    const weatherTimeFormatted = weatherDate.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Warsaw' // Wymuszenie strefy czasowej Europy/Warszawy
    });

    // Logowanie daty i godziny serwera
    const serverDate = now.toLocaleDateString('pl-PL');
    const serverTime = now.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    console.log(`Serwer - Data: ${serverDate}, Godzina: ${serverTime}`);

    // Odpowiedź HTML
    res.send(`
      <html>
        <head><link rel="stylesheet" href="/style.css" /></head>
        <body>
          <h1>Pogoda w ${city}, ${country}</h1>
          <p>Temperatura: ${weather.temperature}°C</p>
          <p>Wiatr: ${weather.windspeed} km/h</p>
          <p>Data i Godzina: ${weatherDateFormatted} ${weatherTimeFormatted}</p>
          <br><a href="/">Wróć</a>
        </body>
      </html>
    `);

  } catch (err) {
    console.error(err);
    res.send("Wystąpił błąd podczas pobierania pogody.");
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplikacja działa na porcie ${PORT}`);
});
