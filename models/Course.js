const mongoose = require("mongoose")
const Joi = require("joi")

const courseSchema = new mongoose.Schema({
    courseName: String,
    courseHoures: Number,
    doctorName: String,
    requirmentCourses:[{
        type: mongoose.Types.ObjectId,
        ref: "Course"
    }],

})

const courseJoi = Joi.object({
    courseName: Joi.string().min(4).max(30).required() ,
    courseHoures: Joi.number().min(1).max(10).required(),
    doctorName: Joi.string().min(6).max(100).required(),
    requirmentCourses: Joi.objectid()
})

const Course = mongoose.model("Course" , courseSchema)

module.exports.Course = Course
module.exports.courseJoi = courseJoi