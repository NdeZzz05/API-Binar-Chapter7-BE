var express = require("express");
var router = express.Router();
const V1_ROUTER = require("./api");

router.use("/api", V1_ROUTER);

module.exports = router;
