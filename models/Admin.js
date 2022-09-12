const mongoose = require("mongoose")
const Joi = require("joi")

const adminSchema = mongoose.Schema({
    username: String ,
    email: String,
     password: String,
})

const adminJoi = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(50).required(),
})

const loginJoi = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string().min(8).max(50).required()
})

const Admin = mongoose.model("Admin" , adminSchema)

module.exports.Admin = Admin
module.exports.adminJoi = adminJoi
module.exports.loginJoi = loginJoi