const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}

const createCollege = async (req, res) => {
    try {
        const requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            return
        }

        // Extract params
        const { name, fullName, logoLink, isDeleted } = requestBody //Object destructuring

        // Validation starts
        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'College name is required' })
            return
        }

        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: 'Full name is required' })
            return
        }

        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: 'Logo link is required' })
            return
        }

        if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(logoLink))) {
            res.status(400).send({ status: false, msg: "logoLink is invalid" })
            return
        }

        const isNameAlreadyUsed = await collegeModel.findOne({ name });  //{name : name} object shorthand property

        if (isNameAlreadyUsed) {
            res.status(400).send({ status: false, message: `${name} college name is already registered` })
            return
        }
        // Validation ends

        const collegeData = {
            name, fullName, logoLink, isDeleted
        }
        const newCollege = await collegeModel.create(collegeData);

        res.status(201).send({ status: true, message: 'College created successfully', data: newCollege });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getCollegeDetails = async (req, res) => {
    try {
        const collegeName = req.query.collegeName
        if(!collegeName){
            res.status(400).send({ status: false, message: 'Enter college name for filteration' })
            return
        }

        const colleges = await collegeModel.findOne({isDeleted: false, name: collegeName})
        
        if (!colleges) {
            res.status(404).send({ status: false, message: 'No colleges found' })
            return
        }
        const {name, fullName, logoLink} = colleges

        const interests = await internModel.find({isDeleted: false, collegeId: colleges._id}, {name: 1, email: 1, mobile: 1})

        if(!isValidRequestBody(interests)){
            res.status(404).send({ status: false, message: 'No interns found' })
            return
        }
        
        const collegeDetails = {name, fullName, logoLink, interests}
        
        res.status(200).send({ status: true, message: 'Colleges List', data: collegeDetails })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCollege, getCollegeDetails }