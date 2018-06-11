let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	console.log("Request received", event);
	ddb.put({
		TableName: 'mypeople',
		Item: { 'username': event.username, 'firstName': event.firstName, 'lastName': event.lastName, 'age': event.age }
	}, function (err, data) {
		callback(err, data);
	});

}