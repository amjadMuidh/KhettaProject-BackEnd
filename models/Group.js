const mongoose = require("mongoose")
const Joi = require("joi")

const groupSchema = new mongoose.Schema({
    groupName: String,
    groupStudents:[{
        type: mongoose.Types.ObjectId,
        ref: "Student"
    }],
    groupCourses:[{
        type: mongoose.Types.ObjectId,
        ref: "Course"
    }],

})

const groupJoi = Joi.object({
    groupName: Joi.string().min().max(10).required(),
    groupStudents:Joi.objectid(),
    groupCourses: Joi.objectid()
})

const Group = mongoose.model("Group" , groupSchema)

module.exports.Group = Group
module.exports.groupJoi = groupJoi