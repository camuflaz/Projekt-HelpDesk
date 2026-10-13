# HelpDesk

HelpDesk to aplikacja internetowa służąca do przeglądania zgłoszeń do pomocy technicznej i zarządzania nimi, sprawdzania statystyk zgłoszeń oraz aktualizowania danych konta.

## Strony

### Panel główny

Panel główny przedstawia przegląd aktywności związanej ze zgłoszeniami oraz statystyki dla administratora wraz z możliwością zarządzania zgłoszeniami.

Panel główny administratora

![Dashboard admin illustration](src/assets/dashboard-admin.png)

Panel główny użytkownika

![Dashboard user illustration](src/assets/dashboard-user.png)

### Zgłoszenia

Strona zgłoszeń umożliwia użytkownikom przeglądanie zgłoszeń do pomocy technicznej oraz zarządzanie nimi.

![Tickets](src/assets/tickets.png)

### Settings

Strona ustawień umożliwia użytkownikom zmianę nazwy użytkownika, adresu e-mail i hasła lub usunięcie konta.

![Settings illustration](src/assets/settings.png)

### Help

Strona pomocy zawiera informacje i wskazówki dotyczące korzystania z HelpDesk.

![Help illustration](src/assets/help.png)

### Login

Projekt zawiera również stronę logowania. Obecnie nie jest ona zarejestrowana jako ścieżka w pliku `src/routes/AppRoutes.jsx`.

![Login illustration](src/assets/login.png)

## Funkcjonalności

### Pasek nawigacyjny (Sidebar)

Pasek boczny zapewnia nawigację między panelem głównym, zgłoszeniami, ustawieniami i pomocą. Można go zwinąć, a przycisk wylogowania kończy sesję użytkownika.

Pasek rozwinięty

![Rozwinięty pasek nawigacyjny](src/assets/Sidebar-open.png)

Pasek zwinięty

![Zwinięty pasek nawigacyjny](src/assets/Sidebar-closed.png)

### Tworzenie zgłoszeń

Formularz na panelu użytkownika pozwala utworzyć zgłoszenie, podając tytuł, opis, kategorię i priorytet oraz opcjonalne tagi.

![Formularz nowego zgłoszenia na panelu użytkownika](src/assets/dashboard-user.png)

### Lista, wyszukiwanie i filtrowanie zgłoszeń

Lista zgłoszeń prezentuje ich status, priorytet i datę. Wyszukiwarka i filtry umożliwiają zawężenie wyników według statusu, priorytetu, kategorii i zakresu dat. Lista obsługuje również stronicowanie.

![Lista zgłoszeń](src/assets/tickets.png)

![Wyszukiwanie i filtry zgłoszeń](src/assets/tickets-filters.png)

### Szczegóły zgłoszenia: TicketDrawer i TicketWindow

Wybranie zgłoszenia otwiera widok szczegółów:

- **TicketDrawer** otwiera się z panelu głównego. Pokazuje opis, autora, status, priorytet, kategorię i rozmowę. Użytkownicy mogą odpowiadać w rozmowie, a administratorzy mogą przypisać sobie aktywne zgłoszenie lub zmienić jego status.
- **TicketWindow** otwiera się na stronie zgłoszeń. Pokazuje przebieg i status zgłoszenia. Administratorzy mogą przypisać zgłoszenie, oznaczyć je jako rozwiązane lub zamknąć. Widok obsługuje publiczne wiadomości i notatki wewnętrzne.

TicketDrawer — szczegóły zgłoszenia otwierane z panelu głównego:

![TicketDrawer](src/assets/TicketDrawer.png)

TicketWindow — szczegóły zgłoszenia otwierane ze strony zgłoszeń:

![TicketWindow](src/assets/TicketWindow.png)

### Statystyki administratora

Panel administratora prezentuje liczbę aktywnych, nowych, rozwiązanych i zamkniętych zgłoszeń oraz średni czas ich realizacji.

![Statystyki administratora](src/assets/TicketAdminStatistics.png)

## Routes

| Page | Path |
| --- | --- |
| Dashboard | `/dashboard` |
| Tickets | `/tickets` |
| Settings | `/settings` |
| Help | `/help` |

## Development

Z katalogu frontend zainstaluj dependecies i uruchom lokalny serwer deweloperski:

```sh
npm install
npm run dev
```

Aby utworzyć kompilację produkcyjną lub sprawdzić kod za pomocą ESLint:

```sh
npm run build
npm run lint
```
