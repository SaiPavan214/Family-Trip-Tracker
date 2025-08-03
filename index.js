import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 8000;

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [];

async function getCurrentUser() {
  const users = await getUsers();
  return users.find((user) => user.id == currentUserId);
}

async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  let users = [];
  result.rows.forEach((user)=>{
    users.push(user);
  })
  return users;
}


async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries where user_id = $1",[currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const users = await getUsers();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });

});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const id = await getCurrentUser();
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  const id = req.body["user"];
  currentUserId = id;
  console.log(currentUserId);
  if(req.body.add){
    return res.render("new.ejs");
  }
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE users.id = ($1)",[id]
  );
  const color_result = await db.query("SELECT color FROM users WHERE users.id = ($1)",[id]);
  const color = color_result.rows[0]?.color || "teal";
  let countries = []
  result.rows.forEach((country) =>{
    countries.push(country.country_code)
  });
  console.log(countries);
  res.render("index.ejs",{
    countries: countries,
    total : countries.length,
    color: color,
    users: await getUsers()
  });
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const name = req.body["name"];
  const color = req.body["color"];
  try{
    const result = await db.query("INSERT INTO users (name,color) VALUES ($1,$2)",[name,color]);
    console.log(result);
    res.redirect("/");
  }
  catch(error){
    console.log("Username already exists");
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
