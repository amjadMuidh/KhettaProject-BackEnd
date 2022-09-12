const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const express = require("express")
const validateBody = require("../middleware/validateBody")
const router = express.Router()
const jwt = require("jsonwebtoken")
const checkId = require("../middleware/checkId")
const checkStudent = require("../middleware/checkStudent")
const { studentLoginJoi, Student } = require("../models/Student")


// login
router.post("/login" ,validateBody(studentLoginJoi) , async(req , res) => {
    try {
        const { studentID , passWord } = req.body
         const student = await Student.findOne({studentID})
         if(!student) return res.status(404).send("student not found!")

         const valid = await bcrypt.compare(passWord , student.passWord)
         if(!valid) return res.status(400).send("Incorrect password")

         const token = jwt.sign({id: student._id} , process.env.JWT_SECRET_KEY , {expiresIn : "20d"})
         res.send(token)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// get profile 
router.get("/profile" , checkStudent , async (req , res) => {
    try {
      const student = await Student.findById(req.studentId).select("-__v -passWord")
      res.json(student)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router;