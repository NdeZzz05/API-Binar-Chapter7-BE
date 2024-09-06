const express = require("express");
const router = express.Router();
const AUTH_ROUTER = require("./auth/index");

router.use("/auth", AUTH_ROUTER);

module.exports = router;
