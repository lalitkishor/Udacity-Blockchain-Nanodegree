var express = require("express");
var route = require('./route.js');
let blockchain = require('./simpleChain.js');
let bodyParser = require('body-parser');

var app = express(); // create object
app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
    extended: true
  })); 
// call route
route(app);
var server = app.listen(8000,function(){
    console.log("blockchain server is runnig on port :-",server.address().port);
});