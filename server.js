const express = require("express");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");

const authRoutes = require("./app/routes/auth.routes");
const adminRoutes = require("./app/routes/admin.routes");

const app = express();

// Middleware
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET_kEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.set("trust proxy", true);

app.use(
  cors({
    origin: "https://simplify", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./db/models");
db.sequelize.sync({ force: false });
// if (process.env.NODE_ENV === "development") {
//   db.sequelize.sync({ force: false, alter: true });
// } else {
//   db.sequelize.sync({ force: false });
// }

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
