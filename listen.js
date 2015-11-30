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
      if (listen.world.player.position.y + amount <= listen.world.player.room.size.height && listen.world.player.position.y + amount >= 1) {
        listen.world.player.position.y += amount;
      } else {
        listen.triggerSound("world/sounds/wall.mp3");
        return false;
      }
      break;
    case "x":
      if (listen.world.player.position.x - amount <= listen.world.player.room.size.width && listen.world.player.position.x - amount >= 1) {
        listen.world.player.position.x -= amount;
      } else {
        listen.triggerSound("world/sounds/wall.mp3");
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

// Store for sound file names 

listen.soundList = [];

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

            Object.keys(listen.world.objects).forEach(function (loadedThing) {

              var sound = listen.world.objects[loadedThing]["soundFile"];

              if (sound) {

                listen.soundList.push("world/sounds/" + sound);

              }

            })

            // Add in default sounds

            listen.soundList.push("world/sounds/wall.mp3");

            loadSounds(listen.soundList, function () {

              //              listen.triggerSound("world/sounds/chest.mp3");
              //              listen.triggerSound("world/sounds/start.mp3");

              listen.ready();

            });

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

        var sound = listen.world.rooms[room]["soundFile"];

        if (sound) {

          listen.soundList.push("world/sounds/" + sound);

        }


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

  // Start tick

  listen.controls.tick();

};

// Function for checking conditions

listen.controls.checkCondition = function (conditions) {

  var result;

  Object.keys(conditions).forEach(function (attribute) {

    // See what kind of attribute value operator it is

    var attributeValue = parseFloat(conditions[attribute].substring(1));
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

listen.controls.paused = false;

listen.controls.tick = function () {

  window.setInterval(function () {

    if (joystick.distance === 0) {

      if (!listen.world.player.holdTimeout && joystick.on) {

        listen.world.player.holdTimeout = window.setTimeout(function () {

          listen.controls.paused = true;

          if (listen.world.player.options) {

            console.log("Click your selection");

            listen.controls.trackClicks(4000, function (result) {

              if (result > Object.keys(listen.world.player.options).length + 1) {

                console.log("cancelled");
                listen.controls.paused = false;
                return false;

              } else {

                var selected = Object.keys(listen.world.player.options)[result - 1];

                listen.controls.paused = false;

                if (listen.world.player.options[selected].object.choices && listen.world.player.options[selected].object.choices.length > 0) {

                  var choices = listen.world.player.options[selected].object.choices;

                  // Check conditions for choices

                  var availableChoices = [];

                  choices.forEach(function (choice) {

                    if (listen.controls.checkCondition(choice.conditions)) {

                      availableChoices.push(choice);

                    }

                  })

                  // Show list of available choices and trigger timeout

                  console.log("Pick a choice!");

                  listen.controls.trackClicks(4000, function (result) {

                    if (availableChoices[result - 1]) {

                      listen.controls.action(availableChoices[result - 1].actions);

                    }

                  });

                } else {


                }

              }

            })

          } else {

            listen.controls.paused = false;

            console.log("Nothing to see here");


          }


        }, 2000);
      }

    } else if (!listen.controls.paused) {

      listen.world.player.position.angle = joystick.angle;

      // Clear hold timeout

      if (listen.world.player.holdTimeout) {
        window.clearTimeout(listen.world.player.holdTimeout);
        delete listen.world.player.holdTimeout;
      }

      var vely = -(5 * Math.cos(joystick.angle));
      var velx = -(5 * Math.sin(joystick.angle));

      listen.controls.move("x", velx);
      listen.controls.move("y", vely);

      //       Debugging rectangles

      var canvas = document.getElementById("area"),
        context = canvas.getContext("2d");

      context.strokeRect(listen.world.player.position.x, listen.world.player.position.y, 50, 50)


      context.strokeRect(300, 300, 10, 10)

    }

    // Check for objects

    if (Object.keys(listen.controls.checkForObjects()).length) {

      listen.world.player.options = listen.controls.checkForObjects();

    } else {

      listen.world.player.options = null;

    }

  }, 100)
};

listen.controls.clickCount = 0;
listen.controls.clickTimerOn = false;

listen.controls.trackClicks = function (time, callback) {

  listen.controls.clickTimerOn = true;

  window.setTimeout(function () {

    callback(listen.controls.clickCount);

    listen.controls.clickTimerOn = false;

  }, time)

}

listen.world.player.options = null;

// Select an action

listen.controls.action = function (action) {

  // Add attributes

  if (action.attributes) {

    Object.keys(action.attributes).forEach(function (attribute) {

      // See what kind of attribute value operator it is

      var attributeValue = parseFloat(action.attributes[attribute].substring(1));
      var operator = action.attributes[attribute][0];

      switch (operator) {

        case "=":

          listen.world.player.attributes[attribute] = attributeValue;

          break;
        case "+":
          if (!listen.world.player.attributes[attribute]) {

            listen.world.player.attributes[attribute] = attributeValue

          } else {

            listen.world.player.attributes[attribute] += attributeValue

          }

          break;
        case "-":

          if (listen.world.player.attributes[attribute]) {

            listen.world.player.attributes[attribute] -= attributeValue

          }

          break;
      }

    })

  }

};

listen.triggerSound = function (soundPath) {

  var source1 = context.createBufferSource();
  source1.buffer = listen.sounds[soundPath]["sound"];
  source1.connect(context.destination);
  source1.start(0);

};

//listen.controls.moveToRoom("start", 200, 200);
//listen.controls.moveObjectToRoom("chest", "end", 400, 400);
