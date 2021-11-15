const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "The Name of the Author Cannot be Blank"],
  },
  books: {
    type: Array,
    required: true,
  },
});

const AuthorModel = mongoose.model("Authors", authorSchema);

module.exports = AuthorModel;
