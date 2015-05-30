var particle;
var temp;
var wind;

Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
    return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

function calculateHSL(hsb){
    // determine the lightness in the range [0,100]
    var l = (2 - hsb.s / 100) * hsb.b / 2;
    // store the HSL components
    var hsl =
      {
        'h' : hsb.h,
        's' : hsb.s * hsb.b / (l < 50 ? l * 2 : 200 - l * 2),
        'l' : l
      };
    // correct a division-by-zero error
    if (isNaN(hsl.s)) hsl.s = 0; 
    return hsl;
}

function drawHue(temp){
    var hsb =
    {
      'h' : 0,
      's' : 80,
      'b' : 100
    };

    if(temp>32){
      temp = 32;
    }
    else if(temp<-10){
      temp = -10;
    }
    
    hsb.h = 200 - temp.map(0, 40, 0, 250);
    var hsl = calculateHSL(hsb);
    background(hsb.h, hsb.s, hsb.b);
    $('body').css('background', 'hsl(' + hsl.h + ',' + hsl.s + '%,' + hsl.l + '%)'); // css HSL
}

// particle class
function Particle () {
    this.position = createVector(width/2, height/2);
    
    this.draw = function(speed){
      this.position.add(speed);
      
      // bound checks
      if (this.position.x > width)  this.position.x = 0;
      if (this.position.x < 0)      this.position.x = width;
      if (this.position.y > height) this.position.y = 0;
      if (this.position.y < 0)      this.position.y = height;
      
      noStroke();
      fill(color(255,200));
      ellipse(this.position.x, this.position.y, 16, 16);
    }   
}


function setup() {
    createCanvas($(window).width(), $(window).height());
  
    jQuery.ajax( { 
      url: 'http://ip-api.com/json', 
      type: 'POST', 
      dataType: 'jsonp',
      success: function(location) {
      // get city - update to long & lat
      console.log(location.city);
      console.log("long: " + location.lon);
      console.log("lat: " + location.lat);
      // Request the data from openweathermap
      //loadJSON('http://api.openweathermap.org/data/2.5/weather?q=bucharest&units=metric', gotWeather);
      loadJSON('http://api.openweathermap.org/data/2.5/weather?lat='+ location.lat + '&lon=' + location.lon + "&units=metric", gotWeather);
      }
  } );
  
    wind = createVector();
    particle = new Particle(); 

    colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
    drawHue(temp);
    particle.draw(wind);
    //console.log(particle.position);
}

function gotWeather(weather) {
    // Get the angle (convert to radians)
    var angle = radians(Number(weather.wind.deg));
    // Get the wind speed
    var windmag = Number(weather.wind.speed);
    temp = floor(weather.main.temp);
  
    // Display as HTML elements
    console.log("wind m/s " + windmag + ", km/h " + windmag*3.6);
    console.log("tempC: " + temp);
  
    // Make a vector
    wind = p5.Vector.fromAngle(angle);
    // multiply wind magnitude
    wind.mult(windmag/2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}