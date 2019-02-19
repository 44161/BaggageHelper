var express 		= require('express');
var bodyParser 		= require('body-parser');
var routes			= require('./routes/routes.js');

var app 			= express();

var session			= require('express-session');

var port = process.env.PORT || 3002;


//global.recentInput = "";

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());


app.use(routes);



 app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,X-Frame-Options, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var server = app.listen(port,function(){
	console.log("Application started listening port "+port);		
});


