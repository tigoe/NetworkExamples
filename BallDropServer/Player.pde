
public class Player {  
  // declare variables that belong to the object:
  float paddleH, paddleV, paddleVelocity;
  Client  client;
  boolean showAddress;
  color paddleColor;
  int myScore;
  boolean gettingName = false;
  String name = "";

  public Player (float hpos, float vpos, Client someClient) {
    // initialize the localinstance variables:
    paddleH = hpos;
    paddleVelocity = hpos;
    paddleV = vpos;
    name = someClient.ip();

    int[] octets = int(split(someClient.ip(), "."));
    if (octets.length > 2) {
      paddleColor = color(64, 64, octets[3]);
    } 
    else {
      paddleColor = color(64, 64, 255);
    }
    client = someClient;
    showAddress = true;
  }

  public void movePaddle(float howMuch) {
    float newPosition = 0;
    newPosition = paddleH + howMuch;

    paddleVelocity = howMuch;
    // constrain the paddle's position to the width of the window:
    paddleH = constrain(newPosition, 0, width);
  }


  public void raisePaddle(float howMuch) {
    float newPosition = paddleV + howMuch;

    // constrain the paddle's position to the width of the window:
    paddleV = constrain(newPosition, highestPaddleV, height);
  }


  public void addScore (int howMuch) {
    myScore+= howMuch;
  }


  public void showPaddle() {
    fill(paddleColor);
    rect(paddleH, paddleV, paddleWidth, paddleHeight); 
    fill(255);

    // display the address of this player near its paddle
    if (showAddress) {
      textSize(10); 
      textAlign(CENTER);
      text(name, paddleH, paddleV + paddleHeight/2 -1 );
    }

    if (abs(paddleVelocity) > 0) {
      movePaddle(paddleVelocity);
      paddleVelocity= paddleVelocity/2 ;
    }
  }
}

























