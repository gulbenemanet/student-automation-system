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
            const student = Student.create({
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
                    res.redirect('/student/mainPage')
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
    const user = await Student.findOne({ email: req.body.email }, async(err, user) => {
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
                    res.redirect('/student/mainPage')
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
        const studentid = req.user._id
        const result = await Student.findById(studentid)
            .select({ __v: 0, courses: 0, password: 0, _id: 0 })
            // console.log(result);

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

const termCourses = async(req, res) => {
    try {
        const studentid = req.user._id
        const result = await Student.findById(studentid)
        if (result) {
            let coursesL;
            let tempArr = [];
            for (let i = 0; i < result.courses.termCourses.length; i++) {
                let findit = result.courses.termCourses[i].courseId;
                coursesL = await Courses.find({ 'courseId': findit })
                tempArr[i] = {
                        'courseName': coursesL[0].cName,
                        'courseCredit': coursesL[0].cCredit
                    }
                    // tempArr.push({ coursesL[0].cName, coursesL[0].cCredit })
            }
            //console.log(tempArr);
            // tempArr.push(result.courses.termCourses.$.coursesId)
            res.status(200).json({
                "success": true,
                "code": 200,
                "message": 'Alınan dönem dersleri gönderildi.',
                "data": tempArr
            })
        }

    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const resultExam = async(req, res) => {
    try {
        const studentid = req.user._id
        const result = await Student.findById(studentid)
        if (result) {
            let coursesL;
            let tempArr = [];
            for (let i = 0; i < result.courses.termCourses.length; i++) {
                let findit = result.courses.termCourses[i].courseId;
                coursesL = await Courses.find({ 'courseId': findit })
                tempArr[i] = {
                        'courseName': coursesL[0].cName,
                        'courseMid': result.courses.termCourses[i].gradeMid,
                        'courseFin': result.courses.termCourses[i].gradeFin
                    }
                    // tempArr.push({ coursesL[0].cName, coursesL[0].cCredit })
            }
            console.log(tempArr);
            // tempArr.push(result.courses.termCourses.$.coursesId)
            res.status(200).json({
                "success": true,
                "code": 200,
                "message": 'Alınan dönem dersleri gönderildi.',
                "data": tempArr
            })
        }

    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const getCourse = async(req, res) => {
    //öğrencinin aldığı dönem derslerini ve kaldığı dersleri listelicem
    try {
        const studentid = req.user._id
        const result = await Student.findById(studentid)
        const failedCourseswT = [];
        const termCourseswT = [];
        const termCourses = await Courses.find({ 'cTerm': result.ozluk.term }) // .select({ __v: 0, _id: 0, cStudents: 0 })
        const failedCourses = await Courses.find({ 'courseId': result.courses.failedCourses })

        if (result.ozluk.term % 2 == 0) { //öğrenci bahar döneminde => bahar dönemi derslerini getir
            for (let i = 0; i < failedCourses.length; i++) {
                if (failedCourses[i].cTerm % 2 != 0) { // güz dönemi dersleri
                    failedCourses.splice(i, 1)
                }
            }
        } else {
            for (let i = 0; i < failedCourses.length; i++) {
                if (failedCourses[i].cTerm % 2 == 0) { // bahar dönemi dersleri
                    failedCourses.splice(i, 1)
                }
            }
        }
        for (let i = 0; i < failedCourses.length; i++) {
            const failTeacher = await Employee.find({ 'employeeNumber': failedCourses[i].cTeacher })
                //console.log(failTeacher);
            failedCourseswT.push({
                "credit": failedCourses[i].cCredit,
                "cName": failedCourses[i].cName,
                "tName": failTeacher[0].name + " " + failTeacher[0].lastName,
                "courseId": failedCourses[i].courseId
            })
        }
        for (let i = 0; i < termCourses.length; i++) {
            const termTeacher = await Employee.find({ 'employeeNumber': termCourses[i].cTeacher })
                // console.log("ıhıh" + termTeacher[0].name);
            termCourseswT.push({
                "credit": termCourses[i].cCredit,
                "cName": termCourses[i].cName,
                "tName": termTeacher[0].name + " " + termTeacher[0].lastName,
                "courseId": termCourses[i].courseId
            })
        }


        //console.log(failedCourses);
        res.status(200).json({
            "success": true,
            "code": 200,
            "message": 'Alınabilecek dersler gönderildi.',
            "data": {
                'termCourses': termCourseswT,
                'failedCourses': failedCourseswT
            }
        })
    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const postCourses = async(req, res) => {
    try {
        // console.log(Object.values(req.body));
        var size = Object.keys(req.body).length;
        const propertyValues = Object.keys(req.body);
        let updateStudent
        let updateCourse
            // console.log(propertyValues);
        for (let i = 0; i < size; i++) {
            updateStudent = await Student.findByIdAndUpdate(req.user._id, { $push: { 'courses.termCourses': { 'courseId': propertyValues[i], 'gradeMid': null, 'gradeFin': null } } })
        }
        for (let i = 0; i < size; i++) {
            updateCourse = await Courses.updateOne({ 'courseId': propertyValues }, { $push: { 'cStudents': updateStudent.studentNumber } })
        }
        res.redirect('/student/lessons')
            // res.status(200).json({
            //     "success": true,
            //     "code": 200,
            //     "message": 'Dersler başarıyla alındı',
            //     "data": updateStudent
            // })
    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const getMessages = async(req, res) => {
    try {
        const studentid = req.user._id
        let employees = [];
        const result = await Student.findById(studentid)
        const messages = await Message.find({ 'studentNumber': result.studentNumber })
            .select({ __v: 0, _id: 0 })
        for (let i = 0; i < messages.length; i++) {
            const employee1 = await Employee.find({ 'employeeNumber': messages[i].employeeNumber })
                .select({ __v: 0, _id: 0, ozluk: 0, password: 0, courses: 0, tcNumber: 0, email: 0 })
            employees.push(employee1[0])
        }
        // console.log(employees);
        res.status(200).json({
            "success": true,
            "code": 200,
            "message": "Öğrencinin mesajları gönderildi",
            "data": {
                "messages": messages,
                "employee": employees
            }
        })

    } catch (err) {
        res.json(err)
        console.log(err);
    }

}

const getEmployees = async(req, res) => {
    try {
        const studentid = req.user._id
        const result = await Student.findById(studentid);
        let tempArr = [];
        let employees;
        // console.log(result.courses.termCourses[]);
        for (let i = 0; i < result.courses.termCourses.length; i++) {
            const courses = await Courses.find({ courseId: result.courses.termCourses[i].courseId });
            tempArr.push(courses)
        }
        // console.log(tempArr[2][0]);
        for (let i = 0; i < tempArr.length; i++) {
            // console.log("kjfn" + tempArr[i].cTeacher);
            employees = await Employee.find({ 'employeeNumber': tempArr[i][0].cTeacher })
                //yapamadım
        }
        console.log(employees);

    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const postMessages = async(req, res) => {
    try {
        const studentid = req.user._id
        const result = await Student.findById(studentid)
            // console.log(result);
        const message = Message.create({
            studentNumber: result.studentNumber,
            employeeNumber: req.body.employeeNumber,
            message: req.body.message,
            send: 'student'
        }, (err, message) => {
            if (err) {
                res.json(err)
            } else {
                console.log(message);
            }

        })
    } catch (err) {
        res.json(err)
        console.log(err);
    }
}

const logOut = async(req, res) => {
    //res.json(req.headers.authorization);
    res.clearCookie('token').redirect('/')
}


module.exports = {
    logOut,
    signUp,
    signIn,
    ozluk,
    termCourses,
    resultExam,
    getCourse,
    postCourses,
    getMessages,
    getEmployees,
    postMessages
}