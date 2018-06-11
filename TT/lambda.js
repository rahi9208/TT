let AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();
const validateJS = require('validate.js');
exports.handler = function (event, context, callback) {

	let image = Buffer.from(event.image.replace("data:image/jpeg;base64,", ""), "base64");


	let validation = validateJS(event, { age: { numericality: true } });

	if (validation) {
		console.error("Validation failure");
		callback(null,JSON.stringify(validation));
	}


	ddb.put({
		TableName: 'mypeople',
		Item: { 'username': event.username, 'firstName': event.firstName, 'lastName': event.lastName, 'age': event.age }
	}, function (err, data) {
		if (err) {
			callback("Error in saving to db", null);
		} else {
			s3.putObject({
				"Body": image,
				"Bucket": "testxyz.abc.slapp.food",
				"Key": event.username + ".jpg",
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
		}
	});

}