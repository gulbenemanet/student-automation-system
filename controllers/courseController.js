const Course = require('../models/course_model')
const Employee = require('../models/employee_model')
const jwt = require('jsonwebtoken')

const addCourse = async(req, res) => {
    try {
        console.log(req.body);
        const course = Course.create({
            courseId: req.body.courseId,
            cName: req.body.cName,
            cTerm: req.body.cTerm,
            cCredit: req.body.cCredit,
            cTeacher: req.body.cTeacher,
        }, async(err, user) => {
            if (err) {
                if (err.code == 11000) {
                    res.json(err)
                } else if (err) {
                    res.json(err)
                }
            } else {
                const updateTeacher = await Employee.updateOne({ 'employeeNumber': req.body.cTeacher }, { $push: { 'courses': req.body.courseId } })
                    // console.log(updateTeacher);
                if (updateTeacher.nModified == 0) {
                    res.status(409).json({
                        "success": false,
                        "code": 409,
                        "message": "Beklenmedik bir hatayla karşılandı.",
                        "internalMessage": "Databasede bir güncelleme yapılmadı."
                    })
                } else {
                    res.status(200).json({
                        "success": true,
                        "code": 200,
                        "message": "Database'e ekleme yapıldı.",
                        "data": {
                            profile: user
                        }
                    })
                }
            }
        })

    } catch (err) {
        res.json(err)
        console.log(err);

    }
}

module.exports = {
    addCourse,
}