const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { createJWT } = require("../utils/auth");

exports.signup = async (req, res) => {
    try {
        const { name, email, password, password_confirmation } = req.body;
        const isEmail = validator.isEmail(email); 

        if (!name || !email || !password || !password_confirmation) {
            return res.status(400).json({ error: "Please provide Sign Up details"});
        }
        if (!isEmail) {
            return res.status(400).json({ error: "Please provide a valid email address"});
        }
        if (!password) {
            return res.status(400).json({ error: "Please provide a Strong Password"});
        }
        if (!password_confirmation) {
            return res.status(400).json({ error: "Please confirm your password"});
        }
        if (password != password_confirmation) {
            return res.status(400).json({ error: "Password is mismatch"});
        }

        const isUserExists = await User.findOne({ email });
  
        if (isUserExists) {
            return res.status(400).json({ error: "User already Exists"})
        }

        const user = new User({
            name: name,
            email: email,
            password: password,
        })
 
        bcrypt.hash(password, 10, function(err, hash) {
            user.password = hash;
            user.save().then(response => {
                res.status(200).json({
                    success: true,
                    result: response
                })
            }) 
            .catch(err => {
                res.status(500).json({
                    errors: [{ error: err }]
                });
            });
        });        
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        }); 
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isEmail = validator.isEmail(email); 

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide a Login Details"});
        } 
        if (!email) {
            return res.status(400).json({ error: "Please provide a email address" })
        }
        if (!isEmail) {
            return res.status(400).json({ error: "Please provide a valid email address"});
        } 
        if (!password) {
            return res.status(400).json({ error: "Please provide a Login password"})
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Password is incorrect" });
        }

        const access_token = createJWT(user.email, user.id, 604800);
        
        /*
        jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(500).json({ erros: err });
            }
            if (decoded) {
                return res.status(200).json({
                    success: true,
                    token: access_token,
                    message: user.id
                });
            }
        });
        */
        
        return res.status(200).json({
            success: true,
            token: access_token,
            message: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        })
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const password = user.password;
        
        const isPasswordMatched = await bcrypt.compare(req.body.currentPassword, password);

        if (!isPasswordMatched) {
            return res.status(400).json({error: "Current Password is Invalid"})
        }

        user.password = req.body.newPassword;

        bcrypt.hash(user.password, 10, function (err, hash) {
            user.password = hash;
            user.save().then(response => {
                res.status(200).json({
                    success: true,
                    result: response,
                    message: "Your Password is changed"
                })
            })
        })

    } catch (error) {
        return res.status(400).json({error: "Failed"});
    }   
}
