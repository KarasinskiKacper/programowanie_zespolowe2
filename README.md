# Programowanie Zespołowe 2 - Komunikator

## Opis projektu
Aplikacja "Komunikator" działająca w sieci lokalnej prowadzi wymiane wiadomości poprzez socket'y. Aplikacja wykonany w ramach projektu na programowanie zespołowe.

## Wymagania
- Python 3.12
- MySQL 8.0
- Node v20.12.2
- npm 10.8.0

## Instalacja
Przed instalacją należy utworzyć w `frontend/` i `backend/` pliki `.env` według szablonów.
```bash
git clone https://github.com/KarasinskiKacper/programowanie_zespolowe2.git
cd programowanie_zespolowe2
pip install -r requirements.txt

cd frontend
npm i
npm run build
```

## Uruchomienie aplikacji
Przed pierwszym uruchomieniem należy skonfigurować bazę MySQL używając `Database/Komunikator.sql`.<br>
Po przygotowaniu bazy danych aplikacje uruchamia się w następujący sposób:
```bash
cd backend
python3 main.py

cd ../frontend
npm run start
```

## Struktura projektu
```
programowanie_zespolowe2/
├── backend/
│   ├── main.py
│   ├── .env
│   ├── Database/
│   └── docs/
├── frontend/
│   ├── package.json
│   ├── src/
│   └── docs/
|
├── requirements.txt
└── README.md
```
## Działanie Aplikacji
Aplikacja umożliwia wymianę wiadomości tekstowych w czasie rzeczywistym, zarządzanie pokojami czatowymi oraz śledzenie statusu aktywności użytkowników. <br>
Użytkownik rozpoczyna od utworzenia konta i zalogowania się, aby uzyskać dostęp do serwera. <br>
Aby zacząć pisać, wybierz jeden z dostępnych pokoi publicznych, dołącz do pokoju prywatnego za pomocą klucza dostępu lub stwórz własny pokój (publiczny bądź prywatny z kluczem dostępu). <br>
Po dołączeniu do pokoju możesz wysyłać wiadomości, przeglądać historię rozmowy oraz widzieć, kto aktualnie jest dostępny online.<br>
Jako właściciel pokoju posiadasz uprawnienia do edycji pokoi i zarządzania użytkownikami wewnątrz pokoju.<br>
Jeżeli uznasz, że twój pokój nie jest już potrzebny, możesz go usunąć (usunięcie pokoju wiąże się z całkowitym usunięciem historii wiadomości).

## Autorzy
Aplikacja została stworzona przez:
* Karasiński Kacper
* Dyczek Paweł
* Całus Mikołaj
* Herzyk Paweł
* Lipiński Dawid
