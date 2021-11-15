const router = require("express").Router();
const PublicationModel = require("../models/PublicationSchema");
const BookModel = require("../models/BookSchema");

/* 
Route           /publications/
Description     To get all the publications
Access          PUBLIC
Parameter       None
Methods         GET
*/
router.get("/", async (req, res) => {
  try {
    const Publication = await PublicationModel.find();
    if (Publication) {
      res.json({
        publications: Publication,
      });
    } else {
      res.status(400).json({
        message: "No Publications Found",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//-------------------------------------------------------------------------------------
/* 
  Route           /publications/new
  Description     To add a new Publications
  Access          PUBLIC
  Parameter       none
  Methods         GET
  */
router.post("/new/", async (req, res) => {
  try {
    const { newPublication } = req.body;

    const Publication = await PublicationModel.create(newPublication);

    res.status(200).json({
      msg: "Publication Added Successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});
//--------------------------------------------------------------------------------
/* 
  Route           /publications/
  Description     To get publications author based on id
  Access          PUBLIC
  Parameter       pub_id
  Methods         GET
  */
router.get("/:pub_id", async (req, res) => {
  try {
    const { pub_id } = req.params;

    const specificPublication = await PublicationModel.findOne({
      id: parseInt(request.params.pub_id),
    });

    if (specificPublication) {
      res.status(200).json({
        publication: specificPublication,
      });
    } else {
      res.status(200).json({
        msg: `Publication with id ${pub_id} is not found`,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});
//-------------------------------------------------------------------------------
/* 
  Route           /publications/book/
  Description     To get all the Publications based on book isbn
  Access          PUBLIC
  Parameter       isbn
  Methods         GET
  */
router.get("/book/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;

    Publication = await PublicationModel.find({
      books: isbn,
    });

    if (Publication) {
      res.status(200).json({
        founded_data: Publication.length,
        publication: Publication,
      });
    } else {
      res.status(200).json({
        founded_data: Publication.length,
        msg: `No Publication Found for the Book with ISBN ${isbn}`,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});
//------------------------------------------------------------------------

// Route    - /publications/updateBook/:id
// Des      - to update/add new book
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - { "book": ISBN }

router.put("/updateBook/:pub_id", async (req, resp) => {
  try {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { id: parseInt(req.params.pub_id) },
      { $addToSet: { books: req.body.book } },
      { new: true }
    );

    const updatedBook = await BookModel.findOneAndUpdate(
      { ISBN: req.body.book },
      { publication: parseInt(req.params.id) },
      { new: true }
    );
    if (updatedPublication && updatedBook) {
      return res.json({ publication: updatedPublication, book: updatedBook });
    } else {
      return res.status(400).json({
        message: "Book not found",
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Route    - /publications/delete/:pub_id
// Des      - delete a publication
// Access   - Public
// Method   - DELETE
// Params   - publicationID
// Body     - none

router.delete("/delete/:pub_id", async (req, res) => {
  try {
    const updatedPublication = await PublicationModel.findOneAndDelete({
      id: parseInt(request.params.pub_id),
    });
    if (updatedPublication) {
      res.status(200).json({
        msg: "Publication Deleted Successfully",
      });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});
// Route    - /publications/deleteBook/:pub_id/:isbn
// Des      - delete a book from publication
// Access   - Public
// Method   - DELETE
// Params   - publicationID, bookID
// Body     - none

router.delete("/deleteBook/:pub_id/:book_id", async (req, res) => {
  try {
    const pub_id = parseInt(request.params.pub_id);
    const isbn = request.params.book_id;

    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { id: pub_id },
      { $pull: { books: isbn } },
      { new: true }
    );

    const updatedBook = await BookModel.findOneAndUpdate(
      { ISBN: isbn },
      { publication: -1 },
      { new: true }
    );

    if (updatedPublication && updatedBook) {
      res
        .status(200)
        .json({ publication: updatedPublication, book: updatedBook });
    } else {
      res.status(400).json({
        message: "Deletion Failed",
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
