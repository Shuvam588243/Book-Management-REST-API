const router = require("express").Router();
const BookModel = require("../models/BookSchema");
const AuthorModel = require("../models/AuthorSchema");

/* 
Route           /books/
Description     To get all the books
Access          PUBLIC
Parameter       None
Body            None
Methods         GET
*/
router.get("/", async (req, res) => {
  try {
    const Books = await BookModel.find();
    res.status(200).json(Books);
  } catch (err) {
    res.status(200).json({ err: err.message });
  }
});

/* 
Route           /books/new
Description     To add a new book
Access          PUBLIC
Parameter       none
Methods         POST
Body            newBook(ISBN,title,pub_date,language,page_num,author,category,publicat)
*/
router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;
    if (
      newBook.ISBN &&
      newBook.title &&
      newBook.pub_date &&
      newBook.language &&
      newBook.page_num &&
      newBook.author &&
      newBook.category &&
      newBook.publication
    ) {
      const checkISBN = await BookModel.findOne({ ISBN: newBook.ISBN });
      if (checkISBN) {
        res
          .status(200)
          .json({ message: `Book with ${newBook.ISBN} already exists` });
      } else {
        const Book = BookModel.create(newBook);
        res.status(200).json({
          msg: "Books Added Successfully",
        });
      }
    } else {
      res.status(200).json({
        msg: "Please Provide All the Required Fields",
      });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

/* 
Route           /books/isbn/
Description     To get specific book based on isbn
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
router.get("/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const getBook = await BookModel.findOne({ ISBN: isbn });

    if (getBook) {
      res.status(200).json({
        book: getBook,
      });
    } else {
      res.status(400).json({
        error: `No Book is available for the ISBN ${isbn}`,
      });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

/* 
Route           /books/category/
Description     To get all the books of a particular category
Access          PUBLIC
Parameter       category
Methods         GET
*/
router.get("/category/:category", async (req, res) => {
  try {
    const getSpecificBook = await BookModel.find({
      category: req.params.category,
    });

    if (getSpecificBook.length != 0) {
      res.status(200).json({
        book: getSpecificBook,
      });
    } else {
      res.status(400).json({
        error: `No Book is available for the Category ${req.params.category}`,
      });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

/* 
Route           /books/language/
Description     To get all the books of a particular language
Access          PUBLIC
Parameter       lang
Methods         GET
*/
router.get("/language/:lang", async (req, res) => {
  try {
    const getSpecificBook = await BookModel.find({
      language: req.params.lang,
    });

    if (getSpecificBook.length != 0) {
      res.status(200).json({
        book: getSpecificBook,
      });
    } else {
      res.status(400).json({
        error: `No Book is available on language ${req.params.lang}`,
      });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Route    - /book/aut/:author
// Des      - to get a list of books based on author
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none

router.get("/aut/:author_id", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    author: parseInt(req.params.author_id),
  });
  if (getSpecificBook) {
    res.status(200).json({
      book: getSpecificBook,
    });
  } else {
    return res.json({
      error: `No book found for the author of ${parseInt(
        req.params.author_id
      )}`,
    });
  }
});

/* 
Route           /books/update/:isbn/author
Description     To add new author in the book
Access          PUBLIC
Parameter       None
Methods         GET
Body            id
*/
router.put("/update/:isbn/author/", async (req, res) => {
  try {
    const { isbn } = req.params;
    const { newAuthor } = req.body;

    const CheckForAuthor = await BookModel.findOne({ author: newAuthor });

    if (!CheckForAuthor) {
      const updateBook = await BookModel.findOneAndUpdate(
        {
          ISBN: isbn,
        },
        {
          $addToSet: {
            author: newAuthor,
          },
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        msg: "Author Updated Successfully",
        book: updateBook,
      });
    } else {
      res.status(200).json({
        msg: `Author with id ${newAuthor} Already Exists in Book with ISBN ${isbn}`,
      });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Route    - /books/update/:isbn
// Des      - update book title
// Access   - Public
// Method   - PUT
// Params   - isbn
// Body     - { title: newTtile }

router.put("/update/:isbn", async (req, res) => {
  try {
    const checkBookIsbnExist = await BookModel.findOne({ ISBN: req.body.isbn });

    if (!checkBookIsbnExist && req.body.title) {
      const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn },
        { title: req.body.title },
        { new: true }
      );
      if (updatedBook) {
        return res.status(200).json(updatedBook);
      } else {
        return res.status(400).json({
          error: `Updation Failed`,
        });
      }
    } else {
      return res.status(400).json({
        error: `No book found for the ISBN ${req.params.isbn}`,
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
// Route    - /books/deleteBook/:isbn
// Des      - to delete a book
// Access   - Public
// Method   - DELETE
// Params   - isbn
// Body     - none

router.delete("/deleteBook/:isbn", async (req, res) => {
  try {
    const deleteBook = await BookModel.findOneAndDelete({
      ISBN: req.params.isbn,
    });
    if (deleteBook) {
      return res.status(200).json({
        message: `Book with isbn ${req.params.isbn} deleted successfully`,
      });
    } else {
      return res.status(400).json({
        error: `No book found for the ISBN ${req.params.isbn}`,
      });
    }
  } catch (error) {
    return res.staus(400).json({
      error: error.message,
    });
  }
});
// Route    - /books/deleteAuthor/:BookID/:authorID
// Des      - delete an author from the book
// Access   - Public
// Method   - DELETE
// Params   - bookID, authorID
// Body     - none

router.delete("/deleteAuthor/:isbn/:author_id", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const author_id = parseInt(req.params.author_id);

    const updatedBook = await BookModel.findOneAndUpdate(
      { ISBN: isbn },
      { $pull: { author: author_id } },
      { new: true }
    );
    console.log(updatedBook);
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      { id: author_id },
      { $pull: { books: isbn } },
      { new: true }
    );
    console.log(updatedAuthor);
    if (updatedBook && updatedAuthor) {
      return res.status(200).json({ book: updatedBook, author: updatedAuthor });
    } else {
      return res.status(400).json({ error: "No book found" });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
