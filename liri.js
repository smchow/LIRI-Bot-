var Twitter = require('twitter');
var apiKey = require('./keys.js');
var spotify = require('spotify');
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");



/*Title of the movie.
Year the movie came out.
IMDB Rating of the movie.
Country where the movie was produced.
Language of the movie.
Plot of the movie.
Actors in the movie.
Rotten Tomatoes Rating.
Rotten Tomatoes URL.*/


 var getmovieInfo = function(movieStr,callback){ request("http://www.omdbapi.com/?t="+ movieStr+"&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {
       var movieInfo = '';
       console.log(movieStr);
     // If the request is successful (i.e. if the response status code is 200)
     if (!error && response.statusCode === 200) {
 
       // Parse the body of the site and recover just the imdbRating
       // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
         movieInfo += "\nThe movie's title is: " + JSON.parse(body).Title;
         movieInfo += "\nThe movie's was made in: " + JSON.parse(body).Year;
         movieInfo += "\nThe movie's rating is: " + JSON.parse(body).imdbRating;
         movieInfo += "\nThe movie's country is: " + JSON.parse(body).Country;
         movieInfo += "\nThe movie's language is: " + JSON.parse(body).Language;
         movieInfo += "\nThe movie's plot is: " + JSON.parse(body).Plot;
         movieInfo += "\nThe movie's actors is: " + JSON.parse(body).Actors;
         movieInfo += "\nThe movie's rotten tomatoes rating is: " + JSON.parse(body).tomatoRating;
         movieInfo += "\nThe movie's rotten tomatoes url is: " + JSON.parse(body).tomatoURL;
         fs.appendFile('./log.txt', movieInfo);
         callback(movieInfo) ;
     }
 });
}

var searchSong = function(actStr, callback){
    console.log('in search song' + actStr + "  ");
    if (actStr =="") {actStr = "The Sign"};
    spotify.search({ type: 'track', query: actStr }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    /*Artist(s)
    The song's name
    A preview link of the song from Spotify
    The album that the song is from*/
    //for (var i =0 ; i < data.tracks.items.length; i++){
      var songStr = data.tracks.items[0].name + " " 
          + data.tracks.items[0].album.name + " " + data.tracks.items[0].preview_url 
          + " " + data.tracks.items[0].artists[0].name ;
          console.log(songStr)
        callback(songStr) ;
    //}
    
});
}


var displayInfo = function(myStr){
  console.log( myStr);
  //return myStr;
};


// Create a "Prompt" with a series of questions.
inquirer.prompt([
   {
    type: "list",
    message: "Which option do you choose?",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "liriCmd"
  },

  // Here we create a basic text prompt.
  {
    type: "input",
    message: "Please enter the name of the song/movie (if applicable)?",
    name: "name"
  }


  // Here we give the user a list to choose from.
 
  // Here we ask the user to confirm.


// Once we are done with all the questions... "then" we do stuff with the answers
// In this case, we store all of the answers into a "user" object that inquirer makes for us.
]).then(function(user) {
  //console.log(user);
  var action = "";
  var actStr = '';//yellow submarine';

  // If we log that user as a JSON, we can see how it looks.
  console.log(JSON.stringify(user, null, 2));
  action = user.liriCmd;
    actStr = user.name;
  if (user.liriCmd == "do-what-it-says"){
    fs.readFile("./random.txt", "utf8", function(err, data) {

     console.log(data);
     var myArr = data.split(",");
     action = myArr[0];
     actStr = myArr[1];
     console.log(actStr);
    });
  }
  //["", , ""
  console.log(actStr +  "** actStr **" + action  +  "** action **");
  fs.appendFile('./log.txt', "** actStr **" + action  +  "** action **");
  // If the user confirms, we displays the user's name and pokemon from the answers.
  if (action == "spotify-this-song"){

      searchSong(actStr,displayInfo);

  }

  if (action == "movie-this"){
     if (actStr == "") actStr = "Mr+Nobody";
     getmovieInfo(actStr,displayInfo);
      //console.log(myMovie);
  }



 

if (action == "my-tweets"){
  var client = new Twitter({
  consumer_key: apiKey.twitterKeys.consumer_key,
  consumer_secret: apiKey.twitterKeys.consumer_secret,
  access_token_key: apiKey.twitterKeys.access_token_key,
  access_token_secret: apiKey.twitterKeys.access_token_secret
});

var params = {screen_name: 'coderSun'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets.length);
    for (var i = 0 ; i < tweets.length; i++ ){
      console.log(tweets[i].text + " " + tweets[i].created_at);
      fs.appendFile('./log.txt', tweets[i].text + " " + tweets[i].created_at + "\n");
    }
  }

  
});
}

});