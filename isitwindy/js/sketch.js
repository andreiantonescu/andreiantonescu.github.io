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
        'b' : 96
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

    this.draw = function(speed, i, mouseX, mouseY){

      mouse = createVector(mouseX, mouseY);
      normalizedPosition = this.position.copy();
      distance = mouse.dist(normalizedPosition);

      repulsion = createVector(normalizedPosition.x - mouse.x - sin(i), normalizedPosition.y - mouse.y - cos(i));
      repulsion.normalize()
     
      if (distance<30){
        this.position.add(repulsion)
      }
      else if (distance<60){
        repulsion.div(2)
        this.position.add(repulsion)
      }
      else if (distance<90){
        repulsion.div(3)
        this.position.add(repulsion)
      }
      else if (distance<120){
        repulsion.div(4)
        this.position.add(repulsion)
      }
      
      this.position.add(speed)

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
    
    this.draw = function(speed, i, mouseX, mouseY){
      
      mouse = createVector(mouseX, mouseY);
      normalizedPosition = this.position.copy();
      distance = mouse.dist(normalizedPosition);

      repulsion = createVector(normalizedPosition.x - mouse.x - sin(i), normalizedPosition.y - mouse.y - cos(i));
      repulsion.normalize()
     
      if (distance<30){
        this.position.add(repulsion)
      }
      else if (distance<60){
        repulsion.div(2)
        this.position.add(repulsion)
      }
      else if (distance<90){
        repulsion.div(3)
        this.position.add(repulsion)
      }
      else if (distance<120){
        repulsion.div(4)
        this.position.add(repulsion)
      }
      
      this.position.add(speed);

      // add some randomness
      this.position.x = this.position.x + cos(i)/10;
      this.position.y = this.position.y + sin(i)/10;
      this.size = this.size;
      
      boundCheck(this.position);
      
      stroke(color(255, this.opacity));
      strokeWeight(1);
      push();
      translate(this.position.x, this.position.y);
      rotate(windAngle);
      line(0, 0, this.size*2 ,0);
      //arrow
      line(this.size*2, 0, this.size*1.4, -this.size/2);
      line(this.size*2, 0, this.size*1.4, this.size/2);
      pop();
    }   
}

function getData() {
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
      jQuery.ajax( { 
         url: 'http://api.wunderground.com/api/16edb6959424f26b/conditions/settings/q/'+ location.lat +',' + location.lon + '.json', 
         type: 'GET', 
          dataType: 'jsonp',
          cache: false,
          headers: { "Content-type": "application/json" },
          success: function(weather) {
              console.log('http://api.wunderground.com/api/16edb6959424f26b/conditions/settings/q/'+ location.lat +',' + location.lon + '.json')
              console.log(weather.current_observation.wind_kph)
              console.log(weather.current_observation.wind_gust_kph)
              //console.log((float(weather.current_observation.wind_kph) + float(weather.current_observation.wind_gust_kph))/2)

              console.log(weather.current_observation.temp_c)

              //wind = (float(weather.current_observation.wind_kph) + float(weather.current_observation.wind_gust_kph))/2
              if(max(float(weather.current_observation.wind_gust_kph), float(weather.current_observation.wind_kph)) < 1){
                wind = 1.0;
              } else {
                wind = max(float(weather.current_observation.wind_gust_kph), float(weather.current_observation.wind_kph));
              }
              gotWeather(weather.current_observation.temp_c, wind, weather.current_observation.wind_degrees);
            }
            } );
            }
  } );
}

function setup() {
    createCanvas($(window).width(), $(window).height());
  
    getData();
  
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
      
      // removed mobile for now
      for(i=0; i<numberOfParticles; i++){
          particles[i].draw(wind, i, mouseX, mouseY);
          arrows[i].draw(wind, i , mouseX, mouseY);
      }
      	//drawMainArrow(hsb, $(".message").offset().left + $(".message").width()/2, $(".message").offset().top);
        //console.log(status.length);
        if(windMag<10)
            $(".message").html("Barely windy");
        else if(10<windMag && windMag<20)
            $(".message").html("A bit windy");
        else if(20<windMag && windMag<30)
            $(".message").html("Quite windy");
        else if(windMag>30)
            $(".message").html("Very windy");
        
    }
    
    $('html, body').on('touchstart touchmove', function(e){ 
     //prevent native touch activity like scrolling
     e.preventDefault(); 
  	});
	 	
    // recheck weather data
    if (floor((millis()/10)%60000) == 0){
        getData();
    }
}

function gotWeather(temperature, windSpeed, windDirection) {
    // Get the angle (convert to radians)
    var angle = radians(180-windDirection);
    windAngle = angle;
    // Get the wind speed
    windMag = Number(windSpeed);
    temp = floor(temperature);

    // Make a vector
    wind = p5.Vector.fromAngle(angle);
    // multiply wind magnitude
    wind.mult(windMag/4);
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