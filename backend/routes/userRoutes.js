const express = require("express");
const router = express.Router();

const { loginUser, createUser } = require("./../controllers/userController");

router.route("/create").post(createUser);
router.route("/login").post(loginUser);

module.exports = router;
