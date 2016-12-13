# Listen engine

Powered by JSON files.

## Rooms

Rooms are stored in a rooms folder. They have the following information.

### Width and Height

Numbers designating the size of the room. 

### Walking surface

A sound file used for footsteps within the room.

## Objects

Objects are stored in the objects folder. They can be placed in any room by an action. They have the following options.

### Starting position

If the object starts in a room.

#### X and Y

The starting position within a room if one is set.

#### Room

The name of a room.

### Identification

What soundfile should be played when the object is announced.

### Ambient sound file

A file that is always played by the object if ambientSoundOn is set to true.

### Ambient sound on

Condition for whether the ambient sound should be played. See conditions.

### Conditions

An array of conditions that need to be active before the item is displayed. Reads from a player's current property values.

```

{"propertyName":"value"}

```

Possible values are:

* A number or string
* < number
* > number

### TriggerDistance

How far should the player be from the object before it is known to them?

### Choices

What choices are available to a player and what happens if they are selected?

Each choice has the following:

#### Conditions

A conditions object (see above) for whether the choice should be made available.

### Soundfile

The sound that describes the condition.

### Actions

An object of actions. These can be of the following type. All actions are performed once a choice is selected. In order.

#### Soundfile

A file to be played.

#### Attributes

The name of an attribute plus the value it should be set to or incremented by. Accepted values are:

* Number
* String
* +Number (increase) (or set to value if none yet)
* -Number (reduce)

#### MoveObject

Move an object to a location. Takes an object with the following properties:

* object
* room
* x
* y

#### MovePlayer

Move the player to a location. Takes an object with the following properties:

* room
* x
* y
