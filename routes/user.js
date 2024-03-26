const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const jwtSecret= "123456";

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username=req.body.username;
    const password=req.body.password;

    const findExistingUser= await User.findOne({ username });

    if(findExistingUser){
        console.log(`${username} Already Exist`);
        res.json({
            message: `${username} Already Present`
        });
        return;
    }
    
    const newUser= new User({
        username:username,
        password:password
    })

    await newUser.save();

    res.json({
        message: 'User created successfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username=req.body.username;
    const password=req.body.password;

    const findUser=await User.find({
        username: username,
        password: password 
    });

    if(findUser.length ===0){
        res.status(404).json({
            message:`${username}  Not found`
        });

        return;
    }

    const token = jwt.sign({username}, jwtSecret); 

    res.json({token});
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const Courses=await Course.find({});

    res.json({
        courses: Courses
    });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId= req.params.courseId;
    console.log(courseId);
    const username= req.username;

    await User.updateOne(
        { username: username }, // Filter criteria
        { "$push": { purchasedCourses: courseId } } // Update operation
    );

    res.json({
        message: "Purchase complete!"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username= req.username;
    
    const user = await User.findOne({
        username
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    })
});

module.exports = router