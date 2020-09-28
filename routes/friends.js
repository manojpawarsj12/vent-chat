const { Router } = require('express');
const User = require("../models/User");
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

const router = Router();

router.get('/friends',requireAuth,async (req,res) =>{
    let username = res.locals.user.username;
    let friendlist = await User.findOne({ username: username});
    res.json(friendlist.friends);
    
    
});


module.exports = router;