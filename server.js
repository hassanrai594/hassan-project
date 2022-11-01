const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const es6Renderer = require('express-es6-template-engine');



// ------ Initializing Middle-Ware ------ //
const PORT = 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Setting Templating Engine
app.engine('html', es6Renderer);
// Defining Directory that contains all templates
app.set('views', 'templates');
app.set('view engine', 'html');
// -------------------------------------- //


// ----------- Importing Controlelrs -----------//
var verifyRoutes = require("./controllers/verifyToken");
var userRoutes = require("./controllers/userControllers");
var loomRoutes = require("./controllers/loomControllers");
var employRecordRoutes = require("./controllers/employRecordsController");

// -------------------------------------------- //



// Initializing different Routes with base Apis //
app.use('/verify', verifyRoutes);
app.use('/user', userRoutes);
app.use('/loom', loomRoutes);
app.use('/emprec', employRecordRoutes);


// Starting server
app.listen(PORT, function() {
    console.log(`Server Up at http://localhost:${PORT}`);
});