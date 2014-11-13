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

var x = WIDTH / 2;
var y = HEIGHT / 2;
var zPos = 295;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function relDiff(a, b) {
    return 100 * Math.abs((a - b) / ((a + b) / 2));
}

newsound(200,200,295,"blackbird.ogg");

//newsound(xPos + randomIntFromInterval(50,-50),yPos + randomIntFromInterval(50,-50),295,"palaufrog.ogg");

//Drawing

	var counter = 0,
		logoImage = new Image(),
		TO_RADIANS = Math.PI/180; 
	logoImage.src = 'jumper.png';
	var canvas = document.createElement('canvas'); 
	canvas.width = 1000; 
	canvas.height = 1000; 
	var context = canvas.getContext('2d'); 
	document.body.appendChild(canvas); 

	document.onkeydown = function (e) {
     
    if(e.which === 37) {
     
    window.clearInterval(window.left);
    window.left = window.setInterval(function(){
        
    angle -= 50 * TO_RADIANS;
    move();
        
    },5);
    
    
    }
        
    if(e.which === 39) {
    
    window.clearInterval(window.right);
    window.right = window.setInterval(function(){
     
    angle += 50 * TO_RADIANS;
    move();
        
    },5);
        
    }
        
    if(e.which === 38) {
        
    window.clearInterval(window.up);
    window.up = window.setInterval(function(){
     
    x += speed * Math.cos(angle * TO_RADIANS);
    y += speed * Math.sin(angle * TO_RADIANS);
    move();
        
    },5);
        
    }
        
    }
    
    document.onkeyup = function (e) {
     
    if(e.which === 37) {
     
    window.clearInterval(window.left);
    
    
    }
        
    if(e.which === 39) {
        
    window.clearInterval(window.right);
        
    }
        
    if(e.which === 38) {
     
    window.clearInterval(window.up);
        
    }
        
    }
    

        var angle = 0,
            x = 50,
            y = 50,
            speed = 0.5;
        
        var move = function(){
        
        drawRotatedImage(logoImage,x,y,angle);
        player.setPosition(x, y, zPos);
        player.setOrientation(angle,-angle,0,0,0,0);
            
        };
	
	
	function drawRotatedImage(image, x, y, angle) { 

        context.clearRect(0, 0, canvas.width, canvas.height)
        
		// save the current co-ordinate system 
		// before we screw with it
		context.save(); 

		// move to the middle of where we want to draw our image
		context.translate(x, y);

		// rotate around that point, converting our 
		// angle from degrees to radians 
		context.rotate((angle + 90) * TO_RADIANS);

		// draw it up and to the left by half the width
		// and height of the image 
		context.drawImage(image, -(image.width/2), -(image.height/2));

		// and restore the co-ords to how they were when we began
		context.restore(); 
        context.fillRect(200,200,10,10);
	}