var Twitter = require('twitter');
var apiKey = require('./keys.js');
var spotify = require('spotify');
var request = require("request");


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
    console.log(tweets.length);
    for (var i = 0 ; i < tweets.length; i++ ){
      console.log(tweets[i].text + " " + tweets[i].created_at);
    }
  }
});


spotify.search({ type: 'track', query: 'yellow submarine' }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    /*Artist(s)
    The song's name
    A preview link of the song from Spotify
    The album that the song is from*/
    for (var i =0 ; i < data.tracks.items.length; i++){
      console.log(data.tracks.items[i].name + " " 
          + data.tracks.items[0].album.name + " " + data.tracks.items[0].preview_url 
          + " " + data.tracks.items[0].artists[0].name);
    }
    
});


/*Title of the movie.
Year the movie came out.
IMDB Rating of the movie.
Country where the movie was produced.
Language of the movie.
Plot of the movie.
Actors in the movie.
Rotten Tomatoes Rating.
Rotten Tomatoes URL.*/

/*"Title": "Remember the Titans",
"Year": "2000",
"Rated": "PG",
"Released": "29 Sep 2000",
"Runtime": "113 min",
"Genre": "Biography, Drama, Sport",
"Director": "Boaz Yakin",
"Writer": "Gregory Allen Howard",
"Actors": "Denzel Washington, Will Patton, Wood Harris, Ryan Hurst",
"Plot": "The true story of a newly appointed African-American coach and his high school team on their first season as a racially integrated unit.",
"Language": "English",
"Country": "USA",
"Awards": "8 wins & 17 nominations.",
"Poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BYThkMzgxNjEtMzFiOC00MTI0LWI5MDItNDVmYjA4NzY5MDQ2L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
"Metascore": "48",
"imdbRating": "7.8",
"imdbVotes": "165,591",
"imdbID": "tt0210945",
"Type": "movie",
"Response": "True"*/
//}

request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&r=json", function(error, response, body) {
    var movieInfo = '';
  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      movieInfo += "The movie's title is: " + JSON.parse(body).Title;
      movieInfo += "The movie's year is: " + JSON.parse(body).Year;
      movieInfo += "The movie's rating is: " + JSON.parse(body).imdbRating;
      movieInfo += "The movie's country is: " + JSON.parse(body).Country;
      movieInfo += "The movie's language is: " + JSON.parse(body).Language;
      movieInfo += "The movie's plot is: " + JSON.parse(body).Plot;
      movieInfo += "The movie's actors is: " + JSON.parse(body).Actors;
      movieInfo += "The movie's rating is: " + JSON.parse(body).imdbRating;
      movieInfo += "The movie's rating is: " + JSON.parse(body).imdbRating;

      console.log(movieInfo);
  }
});