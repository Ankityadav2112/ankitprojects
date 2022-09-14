
const collegeModel = require("../models/collegeModel");
const internModel = require('../models/internModel');


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
};

const isValidRequest = function (object) {
    return Object.keys(object).length > 0
}

// const isValidEmail = function (value) {
//     const regexForEmail = /^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/
//     return regexForEmail.test(value)
// }

// const isValidPassword = function (value) {
//     const regexForPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{6,20}$/
//     return regexForPassword.test(value)
// }
const regixValidator = function (value) {
    const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    return regex.test(value)
}

const createCollege = async function (req, res) {

    try {
        let data = req.body

        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "author data is required" });
        }
        //using desturcturing
        const { name, fullName, logoLink} = data;

        //data should not have more than 5keys as per outhorSchema (edge case)
        if (Object.keys(data).length > 4) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }
       
        if (!isValid( name.trim()) || !regixValidator( name.trim())) {
            return res
                .status(400)
                .send({ status: false, message: " name is required or its should contain character" })
        }
        const isNameUnique = await collegeModel.findOne({ name: name })
        if (isNameUnique) {
            return res
                .status(400)
                .send({ status: false, message: "Name already exits" });
        }

        if (!isValid( fullName.trim()) ||  !regixValidator( fullName.trim()) ) {
            return res
                .status(400)
                .send({ status: false, message: "fullname is invalid" })
        }

        if(!logoLink){

            return res.status(400).send({status:false, message:"Please give logo link"})
        }
    
        const newCollege = await collegeModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: newCollege.name +" college created successfully", data: newCollege });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}


const collegeDetails = async (req, res) => {
    try {
        let data = req.query.name;
        if (Object.keys(data) < 1) return res.status(400).send({ status: false, msg: "Please enter the college name" });

        let getClg = await collegeModel.findOne({ name: data, isDeleted: false })
        // console.log(getClg)
        if (!getClg) return res.status(400).send({ status: false, msg: "No such college found" });

        let clgId = getClg.id;
        let getInternData = await internModel.find({ collegeId: clgId, isDeleted: false, }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
        // console.log(getInternData)
        if (!getInternData) return res.status(400).send({ status: false, msg: "No intern Apply for This College" })

        let details = {
            name: getClg.name,
            fullName: getClg.fullName,
            logoLink: getClg.logoLink,
            interns: getInternData
        }
        res.status(200).send({ status: true, data: details });
    } catch (err) {
        res.status(400).send({ status: false, msg: err })
    }
}

module.exports.createCollege = createCollege;
module.exports.collegeDetails = collegeDetails