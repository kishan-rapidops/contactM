const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const checkadmin = require('../middleware/checkadmin');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const User = require('../models/User');
const Group = require('../models/Group');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Route 1 :Get all the users using: GET "/api/admin/fetchalluser". Login required (admin)
router.get('/fetchalluser', fetchuser, async (req, res) => {
    try {
        const users = await User.find({});
        // console.log(users);
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//Route 2 :Get all the users using: GET "/api/admin/fetchcontact:id". Login required (admin)
router.get('/fetchcontact/:id', fetchuser, async (req, res) => {
    
    try {
        const id=req.params.id;
        const contactofUser = await Contact.find({ user: id });
        res.status(200).json(contactofUser);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})



//Route3
//Update an existing User using: PUT "/api/admin/updateuser/:id". Login required
router.put('/updateuser/:id', fetchuser, async (req, res) => {
    const { name, email,role,permissiongrp,permissionuser } = req.body;
    try {
        const editor=await User.findById(req.user.id);
        if((editor && editor.permission.users.includes('U')) || req.user.role==='admin' || req.user.role==='subadmin'){

            let user = await User.findById(req.params.id);
            
            if (!user) { return res.status(404).send("Not Found"); }
            const newUser = {};
            // Create a new contact object
            newUser.password = user.password;
            if (name) { newUser.name = name; }
            if (email) { newUser.email = email; }
            
            if(role){newUser.role=role};
            newUser.permission={ users: '', groups: '' };
            if(permissiongrp){newUser.permission.groups=permissiongrp};
            if(permissionuser){newUser.permission.users=permissionuser};

            user = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true });
            
            return res.status(200).send({ user });
        }else{
            return res.status(403).send({ message: 'You do not have permission to edit user information' });
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//Route 4
//Delete a contact using: DELETE "/api/admin/deleteuser/:id" Login required
router.delete('/deleteuser/:id', fetchuser, async (req, res) => {
    //find note to be delete
    try {

        let user = await User.findById(req.params.id);
        if (!user) { return res.status(404).send("Not Found"); }

        if(req.user.role==="admin" || user.permission.users.includes==="D"){
                user = await User.findByIdAndDelete(req.params.id);
                res.status(200).send({ "Success": "Notes Deleted Successfuly", user: user });
        }else{
            return res.status(401).send("Not Allowed");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})


// Get all groups
router.get('/getallgroup', async (req, res) => {
    try {
        const groups = await Group.find({});
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching groups', error });
    }
});


module.exports = router;