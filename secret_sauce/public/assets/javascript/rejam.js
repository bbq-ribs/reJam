jQuery(function($) {
  //spotify playlist id to update widget
  var userPlaylistURI = "";
  var userPlaylistID = "";
  var userSpotifyID = "";

  //array of strings used to add songs to spotify playlist
  var spotifyTrackURIs =
    "spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M";

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
      //valid access token, get spotify user id
      getSpotifyUserInfo();
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

  $("#api-button-2").on("click", function() {
    console.log("this works");
    createSpotifyPlaylist();
  });

  $("#api-button-3").on("click", function() {
    console.log("this works");
    generateSpotifyPlaylist();
  });

  $("#api-button-4").on("click", function() {
    console.log("this works");
    getSpotifyUserInfo();
  });

  //list setlists obtained from artist search
  function listSetlist(searchResults) {
    //Q's code goes here
    console.log("Updating Page w/ Artist Shows");
  }

  //get user info from spotify and set global var
  function getSpotifyUserInfo() {
    $.ajax({
      url: "/get_spotify_user_info",
      data: {
        access_token: access_token
      }
    }).done(function(data) {
      console.log(data);
      userSpotifyID = data.id;
    });
  }

  //create empty spotify playlist
  function createSpotifyPlaylist() {
    $.ajax({
      url: "/create_spotify_playlist",
      data: {
        access_token: access_token,
        user_id: userSpotifyID
      }
    }).done(function(data) {
      console.log("Created Playlist!");
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
        user_id: userSpotifyID,
        playlist_id: userPlaylistID,
        track_id: spotifyTrackURIs
      }
    }).done(function() {
      console.log("Updated Playlist!");
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
    }).done(function(data) {
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
    }).done(function(data) {
      console.log(data);
      listSetlist(data);
    });
  }
  // }
});
