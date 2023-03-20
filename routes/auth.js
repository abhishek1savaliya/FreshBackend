const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');   

const JWT_SECRET = "Abhishekhasenoughpowertolearnmore"


//ROUTE-1 create a user USING POST "/api/auth/" .Doesn't require author

router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({ min: 5 })
    
],async (req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
    let user = await User.findOne({email:req.body.email}); 
    if(user){
        success = false;
        return res.status(400).json({success,error: "Sorry a User with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password,salt);

     //create a new User
       user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password:secPass,
          })
          const data = {
            user:{
                id:user.id,
            }
          }
    const authToken = jwt.sign(data,JWT_SECRET);

    success = true;
    res.json({success,authToken});

}
catch(err){
    console.error(err.message);
    res.status(500).send("Internal Server Error")
}
})

//ROUTE-2 Authenticate a User


router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  
  
  });


//ROUTE-3 Get Loggedin User Detail using POST "/api/auth/getuser" .Login Required

router.post('/getuser',fetchuser,async (req,res)=>{
try{
    userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
}
catch(err){
    console.error(err.message);
    res.status(500).send("Internal Server Error")
}
})


module.exports = router;