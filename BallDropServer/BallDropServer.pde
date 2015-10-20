/*
  ball drop server
 Language:  Processing
 
 This program listens for TCP socket connections and uses the 
 data from the incoming connections in a networked multiplayer 
 ball drop game.
 
 Created sometime in 2007
 modified 8 Sept 2014
 by Tom Igoe
 
 */

// include the net library:
import processing.net.*;

// variables for keeping track of clients:
int port = 8080;                        // the port the server listens on
Server myServer;                        // the server object
ArrayList playerList = new ArrayList(); // list of clients

// Variables for keeping track of the game play and graphics:

float ballSize = 10.0;             // the size of the ball
float ballDirectionV = 0.0;        // the ball's horizontal direction. 
// left is negative, right is positive
float ballDirectionH = 1.5;        // the ball's vertical direction.
// up is negative, down is positive
float ballPosV, ballPosH;        // the ball's vertical/horizontal and vertical positions
boolean ballInMotion = false;  // whether or not the ball should be moving
float gravity = 0.1;
float elasticity = -0.5;



int topScore;     // scores for the top team and the bottom teams
int hitDeck = 0;
float paddleHeight = 10.0;     // vertical dimension of the paddles
float paddleWidth = 90.0;      // horizontal dimension of the paddles
float nextPaddleV;             // paddle position for the next player to be created
float nextPaddleH;             // paddle horizontal position for the next player
float highestPaddleV;          // highest a paddle can be
boolean gameOver = false;      // whether or not a game is in progress
long delayCounter;             // a counter for the delay after 
// a game is over
long gameOverDelay = 8000;     // pause after each game
long pointDelay = 3000;        // pause after each point
boolean resultsAreOn = true;   // whether to show results

Player lastPlayerHit;
String serverIp;

void setup() {
  // set the window size:
  size(800, 600);
  // set the frame rate:
  frameRate(90);
  // set up all the pong details:
  gameSetup();
  // Start the server:
  myServer = new Server(this, port);
  serverIp = myServer.ip();
}

void gameSetup() {
  // create a font with the third font available to the system:
  PFont myFont = createFont(PFont.list()[1], 18);
  textFont(myFont);

  // set the default font settings:
  textFont(myFont, 18); 
  textAlign(CENTER);

  // initialize the delay counter:
  delayCounter = millis();
  // initalize paddle positions for the first player.
  // these will be incremented with each new player:
  nextPaddleV = height - ((paddleHeight * 2.0) * 16.0);
  highestPaddleV = nextPaddleV;

  nextPaddleH = paddleWidth;
  // initialize the ball in the center of the screen:
  ballPosV = ballSize * 2.0;
  ballPosH = int(random(width));

  // set no borders on drawn shapes:
  noStroke();
  // set the rectMode so that all rectangle dimensions 
  // are from the center of the rectangle (see Processing reference):
  rectMode(CENTER);
}

void draw() {
  checkPlayerList();
  gameDraw();
  listenToClients();
}


// The ServerEvent message is generated when a new client 
// connects to the server.
void serverEvent(Server someServer, Client someClient) {
  boolean isPlayer = false;

  if (someClient != null) {
    // iterate over the playerList:
    for (int p = 0; p < playerList.size (); p++) {
      // get the next object in the ArrayList and convert it
      // to a Player:

      Player thisPlayer = (Player)playerList.get(p);

      // if thisPlayer's client matches the one that generated 
      // the serverEvent, then this client is already a player:
      if (thisPlayer.client.ip().equals(someClient.ip())) {
        // we already have this client
        println("client already here");
        isPlayer = true;
      }
    }

    // if the client isn't already a Player, then make a new Player
    // and add it to the playerList:
    if (!isPlayer) {
      makeNewPlayer(someClient);
    }
  }
}

/*
  This method checks the player list and removes any
 unexpectedly dead clients. Thanks to Peiqi Su for this fix.
 */

