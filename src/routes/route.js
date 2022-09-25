const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const mid = require('../middleware/auth')

//....Users APIs..
router.post('/register',userController.registerUser)

router.post('/login',userController.loginUser)

//....Books APIs....

router.post('/books' , mid.authentication , bookController.createBook)

router.get('/books', mid.authentication , bookController.getAllBook)

router.get('/books/:bookId' , mid.authentication , bookController.getBookById)

router.put('/books/:bookId' , mid.authentication ,mid.Authorisation , bookController.updateBookById)

router.delete('/books/:bookId' , mid.authentication ,mid.Authorisation , bookController.deleteBookById)

//.....Review APIs........

router.post('/books/:bookId/review',reviewController.createReview)

router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)

module.exports = router