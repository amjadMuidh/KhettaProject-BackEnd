const mongoose = require("mongoose")
const Joi = require("joi")

const studentSchema = new mongoose.Schema({
    studentFullName: String,
    studentID: Number,
    passWord: String,
    previousCourses:[{
        type: mongoose.Types.ObjectId,
        ref: "Course"
    }],

})

const studentJoi = Joi.object({
    studentFullName: Joi.string().min(4).max(30).required() ,
    studentID: Joi.number().min(5).max(10000000000).required(),
    passWord: Joi.string().min(6).max(100).required(),
    previousCourses: Joi.objectid()
})
const studentLoginJoi = Joi.object({
    studentID: Joi.string().min(4).max(15).required(),
    passWord: Joi.string().min(8).max(50).required()
})

const Student = mongoose.model("Student" , studentSchema)

module.exports.Student = Student
module.exports.studentJoi = studentJoi
module.exports.studentLoginJoi = studentLoginJoi