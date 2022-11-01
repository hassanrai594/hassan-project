const express = require('express')
const looomController = express.Router()


// middleware that is specific to this router
looomController.use((req, res, next) => {
    next();
})


// define the home page route
looomController.get('/all', (req, res) => {
    res.render("loomsPage.html" , {locals: {title: 'This is Backend Api Talking !'}} )

})

  

module.exports = looomController;