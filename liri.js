//Require dotenv npm to link Spotify keys file
require("dotenv").config();

//Require keys.js file
var keys = require("./keys.js");

//Require request npm
var request = require("request")

//Require spotify npm
var Spotify = require('node-spotify-api');

//Save spotify key to a variable
var spotify = new Spotify(keys.spotify);

//Require moment npm
var moment = require('moment');
moment().format();

var fs = require("fs")

var nodeArgs = process.argv;
var userInput = "";
var prettyUserInput = "";

//Get user input for song/artist/movie name
//Loop starting at process.argv[3]
for (var i = 3; i < nodeArgs.length; i++) {
    //If userInput is more than 1 word
    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + "%20" + nodeArgs[i];
    }
    //If userInput is only 1 word
    else {
        userInput += nodeArgs[i];
    }
}

//Remove %20 when pushing to log.txt
for (var i = 3; i < nodeArgs.length; i++) {
    prettyUserInput = userInput.replace(/%20/g, " ");
}

var userCommand = process.argv[2];
//Switch statement for commands
function runLiri() {
    switch (userCommand) {
        case "concert-this":
            //Append userInput to log.txt
            fs.appendFileSync("log.txt", prettyUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            //Run request to bandsintown with the specified artist
            var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
            request(queryURL, function (error, response, body) {
                //If no error and response is a success
                if (!error && response.statusCode === 200) {
                    //Parse the json response
                    var data = JSON.parse(body);
                    //Loop through array
                    for (var i = 0; i < data.length; i++) {
                        //Get venue name
                        console.log("Venue: " + data[i].venue.name);
                        //Append data to log.txt
                        fs.appendFileSync("log.txt", "Venue: " + data[i].venue.name + "\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                        //Get venue location
                        //If statement for concerts without a region
                        if (data[i].venue.region == "") {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
                            //Append data to log.txt
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });
                        } else {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
                            //Append data to log.txt
                            fs.appendFileSync("log.txt", "Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country + "\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });
                        }
                        //Get date of show
                        var date = data[i].datetime;
                        date = moment(date).format("MM/DD/YYYY");
                        console.log("Date: " + date)
                        //Append data to log.txt
                        fs.appendFileSync("log.txt", "Date: " + date + "\n----------------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                        console.log("----------------")
                    }
                }
            });
            break;
        case "spotify-this-song":
            //If statement for no song provided
            if (!userInput) {
                userInput = "The%20Sign";
                prettyUserInput = userInput.replace(/%20/g, " ");
            }
            //Append userInput to log.txt
            fs.appendFileSync("log.txt", prettyUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            spotify.search({
                type: "track",
                query: userInput
            }, function (err, data) {
                if (err) {
                    console.log("Error occured: " + err)
                }
                //Assign data being used to a variable
                var info = data.tracks.items
                // console.log(info);
                //Loop through all the "items" array
                for (var i = 0; i < info.length; i++) {
                    //Store "album" object to variable
                    var albumObject = info[i].album;
                    var trackName = info[i].name
                    var preview = info[i].preview_url
                    //Store "artists" array to variable
                    var artistsInfo = albumObject.artists
                    //Loop through "artists" array
                    for (var j = 0; j < artistsInfo.length; j++) {
                        console.log("Artist: " + artistsInfo[j].name)
                        console.log("Song Name: " + trackName)
                        console.log("Preview of Song: " + preview)
                        console.log("Album Name: " + albumObject.name)
                        console.log("----------------")
                        //Append data to log.txt
                        fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " + albumObject.name + "\n----------------\n", function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                    }
                }
            })
            break;
        case "movie-this":
            //If statement for no movie provided
            if (!userInput) {
                userInput = "Mr%20Nobody";
                prettyUserInput = userInput.replace(/%20/g, " ");
            }
            //Append userInput to log.txt
            fs.appendFileSync("log.txt", prettyUserInput + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            //Run request to OMDB
            var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("IMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)
                    //Append data to log.txt
                    fs.appendFileSync("log.txt", "Title: " + info.Title + "\nRelease Year: " + info.Year + "\nIMDB Rating: " + info.Ratings[0].Value + "\nRotten Tomatoes Rating: " +
                        info.Ratings[1].Value + "\nCountry: " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n----------------\n",
                        function (error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                }
            });
            break;
    }
}

if (userCommand == "do-what-it-says") {
    var fs = require("fs");
    //Read random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        //Split data into array
        var textArr = data.split(",");
        userCommand = textArr[0];
        userInput = textArr[1];
        prettyUserInput = userInput.replace(/%20/g, " ");
        runLiri();
    })
}

runLiri();