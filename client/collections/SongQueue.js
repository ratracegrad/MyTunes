// SongQueue.js - Defines a backbone model class for the song queue.
var SongQueue = Songs.extend({

  initialize: function(){
    this.on('add', function(){

      if (this.at(1) === undefined) {
        this.playFirst();
      }
    });

    this.on('ended', function() {
      this.remove(this.at(0));
      if (this.at(0)) {
        this.playFirst();
      }
    });

    this.on('dequeue', function(song) {
      if (song === this.at(0)) {
        this.remove(song);
        if (this.at(0)) {
          this.playFirst();
        } else {
          this.trigger('changeCurrentSong');
        }
      }
      
      this.remove(song);
    });
  },

  playFirst: function() {
    this.at(0).play();
    this.at(0).set('playCount', this.at(0).get('playCount')+1);
  },

  // getCurrentSong: function(){
  //   return this.models[0];
  // }

});