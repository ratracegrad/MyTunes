// LibraryEntryView.js - Defines a backbone view class for the entries that will appear within the library views. These will be inserted using the "subview" pattern.
var LibraryEntryView = Backbone.View.extend({

  tagName: 'tr',

  template: _.template('<td><span class="add-to-queue"><%= artist %> </span> </td> \
    <td> <span class="add-to-queue"> <%= title %> </span></td> \
    <td class="table-numbers"> <%= playCount %> </span> </td> \
    <td class="table-numbers"> <%= voteCount %> </span></td> \
    <td class="table-numbers"><div class="plus-one"> +1 </div></td> \
    <td class="table-numbers"> <div class="minus-one"> -1 </div> </td>'),

  events: {
    'click .add-to-queue': function() {
      this.model.enqueue();
    },

    'click .plus-one': function() {
      this.model.plusOne();
    },

    'click .minus-one': function() {
      this.model.minusOne();
    }


  },



  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});
