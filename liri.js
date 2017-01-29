var Twitter = require('twitter');
var apiKey = require('./keys.js');
console.log(apiKey.twitterKeys.consumer_key);

/* var fs = require("fs");

fs.readFile("./keys.js", "utf8", function(err, data){

	console.log(data);
	var myArr = data.split(",");
	
	for (var i=0; i < myArr.length; i++){
		console.log(myArr[i]);
	}
});
*/
var client = new Twitter({
  consumer_key: apiKey.twitterKeys.consumer_key,
  consumer_secret: apiKey.twitterKeys.consumer_secret,
  access_token_key: apiKey.twitterKeys.access_token_key,
  access_token_secret: apiKey.twitterKeys.access_token_secret
});

var params = {screen_name: 'coderSun'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});