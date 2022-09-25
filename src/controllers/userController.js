
const UserModel = require('../models/userModel')
const valid = require('../validation/validation')
const jwt = require('jsonwebtoken')

const registerUser = async function(req,res){
    try {
        const data = req.body

        if (!valid.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "please provide User data" })

        const { title, name, phone, email, password, address } = data

        if (!valid.isValid(title)) return res.status(400).send({ status: false, message: "title is Mandatory" })

        if(!valid.isValidEnum(title)) return res.status(400).send({ status: false, message: "Invalid title" })

        if (!valid.isValid(name)) return res.status(400).send({ status: false, message: "Name is Mandatory" })

        if (!valid.isValid(phone)) return res.status(400).send({ status: false, message: "Phone Number is Mandatory" })

        if (!valid.mobileValidation(phone)) 
            return res.status(400).send({ status: false, message: "Please enter a valid Phone Number" })

        if (!valid.isValid(email)) return res.status(400).send({ status: false, message: "email Id is Mandatory" })
        
        if (!valid.emailValidation(email)) return res.status(400).send({ status: false, message: "Please enter a valid email id" })

        if (!valid.isValid(password)) return res.status(400).send({ status: false, message: "Password is Mandatory" })
        
        if (!valid.isValidPassword(password)) return res.status(400).send({ status: false, message: "password is invalid, it contain at least one Upper one lower letters one Special char and one number with min 8 and max 15 letters" })

        const isPhoneExist = await UserModel.findOne({ phone: phone })

        if (isPhoneExist) return res.status(400).send({ status: false, message: "phone number already exist" })

        const isEmailExist = await UserModel.findOne({ email: email })

        if (isEmailExist) return res.status(400).send({ status: false, message: "email is already registerd" })

        const savedata = await UserModel.create(data)

        return res.status(201).send({ status: true, message: "User created", data: savedata })
    } 
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const loginUser = async function(req,res){
    
    try {
        let userName = req.body.email;
        let password = req.body.password;
        if (!userName) return res.status(400).send({ status: false, message: "Please enter email" })

        if (!password) return res.status(400).send({ status: false, message: "Please enter password" })
        
        let User = await UserModel.findOne({ email: userName, password: password });

        if (!User) return res.status(400).send({status:false, message: "Invalid username or password" })
        
        let payload = { userId: User._id.toString() }

        let token = jwt.sign(payload, "projectgroup25-importent-key",{ expiresIn:"24h"});

        res.setHeader("x-api-key", token);

        return res.status(201).send({ status:true , message: "login successfully", data: token });
    }
    catch (err) {
        return res.status(500).send({ status:false,message: "Error", error: err.message })
    }
}
module.exports = {registerUser , loginUser}