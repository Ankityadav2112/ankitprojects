const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')

//....Users APIs..
router.post('/register',userController.registerUser)

router.post('/login',userController.loginUser)

//....Books APIs....

router.post('/books',bookController.createBook)

router.get('/books',bookController.getAllBook)

router.get('/books/:bookId',bookController.getBookById)

router.put('/books/:bookId',bookController.updateBookById)

router.delete('/books/:bookId',bookController.deleteBookById)

//.....Review APIs........

router.post('/books/:bookId/review',reviewController.createReview)

router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)

module.exports = router