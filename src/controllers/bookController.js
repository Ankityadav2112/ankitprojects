const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const valid = require('../validation/validation')
const moment = require('moment')

const createBook = async function (req, res) {
  try {

    let data = req.body

    if (!valid.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Please Provide some Book details" })

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt, reviews } = data

    //-----------------------------Authorization for create Book----------------------------------------

    if (!userId) return res.status(400).send({ status: false, message: " UserId is Mandatory" })

    if (!valid.isValidObjectId(userId))
      return res.status(400).send({ status: false, message: " UserId is inValid" })

    if (req['x-api-key'].userId != userId)
      return res.status(403).send({ status: false, message: " Authorisation failed" })
    //--------------------------------------------------------------------------------------------------

    // let finduser = await userModel.findById(userId)
    // if (!finduser) return res.status(404).send({ status: false, message: "User is not exist" })

    if (!valid.isValid(title)) return res.status(400).send({ status: false, message: "Title is Mandatory" })

    let uniquetitle = await bookModel.findOne({ title: title })
    if (uniquetitle) return res.status(400).send({ status: false, message: "Tittle must be unique" })


    if (!valid.isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt is Mandatory" })

    if (!valid.isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Number is Mandatory" })

    let ISBNunique = await bookModel.findOne({ ISBN: ISBN })
    if (ISBNunique) return res.status(400).send({ status: false, message: "ISBN number must be unique" })
    //^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$
    //^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$
    // (?=(?:[0-9]+[-●]){3})[-●0-9X]{13}$

    if (!valid.isValid(category)) return res.status(400).send({ status: false, message: "Category is Mandatory" })

    if (!valid.isValid(subcategory)) return res.status(400).send({ status: false, message: "Subcategory is Mandatory" })

    if (!valid.TIME(releasedAt)) return res.status(400).send({ status: false, message: "releasedAt time must be present in Format YYYY-MM-DD" })
    // if (!moment(releasedAt, 'YYYY-MM-DD', true).isValid()) return res.status(400).send({ status: false, message: "releasedAt Date must be present in Format YYYY-MM-DD" })


    if (reviews) {  //reviews should be 0 ...???
      if (!valid.isvalidNumber(reviews)) return res.status(400).send({ status: false, message: "Input type only in number" })
    }
    const saveData = await bookModel.create(data)

    return res.status(201).send({ status: true, message: "Book created succesfully", data: saveData })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
  }

}
const getAllBook = async function (req, res) {
  try {

    let { userId, category, subcategory } = req.query;

    let data = {}

    if (userId) {
      if (!valid.isValidObjectId(userId)) return res.status(400).send({ status: false, message: " please enter valid userId " });
      data.userId = userId
      // let book = await bookModel.find({ userId: userId, isDeleted: false }).select({ _id: 1 , title: 1, excerpt: 1, userId: 1, category: 1 , reviews:1 , releasedAt: 1})
      // return res.status(200).send({ status: true, message: 'Book list', data: book });
    }
    // if (category) {

    //   let book = await bookModel.find({ category: data.category, isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, releasedAt: 1, reviews: 1, _id: 1 })
    //   if (book.length == 0) {
    //     return res.status(404).send({ status: false, message: "No Book found for such category" })
    //   }
    //   return res.status(200).send({ status: true, message: 'Book list', data: book });

    // }
    // if (subcategory) {
    //   let book = await bookModel.find({ subcategory: subcategory, isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, releasedAt: 1, reviews: 1, _id: 1 })
    //   if (book.length == 0) {
    //     return res.status(404).send({ status: false, message: "No Book found for such subcategory" })
    //   }
    //   return res.status(200).send({ status: true, message: 'Book list', data: book });
    // }
    if (valid.isValid(category)) data.category = category

    if (valid.isValid(subcategory)) data.subcategory = subcategory

    data.isDeleted = false

    let bookDetail = await bookModel.find(data).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })

    if (bookDetail.length == 0) return res.status(404).send({ status: false, message: "No data found" });

    bookDetail.sort((a, b) => a.title.localeCompare(b.title))   // title alphabetic sorting............

    return res.status(200).send({ status: true, message: 'Book list', data: bookDetail })
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}


const getBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId

    if (!valid.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter a valid bookId" })

    let bookDetails = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()

    if (!bookDetails) return res.status(404).send({ status: false, message: "Book Data not Found" })

    let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })

    delete bookDetails.ISBN;
    delete bookDetails.__v;

    bookDetails.reviewsData = reviewsData

    return res.status(200).send({ status: true, message: "BOOK LIST", data: bookDetails })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
  }
}

const updateBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId
    if (!(bookId)) res.status(400).send({ status: false, message: "BookId is Mandatory" })

    if (!valid.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter a valid Object ID" })

    let chekdBooks = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!chekdBooks) return res.status(404).send({ status: false, message: "Book DATA NOT FOUND" })

    let data = req.body
    if (!valid.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Please give some input data for update " })

    let { title, excerpt, releasedAt, ISBN } = data

    if (title) {
      if (!valid.isValid(title)) return res.status(400).send({ status: false, message: "Please enter valid title name" })

      let uniqueTitle = await bookModel.findOne({ title: title })

      if (uniqueTitle) return res.status(400).send({ status: false, message: "title name is Already exist" })
    }

    if (excerpt) {
      if (!valid.isValid(excerpt)) return res.status(400).send({ status: false, message: "Please enter valid excerpt name" })
    }

    if (releasedAt) {
      if (!valid.TIME(releasedAt)) return res.status(400).send({ status: false, message: "Please give input date in YYYY-MM-DD Format" })
    }

    if (ISBN) {
      if (!valid.isValid(ISBN)) return res.status(400).send({ status: false, message: "Please enter ISBN in NUmber to Update" })

      let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })

      if (uniqueISBN) return res.status(400).send({ status: false, message: "ISBN is Already exist" })
    }

    let updatedBook = await bookModel.findByIdAndUpdate(
      { _id: bookId },
      { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } },
      { new: true }
    )
    return res.status(200).send({ status: true, message: "Success", data:updatedBook })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
  }

}

const deleteBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId

    if (!valid.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: " Please enter a valid Book Id" })

    let deletedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, {$set:{ isDeleted: true, deletedAt: new Date()}})

    if (!deletedBook) return res.status(404).send({ status: false, message: "Book Not Found" })

    return res.status(200).send({ status: true, message: "The book has been Deleted" })

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}
module.exports = { createBook, getAllBook, getBookById, updateBookById, deleteBookById }



