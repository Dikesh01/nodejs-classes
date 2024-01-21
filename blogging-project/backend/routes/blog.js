const express = require("express");
const { createBlog } = require("../controllers/blog.controller");
const app = express();

app.post("/create-blog", createBlog);

module.exports = app;