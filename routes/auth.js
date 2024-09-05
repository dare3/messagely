/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
// routes/auth.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const router = new express.Router();

/** POST /login - login: {username, password} => {token} */
router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    // Authenticate the user
    const isValidUser = await User.authenticate(username, password);
    if (isValidUser) {
      // Update last login timestamp
      await User.updateLoginTimestamp(username);

      // Generate a token
      const token = jwt.sign({ username }, SECRET_KEY);

      return res.json({ token });
    } else {
      return res.status(400).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: {username, password, first_name, last_name, phone} => {token} */
router.post("/register", async function (req, res, next) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;

    // Register the user
    const user = await User.register({
      username,
      password,
      first_name,
      last_name,
      phone,
    });

    // Update last login timestamp
    await User.updateLoginTimestamp(user.username);

    // Generate a token
    const token = jwt.sign({ username: user.username }, SECRET_KEY);

    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
