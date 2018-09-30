const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const acneTypRoutes = require("./api/routes/acneTyps");
const treatmntsRoutes = require("./api/routes/treatmnts");
const WhiteheadRoutes = require("./api/routes/Whiteheads");
const CysticAcnRoutes = require("./api/routes/Cyst");
const PustuleRoutes = require("./api/routes/Pustule");

mongoose.connect(
  "mongodb://dvillam:Dvillam1@mydatabase-shard-00-00-qfbc5.mongodb.net:27017,mydatabase-shard-00-01-qfbc5.mongodb.net:27017,mydatabase-shard-00-02-qfbc5.mongodb.net:27017/test?ssl=true&replicaSet=MyDatabase-shard-0&authSource=admin&retryWrites=true",
  {
    useMongoClient: true
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests

app.use("/acneTyps", acneTypRoutes);
app.use("/treatmnts", treatmntsRoutes);
app.use("/Whiteheads", WhiteheadRoutes);
app.use("/Cyst", CysticAcnRoutes);
app.use("/Pustule", PustuleRoutes);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
