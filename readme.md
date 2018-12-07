# Listen

## A JSON-powered engine for making audio-only adventures

Listen is a (game) engine made using JavaScript, especially the Web Audio API. It has no graphics whatsoever and is instead navigated using a player's hearing. It is in early stages but now has a short technology demo.

This demo is available at http://listen.filipnest.com 

## How it works

The world the engine puts the adventurer in consists of rooms (or a single room in the case of the demo) filled with objects/things. Things usually, but not always, have an ambient sound attached to them to make finding them easier. Others may be stumbled apon randomly or by following a direction set by the location of other things. The logic of the game is based around the concept of things, attributes, events, actions and choices.

### Attributes

An adventurer (or perhaps it makes more sense to describe it as an instance of the game) has a list of attributes. These each have a label, and a value (usually numeric). Different choices, things and actions occur and appear depending on the setting of these attributes. Examples:

* Gold
* Health
* A key
* Needing a key
* Having completed a level

Actions set by choices and events can set/change attributes. The logic on the game is based on looking at the value of attributes. 

### Choices

Choices appear on things. They appear depending on a set of attribute conditions (described above). Each usually has an audio description of what the choice is so the adventurer can select it. Choices trigger actions.

### Events

Events are triggered when an attribute reaches a certain value. They then trigger actions. See below:

### Actions

Actions occur after a choice/event and can do things like:

* Change an attribute value
* Move an object/adventurer to the room
* Trigger a sound to be played
* Trigger an thing's looping background sound to start.

The creation of objects, events, actions and choices is all based around JSON configuration files. More information on exactly how this works will come soon once thngs are tidied up a bit.

Here's an example of the objects file, hopefully you should be able to get an understanding of the basics by skimming through it. What this and the demo does not show is the ability to jump between (and trigger objects being moved between) different rooms. This is available and probably essential for bigger adventures but is not present in the one room demo.

```JSON

{
  "susan": {
    "startingPosition": {
      "room": "start",
      "x": 600,
      "y": 200
    },
    "soundFile": "susan.mp3",
    "ambientSoundFile": "susanpurring.mp3",
    "ambientSoundOn": true,
    "triggerDistance": 100,
    "conditions": {
      "cat": "<1"
    },
    "choices": [{
        "conditions": {
          "lostcat": "<1"
        },
        "soundFile": "listentosusan.mp3",
        "actions": {
          "soundFile": "soundslikedreaming.mp3"
        }
    },
      {
        "conditions": {
          "lostcat": "<1"
        },
        "soundFile": "strokesusan.mp3",
        "actions": {
          "soundFile": "susanstroked.mp3"
        }
    },
      {
        "conditions": {
          "keyneeded": ">0",
          "windowkey": "<1"
        },
        "soundFile": "grabwindowkey.mp3",
        "actions": {
          "soundFile": "grabbedkey.mp3",
          "attributes": {
            "windowkey": "+1"
          }
        }
    }]
  }
}

```
