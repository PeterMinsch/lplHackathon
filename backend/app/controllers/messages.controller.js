const db = require("../models");
require("dotenv").config();
const User = db.users;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const API_KEY = process.env.API_KEY;
exports.send = async (req, res) => {
  if (!req.body.message) {
    return res.status(400).send({ message: "Required field can not be empty" });
  }
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    console.log("data is ", data);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
