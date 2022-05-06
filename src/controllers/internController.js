const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}

const createIntern = async (req, res) => {
    try {
        const requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
            return
        }

        // Extract params
        const { name, email, mobile, collegeName } = requestBody //Object destructuring

        // Validation starts
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'College name is required' })
            return
        }

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Email is required' })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: 'Email should be valid email address' })
            return
        }

        if (!isValid(mobile)) {
            res.status(400).send({ status: false, message: 'Mobile number is required' })
            return
        }

        if (!(/^[6-9]\d{9}$/.test(mobile))) {
            res.status(400).send({ status: false, message: 'Mobile should be valid mobile number' })
            return
        }

        if(!isValid(collegeName)){
            res.status(400).send({status: false, message: 'College name is required'})
        }

        let college = await collegeModel.findOne({name: collegeName})

        if(!isValid(college)){
            res.status(400).send({status: false, message: `${collegeName} not exists in collection`})
            return
        }

        const collegeId = college._id

        const isEmailAlreadyUsed = await internModel.findOne({ email });  //{email : email} object shorthand property

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }

        const isMobileAlreadyUsed = await internModel.findOne({ mobile });  //{mobile : mobile} object shorthand property

        if (isMobileAlreadyUsed) {
            res.status(400).send({ status: false, message: `${mobile} mobile is already registered` })
            return
        }
        // Validation ends

        const internData = {
            name, email, mobile, collegeId
        }
        const newIntern = await internModel.create(internData);

        res.status(201).send({ status: true, message: 'College created successfully', data: newIntern });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = {createIntern}