const collegeModel = require("../models/collegeModel");
const internModel = require('../models/internModel');
const { isValid,isValidatorName, isValidRequest, isValidUrl } = require('../middleware/validator')


//<-----------------------------create College --------------------->//

const createCollege = async function (req, res) {

    try {
        let data = req.body

        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "author data is required" });
        }
        //using desturcturing
        const { name, fullName, logoLink } = data;

        //data should not have more than 5keys as per outhorSchema (edge case)
        if (Object.keys(data).length > 4) {
            return res.
                status(400).
                send({ status: false, message: "Invalid data entry inside request body" })
        }

        if (!name)
            return res
                .status(400)
                .send({ status: false, msg: "Name is madatory" });

        if (!isValid(name.trim()) || !isValidatorName(name.trim())) {
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

        if (!fullName)
            return res
                .status(400)
                .send({ status: false, msg: "fullName is madatory" });

        if (!isValid(fullName.trim()) || !isValidatorName(fullName.trim())) {
            return res
                .status(400)
                .send({ status: false, message: "fullname is invalid" })
        }

        if (!logoLink) {

            return res
            .status(400)
            .send({ status: false, message: "Please give logo link" })
        }

        if (!isValidUrl(logoLink)) {
            return res
                .status(400)
                .send({ status: false, msg: "Put the correct logoLink " });
        }
        
        const newCollege = await collegeModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: newCollege.name + " college created successfully", data: newCollege });

    } catch (err) {
        res.status(500).send({status: false, msg: `this is catch err ${err.message}` })

    }
}

//<-----------------------------college Details---------------------------->//

const collegeDetails = async (req, res) => {
    try {
        let data = req.query;
        let name = req.query.name;
        if (Object.keys(data) == 0) 
        return res
        .status(400)
        .send({ status: false, msg: "Please enter the college name in query param" });

        let getClg = await collegeModel.findOne({ name: name, isDeleted: false })
        
        if (!getClg) 
        return res
        .status(400)
        .send({ status: false, msg: "No such college found" });

        let clgId = getClg.id;
        
        let getInternData = await internModel.find({ collegeId: clgId, isDeleted: false, }).select({ name: 1, email: 1, mobile: 1 })
        
        if (!getInternData) 
        return res
        .status(400)
        .send({ status: false, msg: "No intern Apply for This College" })

        let details = {
            name: getClg.name,
            fullName: getClg.fullName,
            logoLink: getClg.logoLink,
            interns: getInternData
        }
        res.status(200).send({ status: true, data: details });
    } catch (err) {
        res.status(500).send({status: false, msg: `this is catch err ${err.message}` })
    }
}
module.exports.createCollege = createCollege;
module.exports.collegeDetails = collegeDetails