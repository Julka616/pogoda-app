 Zadanie 2: 

 Zawartość repozytorium

- Dockerfile – buduje obraz aplikacji
- .github/workflows – pipeline GitHub Actions
- app.js – główny plik aplikacji
- style.css – stylizacja interfejsu
- package.json – zależności Node.js

 Uruchamianie lokalne

1. Zbuduj obraz Dockera:
   docker build -t pogoda-app .

2. Uruchom kontener:
   docker run -p 3000:3000 pogoda-app
 

Pipeline automatycznie:

1. Buduje obraz Dockera.
2. Tworzy wersje dla linux/amd64 oraz linux/arm64.
3. Używa cache z DockerHub (eksporter: registry, tryb max).
4. Przeprowadza skan bezpieczeństwa (CVE) przy użyciu Trivy.


Tagowanie:

- Obrazy: `latest`
- Cache: `pogoda-app-cache:latest`

Tag `latest` ułatwia zarządzanie wersjami przy ciągłej integracji.

Skan bezpieczeństwa – Trivy:

Wybrano Aqua Security Trivy ze względu na:

- natywną integrację z GitHub Actions,
- prostą konfigurację,
- możliwość blokady publikacji obrazu przy wykryciu zagrożeń HIGH lub CRITICAL.

 Status:

- Obraz zbudowany i przesłany do GHCR i DockerHub
- Pipeline zakończony sukcesem
- Skan bezpieczeństwa zaliczony bez błędów

