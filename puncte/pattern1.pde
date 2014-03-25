PShape puncte; 
int pattern=1;

void setup() { 
  size(window.innerWidth, window.innerHeight); 
  background(0);
  puncte = loadShape("puncte-01.svg");
  smooth();
  frameRate(10);
}

void draw()
{
  size(window.innerWidth, window.innerHeight); 
  background(0);
  noStroke();
  fill(255);

  if(pattern==2){
  for(float i=0;i<width;i+=abs((sin(millis())*100)))
    for(int j=0;j<height;j+=abs((sin(millis())*100))) {
    ellipse(i,j,2.5,2.5);
  } 

  for(int i=10;i<width;i+=20){
    if(abs(int(sin(millis())*10))==7){
      for(float j=10;j<height;j+=abs((cos(millis())*30))) {
        ellipse(i,j,2.5,2.5); } }
    else {
      for(float j=10;j<height;j+=20) {
        ellipse(i,j,2.5,2.5); } }
  }
  }
  else if(pattern==1) {for(float i=0;i<width;i+=20)
    for(int j=0;j<height;j+=20) {
    ellipse(i,j,2.5,2.5);
  } 
  for(int i=10;i<width;i+=20)
    for(float j=10;j<height;j+=20) {
    ellipse(i,j,2.5,2.5);
  } } 

  shapeMode(CENTER);
  shape(puncte, width/2,height/2,puncte.width,puncte.height);
  
}

void setPattern(){
pattern++;
if(pattern>2)
pattern=1;
}