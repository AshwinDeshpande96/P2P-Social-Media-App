const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
dotenv.config()
const postsRoutes = require("./routes/posts")
// const dotenv = require('dotenv').load();
const mongoose = require("mongoose")
const app = express();

mongoose.connect("mongodb+srv://app_user:1ZQDj8U9g8OwIG0H@cluster0.ogh00xe.mongodb.net/node-angular?retryWrites=true")
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.log(error)
    console.log('Connection failed!')
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS")
  next();
});
app.use("/api/posts", postsRoutes);


module.exports = app;
