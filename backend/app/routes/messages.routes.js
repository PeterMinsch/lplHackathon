const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messages.controller");

router.post("/send", messagesController.send);
router.get("/loadPrevMessages", messagesController.loadPrevMessages);

module.exports = router;
