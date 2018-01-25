//File System
const fs = require("fs");

//Get Packages and Keys
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const keys = require('./keys.js');


//arguments
let useAPI = process.argv[2];
let search = process.argv[3];

//
switch (useAPI) {
  case 'my-tweets':
    readTweets();
    break;

  case 'spotify-this-song':
  	if (search === '') {
  		search = 'the sign'
  	}
    spotifySong(search);
    break;

  case 'movie-this':
    omdbMovie(search);
    break;

  case 'do-what-it-says':
    useFile();
    break;
}

// -----------------------
// Funcitons 
// -----------------------

// function that will grab and print the 20 most recent tweets
function readTweets(){
	// console.log(keys.twitterKeys);
	let client = new Twitter (keys.twitterKeys);
	let params = {screen_name: '@Ian94875625'};
		
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
  			if (!error) {
    			for (let i = 0; i < 20; i++) {
    				console.log(tweets[i].text);
    			}
    			
  			}
		});

}

// fucntion to use stotify to get song info
function spotifySong(song){
 	// console.log(keys.spotifyKeys);
	let spotify = new Spotify(keys.spotifyKeys);
	console.log(song);
	 
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  	if (err) {
	    	return console.log('Error occurred: ' + err);
	  	}
	  	else {
		  	// console.log(data.tracks.items[0]);
		  	//ARTISTS
		  	for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
		  		console.log(data.tracks.items[0].artists[i].name);
		  	};
		    //SONG NAME
		 	console.log(data.tracks.items[0].name);
		 	//PREVIEW LINK
		 	console.log(data.tracks.items[0].external_urls.spotify);
		 	//ALBUM NAME
		 	console.log(data.tracks.items[0].album.name); 
		}
});

}

function omdbMovie(movie){

	let search = spaceReplace(movie);
	request(`http://www.omdbapi.com/?t=${search}&apikey=trilogy`, function(error, response, body) {

	  // If there were no errors and the response code was 200 (i.e. the request was successful)...
	  if (!error && response.statusCode === 200) {

	    // Print
	    // console.log(JSON.parse(body));
	    console.log(JSON.parse(body).Title);
	    console.log(JSON.parse(body).Year);
	    console.log(JSON.parse(body).imdbRating);
	    console.log(JSON.parse(body).Ratings[1].Value);
	    console.log(JSON.parse(body).Country);
	    console.log(JSON.parse(body).Language);
	    console.log(JSON.parse(body).Actors);


	  }
	});

}

function useFile(){
	fs.readFile('random.txt', 'utf8', function(err, data) {

	    if (err) {
	      	console.log(err);
	    }
	    else {
	      	// console.log(data);
	      	let holder = data.split('"');
	      	// console.log(holder[1]);
	      	let search = holder[1];
	      	spotifySong(search);
	    }
	});
}

function spaceReplace(input){
	return input.split(' ').join('+');
}
