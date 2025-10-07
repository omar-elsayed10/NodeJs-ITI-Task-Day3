const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const usersRouter = require("./routers/usersRouter");
const postsRouter = require("./routers/postsRouter");
const app = express();

// middleware to parse json body
app.use(express.json());
app.use(cors());

// routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("✅✅ Connected to MongoDB"))
    .catch((err) => console.error("❌❌ Error connecting to MongoDB", err));
});
