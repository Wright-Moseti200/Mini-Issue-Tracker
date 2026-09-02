let express = require("express");
require("dotenv").config();
let rateLimit = require("express-rate-limit");
let cors = require("cors")
let cookieParser = require("cookie-parser");
let { userRoute } = require("./routes/userRoutes");
let { connectDb } = require("./database/database");
let app = express();
let port = process.env.PORT || 5000
let limit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(limit);
app.use(express.json());
app.use("/api", userRoute);

app.get("/", (req, res) => {
    res.send("Express server is running");
});

connectDb().then(() => app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
}));