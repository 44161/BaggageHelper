var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var handler			= require("./../handlers/mainHandler.js");

router.get('/app',function(){
	console.log('Inside get APP');
})

router.post('/app',function(req,res){
	console.log(JSON.stringify(req.body));
	
	console.log('req.body.intentName ',req.body.result.metadata.intentName);
	console.log('req.body.src',req.body.originalRequest.source);
	//req.body.src= 'google';
	switch(req.body.result.metadata.intentName){
		case "Default Welcome Intent"			:	functional = handler.mainIntent;break;
		case "baggageMiss"						:	functional = handler.baggageMiss;break;
		case "baggageMiss-getPNR"				:	functional = handler.getPNR;break;
		//case "baggageMiss-getBaggageNumber"		:	functional = handler.getBaggageNumber;break;
		//case "baggageMiss-getBaggageDescription":	functional = handler.getBaggageDescription;break;
		case "baggageMiss-getPNR-yes":	functional = handler.getBaggageyes;break;	
		case "baggageMiss-getPNR-no"	:	functional = handler.getBaggageno;break;
		case "baggageStatus" :	functional = handler.baggageStatus;break;
		default								:	functional = handler.defaultIntent;break;
	}
		functional(req.body)
		.then(function(result){
			console.log('final send',JSON.stringify(result));
			res.json(result).end();		
		})
		.catch(function(err){
			console.log(err);
			res.json(err).end();
		});
	
});

router.post('/telephony',function(req,res){
	console.log(JSON.stringify(req.body));
	
	console.log('req.body.intentName ',req.body.queryResult.intent.displayName);
	//console.log('req.body.src',req.body.originalRequest.source);
	//req.body.src= 'google';
	switch(req.body.queryResult.intent.displayName){
		case "Default Welcome Intent"			:	functional = handler.mainIntent;break;
		case "thankIntent"			:	functional = handler.telephonythankIntent;break;
		default								:	functional = handler.defaultIntent;break;
	}
		functional(req.body)
		.then(function(result){
			console.log('final send',JSON.stringify(result));
			res.json(result).end();		
		})
		.catch(function(err){
			console.log(err);
			res.json(err).end();
		});
	
});

	


module.exports = router;




			