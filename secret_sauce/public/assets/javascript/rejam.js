jQuery(function($) {
  
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
      console.log("Access Granted!")
      //valid access token, do nothing
    } else {
      //display spotify login modal
      console.log("Displaying Login Modal")
      $(".modal").modal();
      $("#loginModal").modal("open");
    }
  }

  // document.getElementById("obtain-new-token").addEventListener(
  //   "click",
  //   function() {
  //     $.ajax({
  //       url: "/refresh_token",
  //       data: {
  //         refresh_token: refresh_token
  //       }
  //     }).done(function(data) {
  //       access_token = data.access_token;
  //       oauthPlaceholder.innerHTML = oauthTemplate({
  //         access_token: access_token,
  //         refresh_token: refresh_token
  //       });
  //     });
  //   },
  //   false
  // );

  // document.getElementById("check-album-search").addEventListener(
  //   "click",
  //   function() {
  //     $.ajax({
  //       url: "https://api.spotify.com/v1/search",
  //       headers: {
  //         Accept: "application / json",
  //         Authorization: "Bearer " + access_token
  //       },
  //       data: {
  //         q: "muse+absolution",
  //         type: "album"
  //       }
  //     }).done(function(data) {
  //       console.log(data);
  //     });
  //   },
  //   false
  // );

  document.getElementById("api-button-1").addEventListener(
    "click",
    function() {
      console.log("this works");
      var myObj = searchSpotify("radiohead+videotape", "track");
      // console.log(myObj);
    },
    false
  );

  document.getElementById("api-button-2").addEventListener(
    "click",
    function() {
      var myObj = searchSetlist("radiohead");
      // console.log(myObj);
    },
    false
  );

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

  function searchSetlist(searchString) {
    $.ajax({
      url: "/search_setlist",
      data: {
        artistName: searchString
      }
    }).done(function(data) {
      console.log(data);
      listSetlist(data);
      // return data;
    });
  }
  // }
});
