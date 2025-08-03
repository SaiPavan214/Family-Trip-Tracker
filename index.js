import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

// ✅ PostgreSQL connection (Render or Railway)
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

// ✅ Utility: Fetch all users
async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

// ✅ Utility: Fetch visited countries for user
async function checkVisited(userId) {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1",
    [userId]
  );
  return result.rows.map((row) => row.country_code);
}

// ✅ GET / and /user - Render main page
app.get(["/", "/user"], async (req, res) => {
  try {
    const countries = await checkVisited(currentUserId);
    const users = await getUsers();

    const colorResult = await db.query(
      "SELECT color FROM users WHERE id = $1",
      [currentUserId]
    );
    const color = colorResult.rows[0]?.color || "teal";

    res.render("index.ejs", {
      countries,
      total: countries.length,
      users,
      color,
    });
  } catch (err) {
    console.error("Error rendering index:", err);
    res.status(500).send("Something went wrong.");
  }
});

// ✅ POST /add - Add a country to visited list
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
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;",
      [countryCode, currentUserId]
    );
  } catch (err) {
    console.error("Error adding country:", err);
  }
  res.redirect("/");
});

// ✅ POST /user - Switch current user or add new
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    return res.render("new.ejs");
  }

  currentUserId = req.body.user;
  res.redirect("/");
});

// ✅ POST /new - Create a new user
app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  try {
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id",
      [name, color]
    );
    currentUserId = result.rows[0].id;
  } catch (error) {
    console.error("Username may already exist:", error);
  }

  res.redirect("/");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
