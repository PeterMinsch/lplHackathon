const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);
router.post("/create-user", authController.createUser);
// this function is to delete the token in client-side cookie
router.delete("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logged out" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
