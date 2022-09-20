//*****Validation******* */

const isValid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}

const emailValidation = function (email) {
    let regexForEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    return regexForEmail.test(email)
}

const mobileValidation = function (phone) {
    let regexForMobile = /^[6-9]\d{9}$/
    return regexForMobile.test(phone)
}

const isValidPassword = function (password) {
     let regexforpassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/
     return regexforpassword.test(password)
}
const isValidEnum = function(value){
    if(["Mr", "Mrs", "Miss"].find(element => element ===value))return true;
    return false;
}
module.exports = { isValid,isValidRequestBody , emailValidation , mobileValidation , isValidPassword , isValidEnum}