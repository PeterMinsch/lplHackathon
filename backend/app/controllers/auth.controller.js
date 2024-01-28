const db = require("../models");

const User = db.users;
const Chatroom = db.chatrooms;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { Email: req.body.Email } }); //grabbing the user's email from the user database
    if (!user) return res.status(400).send({ Message: "User not found" }); //if the user does not exist then we return an error message
    if (!req.body.AuthenticationData || !user.AuthenticationData) {
      //if password is missing from the database or from the frontend
      return res.status(400).send({ Message: "Password data missing" });
    }

    const validPassword = await bcrypt.compare(
      req.body.AuthenticationData,
      user.AuthenticationData
    );

    if (!validPassword)
      return res.status(400).send({ Message: "Invalid password" });

    const token = jwt.sign(
      { ID: user.UserID, Role: user.Role, EMAIL: user.Email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, //type of cookie
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, //expiration time
      secure: false, //people browsing the site can see the cookie
      path: "/", //store at the root where the browser holds cookies
    });
    if (user.Role == "Tutor") {
      const tutor = await Tutor.findOne({ where: { UserID: user.UserID } });
      if (!tutor) return res.status(400).send({ Message: "Tutor not found" });
      res.status(200).send({
        message: "Logged in successfull",
        Tutor: tutor,
        User: {
          ID: user.UserID,
          Email: user.Email,
          FirstName: user.FirstName,
          LastName: user.LastName,
        },
      });
    } else {
      res.status(200).send({
        message: "Logged in successfully!",
        User: {
          ID: user.UserID,
          Email: user.Email,
          FirstName: user.FirstName,
          LastName: user.LastName,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  // to do
  if (
    !req.body.Username ||
    !req.body.AuthenticationData ||
    !req.body.FirstName ||
    !req.body.LastName ||
    !req.body.Email
  ) {
    return res.status(400).send({ message: "Required field can not be empty" });
  }

  const hashedPassword = await bcrypt.hash(req.body.AuthenticationData, 10);

  try {
    const user = await User.create({
      Username: req.body.Username,
      AuthenticationData: hashedPassword,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
    });
    console.log("User object:", user);

    const chatroom = await Chatroom.create({
      Name: "Title",
      UserID: user.UserID,
    });
    const userResponse = user.toJSON();
    delete userResponse.AuthenticationData;
    res
      .status(201)
      .send({ message: "User registered successfully!", user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
