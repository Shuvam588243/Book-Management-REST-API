require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const booker = express();
const port = process.env.PORT || 3000;
const database = require("./dataset");
booker.use(express.json());
booker.use(express.urlencoded({ extended: true }));

const BookRouter = require("./API/bookAPI");
const AuthorRouter = require("./API/authorAPI");
const PublicationRouter = require("./API/publicationAPI");

booker.use("/books", BookRouter);
booker.use("/authors", AuthorRouter);
booker.use("/publications", PublicationRouter);

//Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connected");
  });

booker.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
