var request 	= 	require('request');
var apiConfig 	=	require('./../config/apiConfig.json'); 
var msgConfig	= 	require('./../config/menusMsgConfig.json');
var responses	=	require('./../responses/response.js');
var zones	=	require('./../utilities/timezones.json');
var config 	=	require('./../config/config.js');
var apiCalls = {};

apiCalls.sendSms = function(msgBody,msgTo){	
	return new Promise(function(resolve, reject){
		const accountSid = config.accountSid; 
		const authToken = config.authToken; 
		const client = require('twilio')(accountSid, authToken); 
		 
		client.messages 
			  .create({ 
				 body: msgBody, 
				 from: '+16573065348',       
				 to: msgTo 
			   }) 
			  .then(
				  message => {
					  console.log(message.sid)
					  resolve(message.sid);
				  }
				) 
			  .done();
	});	
}

module.exports = apiCalls;