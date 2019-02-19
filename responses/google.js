var config = require('./../config/config.json');
var menuConfig = require('./../config/menusMsgConfig.json');

var responses = {
	simpleResponse : function(intentName,type){
			var resp = JSON.parse(JSON.stringify(config.responseObj));			
			resp.data.google.richResponse.items = [
				  {
					"simpleResponse": {
					  "displayText": menuConfig[intentName][type],
					  "textToSpeech":menuConfig[intentName][type]
					}
				  }				  						
			];
			resp.data.google.richResponse.suggestions =	menuConfig[intentName].chips;			
		console.log(JSON.stringify(resp));
		return resp;
	},
	generateResponse:function(res){
		console.log(JSON.stringify(res));
		return new Promise(function(resolve, reject){
			var resp = JSON.parse(JSON.stringify(config.responseObj));
			simpleResp(resp, res)
			.then(function(result){
				console.log(' resp from simple resp ',JSON.stringify(result.resp));
				return basicCardResp(result.resp, result.res);	
			})
			.then(function(result){
				console.log('resp from basicCars',JSON.stringify(result.resp));				
				return listResp(result.resp, result.res)
			})
			.then(function(result){
				console.log('final result',JSON.stringify(result.resp));
				chip = 'mainIntent';
				if(typeof(result.res.intent)!='undefined'&&typeof(result.res.chipType)!='undefined'){
					console.log('intent chip',result.res.intent,result.res.chipType);	
					resp.data.google.richResponse.suggestions = menuConfig[result.res.intent][result.res.chipType]
				}else if(typeof(result.res.intent)!='undefined'){
					resp.data.google.richResponse.suggestions = menuConfig[result.res.intent].chips
				}else{
					resp.data.google.richResponse.suggestions = menuConfig[chip].chips
				}					
				resolve(result.resp);
			})
			.catch(function(err){
				reject(responses.simpleResponse('mainIntent'));
			})
		})
	}
}

var simpleResp = function(responseObj, res){
	return new Promise(function(resolve, reject){
		console.log('res.simpleResponse',res.simpleResponse);
		if(res.simpleResponse){
			console.log('inside if');
			res.simpleResponse.forEach(function(simResp){
				console.log(JSON.stringify(simResp));
				responseObj.data.google.richResponse.items.push({simpleResponse:simResp});	
			})
			resolve({"resp":responseObj,"res":res});	
		}else{
			resolve({"resp":responseObj,"res":res});
		}	
	})
}

var listResp = function(responseObj, res){
	return new Promise(function(resolve, reject){
		console.log('list resp list ', JSON.stringify(res));
		if(res.list){
			responseObj.data.google.systemIntent = {
				"intent": "actions.intent.OPTION",
				"data": {
					"@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
					"listSelect": {
					  "title": res.list.title,
					  "items": res.list.items
					}
				}
			}
			resolve({"resp":responseObj,"res":res});
		}else{
			console.log('list resp obj',JSON.stringify(responseObj));
			resolve({"resp":responseObj,"res":res});
		}	
	});
}

var basicCardResp = function(responseObj, res){
	return new Promise(function(resolve, reject){
		console.log(res.basicCard);
		if(res.basicCard){
			console.log('inside card');
			var bCard = {"basicCard": {}};
			if(res.basicCard.title&&res.basicCard.formattedText){
				bCard.basicCard.title = res.basicCard.title,				
				bCard.basicCard.formattedText = res.basicCard.formattedText
				if(res.basicCard.image){
					bCard.basicCard.image = {};
					if(res.basicCard.image.url){
						bCard.basicCard.image.url = res.basicCard.image.url;
						bCard.basicCard.image.imageDisplayOptions = "CROPPED";
					}
					if(res.basicCard.image.text){
						bCard.basicCard.image.accessibilityText = res.basicCard.image.text;
					}
				}
				if(res.basicCard.buttons){
					bCard.basicCard.buttons=[];
					res.basicCard.buttons.forEach(function(button){
						if(button.title&&button.url){
							bCard.basicCard.buttons.push({title:button.title,"openUrlAction": {"url":button.url}})		
						}
					})
				}
				responseObj.data.google.richResponse.items.push(bCard);
				resolve({"resp":responseObj,"res":res});
			}else{
				resolve({"resp":responseObj,"res":res});
			}				
		}else{
			resolve({"resp":responseObj,"res":res});
		}
	});
}

	
module.exports = responses