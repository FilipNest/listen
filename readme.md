# Listen

## A JSON-powered engine for making audio-only adventures

Listen is a (game) engine made using JavaScript, especially the Web Audio API. It has no graphics whatsoever and is instead navigated using a player's hearing. It is in early stages but now has a short technology demo.

This demo is available at http://filipnest.com/listen/ 

I'm looking for people of all sorts (voice actors, level designers, writers, testers) to help me make a beautiful, epic adventure with it. Please get in touch in the issue queue or elsewhere if you want to help. 

Full documentation on how the game creates objects, events, logic and choices will come in the near future, but it is all based around JSON configuration files.

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