void checkPlayerList() {
  for (int p = 0; p < playerList.size (); p++) {
    Player thisPlayer = (Player)playerList.get(p);  
    Boolean died = false;
    try {
      thisPlayer.client.ip();
    }
    catch (Exception e) {
      println("a client dropped unexpectedly");
      playerList.remove(p);
      continue;
    }
  }
}

void makeNewPlayer(Client thisClient) {
  // paddle position for the new Player:
  float h = 0;
  float v = 0;

  /*
  Get the paddle position of the last player on the list.
   If it's on top, add the new player on the bottom, and vice versa.
   If there are  no other players, add the new player on the top.
   */
  // get the size of the list:
  int listSize = playerList.size() - 1;
  // if there are any other players:
  if  (listSize >= 0) {

    // increment the position and add the next player:  
    nextPaddleV = nextPaddleV + paddleHeight * 2;
    nextPaddleH = nextPaddleH + paddleWidth/2;
    h = nextPaddleH;
    v = nextPaddleV;
  } 
  // if there are no players, add to the top:
  else {
    h = nextPaddleH;
    v = nextPaddleV;
  }

  // make a new Player object with the position you just calculated
  // and using the Client that generated the serverEvent:
  Player newPlayer = new Player(h, v, thisClient);
  // add the new Player to the playerList:
  playerList.add(newPlayer);

  // Announce the new Player:
  print("We have a new player: ");
  println(newPlayer.client.ip());
  newPlayer.client.write("hi\r\n");
  newPlayer.client.write("l = left, r = right, u = up, d = down\r\n");
  newPlayer.client.write("x = exit\r\n");
  newPlayer.client.write("1 point for each time the ball hits a new paddle\r\n");
  newPlayer.client.write("(minimum 2 players)\r\n");
}

void listenToClients() {
  // get the next client that sends a message:
  Client speakingClient = myServer.available();
  Player speakingPlayer = null;

  // iterate over the playerList to figure out whose
  // client sent the message:
  for (int p = 0; p < playerList.size (); p++) {
    // get the next object in the ArrayList and convert it
    // to a Player:
    Player thisPlayer = (Player)playerList.get(p);
    // compare the client of thisPlayer to the client that sent a message.
    // If they're the same, then this is the Player we want:
    if (thisPlayer.client == speakingClient) {
      speakingPlayer = thisPlayer;
    }
  }

  // read what the client sent:
  if (speakingPlayer != null) {
    int whatClientSaid = speakingPlayer.client.read();
    /*
  There a number of things it might have said that we care about:
     x = exit
     l = move left   
     r = move right
     u = move up
     d = move down
     i = display IP address
     n=XXXXX\n - set name (n,= and \n are the terminators. Everyting between is the name)
     */
    if (speakingPlayer.gettingName == true) {
      if (speakingPlayer.name.length() >= 16) {
        speakingPlayer.client.write("name changed to " + speakingPlayer.name + "\r\n");
        speakingPlayer.gettingName = false;
      }
      switch (whatClientSaid) { 

      case '\n':
        speakingPlayer.client.write("new name: " + speakingPlayer.name + "\r\n"); 
        speakingPlayer.gettingName = false;
        break;
      case '=':
      case '\r': // ignore the carriage return
        break;
      default:
        speakingPlayer.name += char(whatClientSaid);
      }
    } else {
      switch (whatClientSaid) { 
        // If the client says "exit", disconnect it 
      case 'x':
        // say goodbye to the client:
        speakingPlayer.client.write("bye\r\n"); 
        // disconnect the client from the server:
        println(speakingPlayer.client.ip() + "\t left"); 
        myServer.disconnect(speakingPlayer.client); 
        // remove the client's Player from the playerList:
        playerList.remove(speakingPlayer);

        break;
      case 'l':
        // if the client sends an "l", move the paddle left
        speakingPlayer.movePaddle(-30);
        break;
      case 'u':
        // if the client sends an "u", move the paddle up
        speakingPlayer.raisePaddle(-10);
        break;
      case 'd':
        // if the client sends an "d", move the paddle down
        speakingPlayer.raisePaddle(10);
        break;

      case'r':
        // if the client sends a "r", move the paddle right
        speakingPlayer.movePaddle(30);
        break;
      case 'i':
        // toggle the address of this player:
        if (speakingPlayer.label < 2) {
          speakingPlayer.label++;
        } else {
          speakingPlayer.label = 0;
        }
        break;
      case 'n':
        speakingPlayer.name = "";
        speakingPlayer.client.write("enter a new name, 16 characters max.:\r\n");
        speakingPlayer.gettingName = true;
        break;
      default:
        break;
      }
    }
  }
}

