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
		Key: { 'username': event.queryStringParameters.username }
	}, function (err, data) {
		if (err) {
			response.statusCode = 500;
			response.body = "Error in fetching user with username";
		} else {
			if (data.Item) {
				data.Item.image = process.env["IMAGE_BUCKET"] + "/" + data.Item.username + ".jpg";
				response.body = JSON.stringify(data.Item);
			} else {
				response.statusCode = 404;
				response.body = "No such user";
			}
		}
		callback(null, response);
	});



}