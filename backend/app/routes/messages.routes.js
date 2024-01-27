const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messages.controller");

router.post("/send", messagesController.send);

module.exports = router;
