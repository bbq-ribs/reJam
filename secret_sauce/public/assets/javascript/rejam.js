var refinedJSON;
var setlistResponse;
var userSearch;
var vagueJSON;
var songsArr;

//-q created the var o, later is set to the obj needed it global for the way that i got the setlist info


var o;
jQuery(function($) {
  //spotify playlist id to update widget
  var userPlaylistURI = "";
  var userPlaylistID = "";
  var userSpotifyID = "";

  //setlist from setlist.fm
  var refinedJSON;

  //setlist search from setlist.fm
  var vagueJSON;

  //array of strings used to add songs to spotify playlist
  var spotifyTrackURIs = "";

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
    var queryString = $("#artist-search").val();
    console.log(queryString);
    searchSetlist(queryString);
  });

  //uses a boolean that way it can tell whether if it is the original json object or the refined one.

  //waits for any of the divs that were just created to be clicked
  $(".aResponse").on("click", function() {
    //going to take the unique hash according to the button that was pressed
    id = $(this).attr("idHash");
    //sets setListSongs to equal the specific json obj returned from calling the ajax with the hash
    refinedJSON = searchSetlist(id);
    //sends that obj into the showAndCreateDivs func that will also print out the divs this time with the songs.
    showAndCreateDivs(refinedJSON, true);
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

  $("#api-button-5").on("click", function() {
    console.log("this works");
    var searchString = "high+on+fire";
    searchSetlist(searchString);
  });

  //-q created this as new function this listens for the venue divs to be clicked

  $(document).on("click", ".aSetList", function(){
    $(".setlist").empty();
    var indexOfSetlist = $(this).attr("name");
    for( var c = 0; c < o.setlist[indexOfSetlist].sets.set[0].song.length; c++ ){
      var a = $("<div>" + o.setlist[indexOfSetlist].sets.set[0].song[c].name + "</div>");
      $(a).appendTo(".setlist");
    }
  });

  $("#api-button-6").on("click", function() {
    console.log("Setlist Selected");
    var searchString = "23f8b003";
    getSetlist(searchString);
  });
//-q there was a function here that didn't do anything so i just got rid of it, thought is was going to use it but didn't end up using it



  //gereate the spoitfy playlist
  //use class setlist for ul

  //-q dont use this function so i don't need it idk about ur code
  function listSetlistRefined(obj, isSongs) {
    for (var i = 0; i < obj.setlist.length; i++) {
      //will only do this if
      //this will populate the array with the refined json object
      $(".setlist").clear();
      songsArr.push(obj.setlist[0].sets.set[0].songs[i].name);
      var b = $("<div><p>" + obj.setlist.sets[0].songs[i].name + "</p></div>");
      $(b).attr({
        idName: "songResponse" + i,
        idHash: obj.setlist[i].id,
        class: "aSong"
      });
    }
  }

  //list setlists obtained from artist search
  function listSetlist(obj) {
      // console.log(obj);
      console.log("in list setlist");
      $("#setListSection").empty();
      var a = $("<div><h3><b>" + obj.setlist[0].artist.name + "</div>");
      $(a).attr("name", obj.setlist[0].artist.name );
      console.log(a);
      $(a).appendTo(".artist");
  
      // console.log(obj.setlist[0].sets.set[0].song[0].name);
      //display the reponse's venue city and date for all the results
      for (var i = 0; i < 20; i++) {
        console.log("iteration " + i);
        if(obj.setlist[i].sets.set[0].song !== null ){
          console.log("length of song array" + obj.setlist[i].sets.set[0].song.length);
          var b = $("<div>" + obj.setlist[i].venue.name + "</div>");
          $(b).attr("name", i);
          $(b).attr("idHash", obj.setlist[i].id);
          $(b).addClass("aSetList");
          $(b).attr("setListLength", obj.setlist[i].sets.set[0].song.length);
          console.log($(b).attr("setListLength"));
          console.log(b);
          $(b).appendTo(".venue");
          console.log("Updating Page w/ Artist Shows");
    
          var c = $("<div>" + obj.setlist[i].venue.city.state + "</div>");
          $(c).attr("name", i);
          $(c).attr("idHash", obj.setlist[i].id);
          $(c).addClass("aSetList");
          $(c).attr("setListLength", obj.setlist[i].sets.set[0].song.length);
          console.log($(c).attr("setListLength"));
          console.log(c);
          $(c).appendTo(".city");
    
          var d = $("<div>" + obj.setlist[i].eventDate + "</div>");
          $(d).attr("name", i);
          $(d).attr("idHash", obj.setlist[i].id);
          $(d).addClass("aSetList");
          $(d).attr("setListLength", obj.setlist[i].sets.set[0].song.length);
          console.log($(d).attr("setListLength"));
          console.log(d);
          $(d).appendTo(".date");
        }
      }
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
      //call generateSpotifyPlaylist and populate with our tracks
      generateSpotifyPlaylist();
    });
  }

  //setlist <div> clicked, generate playlists w/ songs & refresh widget
  function generateSpotifyPlaylist() {
    console.log("Inside generateSpotifyPlaylist");
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
      updateSpotifyWidget();
    });
  }

  //update the spotify widget with the newly generated playlist
  function updateSpotifyWidget() {
    console.log("Updating Spotify Widget");
    $(".songWidget").empty();
    $(".songWidget").html("<iframe src='https://open.spotify.com/embed?uri=" + userPlaylistURI + "' width='300' height='380' frameborder='0' allowtransparency='true'></iframe>");
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

  //get artist setlists from setlist.fm
  function searchSetlist(searchString) {
    $.ajax({
      url: "/search_setlist",
      data: {
        artistName: searchString
      }
    }).done(function(data) {
      vagueJSON = data;
      0 = data;
      console.log(vagueJSON);
    });
  }

  //generate string w/ spotify track uri's
  function generateSpotifyTrackString() {
    console.log("Inside Track Generator");
    var numOfTracks = refinedJSON.sets.set[0].song.length;
    var counter = 0;
    console.log(numOfTracks);

    function getTrackURI() {
      if (counter < numOfTracks) {
        var searchString =
          refinedJSON.artist.name +
          "+" +
          refinedJSON.sets.set[0].song[counter].name;
        console.log(searchString);
        $.ajax({
          url: "/search_spotify",
          data: {
            q: searchString,
            type: "track",
            access_token: access_token
          }
        }).done(function(data) {
          console.log(data);
          if (spotifyTrackURIs != "") {
            spotifyTrackURIs += "," + data.tracks.items[0].uri;
          } else {
            spotifyTrackURIs = data.tracks.items[0].uri;
          }
          console.log(spotifyTrackURIs);
          counter++;
          if (counter == numOfTracks) {
            if (userPlaylistURI == "") {
              //playlist doesn't exist, create one then populate
              createSpotifyPlaylist();
            } else {
              //playlist exists, populate with our tracks
              generateSpotifyPlaylist();
            }
          } else {
            getTrackURI();
          }
        });
      }
    }

    if (counter < numOfTracks) {
      getTrackURI();
    }
  }

  //search setlist.fm for setlist and call function to generate string for playlist generation
  function getSetlist(searchString) {
    $.ajax({
      url: "/get_setlist",
      data: {
        setlistID: searchString
      }
    }).done(function(data) {
      refinedJSON = data;
      console.log(refinedJSON);
      console.log("Calling Track Generator");
      spotifyTrackURIs = "";
      generateSpotifyTrackString();
    });
  }
});
