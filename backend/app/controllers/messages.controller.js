const db = require("../models");
require("dotenv").config();
const User = db.users;
const Message = db.messages;
const Chatroom = db.chatrooms;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const API_KEY = process.env.API_KEY;
exports.send = async (req, res) => {
  let chatroom;
  try {
    const user = await User.findOne({ where: { UserID: req.body.UserID } });
    chatroom = await Chatroom.findOne({
      where: { UserID: user.UserID },
    });
    if (!req.body.message || !user || !chatroom) {
      return res
        .status(400)
        .send({ message: "Required field can not be empty" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error retrieving Chatroom ID and UserID" });
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
    const contentFromOpenAI =
      data.choices?.[0]?.message?.content || "Fallback content";

    const newMessage = await Message.create({
      Content: contentFromOpenAI,
      Timestamp: new Date(),
      UserID: req.body.UserID,
      ChatroomID: chatroom.ChatroomID,
    });
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.loadPrevMessages = async (req, res) => {
  if (!req.body.ChatroomID) {
    return res.status(400).send({ message: "No Chatroom found" });
  }
  try {
    const chatroom = await Chatroom.findByPk(req.body.ChatroomID, {
      include: {
        model: Message,
        attributes: ["Content", "Timestamp"],
      },
    });

    if (!chatroom) {
      return res.status(404).send({ message: "Chatroom not found" });
    }

    res.send(chatroom);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error getting messages" });
  }
};
