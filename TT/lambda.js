let AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	console.log("Request received", event);

	let image = Buffer.from(event.image, "base64");

	ddb.put({
		TableName: 'mypeople',
		Item: { 'username': event.username, 'firstName': event.firstName, 'lastName': event.lastName, 'age': event.age }
	}, function (err, data) {
		s3.putObject({
			"Body": image,
			"Bucket": "testxyz.abc.slapp.food",
			"Key": event.username,
			"ACL": "public-read"
		})
			.promise()
			.then(data => {
				console.log(data);           // successful response
				callback(null, data);
			})
			.catch(err => {
				console.log(err, err.stack); // an error occurred
				callback(err, null);
			});

	});

}