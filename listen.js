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

  name: null,

  objects: {}

};

// Set up database of objects that can be placed in rooms

listen.world.objects = {};

// Master object from which all others are cloned

listen.world.object = {

  position: {
    x: null,
    y: null
  },
  name: null,
  world: null

}

// Player controls

listen.controls = {};

// Move player to a specific room

listen.controls.moveToRoom = function (room, x, y) {

  // Check if room exists, throw error if it doesn't

  if (!listen.world.rooms[room]) {

    throw "The room " + room + " doesn't exist!";

  }

  // Move player to room

  listen.world.player.room = listen.world.rooms[room];

  // Check if requested player position in the room is actually in the room

  if (listen.world.rooms[room].size.x < x || listen.world.rooms[room].size.y < y) {

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

  var nearObjects = {};

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

    nearObjects[object.name] = {
      object: object,
      distance: checkDistance(object.position, listen.world.player.position)
    }

  });

  return nearObjects;

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

// Function for creating rooms

listen.controls.createRoom = function (name, sizex, sizey) {

  if (listen.world.rooms[name]) {

    throw "Room " + name + " already exists";

  }

  var room = {

    size: {
      x: sizex,
      y: sizey

    },
    name: name,
    objects: {}

  }

  listen.world.rooms[name] = room;

}

// Function for creating objects

listen.controls.createObject = function (objectName) {

  // Check if object doesn't already exist

  if (listen.world.objects[objectName]) {

    throw "Object " + objectName + " already exists, yet you're trying to create it again.";

  }

  // Add object to room

  listen.world.objects[objectName] = {
    position: {
      x: null,
      y: null
    },
    name: objectName
  };

}

// Function for adding an object to a room

listen.controls.moveObjectToRoom = function (objectName, room, xPosition, yPosition) {

  // Check if room exists

  if (!listen.world.rooms[room]) {

    throw "Room " + room + " does not exist and you're trying to put object " + objectName + " in it";

  }

  // Check if object exists

  if (!listen.world.objects[objectName]) {

    throw "Object " + objectName + " does not exist and you're trying to put it in room " + room + ".";

  }

  // Check if object fits in room

  if (xPosition > listen.world.rooms[room].size.x || yPosition > listen.world.rooms[room].size.y) {

    throw "Room " + room + " isn't big enough for where you're trying to put " + objectName + ".";

  }

  // Add object to room

  listen.world.rooms[room].objects[objectName] = listen.world.objects[objectName];

  listen.world.objects[objectName].world = listen.world.rooms[room];

  // Set position of object

  listen.world.rooms[room].objects[objectName].position.x = xPosition;
  listen.world.rooms[room].objects[objectName].position.y = xPosition;

  // Delete any other places the object is in

  Object.keys(listen.world.rooms).forEach(function (roomcheck) {

    if (listen.world.rooms[roomcheck].objects[objectName] && roomcheck !== room) {

      delete listen.world.rooms[roomcheck].objects[objectName];

    }

  })

};

// Basic game

// Create room

listen.controls.createRoom("start", 500, 500);

listen.controls.createRoom("end", 500, 500);

// Move player to room

listen.controls.moveToRoom("start", 200, 200);

// Create a sample object

listen.controls.createObject("chest");

listen.controls.moveObjectToRoom("chest", "start", 400, 400);

listen.controls.moveObjectToRoom("chest", "end", 400, 400);

// Check player's distance from objects

console.log(listen.controls.checkForObjects());
