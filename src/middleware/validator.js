const mongoose = require('mongoose');


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;

};
const isValidEmail = function (email) {
    const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    return emailRegex.test(email);
};

let isValidMobile = function (number) {
    let mobileRegex = /^[5-9]{1}[0-9]{9}$/
    return mobileRegex.test(number);
}

const isValidatorName = function (value) {
    const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    return regex.test(value)
}
const isValidRequest = function (object) {
    return Object.keys(object).length > 0
};
const isValidUrl = (value) => {
    let urlRegex = /(http[s]*:\/\/)([a-z\-_0-9\/.]+)\.([a-z.]{2,3})\/([a-z0-9\-_\/._~:?#\[\]@!$&'()*+,;=%]*)([a-z0-9]+\.)(jpg|jpeg|png)/i;
    if (urlRegex.test(value)) return true;
};


module.exports =  {isValid,isValidEmail,isValidMobile,isValidatorName,isValidRequest,isValidUrl};