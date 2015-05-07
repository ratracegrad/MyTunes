var Router = Backbone.Router.extend({
  routes: {
    '/': function(){
      //render about page
    },    // e.g., #about
    'playlist':  function() {
      console.log("playlist route")
      //load song, render player, play song
    },  // e.g., songs/Thriller
  }
});
