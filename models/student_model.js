const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
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
    studentNumber: {
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
        fatherName: {
            type: String,
            trim: true,
            maxLength: 25,
            default: 0
        },
        motherName: {
            type: String,
            trim: true,
            maxLength: 25,
            default: 0
        },
        birthDate: {
            type: Date,
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
        status: {
            type: String,
            trim: true,
            maxLength: 25,
            default: 0
        }, //devamlı dondurmuş
        situation: {
            type: String,
            trim: true,
            maxLength: 25,
            default: 0
        }, //örgün birinci ikinci öğretim
        phoneNumber: {
            type: Number,
            trim: true,
            maxLength: 25,
            default: 0
        },
        term: {
            type: Number,
            default: 0
        },
        military: {
            type: String,
            default: 0
        },
        civilStatus: {
            type: String,
            default: 0
        },
        passPrep: { // true hazırlık tamamnlandı
            type: String,
            default: 0
        },
    },
    courses: {
        passedCourses: {
            type: Array,
        },
        failedCourses: {
            type: Array,
        },
        termCourses: {
            type: Array,
            courseId: {
                type: Number,
                default: 0
            },
            gradeMid: {
                type: Number,
                default: null
            },
            gradeFin: {
                type: Number,
                default: null
            },
        },
    }
}, { collection: 'students' })

const Student = mongoose.model('students', studentSchema)


module.exports = Student;