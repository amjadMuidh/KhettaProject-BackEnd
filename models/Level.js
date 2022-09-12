const mongoose = require("mongoose")
const Joi = require("joi")

const levelSchema = new mongoose.Schema({
    levelNum: Number,
    levelGroups:[{
        type: mongoose.Types.ObjectId,
        ref: "Group"
    }],
    levelCourses:[{
        type: mongoose.Types.ObjectId,
        ref: "Course"
    }],

})

const levelJoi = Joi.object({
    levelNum: Joi.number().min().max(10).required(),
    levelGroups:Joi.objectid(),
    levelCourses: Joi.objectid()
})

const Level = mongoose.model("Level" , levelSchema)

module.exports.Level = Level
module.exports.levelJoi = levelJoi