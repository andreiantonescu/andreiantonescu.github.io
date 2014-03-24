PShape puncte; 

//boolean sketchFullScreen() {
  //return true;
//}

void setup()
{ 
  
  //size(displayWidth,displayHeight);
  // BROSWSER
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
  
 
  
  for(float i=0;i<width;i+=abs((sin(millis())*100)))
    for(int j=0;j<height;j+=abs((sin(millis())*100))) {
    ellipse(i,j,2.5,2.5);
  } 
  for(int i=10;i<width;i+=20){
   if(abs(int(sin(millis())*10))==7){
    for(float j=10;j<height;j+=abs((cos(millis())*30))) {
    ellipse(i,j,2.5,2.5);
    }
   }
    else {
      for(float j=10;j<height;j+=20) {
    ellipse(i,j,2.5,2.5);
      }
    }
  } 
  
  //print(abs(int(sin(millis())*10)) + " ");
  shapeMode(CENTER);
  shape(puncte, width/2,height/2,puncte.width,puncte.height);

}
