
# Aplikacja Pogodowa w Node.js z użyciem Dockera

## 1. Opis aplikacji

Aplikacja pogodowa została stworzona w technologii **Node.js** z użyciem frameworka **Express**. Umożliwia użytkownikowi wybór kraju i miasta w celu wyświetlenia aktualnej pogody na podstawie danych pobieranych z API.
Aplikacja wykorzystuje metodę POST do przesyłania danych z formularza i dynamicznie wyświetla wynik w przeglądarce użytkownika.
Użytkownik może wybrać jeden z trzech krajów: Polska, Niemcy lub Francja, a następnie miasto dostępne w wybranym kraju.

## 2. Struktura projektu

├── public/
│   └── style.css          # Style CSS dla aplikacji
├── views/
│   └── index.html         # Szablon HTML z formularzem
├── app.js                 # Główny plik serwera Express
├── Dockerfile             # Plik Dockerfile do budowania kontenera
├── package.json           # Zależności npm i konfiguracja aplikacji

## 3. Uruchamianie aplikacji

1. Zbuduj obraz:

   docker build -t moja-aplikacja .
   
2. Uruchom kontener:
   
   docker run -d -p 3000:3000 --name moja-aplikacja moja-aplikacja

3. Sprawdzanie lagów:
  
   docker logs moja-aplikacja

4. Rozmiar obrazu: 

   docker images

 Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## 4. Linki

**GitHub (repozytorium z kodem źródłowym)**: https://github.com/Julka616/moja-aplikacja

**DockerHub (obraz aplikacji)**: [https://hub.docker.com/r/twoja-nazwa-uzytkownika/pogoda-app](https://hub.docker.com/r/twoja-nazwa-uzytkownika/pogoda-app)

