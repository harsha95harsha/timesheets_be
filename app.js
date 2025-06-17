require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userProjectRoutes = require("./routes/userProjectRoutes");
const userTaskRoutes = require("./routes/userTaskRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const statusApiRoutes = require("./routes/statusApiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const bodyParser = require("body-parser");
const { verifyjwt } = require("./middlewares/verifyJWT");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT,PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/", authRoutes);
app.use("/", verifyjwt, userRoutes);
app.use("/", verifyjwt, projectRoutes);
app.use("/", verifyjwt, userProjectRoutes);
app.use("/", verifyjwt, profileRoutes);
app.use("/", verifyjwt, userTaskRoutes);
app.use("/", verifyjwt, statusApiRoutes);
app.use("/", verifyjwt, analyticsRoutes);
app.use("/", verifyjwt, dashboardRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log("Server listening on port " + port));
