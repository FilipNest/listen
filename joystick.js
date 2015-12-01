//Wait for page load

var joystick = {
  angle: 0,
  distance: 0,
  homex: 0,
  homey: 0
};
window.addEventListener('load', function () {
  var canvas = document.getElementById("area"),
    context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener("pointerdown", start, false);
  canvas.addEventListener("pointerup", end, false);
  canvas.addEventListener("pointermove", move, false);

  document.ontouchmove = function (event) {
    event.preventDefault();
  }

  function move(event) {
    if (joystick.homex) {

      //Calculate distance

      joystick.distance = (joystick.homex - event.clientX) * (joystick.homex - event.clientX) + (joystick.homey - event.clientY) * (joystick.homey - event.clientY)

      //Change colour depending on distance
      canvas.globalAlpha = 0.5;
      if (joystick.distance < 3000) {
        var color = "rgba(0, 0, 255, 0.5)";
      }
      if (joystick.distance > 6000) {
        var color = "rgba(0, 255, 0, 0.5)";
      }
      if (joystick.distance > 9000) {
        var color = "rgba(255, 0, 0, 0.5)";
      }

      //Get angles

      var p1 = {
        x: joystick.homex,
        y: joystick.homey
      };

      var p2 = {
        x: event.clientX,
        y: event.clientY
      };

      // angle in radians
      joystick.angle = Math.atan2(p2.x - p1.x, -p2.y - -p1.y);

      //Clear canvas

      canvas.width = canvas.width;

      //Create home

      var context = canvas.getContext('2d');
      var centerX = joystick.homex;
      var centerY = joystick.homey;
      var radius = 30;

      context.beginPath();
//      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//      context.fillStyle = 'rgba(255, 255, 255, 0.3)';
//      context.fill();
//      context.lineWidth = 2;
//      context.strokeStyle = '#003300';
//      context.stroke();

      //Create moving

      var context = canvas.getContext('2d');
      var centerX = event.clientX;
      var centerY = event.clientY;
      var radius = 30;

      context.beginPath();
//      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//      context.fillStyle = color;
//      context.fill();
//      context.lineWidth = 2;
//      context.strokeStyle = '#003300';
      context.stroke();
    }
  };

  //Initial circle for start of joystick


  function start(event) {

    if (listen.controls.clickTimerOn) {
      
      listen.controls.clickCount += 1;

    }

    joystick.on = true;
    joystick.mode = true;
    joystick.homex = event.clientX;
    joystick.homey = event.clientY;
  }


  //Clear joystick on touch out

  function end(event) {
    joystick = {
      x: 0,
      y: 0,
      distance: 0,
      angle: joystick.angle,
      on: false
    };
    canvas.width = canvas.width;
  }
});
