const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const validateBody = require("../middleware/validateBody");
const checkAdmin = require("../middleware/checkAdmin");
const checkId = require("../middleware/checkId");

const { adminJoi, Admin, loginJoi } = require("../models/Admin");
const { Student, studentJoi } = require("../models/Student");
const { Course, courseJoi } = require("../models/Course");
const { Group, groupJoi } = require("../models/Group");
const { Level, levelJoi } = require("../models/Level");

//---------------------------------------  Admin section --------------------------------------

// signup
router.post("/signup", validateBody(adminJoi), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const adminFound = await Admin.findOne({ email });
    if (adminFound)
      return res.status(400).send("The Admin allready registered!");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = new Admin({
      username,
      email,
      password: hash,
    });

    await admin.save();
    delete admin._doc.password;

    res.json(admin);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).send("Admin not found!");

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).send("Incorrect password");

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "20d",
    });
    res.send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// get profile
router.get("/profile", checkAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password -__v");
    if (!admin) return res.status(404).send("Admin not found!");

    res.json(admin);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//------------------------------ Dealing  with student section ----------------------------------

// get all students
router.get("/allStudents", checkAdmin, async (req, res) => {
  try {
    const student = await Student.find().select("-__v -password");
    res.json(student);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// add student
router.post(
  "/add-student",
  checkAdmin,
  validateBody(studentJoi),
  async (req, res) => {
    try {
      const { studentFullName, studentID, passWord, previousCourses } = req.body;

      const studentFound = await Student.findOne({ studentID });
      if (studentFound)
        return res.status(400).send("The student allready registered");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(passWord, salt);

      const student = new Student({
        studentFullName,
        studentID,
        passWord: hash,
        previousCourses,
      });
      await student.save();
      delete student._doc.password;

      res.json(student);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Delete student
router.delete("/removeStudent/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) return res.status(404).send("student not found");
    res.send("student removed");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


//------------------------------ Dealing  with courses section ----------------------------------


//get all courses
router.get("/courses" , checkAdmin , async(req , res) => {
    try {
        const allCourses = await Course.find().select("-__v").populate("requirmentCourses")
        res.json(allCourses)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// add course 
router.post("/add-course" , checkAdmin , validateBody(courseJoi) , async (req , res) => {
    try {
        const { courseName , courseHoures , doctorName , requirmentCourses } = req.body

        const course = new Course ({courseName , courseHoures , doctorName , requirmentCourses})
        await course.save()
        res.json(course)
    } catch (error) {
        res.status(500).send(error.message)
    }
}) 


// delete Course 
router.delete("/delete-course/:id" , checkAdmin, checkId , async (req , res ) => {
    try {
         await Course.findByIdAndRemove(req.params.id)
        res.send("Course removed")
    } catch (error) {
        res.status(500).send(error.message)
    }
})


//------------------------------ Dealing  with groups section ----------------------------------

//get all groups
router.get("/groups" , checkAdmin , async(req , res) => {
    try {
        const allGroups = await Group.find().select("-__v").populate("groupStudents")
        res.json(allGroups)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// add group 
router.post("/add-group" , checkAdmin , validateBody(groupJoi) , async (req , res) => {
    try {
        const { groupName , groupStudents , groupCourses  } = req.body

        const group = new Group ({groupName , groupStudents , groupCourses })
        await group.save()
        res.json(group)
    } catch (error) {
        res.status(500).send(error.message)
    }
}) 


// delete group 
router.delete("/delete-group/:id" , checkAdmin, checkId , async (req , res ) => {
    try {
         await Group.findByIdAndRemove(req.params.id)
        res.send("Group removed")
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//

//------------------------------ Dealing  with levels section ----------------------------------


//get all levels
router.get("/levels" , checkAdmin , async(req , res) => {
    try {
        const allLevels = await Level.find().select("-__v").populate("levelCourses").populate("levelGroups")
        res.json(allLevels)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// add level 
router.post("/add-level" , checkAdmin , validateBody(levelJoi) , async (req , res) => {
    try {
        const { levelNum , levelGroups , levelCourses } = req.body

        const level = new Level ({ levelNum ,levelGroups , levelCourses})
        await level.save()
        res.json(level)
    } catch (error) {
        res.status(500).send(error.message)
    }
}) 


// delete level 
router.delete("/delete-level/:id" , checkAdmin, checkId , async (req , res ) => {
    try {
         await Level.findByIdAndRemove(req.params.id)
        res.send("Level removed")
    } catch (error) {
        res.status(500).send(error.message)
    }
})
module.exports = router;
