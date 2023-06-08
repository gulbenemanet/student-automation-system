const express = require('express');
const signInControllerStudent = require('../controllers/signInControllerStudent')
const signInControllerEmployee = require('../controllers/signInControllerEmployee')
const signUpControllerStudent = require('../controllers/signUpControllerStudent')
const signUpControllerEmployee = require('../controllers/signUpControllerEmployee')
const homePageController = require('../controllers/homePageController')
const courseController = require('../controllers/courseController')

//Student Controllers
const mainPageController = require('../controllers/studentControllers/mainPageController')
const examResultController = require('../controllers/studentControllers/exam-resultController')
const lessonsController = require('../controllers/studentControllers/lessonsController')
const messagesController = require('../controllers/studentControllers/messagesController')
const ozlukController = require('../controllers/studentControllers/ozlukController')
const syllabusController = require('../controllers/studentControllers/syllabusController')
const dersAlmaController = require('../controllers/studentControllers/dersAlmaController')
const student_authController = require('../controllers/studentControllers/authControllers')
const auth_student = require('../middleware/auth_student');


//Employee Controllers
const classesControllerEmp = require('../controllers/employeeControllers/classesController')
const mainPageControllerEmp = require('../controllers/employeeControllers/mainPageController')
const messagesControllerEmp = require('../controllers/employeeControllers/messagesController')
const notGirisiControllerEmp = require('../controllers/employeeControllers/notGirisiController')
const ozlukControllerEmp = require('../controllers/employeeControllers/ozlukController')
const syllabusControllerEmp = require('../controllers/employeeControllers/syllabusController')
const employee_authController = require('../controllers/employeeControllers/authControllers')
const auth_employee = require('../middleware/auth_employee');

const router = express.Router();

router.get('/', homePageController)


router.get('/student/mainPage', auth_student, mainPageController)
router.get('/student/messages', auth_student, messagesController)
router.get('/student/dersAlma', auth_student, dersAlmaController)
router.get('/student/exam-result', auth_student, examResultController)
router.get('/student/ozluk', auth_student, ozlukController)
router.get('/student/syllabus', auth_student, syllabusController)
router.get('/student/lessons', auth_student, lessonsController)
router.get('/student/logOut', auth_student, student_authController.logOut)
router.get('/student/getozluk', auth_student, student_authController.ozluk)
router.get('/student/getTermCourses', auth_student, student_authController.termCourses)
router.get('/student/getExamResult', auth_student, student_authController.resultExam)
router.get('/student/getCourse', auth_student, student_authController.getCourse)
router.get('/student/getMessages', auth_student, student_authController.getMessages)
router.get('/student/getEmployees', auth_student, student_authController.getEmployees)
router.post('/student/postCourses', auth_student, student_authController.postCourses)
router.post('/student/postMessages', auth_student, student_authController.postMessages)


router.get('/employee/mainPage', auth_employee, mainPageControllerEmp)
router.get('/employee/messages', auth_employee, messagesControllerEmp)
router.get('/employee/classes', auth_employee, classesControllerEmp)
router.get('/employee/notGirisi', auth_employee, notGirisiControllerEmp)
router.get('/employee/ozluk', auth_employee, ozlukControllerEmp)
router.get('/employee/syllabus', auth_employee, syllabusControllerEmp)
router.get('/employee/logOut', auth_employee, employee_authController.logOut)
router.get('/employee/getozluk', auth_employee, employee_authController.ozluk)
router.get('/employee/getClasses', auth_employee, employee_authController.getClasses)
router.post('/employee/postGrade', auth_employee, employee_authController.postGrade)



router.get('/signInStudent', signInControllerStudent)
router.get('/signInEmployee', signInControllerEmployee)
router.get('/signUpEmployee', signUpControllerEmployee)
router.get('/signUpStudent', signUpControllerStudent)
router.post('/api/signUpStudent', student_authController.signUp)
router.post('/api/signInStudent', student_authController.signIn)
router.post('/api/signUpEmployee', employee_authController.signUp)
router.post('/api/signInEmployee', employee_authController.signIn)


router.post('/addCourse', courseController.addCourse)



module.exports = router