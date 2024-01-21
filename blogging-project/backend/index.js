const express = require("express");
require("dotenv").config();

// file imports
const db = require("./config/db");
const userRoutes = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(express.json());

// routes
app.use("/user", userRoutes);
app.use("/blog", blogRoute)

app.listen(PORT, ()=>{
    console.log("Server is running at PORT:", PORT);
})