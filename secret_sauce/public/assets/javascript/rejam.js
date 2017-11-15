
jQuery(function($) {
  //spotify playlist id to update widget
  var userPlaylistURI = "";
  var userPlaylistID = "";

  //array of strings used to add songs to spotify playlist
  var spotifyTrackURIs = "spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M";

  //Obtains parameters from the hash of the URL @return Object
  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();

  //set spotify access_token & refresh_token
  var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

  //check for spotify access_token, display login modal if needed
  if (error) {
    alert("There was an error during the authentication");
  } else {
    if (access_token) {
      console.log("Access Granted!");
      //valid access token, do nothing
    } else {
      //display spotify login modal
      console.log("Displaying Login Modal");
      $(".modal").modal();
      $("#loginModal").modal("open");
    }
  }

  //seach button clicked, search setlist.fm
  $("#search-button").on("click", function() {
    console.log("Search Clicked");
    var searchString = $("#artist-search").val();
    searchSetlist(searchString);
  });

  $("#api-button-1").on("click", function() {
    console.log("this works");
    var myObj = searchSpotify("radiohead+videotape", "track");
    // console.log(myObj);
  });

  document.getElementById("api-button-1").addEventListener(
    "click",
    function () {
      console.log("this works");
      var myObj = searchSpotify("radiohead+videotape", "track");
      // console.log(myObj);
    },
    false
  );

  document.getElementById("api-button-2").addEventListener(
    "click",
    function () {
      var myObj = searchSetlist("radiohead");
      // console.log(myObj);
    },
    false
  );

  var refinedJSON;
  var setlistResponse;
  var userSearch;
  var vagueJSON;
  var songsArr;
  //create an on click function for the searchButton
  $("searchButton").on("click", function () {
    //grabs the users search query
    userSearch = $("#search").text().val();
    // console.log(userSearch);
    //sets the setListsObj to equal the json object
    vagueJSON = searchSetlist(userSearch);
    //sends the json obj to showAndCreateDivs which is going to print them out for the user to see
    showAndCreateDivs(vagueJSON, false);
  });

  //uses a boolean that way it can tell whether if it is the original json object or the refined one.
  function showAndCreateDivs(obj, isSongs) {
    for (var i = 0; i < obj.setlist.length; i++) {
      //will only do this if 
      if (isSongs) {
        //this will populate the array with the refined json object
        songsArr.push(obj.setlist[0].sets.set[0].songs[i].name);


        //display the reponse's venue city and date for all the results
      } else {
        var a = $("<div><p>" + obj.setlist[i].venue + " " + obj.setlist[i].venue.city.name + "," + obj.setlist[i].venue.city.stateCode + " " + obj.setlist[i].eventDate + " " + obj.setlist[i].id + "</p></div>")
        $(a).attr({
          "idName": "response" + i,
          "idHash": obj.setlist[i].venue.id,
          "class": "aReponse"
        });
      }
    }
  }

  //waits for any of the divs that were just created to be clicked
  $(".aResponse").on("click", function () {
    //going to take the unique hash according to the button that was pressed
    var id = this.idHash;
    //sets setListSongs to equal the specific json obj returned from calling the ajax with the hash
    refinedJSON = searchSetlist(id);
    //sends that obj into the showAndCreateDivs func that will also print out the divs this time with the songs.
    showAndCreateDivs(refinedJSON, true);
  $("#api-button-2").on("click", function() {
    console.log("this works");
    createSpotifyPlaylist();
  });

  $("#api-button-3").on("click", function() {
    console.log("this works");
    generateSpotifyPlaylist();
  });

  //list setlists obtained from artist search
  function listSetlist(searchResults) {
    //Q's code goes here
    console.log("Updating Page w/ Artist Shows");
  }

  //create empty spotify playlist
  function createSpotifyPlaylist() {
    $.ajax({
      url: "/create_spotify_playlist",
      data: {
        access_token: access_token,
        user_id: "brandonhoffman"
      }
    }).done(function(data) {
      console.log("Created Playlist!")
      console.log(data);
      userPlaylistURI = data.uri;
      userPlaylistID = data.id;
    });
  }

  //setlist <div> clicked, generate playlists w/ songs & refresh widget
  function generateSpotifyPlaylist() {
    $.ajax({
      url: "/update_spotify_playlist",
      data: {
        access_token: access_token,
        user_id: "brandonhoffman",
        playlist_id: userPlaylistID,
        track_id: spotifyTrackURIs
      }
    }).done(function() {
      console.log("Updated Playlist!")
    });
  }

  //search spotify for string and specified type (artist, album, track)
  function searchSpotify(searchString, searchType) {
    $.ajax({
      url: "/search_spotify",
      data: {
        q: searchString,
        type: searchType,
        access_token: access_token
      }
    }).done(function (data) {
      console.log(data);
      return data;
    });
  }

  //search setlist.fm for setlist and call listSetlist with the results
  function searchSetlist(searchString) {
    $.ajax({
      url: "/search_setlist",
      data: {
        artistName: searchString
      }
    }).done(function (data) {
      console.log(data);
      listSetlist(data);
    });
  }
  // }
});
