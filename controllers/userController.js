const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.me = async (req, res) => {
    try {
        return res.status(200).json({message: "User Profile"});
    } catch (error) {
        
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