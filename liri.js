var Twitter = require('twitter');
var apiKey = require('./keys.js');
var spotify = require('spotify');
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");

var logFile = "./log.txt";

var getmovieInfo = function(movieStr, callback) {
    request("http://www.omdbapi.com/?t=" + movieStr + "&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {
        var movieInfo = '';
        //console.log(movieStr);
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            movieInfo += "\nThe movie's title is: " + JSON.parse(body).Title;
            movieInfo += "\nThe movie's was made in: " + JSON.parse(body).Year;
            movieInfo += "\nThe movie's rating is: " + JSON.parse(body).imdbRating;
            movieInfo += "\nThe movie's country is: " + JSON.parse(body).Country;
            movieInfo += "\nThe movie's language is: " + JSON.parse(body).Language;
            movieInfo += "\nThe movie's plot is: " + JSON.parse(body).Plot;
            movieInfo += "\nThe movie's actors is: " + JSON.parse(body).Actors;
            movieInfo += "\nThe movie's rotten tomatoes rating is: " + JSON.parse(body).tomatoRating;
            movieInfo += "\nThe movie's rotten tomatoes url is: " + JSON.parse(body).tomatoURL;
            fs.appendFile(logFile, movieInfo);
            callback(movieInfo);
        }
    });
}

var getTweetInfo = function(callback) {
    var client = new Twitter({
        consumer_key: apiKey.twitterKeys.consumer_key,
        consumer_secret: apiKey.twitterKeys.consumer_secret,
        access_token_key: apiKey.twitterKeys.access_token_key,
        access_token_secret: apiKey.twitterKeys.access_token_secret
    });

    var params = { screen_name: 'coderSun' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var myTweets = "List of tweets: \n";
            for (var i = 0; i < tweets.length; i++) {
                 myTweets +=    "\n" + tweets[i].text + " - Tweeted at: " + tweets[i].created_at;
                fs.appendFile(logFile, myTweets);
            }
            callback(myTweets);
        }
    });

}

var searchSong = function(actStr, callback) {
    console.log('in search song' + actStr + "  ");
    if (actStr == "") { actStr = "The Sign" };
    spotify.search({ type: 'track', query: actStr }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        //for (var i =0 ; i < data.tracks.items.length; i++){
        var songStr = "\n Name of the song: " + data.tracks.items[0].name + "\nName of the album: " 
        + data.tracks.items[0].album.name + "\nPreview URL: " + data.tracks.items[0].preview_url 
        + "\nName of the Artist: " + data.tracks.items[0].artists[0].name;
        fs.appendFile(logFile, songStr);
        callback(songStr);
        //}

    });
}

var actOnRequest = function(actStr, action) {
    fs.appendFile(logFile, actStr + "** actStr **" + action + "** action **");
    fs.appendFile('./log.txt', actStr + "** actStr **" + action + "** action **");
    // If the user confirms, we displays the user's name and pokemon from the answers.
    if (action == "spotify-this-song") {
        searchSong(actStr, displayInfo);
    }

    if (action == "movie-this") {
        if (actStr == "") actStr = "Mr+Nobody";
        getmovieInfo(actStr, displayInfo);
    }

    if (action == "my-tweets") {
        getTweetInfo(displayInfo);
    }
}

var displayInfo = function(myStr) {
    console.log(myStr);
};

// Create a "Prompt" with a series of questions.
inquirer.prompt([{
        type: "list",
        message: "Which option do you choose?",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "liriCmd"
    },

    {
        type: "input",
        message: "Please enter the name of the song/movie (if applicable)?",
        name: "name"
    }

    // Once we are done with all the questions... "then" we do stuff with the answers
]).then(function(user) {
    //console.log(user);
    var action = "";
    var actStr = ''; 
    fs.appendFile(logFile, "\n****************New Request ***************\n");
    //console.log(JSON.stringify(user, null, 2));
    action = user.liriCmd;
    actStr = user.name;
    if (user.liriCmd == "do-what-it-says") {
        fs.readFile("./random.txt", "utf8", function(err, data) {
            var myArr = data.split(",");
            action = myArr[0];
            actStr = myArr[1];
            actOnRequest(actStr, action);
        });
    } else {
        actOnRequest(actStr, action);
    }
   
});
