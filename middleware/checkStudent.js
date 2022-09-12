const jwt = require("jsonwebtoken")
const { Student } = require("../models/Student")

const checkStudent = async (req , res , next ) => {
try {
    const token = req.header("Authorization")
    if(!token) return res.status(400).send("Token is missing!")

    const dcryption = jwt.verify(token , process.env.JWT_SECRET_KEY)
    const studentId = dcryption.id 

    const student = await Student.findById(studentId)
    if(!student) return res.status(404).send("Student not found")

    req.studentId = studentId
    next()
    
} catch (error) {
    res.status(500).send(error.message)
}
}

module.exports = checkStudent