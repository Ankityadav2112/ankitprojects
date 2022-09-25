const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const valid = require('../validation/validation')

const createReview = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!valid.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter a valid Book Object id" })

        const checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!checkBook) return res.status(400).send({ status: false, message: "Book is deleted by user in past" })

        const data = req.body

        const { reviewedBy, rating, review } = data

        if (!valid.isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please enter reviewed person name" })

        if (!(/^[1-5]$/).test(rating)) return res.status(400).send({ status: false, message: "Please enter rating between 1 to 5 Number" })

        if(review){
            if (!valid.isValid(review)) return res.status(400).send({ status: false, message: "Please give a rating" })
        }
        data.bookId = bookId
        data.reviewedAt = new Date();

        const reviewsData = await reviewModel.create(data)
        const totalReview = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()
       
        const bookDetails = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set:{reviews: totalReview }}, { new: true }).lean()

        bookDetails.reviewsData = reviewsData

        return res.status(201).send({ status: true, message: 'Success', data: bookDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}
const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!valid.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter a valid Object Id" })

        let checkBook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()

        if (!checkBook) return res.status(400).send({ status: false, message: "No such type of book Present" })

        const reviewId = req.params.reviewId

        if (!valid.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Please enter valid review Object Id" })

        // let checkreviewId = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })

        // if (!checkreviewId) return res.status(400).send({ status: false, message: "No such type of review Present" })

        const { reviewedBy, rating, review } = req.body

        if (!valid.isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Please enter reviewed name to Update" })

        if (!(/^[1-5]$/).test(rating)) return res.status(400).send({ status: false, message: "Please enter rating between 1 to 5 Number" })

        if (review) {
            if (!valid.isValid(review)) return res.status(400).send({ status: false, message: "invalid review to update" })
        }
        const filter = { bookId: bookId, _id: reviewId, isDeleted: false }
        const data = { reviewedBy, rating, review }

        const updatedReview = await reviewModel.findOneAndUpdate(filter, {$set:data }, { new: true }).lean()

        if (!updatedReview) return res.status(400).send({ status: false, message: "No such type of review Present" })

        checkBook.reviewsData = updatedReview

        return res.status(200).send({ status: true, message: "review updated", data: checkBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}
const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!valid.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please use a valid object Id" })

        let checkbook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()

        if (!checkbook) return res.status(400).send({ status: false, message: "Book not present" })

        const reviewId = req.params.reviewId

        if (!valid.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Please enter va valid review id" })

        // let checkreview = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false }).lean()

        // if (!checkreview) return res.status(400).send({ status: false, message: "Review not present " })

        let alldelete =  await reviewModel.findOneAndUpdate({ _id: reviewId, bookId:bookId, isDeleted:false}, {$set:{isDeleted: true, deletedAt: new Date() }}, { new: true })
    
        if (!alldelete) return res.status(404).send({ status: false, message: "Review not present " })

        const totalReview = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()

        // totalReview.alldelete = alldelete
        
        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set:{reviews: totalReview }})
        
        return res.status(200).send({ status: true, message: "This Review has been Deleted" })
      
    }
    catch (err) {
        return res.status(500), send({ status: false, error: err.message })
    }
}
module.exports = { createReview, updateReview, deleteReview }