void gameDraw() {
  background(0);
  // draw all the paddles
  for (int p = 0; p < playerList.size (); p++) {
    Player thisPlayer = (Player)playerList.get(p);
    // show the paddle for this player:
    thisPlayer.showPaddle();
  }

  // calculate ball's position:
  if (ballInMotion) {
    moveBall();
  }
  // Draw the ball:
  rect(ballPosH, ballPosV, ballSize, ballSize);

  // show the score:
  showScore();

  // if the game is over, show the winner:
  if (gameOver) {

    if (resultsAreOn) {
      displayResults();
    } else {
      textSize(24);
      gameOver = true;
      text("Game Over", width/2, height/2 - 30);
      showInstructions();
    }
  }
  // pause after each game:
  if (gameOver && (millis() > delayCounter + gameOverDelay)) {
    if (playerList.size() == 1) {
      gameOver = false;
      newGame();
    }
  }
  // pause after each point:
  if (!gameOver && !ballInMotion && (millis() > 
    delayCounter + pointDelay)) {

    // make sure there are at least two players:
    if (playerList.size() >=1) {
      ballInMotion = true;
    } else {
      ballInMotion = false;
      textSize(24);
      textAlign(CENTER);
      text("Waiting for players", width/2, height/2 - 30);
      showInstructions();
    }
  }
}

