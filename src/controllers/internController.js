const internModel = require('../models/internModel');
const collegeModel = require('../models/collegeModel');
const { isValid, isValidEmail, isValidMobile, isValidatorName } = require('../middleware/validator');



//<----------------------------------create Intern--------------------------------> //

const createIntern = async (req, res) => {
    try {
        let data = req.body;
        let { name, mobile, email, collegeName } = data;

        if (Object.keys(data).length == 0)
            return res
                .status(400)
                .send({ status: false, msg: "Date is require for creation Intern Details" });

        if (!name)
            return res
                .status(400)
                .send({ status: false, msg: "Name" });

        if (!isValid(name.trim()) || !isValidatorName(name.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "Error : Name should be Alphabates Only." })
        }
        
        if (!email)
            return res
                .status(400)
                .send({ status: false, msg: "Enter your emailId" })

        if (!isValidEmail(email))
            return res
                .status(400)
                .send({ status: false, msg: "please enter valid emailId" });

        if (!mobile)
            return res
                .status(400)
                .send({ status: false, msg: "Enter your mobile number" });

        if (!isValidMobile(mobile))
            return res
                .status(400)
                .send({ status: false, msg: "please enter valid mobile Number" });


        let checkEmail = await internModel.findOne({ email: email, isDeleted: false })
        if (checkEmail)
            return res
                .status(400)
                .send({ message: "Email Already Registered" })

        let checkMobile = await internModel.findOne({ mobile: mobile, isDeleted: false })
        if (checkMobile)
            return res
                .status(400)
                .send({ message: "Mobile Already Registered" })

        let checkClgName = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!checkClgName)
            return res
                .status(404)
                .send({ status: false, message: "No such college Name Not Found!" });

        let clgId = checkClgName._id
        req.body.collegeId = clgId

        let internData = await internModel.create(data)
        res.status(201).send({ status: true, data: internData })

    } catch (err) {
        res.status(500).send({ status: false, msg: `this is catch err ${err.message}` })
    }
}


module.exports.createintern = createIntern;