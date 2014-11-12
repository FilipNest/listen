/*global console, AudioContext*/

"use strict";

// Detect if the audio context is supported.
window.AudioContext = (
    window.AudioContext ||
    window.webkitAudioContext ||
    null
);

if (!AudioContext) {
    document.getElementById("main").innerHTML = "You need a newer browser that supports the Web Audio API to play here.";
}

// Create a new audio context.
var ctx = new AudioContext();
var player = ctx.listener;

var newsound = function (x,y,z,file) {

// Create a AudioGainNode to control the main volume.
var mainVolume = ctx.createGain();
// Connect the main volume node to the context destination.
mainVolume.connect(ctx.destination);

// Create an object with a sound source and a volume control.
var sound = {};
sound.source = ctx.createBufferSource();
sound.volume = ctx.createGain();

// Connect the sound source to the volume control.
sound.source.connect(sound.volume);

sound.panner = ctx.createPanner();
// Instead of hooking up the volume to the main volume, hook it up to the panner.
sound.volume.connect(sound.panner);
// And hook up the panner to the main volume.
sound.panner.connect(mainVolume);

// Make the sound source loop.
sound.source.loop = true;

// Load a sound file using an ArrayBuffer XMLHttpRequest.
var request = new XMLHttpRequest();
request.open("GET", file, true);
request.responseType = "arraybuffer";
request.onload = function (e) {

    // Create a buffer from the response ArrayBuffer.
    ctx.decodeAudioData(this.response, function onSuccess(buffer) {
        sound.buffer = buffer;

        // Make the sound source use the buffer and start playing it.
        sound.source.buffer = sound.buffer;
        sound.source.start(ctx.currentTime);
    }, function onFailure() {
        console.log("Decoding the audio buffer failed");
    });
};
request.send();
    
sound.panner.setPosition(x, y, z);
        
};

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var xPos = WIDTH / 2;
var yPos = HEIGHT / 2;
var zPos = 295;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function relDiff(a, b) {
    return 100 * Math.abs((a - b) / ((a + b) / 2));
}

var move = function () {
    player.setPosition(xPos, yPos, zPos);

};

newsound(xPos + randomIntFromInterval(50,-50),yPos + randomIntFromInterval(50,-50),295,"blackbird.ogg");

newsound(xPos + randomIntFromInterval(50,-50),yPos + randomIntFromInterval(50,-50),295,"palaufrog.ogg");

move();

document.onkeydown = function (e) {
    e = e || window.event;
    switch (e.which || e.keyCode) {
    case 37: // left
        xPos -= 1;
        move();
        break;

    case 38: // up
        yPos -= 1;
        move();
        break;

    case 39: // right
        xPos += 1;
        move();
        break;

    case 40: // down
        yPos += 1;
        move();
        break;

    default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
};