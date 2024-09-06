var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
const INDEX_ROUTES = require("./routes/index");
const ERROR_HANDLER = require("./middleware/errorHandling.middleware");
const NOT_FOUND_HANDLER = require("./middleware/notFoundHandling.middleware");
const corsMiddleware = require("./middleware/cors.middleware");

app.use(corsMiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(INDEX_ROUTES);
app.use(NOT_FOUND_HANDLER);
app.use(ERROR_HANDLER);

module.exports = app;
