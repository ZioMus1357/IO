# IO-main – Dokumentacja projektu

## 🛠 Technologie
- **Backend**:
  - Node.js
  - Express
  - MongoDB + Mongoose
  - Axios
  - Cheerio (do web scrapingu)
  - Groq API (do generowania przepisów)
  
- **Frontend**:
  - React.js
  - Axios

---

## 📁 Struktura projektu

IO-main/\
── backend/ # Backend (Node.js)\
 ── server.js # Serwer Express, obsługuje API i MongoDB\
 ── models/product.js # Model danych dla produktów\
 ── routes/products.js # Routing API: /api/products, /scrape, /api/recipes\
 ── scrapers/scraper.js # Skrypt scrapujący produkty z Biedronki\
── frontend/ # Frontend (React)\
 ── src/ # Komponenty React\
  ── App.js # Główny komponent aplikacji\
  ── components/ # Podkomponenty aplikacji\
   ── Filter.js # Komponent filtra kategorii\
   ── ProductList.js # Komponent listy produktów\
   ── SelectedProductsPanel.js # Komponent wybranych produktów\
 ── public/\
 ── index.html # Główny plik HTML\
── README.md # Dokumentacja projektu\


---

## 📒 Backend – Opis

### 🔧 Technologie Backendowe

- **Node.js** – backend oparty na Node.js.
- **Express** – serwer HTTP.
- **MongoDB** – baza danych do przechowywania produktów.
- **Mongoose** – ORM do MongoDB.
- **Axios** – do wykonywania zapytań HTTP w scrapingu.
- **Cheerio** – do parsowania HTML podczas scrapingu produktów.
- **Groq API** – generowanie przepisów kulinarnych (kompatybilne z OpenAI).

### 📁 Struktura katalogów

#### `backend/`

- **server.js** – główny plik serwera Express, który obsługuje zapytania API oraz połączenie z MongoDB.
- **models/product.js** – model Mongoose dla produktów.
- **routes/products.js** – routing API dla `/api/products`, `/scrape`, `/api/recipes`.
- **scrapers/scraper.js** – skrypt scrapujący produkty z Biedronki.

#### API

- **GET `/api/products`** – Pobiera listę produktów z bazy danych.
- **POST `/api/recipes`** – Wysyła listę produktów do generowania przepisów.
- **POST `/scrape`** – Uruchamia scraper, który pobiera dane o produktach z Biedronki i zapisuje je w bazie danych.
- **POST `/api/selected-products`** – Testowy endpoint do logowania wybranych produktów.

#### Scraping produktów (`scrapers/scraper.js`)

Skrypt scrapuje produkty z Biedronki w określonych kategoriach i zapisuje je w MongoDB. Przykład:

```js
{ name: "Banany luz", price: 5.99, category: "owoce" }
  ```
Kategorie, które są obsługiwane (można je edytować w tablicy categories):
```
[
  "owoce", "warzywa", "piekarnia", "nabial", "mieso", 
  "dania-gotowe", "napoje", "mrozone", "artykuly-spozywcze", 
  "drogeria", "dla-domu", "dla-dzieci", "dla-zwierzat"
]
```
## 🖥️ Frontend – Opis
### 🔧 Technologie Frontendowe
**React.js** – do budowy interfejsu użytkownika.

**Axios** – do komunikacji z backendem.

### Komponenty:

**ProductList** – lista produktów.

**Filter** – filtr kategorii.

**SelectedProductsPanel** – panel wybranych produktów.

### Główne komponenty
**App.js**
Główny komponent aplikacji, który:

Pobiera dane o produktach z backendu i zapisuje je w stanie products.

Pozwala użytkownikowi wybierać produkty i dodawać je do listy wybranych.

Po kliknięciu przycisku, wysyła wybrane produkty do backendu i generuje przepisy.

**Filter.js**
Komponent do wyboru kategorii produktów. Umożliwia użytkownikowi filtrowanie produktów według wybranej kategorii:
```
<select onChange={(e) => setSelectedCategory(e.target.value)}>
  <option value="">Wszystkie kategorie</option>
  {categories.map((category, idx) => (
    <option key={idx} value={category}>{category}</option>
  ))}
</select>
```
Komponent wyświetlający wybrane produkty oraz umożliwiający wysłanie ich do backendu w celu generowania przepisów:
```
<button onClick={handleSend} disabled={selectedProducts.length === 0}>
  🔍 Pokaż przepisy z tych składników
</button>
```
Komponent, który wyświetla listę produktów i pozwala użytkownikowi na zaznaczanie/odznaczanie produktów:
```
<input
  type="checkbox"
  checked={isSelected}
  onChange={() => toggleProductSelection(product)}
/>
```
## 🧑‍🍳 Generowanie przepisów
Frontend umożliwia generowanie przepisów na podstawie wybranych produktów. Wysyłając listę produktów do API, otrzymujemy tekst z propozycjami przepisów kulinarnych, które są następnie wyświetlane na stronie.

## ⚙️ Zmienna środowiskowa (Backend)
Aplikacja wymaga pliku .env, który powinien zawierać:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
GROQ_API_KEY=your_groq_api_key
```
## 💡 Użycie aplikacji
**Backend:**

Uruchom backend: node server.js w katalogu backend.

Serwer będzie działał na porcie 5000 (lub innym wskazanym w .env).

**Frontend:**

Uruchom frontend: npm start w katalogu frontend.

Aplikacja będzie dostępna pod http://localhost:3000.

## 🚧 Podsumowanie
Aplikacja pozwala na scrapowanie produktów z Biedronki, zarządzanie nimi i generowanie przepisów kulinarnych na ich podstawie.

Użytkownicy mogą filtrować produkty, wybierać je i otrzymywać przepisy na podstawie dostępnych składników.

## Autorzy:
**Jolanta Jabłonowska**
**Dawid Górka**
**Wojciech Gochnio**
