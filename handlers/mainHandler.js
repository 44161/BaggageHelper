var config 		=	require('./../config/config.json');
var msgConfig	=	require('./../config/menusMsgConfig.json');
var responses	=	require('./../responses/response.js');
var apiCall		=	require('./../apis/apiCall.js');
const request = require('request'),
configJs = require('./../config/config.js')
var mainHandler = {};
var isTicketRaised,isFirstSMSsent,isSecondSMSsent,isThirdSmsSent = false;

mainHandler.mainIntent = function(req){
	return new Promise(function(resolve, reject){
		//console.log(' req.src',req.src);
		if(isTicketRaised&&isFirstSMSsent)
			resolve(responses[req.originalRequest.source].simpleResponse('mainIntent',"trackingBaggage"));
		else if(isTicketRaised&&isSecondSMSsent)			
			resolve(responses[req.originalRequest.source].simpleResponse('mainIntent',"baggageFound"));
		else if(isTicketRaised&&isThirdSmsSent){
			setTimeout(function(){
				isTicketRaised = false;
				isFirstSMSsent = false;
				isSecondSMSsent = false;
				isThirdSmsSent=false;
				}, 10000)
			resolve(responses[req.originalRequest.source].simpleResponse('mainIntent',"baggageReached"));
		}
		else
		resolve(responses[req.originalRequest.source].simpleResponse('mainIntent',"greeting"));
	});
}

mainHandler.baggageMiss = function(req){
	return new Promise(function(resolve, reject){
		console.log(' req.src',req.originalRequest.source);
		/*if(isTicketRaised)
			resolve(responses[req.originalRequest.source].simpleResponse('baggageMiss',"baggageMissExistingMsg"));
		else*/
			resolve(responses[req.originalRequest.source].simpleResponse('baggageMiss',"baggageMissInitialMsg"));
	});
}

mainHandler.getPNR = function(req){
	return new Promise(function(resolve, reject){
		console.log(' req.src',req.originalRequest.source);
		resolve(responses[req.originalRequest.source].simpleResponse('getPNR',"getPNRMsg"));
	});
}

/*mainHandler.getBaggageNumber = function(req){
	return new Promise(function(resolve, reject){
		console.log(' req.src',req.originalRequest.source);
		resolve(responses[req.originalRequest.source].simpleResponse('getBaggageNumber',"getBaggageNumberMsg"));
	});
}

mainHandler.getBaggageDescription = function(req){
	return new Promise(function(resolve, reject){
		console.log(' req.src',req.originalRequest.source);
		resolve(responses[req.originalRequest.source].simpleResponse('getBaggageDescription',"getBaggageDescriptionMsg"));
	});
}*/

mainHandler.getBaggageyes = function(req){
	console.log('getBaggageDescriptionyes',JSON.stringify(req));
	return new Promise(function(resolve, reject){ 
		var resp = JSON.parse(JSON.stringify(config.responseObj));
		var params = {};
		const header = {
			'Cache-Control': 'no-cache',
			Accept: 'application/json',
			'Content-Type': 'application/json'
		  };
		console.log('contexts',req.result.contexts);
		req.result.contexts.forEach(function(context){
			if(context.name == 'baggagemiss'){
				var str = context.parameters;
				console.log(str);
				params = {
					u_pnr: str.pnrNumber,
					u_baggage_number: str.baggageNumber,
					u_baggage_description: str.description
				};
				
			}
		})

		var options = {
			url: 'https://dev67351.service-now.com/api/now/table/u_baggage_logger',
			method: 'POST',
			header: header,
			body: params,
			json: true,
			auth: {
			  user: configJs.serviceNowUserName,
			  password: configJs.serviceNowPassword
			}
		  };
		  console.log('Options::',options);
		  request(options, function (error, response, body) {
			if (error) {
				  console.log('API ERROR', JSON.stringify(error));
				  resp.data.google.richResponse.items = [
					{
					  "simpleResponse": {
						"displayText": "Oops! Looks like there is some technical glitch ! Please come back in a while, Sorry for the inconvenience ☹",
						"textToSpeech":"Oops! Looks like there is some technical glitch ! Please come back in a while, Sorry for the inconvenience ☹"
					  }
					}				  						
			  ];
			  resolve(resp);			  
			} else {
			  console.log('Body',body);	
			  isTicketRaised = true;
			  console.log('configJs.msgTo:',configJs.msgTo);
			  setTimeout(apiCall.sendSms, 10000, 'Hi Ms. Gloria, We are trying our best to locate your baggage. Will keep you posted of the progress.For more details call our help center @ +1 802-449-6978  ',configJs.msgTo);
			  isFirstSMSsent = true;
			  resp.data.google.richResponse.items = [
					{
					  "simpleResponse": {
						"displayText": "Your claim is filed and the refernce# is "+ body.result.u_number +".\n While the average time to locate is 2 days, we'll do our best to locate it at the earliest.\n Sorry for the inconvenience! We'll keep you updated of the status through SMS",
						"textToSpeech":"Your claim is filed and the refernce number is "+ body.result.u_number +".\n While the average time to locate is 2 days, we'll do our best to locate it at the earliest.\n Sorry for the inconvenience! We'll keep you updated of the status through SMS"
					  }
					}				  						
			  ];
			  resolve(resp);
			}
		  });
		      
        
		
	});	
}

