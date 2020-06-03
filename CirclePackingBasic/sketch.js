var circles;

var totalAttempts = 1000; //Number of attempts to add a circle before giving up
var circlePerUpdate = 10; //Every frame how many circles to add
var totalCircles = 2000; // 0 = infinity, Number = max circles

function setup() {
  createCanvas(700, 700);
  circles = [];
}

function draw() {
  background(0);
  frameRate(20);

  var count = 0;
  var attempts = 0;
  
  if (totalCircles == 0 || circles.length < totalCircles) {
    while (count < circlePerUpdate) {
      var newC = newCircle();
      if (newC !== null) {
        circles.push(newC);
        count++;
      }
      attempts++;
      if (attempts > totalAttempts) {
        noLoop();
        console.log('finished');
        break;
      }
    }
  }

  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];

    if (circle.growing) {
      if (circle.edges()) {
        circle.growing = false;
      } else {
        for (var j = 0; j < circles.length; j++) {
          var other = circles[j];
          if (circle !== other) {
            var d = dist(circle.x, circle.y, other.x, other.y);
            var distance = circle.r + other.r;

            if (d - 2 < distance) {
              circle.growing = false;
              break;
            }
          }
        }
      }
    }

    circle.show();
    circle.grow();
  }
}

function newCircle() {
  var x = random(width);
  var y = random(height);
  var valid = true;
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    var d = dist(x, y, circle.x, circle.y);
    if (d < circle.r) {
      valid = false;
      break;
    }
  }
  if (valid) {
    return new Circle(x, y);
  } else {
    return null;
  }
}