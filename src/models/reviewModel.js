const mongoose = require('mongoose')

const reviewsSchema = mongoose.Schema({

    bookId: { type: mongoose.Types.ObjectId, required: true, ref: "Books" },

    reviewedBy: { type: String, required: true, default: 'Guest' },

    reviewedAt: { type: Date, required: true }, //format ("YYYY-MM-DD")

    rating: { type: Number, required: true },

    review: { type:String },

    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Reviews',reviewsSchema)