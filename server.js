const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "/backend/data", "data.json");
const PORT = Number(process.env.PORT) || 8055;

const app = express();
app.use(express.json());

const allowOrigin = "*";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

async function readProductData() {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeProductData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/restaurants", async (req, res) => {
  try {
    const data = await readProductData();

    // const restaurantsListDto = data.map(
    //   ({ reviews, description, hours, ...rest }) => ({
    //     ...rest,
    //     reviewsCount: Array.isArray(reviews) ? reviews.length : 0,
    //     reviewsAvg:
    //       reviews.length > 0
    //         ? reviews.reduce((sum, rev) => sum + Number(rev.rating || 0), 0) /
    //           reviews.length
    //         : Number(r.rating || 0), // fallback
    //   })
    // );

    res.json(data ?? []);
  } catch (error) {
    console.error("Failed to read products", error);
    res.status(500).json({ error: "Unable to load restaurants." });
  }
});

app.get("/restaurant/:id", async (req, res) => {
  try {
    const data = await readProductData();
    const needle = data.find((r) => r.id === Number(req.params.id));
    res.json(needle ? [needle] : []);
  } catch (error) {
    console.error("Failed to fetch product", error);
    res.status(500).json({ error: "Unable to fetch restaurant." });
  }
});

app.listen(PORT, () => {
  console.log(`Product API listening on port ${PORT}`);
});
