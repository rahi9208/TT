let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	let response = {
		"isBase64Encoded": false,
		"statusCode": 200,
		"headers": {
			"Access-Control-Allow-Origin": "*"
		},
		"body": ""
	}

	ddb.get({
		TableName: 'mypeople',
		Key: { 'username': event.queryParameters.username }
	}, function (err, data) {
	
		if (err) {
			response.body = "Error in fetching user with username";
		} else {
			response.body = JSON.stringify(data.Item);
		}
		callback(null, response);
	});



}