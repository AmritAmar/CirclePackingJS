// Change Image Source for your picture!
var imgSource = "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1891&q=80"

var totalAttempts = 1000; //Number of attempts to add a circle before giving up
var circlePerUpdate = 10; //Every frame how many circles to add
var totalCircles = 2500; // 0 = infinity, Number = max circles

var circles;
var img;

let cpu_slider, tc_slider, ta_slider, button;

function preload() {
  img = loadImage(imgSource);
}

function setup() {  
  
  ta_slider = createSlider(100, 2000, 1000);
  cpu_slider = createSlider(1, 100, 10);
  tc_slider = createSlider(0, 5000, 2500);
  
  cpu_slider.position(20, 720); // First Slider
  tc_slider.position(180, 720); // Second Slider
  ta_slider.position(340, 720); // Third Slider
  
  button = createButton('Go!');
  button.position(650, 720);
  button.mousePressed(reset);
  
  img.resize(700, 700);
  createCanvas(700, 700);
  var density = displayDensity();
  pixelDensity(1);
  img.loadPixels();
  circles = [];
}

function reset() {
  circles = [];
  totalAttempts = ta_slider.value();
  circlePerUpdate = cpu_slider.value();
  totalCircles = tc_slider.value();
  loop()
}

function draw() {
  background(0);

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

            if (d - 1 < distance) {
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
  var x = random(0, img.width);
  var y = random(0, img.height);

  var valid = true;
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    var d = dist(x, y, circle.x, circle.y);
    if (d - 2 < circle.r) {
      valid = false;
      break;
    }
  }
  if (valid) {
    var index = (int(x) + int(y) * img.width) * 4;
    var r = img.pixels[index];
    var g = img.pixels[index + 1];
    var b = img.pixels[index + 2];
    var c = color(r, g, b);
    return new Circle(x, y, color(c));
  } else {
    return null;
  }
}