var particles = [] 
var arrows = [] 
var numberOfParticles = 0 
var temp = 0
var wind = {
  angle: 0,
  speed: 0,
  vector: null
}

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
    return hsl
}

function getHsb(temp){
    var hsb = {
        'h' : 0,
        's' : 80,
        'b' : 85
      };
    
    temp = temp > 32 ? 32 : temp < -10 ? -10 : temp

    hsb.h = 200 - temp.map(0, 40, 0, 250)

    return hsb
}

function drawBackground(hsb) {
    var hsl = calculateHSL(hsb)
    background(hsb.h, hsb.s, hsb.b)
    $('body').css('background', 'hsl(' + hsl.h + ',' + hsl.s + '%,' + hsl.l + '%)') // css HSL
}

function boundCheck(position){
    if (position.x > width)  position.x = 0
    if (position.x < 0)      position.x = width
    if (position.y > height) position.y = 0
    if (position.y < 0)      position.y = height
}

function Particle () {
    this.position = createVector(random(width), random(height))
    this.size = random(8)
    this.opacity = random(1)

    this.draw = function(speed, i, mouseX, mouseY){

      mouse = createVector(mouseX, mouseY)
      normalizedPosition = this.position.copy()
      distance = mouse.dist(normalizedPosition)

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
      this.position.x = this.position.x + cos(i)/10
      this.position.y = this.position.y + sin(i)/10
      this.size = this.size
      
      boundCheck(this.position)
      
      noStroke()
      fill(color(25, this.opacity))
      ellipse(this.position.x, this.position.y, this.size, this.size)
    }   
}

function Arrow () {
    this.position = createVector(random(width), random(height))
    this.size = random(10)
    this.opacity = random(1)
    
    this.draw = function(speed, i, mouseX, mouseY){
      
      mouse = createVector(mouseX, mouseY)
      normalizedPosition = this.position.copy()
      distance = mouse.dist(normalizedPosition)

      repulsion = createVector(normalizedPosition.x - mouse.x - sin(i), normalizedPosition.y - mouse.y - cos(i))
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
      this.position.x = this.position.x + cos(i)/10
      this.position.y = this.position.y + sin(i)/10
      this.size = this.size
      
      boundCheck(this.position)
      
      stroke(color(255, this.opacity))
      strokeWeight(1)
      push()
      translate(this.position.x, this.position.y)
      rotate(wind.angle);
      line(0, 0, this.size*2 ,0)
      //arrow
      line(this.size*2, 0, this.size*1.4, -this.size/2)
      line(this.size*2, 0, this.size*1.4, this.size/2)
      pop();
    }   
}

function setWeather(temperature, windSpeed, windDirection) {
  temp = floor(temperature)

  if (!windDirection){
    windDirection = -90
  }
  if (!windSpeed) { 
    windSpeed = 0.5
  }
  
  // convert to radians and account for meteorological degrees
  wind.angle = radians(windDirection + 90)
  wind.speed = Number(windSpeed)

  wind.vector = p5.Vector.fromAngle(wind.angle) 
  // add wind magnitude 
  wind.vector.mult(wind.speed/4)
}

function getData(){
  jQuery.ajax( { 
    url: 'http://ip-api.com/json', 
    type: 'GET', 
    dataType: 'jsonp',
    cache: false,
    headers: { "Content-type": "application/json" },
    success: function(location) {
      jQuery.ajax( { 
        url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + location.lat + '&lon=' + location.lon +  '&units=metric&APPID=4e6e342eef6a9a7f8ea3d5f3f95a7b84', 
        type: 'GET', 
        dataType: 'jsonp',
        cache: false,
        headers: { "Content-type": "application/json" },
        success: function(weather) {
          console.log(weather)
          setWeather(weather.main.temp, weather.wind.speed, weather.wind.deg)
        }
      });
  }
} );
}

function setup() {
    particles = []
    arrows = []
    temp = 0

    createCanvas($(window).width(), $(window).height());
    getData()

    numberOfParticles = floor(width/14)
    if(numberOfParticles>90){
      numberOfParticles = 90
    } 

    for(i=0; i < numberOfParticles; i++){
      particle = new Particle() 
      particles.push(particle)
      
      arrow = new Arrow()
      arrows.push(arrow)
    }
    colorMode(HSB, 360, 100, 100, 1)
}


function draw() {
  // if temperature was read
  if(temp && wind){
      hsb = getHsb(temp)
      drawBackground(hsb)
      
      // removed mobile for now
      for(i=0; i < numberOfParticles; i++){
          particles[i].draw(wind.vector, i, mouseX, mouseY)
          arrows[i].draw(wind.vector, i , mouseX, mouseY)
      }

      if(wind.speed < 2)
          $(".message").html("Barely windy")
      else if(2 <= wind.speed && wind.speed < 6)
          $(".message").html("A bit windy")
      else if(6 <= wind.speed && wind.speed < 9)
          $(".message").html("Quite windy")
      else if(9 < wind.speed && wind.speed < 12)
          $(".message").html("Really windy")
      else if(wind.speed >= 12)
          $(".message").html("Outright windy")
    }
    
    $('html, body').on('touchstart touchmove', function(e){ 
     //prevent native touch activity like scrolling
     e.preventDefault()
  	});
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    
    particles = []
    arrows = []
    
    numberOfParticles = floor(width/14)
    if(numberOfParticles>90){
      numberOfParticles = 90
    }
      
    
    for(i=0; i<numberOfParticles; i++){
      particle = new Particle()
      particles.push(particle)
      
      arrow = new Arrow()
      arrows.push(arrow)
    }
}