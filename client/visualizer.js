/*globals BufferLoader:true */
/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Start off by initializing a new context.
var context = new(window.AudioContext || window.webkitAudioContext)();

if (!context.createGain) {
  context.createGain = context.createGainNode;
}
if (!context.createDelay) {
  context.createDelay = context.createDelayNode;
}
if (!context.createScriptProcessor) {
  context.createScriptProcessor = context.createJavaScriptNode;
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var loadSounds = function (obj, soundMap, callback) {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in soundMap) {
    var path = soundMap[name];
    names.push(name);
    paths.push(path);
  }
  var bufferLoader = new BufferLoader(context, paths, function (bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      obj[name] = buffer;
    }
    if (callback) {
      callback();
    }
  });
  bufferLoader.load();
};

var WIDTH = 970;
var HEIGHT = 150;

// Interesting parameters to tweak!
var SMOOTHING = 0.8;
var FFT_SIZE = 2048;

var SongVisualizer = function (songLocation, callback) {
  this.analyser = context.createAnalyser();

  this.analyser.connect(context.destination);
  this.analyser.minDecibels = -140;
  this.analyser.maxDecibels = 0;
  loadSounds(this, {
    buffer: songLocation
  });
  this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
  this.times = new Uint8Array(this.analyser.frequencyBinCount);
  this.callback = callback;

  this.isPlaying = false;
  this.startTime = 0;
  this.startOffset = 0;
  setTimeout(this.togglePlayback.bind(this), 3000);
};

// Toggle playback
SongVisualizer.prototype.togglePlayback = function () {
  if (this.isPlaying) {
    // Stop playback
    this.source[this.source.stop ? 'stop' : 'noteOff'](0);
    this.startOffset += context.currentTime - this.startTime;
    // Save the position of the play head.
  } else {
    this.startTime = context.currentTime;
    this.source = context.createBufferSource();
    // Connect graph
    this.source.connect(this.analyser);
    this.source.buffer = this.buffer;
    this.source.loop = false;
    // Start playback, but make sure we stay in bound of the buffer.
    this.source[this.source.start ? 'start' : 'noteOn'](0, this.startOffset % this.buffer.duration);
    // Start visualizer.
    window.requestAnimFrame(this.draw.bind(this));
  }
  this.isPlaying = !this.isPlaying;
};


SongVisualizer.prototype.draw = function() {
  this.analyser.smoothingTimeConstant = SMOOTHING;
  this.analyser.fftSize = FFT_SIZE;

  // Get the frequency data from the currently playing music
  this.analyser.getByteFrequencyData(this.freqs);
  this.analyser.getByteTimeDomainData(this.times);

  if (this.analyser.context.currentTime > this.buffer.duration + this.startTime) {
    this.isPlaying = !this.isPlaying;
    if (this.callback !== undefined) {
      this.callback();
    }
  }

  this.render();

  if (this.isPlaying) {
    window.requestAnimFrame(this.draw.bind(this));
  }
};

SongVisualizer.prototype.render = function () {
  var canvas = document.querySelector('canvas');
  var drawContext = canvas.getContext('2d');

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // Draw the frequency domain chart.
  for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
    var value = this.freqs[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH / this.analyser.frequencyBinCount;
    drawContext.fillStyle = 'hsl(150, 100%, 50%)';
    drawContext.fillRect(i * barWidth, offset, barWidth, height);
  }
};

SongVisualizer.prototype.getFrequencyValue = function (freq) {
  var nyquist = context.sampleRate / 2;
  var index = Math.round(freq / nyquist * this.freqs.length);
  return this.freqs[index];
};
