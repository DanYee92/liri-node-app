var env=require("dotenv").config();


var keys = require("./keys.js");
var fs = require("fs");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//the first argument takes in the function or action to running
//the second argument takes in the value or parameter of the function
var action=process.argv[2];
var value=process.argv[3];

//the switch statement will direct which function gets run
switch (action) {
  case "my-tweets":
  tweetSearch();
  break;

  case "spotify-this-song":
  songSearch();
  break;

  case "movie-this":
  movieSearch();
  break;

  case "do-what-it-says":
  lotto();
  break;
}

function tweetSearch(){
  var params = {screen_name: 'LIRI_Trilogy',
  count:20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log("=========My Twitter=========");
      for(var i=0;i<=19;i++){
        console.log("Tweet: "+ tweets[i].text);
        console.log("Creation Date: " + tweets[i].created_at);
    }
  }
    else {
      throw error
  }
});
}

function songSearch(){
  if(process.argv.length>=4|| typeof value==="string"){
    spotify.search({ type: 'track', query: value }, function(err, data) {
        if (!err) {
        console.log("======Spotify======");
          displaySpotify(data);
          }
          else{

            throw err;
          }
        });
  }
  else if(process.argv.length < 4) {
              //Displays default song data
              spotify.search({type:'track', query: "The Sign Ace of Base" }, function(err, data){
                  //if there is no error then...
                  if(!err) {
                    //Display spotify data to terminal
                    console.log("======Spotify======");
                    displaySpotify(data);
                  }

                  else {
                    throw err;
                  }
            });
        }
}

function displaySpotify(data){
      var artists = data.tracks.items[1].artists[0].name;
      var album = data.tracks.items[1].album.name;
      var songPreview = data.tracks.items[1].external_urls.spotify;
      var track = data.tracks.items[1].name;
      //Testing
      // console.log(JSON.stringify(data['tracks']['items'][1]['name'] ,null, 1));
      console.log('Artist: ' + artists);
      console.log('Track: ' + track);
      console.log('Album: ' + album);
      console.log('Song Preview: ' + songPreview);
}



// This line is just to help us debug against the actual URL.

function movieSearch(){
console.log("=========Movie Info=========");
  if(process.argv.length>=4 ){

request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    displayMovie(body);
  }
  else {
    throw err;
  }
})
}
else if(process.argv.length < 4) {
            //Displays default song data
            request("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy", function(error, response, body) {

              // If the request is successful
              if (!error && response.statusCode === 200) {

                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                displayMovie(body);
              }
              else {
                throw err;
              }
            })
      }

}

function displayMovie(body){
  var movieTitle=JSON.parse(body).Title;
  var movieYear=JSON.parse(body).Year;
  var movieImdb=JSON.parse(body).Ratings[0].Value;
  var movieRotten=JSON.parse(body).Ratings[1]["Value"];
  var movieCountry=JSON.parse(body).Country;
  var movieLanguage=JSON.parse(body).Language;
  var moviePlot=JSON.parse(body).Plot;
  var movieCast=JSON.parse(body).Actors;
  console.log("Title: " +movieTitle);
  console.log("Year Released: " +movieYear);
  console.log("IMDB Rating: " +movieImdb);
  console.log("Rotten Tomatoes Score: " +movieRotten);
  console.log("Country: " +movieCountry);
  console.log("Language: " +movieLanguage);
  console.log("Plot: " +movieTitle);
  console.log("Cast: " +movieCast);
}




function lotto(){
// This block of code will read from the "random.txt" file.
// It's important to include the "utf8" parameter or the code will provide stream data (garbage)
// The code will store the contents of the reading inside the variable "data"
fs.readFile("random.txt", "utf8", function(error, data){


  // If the code experiences any errors it will log the error to the console.
if(error){
  return console.log(error);
}



  // Then split it by commas (to make it more readable)
var dataSplit=data.split(",");
 action=dataSplit[0];
 value=dataSplit[1];

 switch (action) {
   case "my-tweets":
   tweetSearch();
   break;

   case "spotify-this-song":
   songSearch();
   break;

   case "movie-this":
   movieSearch();
   break;
 }

});
}
