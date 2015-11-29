// Parent object for engine

"use strict";

var listen = {};

// Settings

listen.settings = {};

// Set up world

listen.world = {};

// Set up player object, holds player properties. Currently which room the player is in and which position in that room they are in

listen.world.player = {
  "position": {
    "x": 0,
    "y": 0
  },
  room: null,
  attributes: {}
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

  if (listen.world.rooms[room].size.width < x || listen.world.rooms[room].size.height < y) {

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

    // Check if object is visible by running conditions check

    var object = listen.world.player.room.objects[object];
    var distance = checkDistance(object.position, listen.world.player.position);

    if (listen.controls.checkCondition(object.conditions)) {

      if (distance < object.triggerDistance) {

        nearObjects[object.name] = {
          object: object,
          distance: distance
        }

      }

    }

  });

  return nearObjects;

};

// Change player's direction along with checking they still fit in the room

listen.controls.move = function (direction, amount) {

  switch (direction) {
    case "y":
      if (listen.controls.checkRoomBounds()) {
        listen.world.player.position.y += amount;
      } else {
        return false;
      }
      break;
    case "x":
      if (listen.controls.checkRoomBounds()) {
        listen.world.player.position.x -= amount;
      } else {
        return false;
      }
      break;
  }

};

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

  if (xPosition > listen.world.rooms[room].size.width || yPosition > listen.world.rooms[room].size.height) {

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

// Function for reading JSON files and storing their settings

listen.readJSON = function (url) {

  return new Promise(function (yes, no) {

    // Read in settings file to get settings

    var request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.onload = function () {

      if (request.status >= 200 && request.status < 400) {

        yes(JSON.parse(request.responseText));

      } else {

        throw "Could not read a settings file"

      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
    };

    request.send()

  })

};

listen.readJSON("world/settings.json").then(function (result) {

  listen.settings = result;

  // Load in all rooms

  var loadedRooms = function () {

    // Rooms are loaded, now load in objects

    var objectIndex = 0;

    listen.settings.objectFiles.forEach(function (objectfile) {

      listen.readJSON("world/" + objectfile).then(function (things) {

        Object.keys(things).forEach(function (thing) {

          listen.world.objects[thing] = things[thing];
          objectIndex += 1;

          if (objectIndex === listen.settings.objectFiles.length) {

            listen.ready();

          }

        });

      })

    })

  };

  var roomIndex = 0;

  listen.settings.roomFiles.forEach(function (roomfile) {

    listen.readJSON("world/" + roomfile).then(function (rooms) {

      Object.keys(rooms).forEach(function (room) {

        listen.world.rooms[room] = rooms[room];

        roomIndex += 1;

        if (roomIndex === listen.settings.roomFiles.length) {

          loadedRooms();

        }

      });

    })

  })

})

// World loaded, ready.

listen.ready = function () {

  // Move player to starting room

  listen.controls.moveToRoom(listen.settings.playerStartPosition.room, listen.settings.playerStartPosition.x, listen.settings.playerStartPosition.y);

  Object.keys(listen.world.rooms).forEach(function (room) {

    if (!listen.world.rooms[room].objects) {

      listen.world.rooms[room].objects = {};

    }

  })

  // Move all objects to their starting rooms if one is set

  Object.keys(listen.world.objects).forEach(function (element) {

    var thing = listen.world.objects[element];

    if (!thing.position) {

      thing.position = {
        x: 0,
        y: 0
      }

    }

    if (!thing.name) {

      thing.name = element;

    }

    if (thing.startingPosition.room) {

      listen.controls.moveObjectToRoom(element, thing.startingPosition.room, thing.startingPosition.x, thing.startingPosition.y);

    }

  })

  // Add starting attributes to player

  listen.world.player.attributes = listen.settings.playerStartAttributes;

};

// Function for checking conditions

listen.controls.checkCondition = function (conditions) {

  var result;

  Object.keys(conditions).forEach(function (attribute) {

    // See what kind of attribute value operator it is

    var attributeValue = conditions[attribute].substring(1);;
    var operator = conditions[attribute][0];

    switch (operator) {

      case "=":
        if (listen.world.player.attributes[attribute] && listen.world.player.attributes[attribute] == attributeValue) {

          result = true;

        } else {

          result = false;

        }
        break;
      case "<":
        if (!listen.world.player.attributes[attribute] || listen.world.player.attributes[attribute] < attributeValue) {

          result = true;

        } else {

          result = false;

        }
        break;
      case ">":
        if (listen.world.player.attributes[attribute] && listen.world.player.attributes[attribute] > attributeValue) {

          result = true;

        } else {

          result = false;

        };
        break;
      default:
        result = false;
    }

  })

  return result;

}

// Game tick

window.setInterval(function () {

  if (joystick.distance === 0) {


  } else {

    var vely = -(5 * Math.cos(joystick.angle));
    var velx = -(5 * Math.sin(joystick.angle));

    listen.controls.move("x", velx);
    listen.controls.move("y", vely);

    document.getElementById("result").innerHTML = "X:" + listen.world.player.position.x + ",<br />" + "Y:" + listen.world.player.position.y;

    // Debugging rectangle

//        var canvas = document.getElementById("area"),
//          context = canvas.getContext("2d");
//    
//        context.strokeRect(listen.world.player.position.x, listen.world.player.position.y, 50, 50)

  }

}, 100)

//listen.controls.moveToRoom("start", 200, 200);
//listen.controls.moveObjectToRoom("chest", "end", 400, 400);
//listen.controls.checkForObjects();
