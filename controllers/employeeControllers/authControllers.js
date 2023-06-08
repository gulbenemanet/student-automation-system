const Student = require('../../models/student_model')
const Employee = require('../../models/employee_model')
const Courses = require('../../models/course_model')
const Message = require('../../models/messages_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Token = require('../../models/token_model')

const signUp = async(req, res) => {
    try {
        console.log(req.body);
        if (req.body.rePassword != req.body.password) {
            res.json('err:şifreler aynı değil')
        } else {
            var hashedPassword = await bcrypt.hash(req.body.password, 8);
            const employee = Employee.create({
                tcNumber: req.body.tcNumber,
                email: req.body.email,
                name: req.body.name,
                lastName: req.body.lastName,
                password: hashedPassword
            }, (err, user) => {
                if (err) {
                    if (err.code == 11000) {
                        res.json(err)
                    } else if (err) {
                        res.json(err)
                    }
                } else {
                    const token = jwt.sign({ id: user._id }, 'supersecret', {
                        expiresIn: '1h'
                    })
                    res.cookie("token", token, {
                        httpOnly: true
                    })
                    res.redirect('/employee/mainPage')
                        // res.status(200).json({
                        //     "success": true,
                        //     "code": 200,
                        //     "message": "Database'e ekleme yapıldı.",
                        //     "data": {
                        //         profile: user,
                        //         token: token
                        //     }
                        // })
                }
            })
        }
    } catch (err) {
        res.json(err)
        console.log(err);

    }
}

const signIn = async(req, res) => {
    const user = await Employee.findOne({ email: req.body.email }, async(err, user) => {
        //console.log(user);
        if (err) {
            res.json(err)
        } else if (!user) {
            res.json('Hatalı bilgi...') // e posta hatalı
        } else {
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                //console.log(req.body.password + user.password);
                if (error) {
                    res.json(error)
                } else if (!result) {
                    res.json('Hatalı bilgi...') // şifre hatalı
                } else if (result) {
                    const token = jwt.sign({ id: user._id }, 'supersecret', {
                        expiresIn: '1h'
                    })
                    res.cookie("token", token, {
                        httpOnly: true
                    })
                    res.redirect('/employee/mainPage')
                        // res.status(200).json({
                        //     "success": true,
                        //     "code": 200,
                        //     "message": "Girişiniz başarıyla yapıldı.",
                        //     "data": {
                        //         profile: user,
                        //         token: token
                        //     }
                        // })
                }

            })
        }
    })
}

const ozluk = async(req, res) => {
    try {
        // console.log(req);
        const employeeid = req.user._id

        const result = await Employee.findById(employeeid)
            .select({ areas: 0, __v: 0, password: 0, _id: 0, courses: 0 })
        console.log(result);
        if (result) {
            res.status(200).json({
                "success": true,
                "code": 200,
                "message": 'Özlük bilgileri gönderildi.',
                "data": result
            })
        }

    } catch (err) {
        res.json(err)
        console.log(err);
    }
}


const logOut = async(req, res) => {
    //res.json(req.headers.authorization);
    res.clearCookie('token').redirect('/')

}

const getClasses = async(req, res) => { //verdiği dersleri alan öğrenciler
    try {
        let courses
        let students
        let tempArr = []
        let tempArr2 = []
        let tempArr3 = []
        let tempArr4 = {};
        // console.log(req.user);
        const employeeid = req.user._id

        const result = await Employee.findById(employeeid)
            // console.log(result);
        if (result) {
            for (let i = 0; i < result.courses.length; i++) {
                courses = await Courses.find({ 'courseId': result.courses[i] })
                tempArr.push(courses)
            }
            for (let i = 0; i < tempArr.length; i++) {
                tempArr3.push(tempArr[i][0].cName)
            }
            for (let i = 0; i < tempArr.length; i++) {
                students = await Student.find({ 'studentNumber': tempArr[i][0].cStudents })
                tempArr2.push(students)
            }
            for (let i = 0; i < tempArr.length; i++) {
                let key = tempArr3[i]
                console.log(tempArr3[i]);
                tempArr4[key] = tempArr2[i]

            }
            // console.log(tempArr2);
        }
        if (courses && students) {
            res.status(200).json({
                "success": true,
                "code": 200,
                "message": 'Özlük bilgileri gönderildi.',
                "data": tempArr4
            })
        }

    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const notGirisi = async(req, res) => {
    try {

        if (result) {
            res.status(200).json({
                "success": true,
                "code": 200,
                "message": 'Özlük bilgileri gönderildi.',
                "data": result
            })
        }

    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const postGrade = async(req, res) => {
    console.log(req.body);
    let updateStudent;
    for (let i = 0; i < req.body.gradeMid.length; i++) {
        updateStudent = await Student.find({ studentNumber: req.body.studentNumber[i] })
        let course = await Courses.find({ cName: req.body.courseName });
        // console.log(course);
        for (let j = 0; j < updateStudent[0].courses.termCourses.length; j++) {
            // console.log(updateStudent[0].courses.termCourses[j].courseId);
            // console.log(course[0].courseId);

            if (course[0].courseId == updateStudent[0].courses.termCourses[j].courseId) {
                // console.log(req.body.gradeMid[i]);
                // console.log(req.body.gradeFin[i]);
                // console.log(updateStudent[0].courses.termCourses[j].gradeMid);
                let updateE = await Student.updateMany({ 'studentNumber': req.body.studentNumber[i] }, {
                    $set: {
                        [`courses.termCourses.${j}.gradeMid`]: req.body.gradeMid[i],
                        [`courses.termCourses.${j}.gradeFin`]: req.body.gradeFin[i],

                    }
                })
                console.log(updateE);

            }
        }
    }
    res.redirect('/employee/mainPage')

}

module.exports = {
    logOut,
    signUp,
    signIn,
    ozluk,
    getClasses,
    postGrade
}