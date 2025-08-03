Sure! Here's the entire `README.md` content in one copy-paste-friendly block:

---

```markdown
# 🌍 Family Trip Tracker

A full-stack web application that lets users track the countries they've visited, switch between user profiles, and visualize travel progress.

![screenshot](image.png)

---

## ✨ Features

- ✅ Add and manage multiple users
- ✅ Track visited countries with a simple search
- ✅ Visualize total countries visited
- ✅ Color-coded user customization
- ✅ PostgreSQL database integration

---

## 🚀 Tech Stack

| Technology  | Role                         |
| ----------- | ---------------------------- |
| Node.js     | Server-side runtime          |
| Express.js  | Web framework                |
| EJS         | Templating engine            |
| PostgreSQL  | Relational database          |
| pg          | Node PostgreSQL client       |
| dotenv      | Environment variable config  |
| body-parser | Form data parsing middleware |

---

## 📁 Project Structure
```

Family-Trip-Tracker/
│
├── public/ # Static assets (CSS, images)
├── views/ # EJS templates
├── .env # Environment variables (not committed)
├── .env.example # Sample config file
├── index.js # Main server logic
├── package.json
└── README.md

````

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaiPavan214/Family-Trip-Tracker.git
   cd Family-Trip-Tracker
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a PostgreSQL database**

   Create a database named `world` and ensure it has the following tables:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) UNIQUE NOT NULL,
     color VARCHAR(50)
   );

   CREATE TABLE countries (
     country_code VARCHAR(5) PRIMARY KEY,
     country_name VARCHAR(255)
   );

   CREATE TABLE visited_countries (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     country_code VARCHAR(5) REFERENCES countries(country_code)
   );
   ```

4. **Configure environment variables**

   Create a `.env` file based on `.env.example`:

   ```
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=world
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```

5. **Start the app**

   ```bash
   node index.js
   ```

   Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📌 Future Improvements

- 🗺 Add a world map visualization (e.g., using D3 or Leaflet)
- 📱 Make the app mobile responsive
- 📊 Add statistics for most visited regions
- ✈️ Integrate a travel wishlist

---

## 🛡 Security Note

> All credentials and secrets are handled via environment variables. Be sure **not to commit your `.env` file**. Use `.env.example` as a reference for others.

---

## 🤝 Contributions

Pull requests and suggestions are welcome! Feel free to fork the project and improve it.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ by [Sai Pavan](https://github.com/SaiPavan214)