mainHandler.getBaggageno = function(req){
	console.log('getBaggageno',JSON.stringify(req));
	return new Promise(function(resolve, reject){ 
		var resp = JSON.parse(JSON.stringify(config.responseObj));
		var params = {};
		const header = {
			'Cache-Control': 'no-cache',
			Accept: 'application/json',
			'Content-Type': 'application/json'
		  };
		console.log('contexts',req.result.contexts);
		req.result.contexts.forEach(function(context){
			if(context.name == 'baggagemiss'){
				var str = context.parameters;
				console.log(str);
				params = {
					u_pnr: str.pnrNumber,
					u_baggage_number: str.baggageNumber,
					u_baggage_description: str.description
				};
				
			}
		})

		var options = {
			url: 'https://dev67351.service-now.com/api/now/table/u_baggage_logger',
			method: 'POST',
			header: header,
			body: params,
			json: true,
			auth: {
			  user: configJs.serviceNowUserName,
			  password: configJs.serviceNowPassword
			}
		  };
		  console.log('Options::',options);
		  request(options, function (error, response, body) {
			if (error) {
				  console.log('API ERROR', JSON.stringify(error));
				  resp.data.google.richResponse.items = [
					{
					  "simpleResponse": {
						"displayText": "Oops! Looks like there is some technical glitch ! Please come back in a while, Sorry for the inconvenience ☹",
						"textToSpeech":"Oops! Looks like there is some technical glitch ! Please come back in a while, Sorry for the inconvenience ☹"
					  }
					}				  						
			  ];
			  resolve(resp);			  
			} else {
			  console.log('Body',body);	
			  isTicketRaised = true;
			  isFirstSMSsent = true;		 			
			  resp.data.google.richResponse.items = [
					{
					  "simpleResponse": {
						"displayText": "Your claim is filed and the refernce# is "+ body.result.u_number +".\n While the average time to locate is 2 days, we'll do our best to locate it at the earliest.\n Sorry for the inconvenience! We'll keep you updated of the status through SMS/email - along with the instructions to update your current phone number",
						"textToSpeech":"Your claim is filed and the refernce# is "+ body.result.u_number +".\n While the average time to locate is 2 days, we'll do our best to locate it at the earliest.\n Sorry for the inconvenience! We'll keep you updated of the status through SMS/email - along with the instructions to update your current phone number."
					  }
					}				  						
			  ];
			  resolve(resp);
			}
		  });
		      
        
		
	});	
}

mainHandler.telephonythankIntent = function(req){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			apiCall.sendSms('Hi Ms. Gloria, Good News! Your baggage has been located. It will reach Heathrow on or before tomorrow.',configJs.msgTo)
			isSecondSMSsent = true;
			isFirstSMSsent = false;	
		}, 10000);
		setTimeout(function(){
			apiCall.sendSms('Hi Ms. Gloria, we are happy to inform you that your baggage has arrived Heathrow airport. You can collect it from the airport between 9 AM to 9 PM. Please carry your passport, boarding pass and baggage tag along with you for customs verification.',configJs.msgTo)
			isSecondSMSsent = false;
			isThirdSmsSent = true;	
		}, 60000);		
		resolve(true);
		
	});
}
mainHandler.baggageStatus = function(req){
	return new Promise(function(resolve, reject){
		//console.log(' req.src',req.src);
		if(isTicketRaised&&isFirstSMSsent)
			resolve(responses[req.originalRequest.source].simpleResponse('baggageStatus',"trackingBaggage"));
		else if(isTicketRaised&&isSecondSMSsent)			
			resolve(responses[req.originalRequest.source].simpleResponse('baggageStatus',"baggageFound"));
		else if(isTicketRaised&&isThirdSmsSent)
			resolve(responses[req.originalRequest.source].simpleResponse('baggageStatus',"baggageReached"));
		else
		resolve(responses[req.originalRequest.source].simpleResponse('baggageStatus',"greeting"));
	});
}

mainHandler.cancelMeetingFollowupYes = function(req, token){
	console.log('cancelMeetingFollowupYes',JSON.stringify(req));
	return new Promise(function(resolve, reject){
		var params = meetingDetails;
		if(typeof(params.sno)!='undefined' || params.sno == '')
			params.sno = 0;
		return apiCall.cancelMeeting(token,params)
		.then(function(result){
			if(result == 204)
				{
					console.log(responses[req.src].simpleResponse('cancelMeetingSuccess',"successMsg"));
					resolve(responses[req.src].simpleResponse('cancelMeetingSuccess',"successMsg"));
				}
				else{
					console.log(responses[req.src].simpleResponse('cancelMeetingError',"Msg"));
					resolve(responses[req.src].simpleResponse('cancelMeetingError',"Msg"))
				}			
		})
		.catch(function(err){
			console.log(err);
			responses[req.src].generateResponse(err)
			.then(function(result){
				resolve(result);
			})
			.catch(function(){
				reject(responses[req.src].simpleResponse('mainIntent',"defaultMsg"));		
			})			
		})
	});	
}



mainHandler.defaultIntent = function(req, token){
	return new Promise(function(resolve, reject){
		resolve(responses[req.src].simpleResponse('mainIntent',"defaultMsg"));
	});
}

module.exports = mainHandler