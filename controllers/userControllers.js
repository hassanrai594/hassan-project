const express = require('express');
const UserController = express.Router()
var jwt = require('jsonwebtoken');
const { connection } = require('mongoose');
const pool = require('../dataBase/dbConnector');
var router = express.Router();

const PRIVATEKEY = "HASSAN-123"

// middleware that is specific to this router
UserController.use((req, res, next) => { next() })
    // define the User Routes 





UserController.get('/signIn', async(req, res) => {
    // Sending Html File as well as Some Variables 
    // that can be accessed within the html file using ${varname} Notation
    res.render("signInPage.html", { locals: { title: 'This is Backend Api Talking !' } })
})



UserController.post('/login', async(req, res) => {
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    const data = req.body;
    if (data.username && data.password) {
        const dataInsert = [data.username, data.password]
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                res.send(err)
            } else {
                connection.query("SELECT * FROM user WHERE username=? AND password=?", dataInsert, function(err2, result2) {
                    if (err2) {
                        connection.release();
                        res.send({ "status": false })
                    } else {
                        connection.release();
                        if (result2.length > 0) {
                            let token = jwt.sign({ username: data.username, role: result2[0].role }, PRIVATEKEY);
                            res.send({ "token": token, "role": result2[0].role, "status": true })
                        } else { res.send({ "status": false }) }
                    }
                })
            }
        })
    } else {
        res.send({ "status": false })
    }

})



UserController.post('/add', async(req, res) => {
    // req --> It is the request Object In which we will get data from user that will hit this api
    // res --> It is the responce Object that this api will send to the user 
    const data = req.body;
    if (data.username && data.password && data.role) {
        const dataInsert = [data.username, data.password, data.role]
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                res.send(err)
            } else {
                connection.query("INSERT INTO user (username, password, role) VALUES (?,?,?)", dataInsert, function(err2, result2) {
                    if (err2) {
                        connection.release();
                        res.send("User Not added successfully")
                    } else {
                        connection.release();
                        res.send("User Added Successfully")
                    }
                })
            }
        })
    } else {
        res.send("Plz Provide Username and Password")
    }

})


UserController.post('/update', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;

    const tokenData = jwt.verify(token, PRIVATEKEY);

    if (tokenData.role == 'admin' || tokenData.role == 'hr') {
        if (data.username) {
            const dataInsert = [data.password, data.email, data.cnic, data.phone, data.gender, data.address, data.is_verify, data.role, data.username]
            pool.getConnection(function(err, connection) {
                if (err) {
                    connection.release();
                    res.send({ status: false, message: err })
                } else {
                    connection.query('UPDATE user SET password=?,email=?,cnic=?,phone=?,gender=?,address=?,is_verify=?,role=? WHERE username = ?', dataInsert, (err2, result2) => {
                        if (err2) {
                            connection.release();
                            res.send({ status: false, message: err2 })
                        } else {
                            connection.release();
                            res.send({ status: true, message: 'User updated successfully' })
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: 'User not updated Successfully!' })
        }
    } else {
        res.send({ status: false, message: 'You are not authenitcated to perform this operation' })
    }
})


UserController.post('/delete', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;

    const tokenData = jwt.verify(token, PRIVATEKEY);
    if (tokenData.role == 'admin') {
        if (data.username) {
            const dataInsert = [data.username];
            pool.getConnection(function(err, connection) {
                if (err) {
                    connection.release();
                    res.send({ status: false, message: err });
                } else {
                    connection.query('DELETE FROM user WHERE username =?', dataInsert, (err2, result2) => {
                        if (err2) {
                            connection.release();
                            res.send({ status: false, message: err2 })
                        } else {
                            connection.release();
                            res.send({ status: true, message: 'User deleted Successfully!' })
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: 'User not deleted Successfully!' })
        }
    } else {
        res.send({ status: false, message: 'You are not authenitcated to perform this operation' })
    }
})


UserController.get('/get', async(req, res) => {
    const data = req.body;
    const token = req.headers.token;

    const tokenData = jwt.verify(token, PRIVATEKEY);
    if (tokenData.role == 'admin' || tokenData.role == 'hr') {
        if (data.username) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    connection.release();
                    res.send({ status: false, message: err })
                } else {
                    connection.query('SELECT * FROM user', (err2, result2) => {
                        if (err2) {
                            connection.release();
                            res.send({ status: false, message: err2 })
                        } else {
                            connection.release();
                            res.send({ status: true, message: 'Users fetched successfully!', result2 })
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: 'Error while fetching Users' })
        }
    } else {
        res.send({ status: false, message: 'You are not authenitcated to perform this operation' })
    }
})

module.exports = UserController;