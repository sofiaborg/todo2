/////////require//////////
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");
const taskRoute = require("./routes/tasks.js");

require("dotenv").config();

/////////engine//////////
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

/////////set and use//////////
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

///get and use the routes///
app.use("/", taskRoute);

/////port///////
app.listen(8000, () => {
  console.log("listening");
});
