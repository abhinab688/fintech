const bcrypt = require('bcrypt');
// const User = require('../Model/user');
const jwt = require('jsonwebtoken');
const pool = require('../util/connection');
const sqlQuery = require('../globalFuntion/sqlQuery');

function isStringInvalid(string) {
    if (string == undefined || string.length === 0) {
        return true
    } else {
        return false
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, process.env.JWT_VERIFICATION)
}

exports.signup = (req, res) => {
    const { name, phoneNumber, password } = req.body;
    pool().getConnection(async function (err, connection) {
        if (err) {
            console.log(err, 'err')
        }
        const sql = `SELECT * FROM users WHERE phoneNumber = ${phoneNumber}`;
        await sqlQuery(connection, sql).then(result => {
            if (result.length > 0) {
                res.status(201).json({ message: "User already exist" })
            } else {
                if (isStringInvalid(name) || isStringInvalid(phoneNumber) || isStringInvalid(password)) {
                    return res.status(400).json({ err: 'Something Is missing' })
                }
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    const query = `INSERT INTO users (name,phoneNumber, password) VALUES ('${name}','${phoneNumber}','${hash}')`
                    await sqlQuery(connection, query).then(result => {
                        res.status(201).json({ message: 'Sign Up Succesful' })
                    })

                })

            }
        })
            .catch(err => {
                console.log(err)
                res.status(501).json({ message: "server error" })
            })
            .finally(() => {
                connection.release();
            })
    })
}

exports.login = (req, res) => {
    const { phoneNumber, password } = req.body;
    pool().getConnection(async function (err, connection) {
        if (err) {
            console.log(err, 'err')
        }
        const sql = `SELECT * FROM users WHERE phoneNumber = ${phoneNumber}`
        await sqlQuery(connection, sql).then(result => {
            if (result.length === 0) {
                res.status(201).json({ message: "Account doesnot exist, SignUp" })
            } else {
                bcrypt.compare(password, result[0].password, (err, response) => {
                    if (err) {
                        throw new Error('Something Went Wrong');
                    }
                    if (response === true) {
                        return res.status(201).json({ message: 'Login Succesful', token: generateAccessToken(result[0].id, result[0].name) })
                    }
                    else {
                        return res.status(401).json({ message: 'Password Incorrect' })
                    }
                })
            }
        })
            .catch(err => {
                console.log(err)
                res.status(501).json({ message: "server error" })
            })
            .finally(() => {
                connection.release();
            })
    })


}