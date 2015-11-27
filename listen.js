// Parent object for engine

"use strict";

var listen = {};

// Set up world

listen.world = {};

// Set up player object, holds player properties. Currently which room the player is in and which position in that room they are in

listen.world.player = {
  "position": {
    "x": 0,
    "y": 0
  },
  room: null
};

// List of rooms

listen.world.rooms = {};

// Each room will include the positions of objects in the room and the size of the room. This is the parent object from which others will be cloned

listen.world.room = {

  size: {

    x: 0,
    y: 0

  },

  objects: {}

};

// Player controls

listen.controls = {};

// Move player to a specific room

listen.moveToRoom = function (room, x, y) {

  // Check if room exists, throw error if it doesn't

  if (!listen.world.rooms[room]) {

    throw "The room " + room + " doesn't exist!";

  }

  // Move player to room

  listen.world.player.room = listen.world.rooms[room];

  // Check if requested player position in the room is actually in the room

  if (listen.world.rooms[room].size.x > x || listen.world.rooms[room].size.y > y) {

    throw "Moving the player to room " + room + " but requested a position that doesn't fit in the room";

  }

  // All is well, change the player's position

  listen.world.player.position.x = x;
  listen.world.player.position.y = y;

};

// Check if a person is still in the room

listen.controls.checkRoomBounds = function () {

  if (listen.world.player.position.x > listen.world.player.room.size.x || listen.world.player.position.y > listen.world.player.room.size.y) {

    return false;

  } else {

    return true;

  }

};

// Check if person is near an object in the room

listen.controls.checkForObjects = function () {

  // Array of objects near the player

  var nearObjects = [];

  // Function for checking distance

  function checkDistance(first, second) {

    var xs,
      ys;

    xs = second.x - first.x;
    xs = xs * xs;

    ys = second.y - first.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
  }

  // Loop over all the objects in the room

  Object.keys(listen.world.player.room.objects).forEach(function (object) {

    // Fetch object

    object = listen.world.player.room.objects[object];

    console.log(checkDistance(object.position, listen.world.player.position));

  });

};

// Change player's direction along with checking they still fit in the room

listen.controls.move = function (direction, amount) {

  switch (direction) {
    case "up":
      if (listen.controls.checkRoomBounds()) {
        listen.world.player.position.y += amount;
      } else {
        return false;
      }
      break;
    case "down":
      if (listen.controls.checkRoomBounds()) {
        listen.world.player.position.y -= amount;
      } else {
        return false;
      }
      break;
    case "left":
      if (listen.controls.checkRoomBounds()) {
        listen.world.player.position.x -= amount;
      } else {
        return false;
      }
      break;
    case "right":
      if (listen.controls.checkRoomBounds()) {
        listen.world.player.position.x += amount;
      } else {
        return false;
      }
      break;
  }

};
