const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
        unique : true,
    },
    fullName : {
        type : String,
        require : true,
    },
    logoLink : {
        type : url,
        required : true,
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},{timestamp : true});

module.exports = mongoose.modal('collegeList', collegeSchema);