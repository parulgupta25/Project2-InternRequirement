const mongoose = require('mongoose')

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Intern name is required',
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
    },
    mobile: {
        type: Number,
        required: 'Number is required',
        unique: true
    },
    collegeId: {
        required: 'Intern college is required',
        type: mongoose.Types.ObjectId,
        refs: 'College'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Intern', internSchema);