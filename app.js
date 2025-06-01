// Importujemy wymagane moduły
const express = require('express'); // framework do tworzenia serwera HTTP
const axios = require('axios'); // biblioteka do wykonywania zapytań HTTP
const path = require('path'); // moduł do obsługi ścieżek plików

// Tworzymy instancję aplikacji Express
const app = express();
const PORT = 3000; // Port, na którym nasłuchuje serwer

// Wyświetlamy informację o starcie aplikacji
const now = new Date();
console.log(`Aplikacja uruchomiona: ${now.toLocaleString()}, autor: Julia, port: ${PORT}`);

// Ustawiamy folder 'public' jako katalog ze statycznymi plikami (CSS, obrazy itd.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware do parsowania danych przesyłanych przez formularz (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Obsługa żądania GET na ścieżkę główną – wyświetlenie strony startowej (formularza)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Obsługa żądania POST na ścieżkę /pogoda – po wysłaniu formularza
app.post('/pogoda', async (req, res) => {
  const country = req.body.country; // Pobieramy kraj z formularza
  const city = req.body.city;       // Pobieramy miasto z formularza

  // Przykładowe dane – współrzędne geograficzne dla wybranych miast
  const cities = {
    "Polska": {
      "Warszawa": { lat: 52.23, lon: 21.01 },
      "Lublin": { lat: 51.25, lon: 22.57 },
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

  // Sprawdzenie, czy dane miasto i kraj są dostępne w naszej bazie
  if (!cities[country] || !cities[country][city]) {
    return res.send("Błąd: Nie znaleziono danych dla wybranego miasta i kraju.");
  }

  // Pobieramy współrzędne geograficzne miasta
  const { lat, lon } = cities[country][city];

  try {
    // Wysyłamy zapytanie do API open-meteo z aktualnymi danymi pogodowymi
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true // Pobieramy tylko aktualną pogodę
      }
    });

    // Odczytujemy dane pogodowe z odpowiedzi
    const weather = response.data.current_weather;

    // Pobieramy bieżącą datę i czas serwera (w strefie czasu Warszawy)
    const serverDate = new Date();
    const localServerDate = new Date(serverDate.toLocaleString("en-US", { timeZone: "Europe/Warsaw" }));

    // Formatowanie daty i czasu
    const serverDateFormatted = localServerDate.toLocaleDateString('pl-PL');
    const serverTimeFormatted = localServerDate.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Wyświetlamy wyniki w przeglądarce
    res.send(`
      <h2>Pogoda w ${city}, ${country}</h2>
      <p>Temperatura: ${weather.temperature}°C</p>
      <p>Wiatr: ${weather.windspeed} km/h</p>
      <p>Data i Godzina: ${serverDateFormatted} ${serverTimeFormatted}</p>
    `);

  } catch (err) {
    // Obsługa błędów np. problemów z API
    console.error(err);
    res.send("Wystąpił błąd podczas pobierania pogody.");
  }
});

// Uruchamiamy serwer i nasłuchujemy na wskazanym porcie
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplikacja działa na porcie ${PORT}`);
});
