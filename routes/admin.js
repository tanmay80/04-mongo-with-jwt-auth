const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const jwtSecret= "123456";

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username=req.body.username;
    const password=req.body.password;

    //Checking if the admin is already present or not
    const findExistingAdmin= await Admin.findOne({ username });
    console.log(findExistingAdmin);
    if(findExistingAdmin){
        console.log(`${username} Already Exist`);
        res.json({
            message: `${username} Already Present`
        });
        return;
    }
    // First Way to do it
    // You can make a new entry by first make an instance of the document by using new Admin
    //and the by saving that instance by using .save
    const newAdmin= new Admin({
        username:username,
        password:password
    })

    await newAdmin.save();

    // //Second way to do it
    // //You can also make a new entry just by using admin.create()
    // //Both return promise therefore use await

    // await Admin.create({
    //     username:username,
    //     password:password
    // })

    res.json({
        message: 'Admin created successfully'
    })
    
});

router.post('/signin', async (req, res) => {
    // Implement admin signin logic

    const username=req.body.username;
    const password=req.body.password;

    const findAdmin=await Admin.find({
        username: username,
        password: password 
    });

    if(findAdmin.length ===0){
        res.status(404).json({
            message:`${username}  Not found`
        });

        return;
    }

    const token = jwt.sign({username}, jwtSecret); 

    res.json({token});

});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title=req.body.title;
    const description=req.body.description;
    const price=req.body.price;
    const imageLink=req.body.imageLink;

    const findExistingCourse= await Course.findOne({ title });

    if(findExistingCourse){
        console.log(`${title} already Exist`);
        return;
    }

    const newCourse= new Course({
        title:title,
        description:description,
        price:price,
        imageLink:imageLink
    })

    await newCourse.save();

    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const Courses=await Course.find({});

    res.json({
        courses: Courses
    });
});

module.exports = router;