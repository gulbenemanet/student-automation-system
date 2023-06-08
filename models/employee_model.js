const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        email: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    tcNumber: {
        type: Number,
        unique: true,
        maxLength: 11
    },
    employeeNumber: {
        type: Number,
        maxLength: 10,
        default: 0
    },
    name: {
        type: String,
        trim: true,
        maxLength: 25
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 25
    },
    ozluk: {
        birthDate: {
            type: String,
            trim: true,
            default: 0
        },
        gender: {
            type: String,
            default: 0
        },
        faculty: {
            type: String,
            trim: true,
            maxLength: 25,
            default: 0
        },
        department: {
            type: String,
            trim: true,
            maxLength: 25,
            default: 0
        },
        givenCourses: {
            type: Array,
        },
        phoneNumber: {
            type: Number,
            trim: true,
            maxLength: 25,
            default: 0
        },
        military: {
            type: String,
            default: false
        },
        civilStatus: {
            type: String,
            default: false
        },
    },
    courses: {
        type: Array,
    }
}, { collection: 'employees' })

const Employee = mongoose.model('employees', employeeSchema)


module.exports = Employee;