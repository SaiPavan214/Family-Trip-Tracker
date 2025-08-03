import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// PostgreSQL connection setup
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let currentUserId = 1;

// Utility functions
async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

async function getCurrentUser() {
  const users = await getUsers();
  return users.find((user) => user.id == currentUserId);
}

async function checkVisited(userId) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [userId]);
  return result.rows.map((row) => row.country_code);
}

// GET / - Default homepage
app.get("/", async (req, res) => {
  const countries = await checkVisited(currentUserId);
  const users = await getUsers();
  const colorResult = await db.query("SELECT color FROM users WHERE id = $1", [currentUserId]);
  const color = colorResult.rows[0]?.color || "teal";

  res.render("index.ejs", {
    countries,
    total: countries.length,
    users,
    color
  });
});

// ✅ GET /user - Used by Render public link
app.get("/user", async (req, res) => {
  const countries = await checkVisited(currentUserId);
  const users = await getUsers();
  const colorResult = await db.query("SELECT color FROM users WHERE id = $1", [currentUserId]);
  const color = colorResult.rows[0]?.color || "teal";

  res.render("index.ejs", {
    countries,
    total: countries.length,
    users,
    color
  });
});

// POST /add - Add a country
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const countryCode = result.rows[0]?.country_code;
    if (!countryCode) return res.redirect("/");

    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
      [countryCode, currentUserId]
    );
  } catch (err) {
    console.error(err);
  }
  res.redirect("/");
});

// POST /user - Switch or add a user
app.post("/user", async (req, res) => {
  const id = req.body["user"];
  currentUserId = id;

  if (req.body.add) {
    return res.render("new.ejs");
  }

  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1",
    [id]
  );
  const countries = result.rows.map((row) => row.country_code);

  const colorResult = await db.query("SELECT color FROM users WHERE id = $1", [id]);
  const color = colorResult.rows[0]?.color || "teal";

  res.render("index.ejs", {
    countries,
    total: countries.length,
    color,
    users: await getUsers(),
  });
});

// POST /new - Create a new user
app.post("/new", async (req, res) => {
  const name = req.body["name"];
  const color = req.body["color"];
  try {
    await db.query("INSERT INTO users (name, color) VALUES ($1, $2)", [name, color]);
  } catch (error) {
    console.error("Username may already exist:", error);
  }
  res.redirect("/");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
