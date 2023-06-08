const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coursesSchema = new Schema({
    courseId: {
        type: Number,
        unique: true,
    },
    cName: {
        type: String,
    },
    cTerm: {
        type: Number,
        maxLength: 11
    },
    cCredit: {
        type: Number,
        maxLength: 10
    },
    cTeacher: {
        type: Number
    },
    cStudents: {
        type: Array,
    }
}, { collection: 'courses' })

const Course = mongoose.model('courses', coursesSchema)


module.exports = Course;