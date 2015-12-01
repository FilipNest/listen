# Listen

## A JSON-powered engine for making audio-only adventures

I will pad out this documentation once I get a bit more sleep but here's the basics.

Listen is a (game) engine made using JavaScript, especially the Web Audio API. It has no graphics whatsoever and is instead navigated using a player's hearing.

A demo is available at http://filipnest.com/listen/ 

Full documentation on how the game creates objects, events, logic and choices will come in the future, but it is all based around JSON configuration files.

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
