const express = require("express");
const expressSession = require("express-session");
const app = express();
const PORT = 4000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: "ewfewf",
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

require("./controllers")(app);

app.listen(PORT, () => {
  console.log("running at :" + PORT);
});