void showInstructions() {
  textAlign(LEFT);
  int leftMargin = 100;
  text("Log in to " + serverIp + " port 8080 to play", leftMargin, height/2);
  text("l = left, r = right, u = up, d = down", leftMargin, height/2 + 30);
  text("i = display name/IP address", leftMargin, height/2 + 60);
  text("n=XXXXX\\n - set name (n,= and \\n are the terminators.", leftMargin, height/2 + 90);
  text("                      Everything between is the name)", leftMargin, height/2 + 120);
  text("x = exit", leftMargin, height/2 + 150);
  text("1 point for each time the ball hits a new paddle", leftMargin, height/2 + 180);
  text("(minimum 2 players)", leftMargin, height/2 + 210);
}
void moveBall() {

  // local variable for calculating height position:
  float newBallPosV; 
  boolean collided = false;

  // calculate  the new position:
  newBallPosV = ballPosV + ballDirectionV;
  ballDirectionV = ballDirectionV + gravity;

  // Check to see if the ball contacts any paddles:
  for (int p = 0; p < playerList.size (); p++) {
    // get the player to check:
    Player thisPlayer = (Player)playerList.get(p);

    // calculate the horizontal edges of the paddle:
    float paddleRight = thisPlayer.paddleH + paddleWidth/2.0;
    float paddleLeft = thisPlayer.paddleH - paddleWidth/2.0;

    // check to see if the ball is in the horizontal range of the paddle:
    if ((ballPosH >= paddleLeft) && (ballPosH <= paddleRight)) {

      // calculate the vertical edges of the paddle:
      float paddleTop = thisPlayer.paddleV - paddleHeight/2.0;
      float paddleBottom = thisPlayer.paddleV + paddleHeight/2.0;

      // check the new vertical position against the paddle vertical position:
      if (ballDirectionV >= 0.0) {
        // ball is descending
        if ((newBallPosV >= paddleTop) && (ballPosV < paddleTop)) {
          // if it's in or below the paddle, put it on top
          // and reverse it:
          // put the ball on top of the paddle:
          newBallPosV = paddleTop - ballSize;
          collided = true;

          //if this is the first bounce, increment the score:
          if (lastPlayerHit != thisPlayer) {
            lastPlayerHit = thisPlayer;
            topScore++;           
            // increment the player's score:
            thisPlayer.addScore(1);
            // give the ball some English from the paddle:
            ballDirectionH = constrain(ballDirectionH + (thisPlayer.paddleVelocity/10.0), 0.1, 2.0);
          }
        }
      } else {     // ballDirectionV < 0
        // ball is ascending 
        if ((newBallPosV <= paddleBottom) && (ballPosV >= paddleBottom)) {
          // if it's in or below the paddle, put it on bottom
          // and reverse it:

          // put the ball on the bottom of the paddle:
          newBallPosV = paddleBottom + ballSize;
          collided = true;
        }
      }
    }
  }

  if (newBallPosV > height) {
    newBallPosV = height - ballSize/2.0;
    collided = true;
  }


  // if any team goes over 5 points, the other team loses:
  if (hitDeck >= 4) {
    delayCounter = millis();
    gameOver = true;
  }

  // stop the ball going off the left or right of the screen:
  if ((ballPosH - ballSize/2.0 <= 0.0) || (ballPosH +ballSize/2.0 >=width)) {
    // reverse the y direction of the ball:
    ballDirectionH = -ballDirectionH;
  }

  if (collided) {
    // reverse the ball vertical direction:
    ballDirectionV = ballDirectionV * elasticity;
    collided = false;
  }

  // if all went well, then 
  ballPosV = newBallPosV;

  // update the ball position:
  ballPosH = ballPosH + ballDirectionH;

  // when the ball hits the ground and stops bouncing, stop:
  if ((abs(ballDirectionV) <= 0.3) && abs(height - newBallPosV ) <= 10.0) {
    ballDirectionV = 0.0; 
    resetBall();
  }
}

void newGame() {
  gameOver = false;
  topScore = 0;
  hitDeck = 0;
}

public void showScore() {
  textSize(24);
  textAlign(LEFT);
  text("Score: " + topScore, 20, 40); 
  textAlign(RIGHT);
  text("remaining balls: " + (5 - hitDeck), width - 20, 40);
}

void resetBall() {
  // increment the hit deck counter:
  hitDeck++;
  // put the ball back in the center
  ballPosV = ballSize;
  ballPosH = int(random(width));
  ballInMotion = false;
  delayCounter = millis();
}

void displayResults() {

  ArrayList sortedPlayers = new ArrayList();
  int counter = 0;
  int nextScoreLine = 80;
  int nextPlayer = 0;

  // iterate over the playerList:
  while (sortedPlayers.size () < playerList.size()) {

    for (int p = 0; p < playerList.size (); p++) {
      Player thisPlayer = (Player)playerList.get(p);      
      if (thisPlayer.myScore == counter) {
        sortedPlayers.add(thisPlayer);
      }
    }
    counter++;
  }

  for (int p = 0; p < sortedPlayers.size (); p++) {

    // get the next object in the ArrayList and convert it
    // to a Player:
    Player thisPlayer = (Player)sortedPlayers.get(p);
    String label = thisPlayer.address;
    if (!thisPlayer.name.equals("no name")) {
      label = thisPlayer.name;
    }

    textSize(24);
    textAlign(LEFT);
    text("Player: " + label + " \tScore: " + thisPlayer.myScore, 20, nextScoreLine); 
    nextScoreLine += 30;
  }
}

void keyReleased() {
  resultsAreOn = !resultsAreOn;
}