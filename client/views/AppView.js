
// AppView.js - Defines a backbone view class for the whole music app.
var AppView = Backbone.View.extend({

  initialize: function(params){
    this.playerView = new PlayerView({model: this.model.get('currentSong')});
    this.libraryView = new LibraryView({collection: this.model.get('library')});
    this.songQueueView = new SongQueueView({collection: this.model.get('songQueue')});

    // change:currentSong - this is Backbone's way of allowing you to filter events to
    // ONLY receive change events for the specific property, 'currentSong'
    // this.playerView.on('ended', this.ended, this);
    // this.model.get('songQueue').on('remove', this.playNextSong, this);
    this.model.on('change:currentSong', function(model){
      this.playerView.setSong(model.get('currentSong'));
    }, this);
  },

  libraryHeader: '<h2 class="collection-heading">Library</h2>',

  render: function(){
    return this.$el.html([
      this.playerView.$el,
      this.libraryHeader,
      this.libraryView.$el
    ]);
  },

});
