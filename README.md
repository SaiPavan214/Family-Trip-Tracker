# 🌍 Family Trip Tracker

A full-stack web application that allows users to track the countries they've visited, switch between user profiles, and view progress visually.

## ✨ Features

- ✅ Add and manage multiple users
- ✅ Track visited countries with a simple search
- ✅ View total countries visited
- ✅ Color-coded user customization
- ✅ PostgreSQL database integration (Render compatible)

## 🚀 Tech Stack

| Technology  | Role                        |
| ----------- | --------------------------- |
| Node.js     | Server-side runtime         |
| Express.js  | Web framework               |
| EJS         | Templating engine           |
| PostgreSQL  | Relational database         |
| pg          | PostgreSQL client for Node  |
| dotenv      | Environment variable config |
| body-parser | Middleware for form parsing |

---

## 📁 Project Structure

```

Family-Trip-Tracker/
│
├── public/ # Static assets (CSS, images)
├── views/ # EJS templates
├── .env # Environment variables (excluded from Git)
├── .env.example # Sample config template
├── index.js # Main server logic
├── package.json
└── README.md

```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/SaiPavan214/Family-Trip-Tracker.git
cd Family-Trip-Tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your PostgreSQL database

Use the following SQL to create your tables:

```sql
DROP TABLE IF EXISTS visited_countries, users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(15) UNIQUE NOT NULL,
  color VARCHAR(15)
);

CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

INSERT INTO users (name, color)
VALUES ('Sai Pavan', 'teal'), ('Sandy', 'powderblue');

INSERT INTO visited_countries (country_code, user_id)
VALUES ('FR', 1), ('GB', 1), ('CA', 2), ('FR', 2);
```

💡 You can run these queries using pgAdmin, psql, or your Render database shell.

---

### 4. Configure environment variables

Create a `.env` file in the root directory based on the following:

```
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
```

> If deploying to **Render**, set these variables in the **Environment > Add Environment Variable** section of your Render service settings.

---

### 5. Start the application

```bash
node index.js
```

Then open your browser to [http://localhost:8000](http://localhost:8000)

---

## 📌 Future Improvements

- 🗺 Add a world map with visual pins (e.g., D3.js, Leaflet)
- 📱 Make the app fully mobile responsive
- 📊 Add statistics per user
- 🧾 Add delete functionality for countries and users
- ✈️ Wishlist for future travel destinations

---

## 🛡 Security

> Environment variables are used to protect sensitive database credentials. Make sure **not to commit `.env` files**. Instead, share `.env.example` for configuration.

---

## 🤝 Contributions

Pull requests are welcome! If you find bugs or have feature ideas, feel free to open an issue or PR.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ by [Sai Pavan](https://github.com/SaiPavan214)

```

---

Let me know if you also want the `.env.example` or a deploy-to-Render guide section added.
```
