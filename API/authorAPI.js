const router = require("express").Router();
const BookModel = require("../models/BookSchema");
const AuthorModel = require("../models/AuthorSchema");
/* 
Route           /authors
Description     To get all the Authors
Access          PUBLIC
Parameter       None
Methods         GET
*/
router.get("/", async (req, res) => {
  try {
    const Author = await AuthorModel.find();
    if (Author) {
      res.status(200).json({
        author: Author,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/* 
  Route           /authors/new
  Description     To add a new author
  Access          PUBLIC
  Parameter       isbn
  Methods         GET
  */
router.post("/new", async (req, res) => {
  try {
    const { newAuthor } = req.body;
    const checkIfAuthorExists = await AuthorModel.findOne({ id: newAuthor.id });
    if (!checkIfAuthorExists) {
      const Author = AuthorModel.create(newAuthor);
      res.status(200).json({
        msg: "Author Added Successfully",
      });
    } else {
      res.status(400).json({
        msg: `Author with id ${newAuthor.id} Already Exists`,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* 
  Route           /authors/:author_id
  Description     To get specific author based on id
  Access          PUBLIC
  Parameter       id
  Methods         GET
  */
router.get("/:author_id", async (req, res) => {
  try {
    const { author_id } = req.params;
    const getSpecificAuthor = await AuthorModel.find({ id: author_id });

    if (getSpecificAuthor) {
      res.status(200).json({
        author: getSpecificAuthor,
      });
    } else {
      res.status(400).json({
        error: `Author with id ${req.params.author_id} doesn't exist`,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//-------------------------------------------------------------------------------
/* 
  Route           /authors/book/
  Description     To get all the Authors based on book isbn
  Access          PUBLIC
  Parameter       isbn
  Methods         GET
  */
router.get("/book/:isbn", async (req, res) => {
  try {
    const getAuthorByBook = await AuthorModel.findOne({
      books: req.params.isbn,
    });

    if (getAuthorByBook) {
      res.status(200).json({
        author: getAuthorByBook,
      });
    } else {
      res.status(400).json({
        error: `Author for book with ISBN ${req.params.isbn} doesn't exist`,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Route    - /authors/update/:id
// Des      - update author details
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - { "author_name": "new author_name" }

router.put("/update/:author_id", async (req, resp) => {
  try {
    const updatedAuthorName = await AuthorModel.findOneAndUpdate(
      { id: parseInt(req.params.author_id) },
      { name: req.body.author_name },
      { new: true }
    );
    if (updatedAuthorName) {
      return res.status(200).json(updatedAuthorName);
    } else {
      resp.status(400).json({
        error: `Author with id ${req.params.author_id} doesn't exist`,
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
// Route    - /authors/delete/:author_id
// Des      - delete an author
// Access   - Public
// Method   - DELETE
// Params   - author_id
// Body     - none

router.delete("/delete/:author_id", async (req, res) => {
  try {
    const deleteAuthor = await AuthorModel.findOneAndDelete({
      id: parseInt(req.params.author_id),
    });
    if (deleteAuthor) {
      res.status(200).json({
        msg: "Author Deleted Successfully",
      });
    } else {
      res.status(400).json({
        error: `Author with id ${req.params.author_id} doesn't exist`,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
