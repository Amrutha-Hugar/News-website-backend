const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us";
const API_KEY = "d9982e9c0b2d4515a449da8bf6dfbaa8";

app.get("/api/news", async (req, res) => {
  const cachedNews = cache.get("news");
  if (cachedNews) {
    return res.json(cachedNews);
  }

  try {
    const response = await axios.get(`${NEWS_API_URL}&apiKey=${API_KEY}`);
    const newsData = response.data.articles.slice(0, 5);
    cache.set("news", newsData);
    res.json(newsData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
