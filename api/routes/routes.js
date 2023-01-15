const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const CourseModel = require('../models/course.model');
const AssignmentModel = require('../models/assignment.model');
const UserModel = require('../models/user.model')
var fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, '../MOCK_DATA.json');


const verifyToken = (token)=>{
    try {
        const verify = jwt.verify(token,process.env.JWT_SECRET_KEY);
        return verify.type === 'user'
    } catch (e) {
        console.error(e);
        return false;
    }
}




router.post('/addAssignment', (req, res) => {
    const data = new AssignmentModel({
        name: req.body.name,
        subject: req.body.subject,
        mark: req.body.mark,
        remark: req.body.remark,
        date: req.body.date,
        completed: req.body.completed
    });

    try {
        const dataToSave = data.save();
        res.status(200).json({message:"Assignment Saved"})
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/assignments', async(req, res) => {
    const { token }= req.cookies;
    try{
        const data = await AssignmentModel.find();
        res.json(data)
    }
    catch(error){
        res.json(error)
    }
})


router.get('/getUser', async(req, res) =>{
    
    const { token }= req.cookies;
    try{
        const verify = jwt.verify(token,process.env.JWT_SECRET_KEY);
        res.json({username: verify.username})
    }catch(e){
        res.json(e)
    }
    

})

router.route('/updateAssignment').post((req, res) => {
    try{
        AssignmentModel.findOneAndUpdate(
            { _id:req.body.id },
            { completed: req.body.newValue }
        ).exec();
        res.json('Updated succesfully');
    }catch{

    }
    
})

router.post('/addCourse', (req, res) => {
    const data = new CourseModel({
        name: req.body.name,
        ownerPicture: req.body.ownerPicture,
        assignmentPictures: req.body.assignmentPictures
    })
    try{
        const dataToSave = data.save();
        res.status(200).json({message:"Courses Added"})
    }catch(e){
        console.log(e)    
        res.status(400).json(e)
    }
})

router.get('/courses', async(req, res) => {
    try{
        const data = await CourseModel.find();
        res.json(data)
    }
    catch(error){
        res.json(error)
    }
})

router.post('/signUp', async(req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.exists({username:username});

    try{
        if (!user) {
            const newUser = new UserModel({
                username:username,
                password: password,
            });
            
            newUser.save()
            .then((data) =>{
                token = jwt.sign({id:newUser._id, username:newUser.username,type:'user'},process.env.JWT_SECRET_KEY)
                res.cookie('token',token,{ path: '/', httpOnly: false }); 
                res.status(200).send({ data: 'success', cookie: token });
            })
            .catch((error) =>{
                res.json(error);
            });
            
        } else {
            res.status(400).send({data: "User is already registered"});
        }
    }catch(err){

    }
})

router.post('/signIn', async(req, res) => {
    const {username, password} = req.body;
    console.log(req.body)
    const user = await UserModel.findOne({username}).lean();
    if(user && password == user.password){
        token = jwt.sign({id:user._id, username:username,type:'user'},process.env.JWT_SECRET_KEY)
        res.cookie('token',token,{ path: '/', httpOnly: false }); 
        res.status(200).send({ data: 'success', cookie: token });
    }else{
        res.status(400).send({data: "Incorrect password"})
    }
})

router.get('/verify', async(req, res) =>{
    const { token }= req.cookies;
    res.json(verifyToken(token))
    
})



const importData = async () => {

    const data = await AssignmentModel.find();
    if(data.length == 0){
        try {
            
            const mock = JSON.parse(fs.readFileSync(filePath, 'utf-8'))      
            await AssignmentModel.create(mock)
            console.log('data successfully imported')
            // to exit the process
            process.exit()
          } catch (error) {
            console.log('error', error)
          }
    }
}

importData()

module.exports = router;
