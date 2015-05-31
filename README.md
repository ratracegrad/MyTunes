# MyTunes
> My implementation of a browser based music player using Backbone.JS and Twitter Bootstrap. 

> The Backbone.JS implementation utilizes two collections - for list of Songs and for the Song Queue.
There are 6 views to render the infromation in the browser. There is the generic AppView for the 
container for MyTunes. There is a Library View to show all the songs, a Player View which is the
audio controls for the song currently playing and a Song Queue view.

> Styling is handled primarily by the Twitter Bootstrap CSS. I have added some custom styling to 
override the Boostrap settings in the styles.css file.

## Technology Stack
1. Backbone.js
2. Twitter Bootstrap

## Requirements
- Backbone.js
- Twitter Bootstrap

## Installation
1. Download the repository
2. Install bower dependencies `bower install`
3. Open the client folder and double click on `index.html`
4. View in your browser

## Operation
Click on any song in the Library to play. This will automatically add the song to the Song Queue.
Add as many songs as you like to the Song Queue. Once a song finishes playing it will be
automatically removed from the Song Queue and the next song, if any, will be played.

Vote for your favorite songs by clicking the up vote button. If you don't like a song then
click the down vote button. Every up vote adds one to the vote total and every down vote
subtracts one from the vote total.

Want to know what is the most played song? MyTunes will keep track of your songs play time and
will show the total times a song has been played.

## Live Preview
[You can see this repo live here](http://jenniferbland.com/mytunes/)


## Screenshot
![alt tag](http://jenniferbland.com/mytunes/screenshot.png)
