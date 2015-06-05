var particles = [];
var arrows = [];
var numberOfParticles = 100;
var temp = "temp";
var wind;
var windAngle;
var windMag;

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


function getHsb(temp){
    var hsb =
      {
        'h' : 0,
        's' : 80,
        'b' : 98
      };

    if(temp>32){
       temp = 32;
      }
    else if(temp<-10){
       temp = -10;
    }
    
    hsb.h = 200 - temp.map(0, 40, 0, 250);

    return hsb;
}

function drawBackground(hsb){
    var hsl = calculateHSL(hsb);
    background(hsb.h, hsb.s, hsb.b);
    $('body').css('background', 'hsl(' + hsl.h + ',' + hsl.s + '%,' + hsl.l + '%)'); // css HSL
}


function drawMainArrow(hsb, x, y){
    push();
    translate(x, y-48);
    // Rotate by the wind's angle
    //draw base
    rotate(wind.heading() + PI/2);
    noStroke();
    fill(255);
    ellipse(0, 0, 48, 48);

    //draw arrow
    scale(0.75);
    stroke(hsb.h, hsb.s, hsb.b);
    strokeWeight(2);
    line(0, -16, 0, 16);

    noStroke();
    fill(hsb.h, hsb.s, hsb.b);
    triangle(0, -18, -6, -10, 6, -10);
    pop();
}


//bound check
function boundCheck(position){
    if (position.x > width)  position.x = 0;
    if (position.x < 0)      position.x = width;
    if (position.y > height) position.y = 0;
    if (position.y < 0)      position.y = height;
}

// particle class
function Particle () {
    this.position = createVector(random(width), random(height));
    this.size = random(8);
    this.opacity = random(1);
    
    this.draw = function(speed, i){
      this.position.add(speed);

      // add some randomness
      this.position.x = this.position.x + cos(i)/10;
      this.position.y = this.position.y + sin(i)/10;
      this.size = this.size;
      
      boundCheck(this.position);
      
      noStroke();
      fill(color(25, this.opacity));
      ellipse(this.position.x, this.position.y, this.size, this.size);
    }   
}

// arrow class
function Arrow () {
    this.position = createVector(random(width), random(height));
    this.size = random(10);
    this.opacity = random(1);
    
    this.draw = function(speed, i){
      this.position.add(speed);

      // add some randomness
      this.position.x = this.position.x + cos(i)/10;
      this.position.y = this.position.y + sin(i)/10;
      this.size = this.size;
      
      boundCheck(this.position);
      
      stroke(color(255, this.opacity));
      strokeWeight(1);
      push();
      angleMode(RADIANS);
      translate(this.position.x, this.position.y);
      rotate(windAngle);
      line(0, 0, this.size*2 ,0);
      //arrow
      line(this.size*2, 0, this.size*1.4, -this.size/2);
      line(this.size*2, 0, this.size*1.4, this.size/2);
      pop();
    }   
}


function setup() {
    createCanvas($(window).width(), $(window).height());
  
    jQuery.ajax( { 
      url: 'http://ip-api.com/json', 
      type: 'GET', 
      dataType: 'jsonp',
      cache: false,
      headers: { "Content-type": "application/json" },
      success: function(location) {
      // get city - update to long & lat
      console.log(location.city);
      console.log("long: " + location.lon);
      console.log("lat: " + location.lat);
      console.log('https://api.forecast.io/forecast/b8ace96330f01d017ae0b275adccc0bd/' + location.lat +',' + location.lon);
      jQuery.ajax( { 
         url: 'https://api.forecast.io/forecast/b8ace96330f01d017ae0b275adccc0bd/' + location.lat +',' + location.lon, 
         type: 'GET', 
          dataType: 'jsonp',
          cache: false,
          headers: { "Content-type": "application/json" },
          success: function(weather) {
              console.log((weather.currently.temperature-32)* 5 / 9); // fah to celsius
              console.log(weather.currently.windSpeed*1.60934); // mph to kmph
              gotWeather((weather.currently.temperature-32)* 5 / 9, weather.currently.windSpeed*1.60934, weather.currently.windBearing);
            }
            } );
            }
  } );
  
    wind = createVector();
    
    numberOfParticles = floor(width/14);
    
    for(i=0; i<numberOfParticles; i++){
      particle = new Particle(); 
      particles.push(particle);
      
      arrow = new Arrow();
      arrows.push(arrow);
    }
    
    colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  // if temperature was read
  if(temp!="temp"){
      hsb = getHsb(temp);
      drawBackground(hsb);
      
      for(i=0; i<numberOfParticles; i++){
          particles[i].draw(wind, i);
          arrows[i].draw(wind,i);
      }
      	//drawMainArrow(hsb, $(".message").offset().left + $(".message").width()/2, $(".message").offset().top);
        //console.log(status.length);
        if(windMag<10)
            $(".message").html("Barely windy");
        else if(10<windMag<20)
            $(".message").html("A bit windy");
        else if(20<windMag<30)
            $(".message").html("Quite windy");
        else if(windMag>30)
            $(".message").html("Very windy");
    }
}

function gotWeather(temperature, windSpeed, windDirection) {
    // Get the angle (convert to radians)
    var angle = radians(Number(windDirection));
    windAngle = angle;
    // Get the wind speed
    windMag = Number(windSpeed);
    temp = floor(temperature);

    // Make a vector
    wind = p5.Vector.fromAngle(angle);
    // multiply wind magnitude
    wind.mult(windMag/3);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    particles = [];
    arrows = [];
    
    numberOfParticles = floor(width/14);
    
    for(i=0; i<numberOfParticles; i++){
      particle = new Particle(); 
      particles.push(particle);
      
      arrow = new Arrow();
      arrows.push(arrow);
    }
}