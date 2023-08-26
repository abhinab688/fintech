const bcrypt = require('bcrypt');
const User = require('../Model/user');
const jwt = require('jsonwebtoken')

function isStringInvalid(string) {
    if (string == undefined || string.length === 0) {
        return true
    } else {
        return false
    }
}

exports.signup = async (req, res) => {
    try {
        const { name, phoneNumber, password } = req.body;
        const user = await User.findAll({ where: { phoneNumber: phoneNumber } })
        if (user.length === 0) {
            if (isStringInvalid(name) || isStringInvalid(phoneNumber) || isStringInvalid(password)) {
                return res.status(400).json({ err: 'Something Is missing' })
            }
            const saltRounds = process.env.SALT_ROUNDS;
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                await User.create({ name, phoneNumber, password: hash })
                res.status(201).json({ message: 'Sign Up Succesful' })
            })
        }
        else {
            res.status(201).json({ message: 'User already exist' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(501).json({ message: "Server Error" })
    }

}

exports.login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const user = await User.findAll({ where: { phoneNumber: phoneNumber } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something Went Wrong');
                }
                if (result === true) {
                    return res.status(201).json({ message: 'Login Succesful', token: generateAccessToken(user[0].id, user[0].name) })
                }
                else {
                    return res.status(401).json({ message: 'Password Incorrect' })
                }
            })
        }
        else {
            return res.status(404).json({ message: 'User does not exist' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(501).json({ message: "Server Error" })
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, process.env.JWT_VERIFICATION)
}