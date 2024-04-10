var jumpSound;

var floorPos_y;
var lives;

var gameChar_x;
var gameChar_y;
var numberOfElements;
var game_score;
var scrollPos;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isFallingC;
var EnemyPlayer;
var isOnPlatform;
var winB;
var failB;

var flagPole;
var trees_x;
var treePos_y;
var clouds;
var mountains;
var collItems;
var canyons

var gameChar_world_x;
var deathS;
var sound;
var platform1;
var restart;

function preload(){
    soundFormats('mp3','wav','ogg');
    /*sound = loadSound('assets/falling.wav');
    sound.setVolume(0.1);
    
    item = loadSound('assets/item.ogg');
    
    winS = loadSound('assets/win.wav');
    
    killS = loadSound('assets/kill.ogg');
    killS.setVolume(2.0);
   
    deathS = loadSound('assets/death.mp3');
    deathS.setVolume(0.2);
    
    KO = loadSound('assets/ko.mp3');
    KO.setVolume(0.5);
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    */
    
}
function touchStarted() {
  getAudioContext().resume();
}
function setup(){
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    startGame();
}
function startGame(){
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    numberOfElements = floor(random(2,5));
    game_score = 0;
    seconds=0;

	// Variable to control the background scrolling.
	scrollPos = 0;
	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isFallingC = false;
    EnemyPlayer = false;
    isOnPlatform = false;
    winB = false;
    failB = false;
    jump = false;
    soundPlay = false;
    jumpP = false;
    
    
    // Initialise arrays of scenery objects.
    flagPole = {x_pos: 500* numberOfElements, isReached: false};
    trees_x = [];
    treePos_y = floorPos_y - 100;
    
    clouds = [];
    for(var i = 0; i < numberOfElements; i++){
        var cloud = {x_pos: 130 + i*500 + random(10), width: 100}
        clouds.push(cloud);
    }
    mountains = [];
    for(var i = 0; i < numberOfElements; i++){
        var mountain = {x_pos: 195 + i*500}
        mountains.push(mountain);
    }
    canyons = [];
    for(var i = 0; i < numberOfElements; i++){
        var canyon = {x_pos: 50 + i*500, width: 1}
        canyons.push(canyon);
    }
    
     for(i = 1; i<numberOfElements; i++){
        var tree_x = canyons[i-1].x_pos+210 + random(100);
        trees_x.push(tree_x);
    }
    
    platforms = []
    platform1 = {x_pos: flagPole.x_pos - 100, y_pos: floorPos_y-70, width:50, height: 20 , color: [255,0,0]};
    platforms.push(platform1);
    for(i = 0; i <random(7); i++){
    platform2 = {x_pos: 300 + i*200 + random(50), y_pos: floorPos_y - 50, width:50, height: 20 , color: [random(255), random(255),random(255)]};
    platforms.push(platform2);
    }
    reachedPlatforms = [];
    
    collItems = [];
    for(var i = 0; i < numberOfElements - 1; i++){
        var collectable = {x_pos: 420 + i*500, y_pos: 420, size: 1}
        collItems.push(collectable);
    }
    var collectable = {x_pos: platform1.x_pos + platform1.width/2, y_pos: platform1.y_pos - 10, size: 1 }
    collItems.push(collectable);
    foundItems = [];
    enemies = [];
    for(var i = 0; i < numberOfElements-1; i++){
        var enemy2 = {x_pos: 360 + i*500, y_pos: floorPos_y, speed: 1, IsKilled: false};
        enemies.push(enemy2);
    }    
    enemyKilled=[];
}
function draw(){
    if(restart){
        soundPlay = false;
        //winS.stop();
        startGame();
        lives=3;
    }
	background(100, 155, 255); // fill the sky blue
    noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    drawScore();
    push();
    translate(scrollPos,0);
    
    // Draw clouds.
    drawClouds();
    // Draw mountains.
    drawMountains();
    // Draw trees.
    drawTrees();
    // Draw canyons.
    for(var i = 0; i < canyons.length; i++){
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    // Draw collectable items.
    for(var i=0; i<collItems.length; i++){
        checkCollectable(collItems[i]);
    }
    drawPlatforms();
	// Draw game character.
    drawGameChar();
    //flagpole
    renderFlagPole(flagPole.x_pos, floorPos_y);
    drawEnemies();
    
	// Logic to make the game character move or the background scroll.
	if(isLeft && !isFallingC && !winB && !failB)
	{
            if(gameChar_x > width * 0.2){
                gameChar_x -= 5;		
            }
            else{
			scrollPos += 5;
            }
        }
    if(isRight && !isFallingC && !winB && !failB)
	{
        if(gameChar_x < width * 0.8){
			gameChar_x  += 5;
            }
            else{
                scrollPos -=5;
            }
        }
    pop();
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    checkFlagPole();
    drawTextLives();
    checkPlayerDie();
}
// ---------------------
// Key control functions
// ---------------------
function keyPressed(){
     if(keyCode == 37){
        isLeft = true;
    }
    if(keyCode == 39){
        isRight = true;
    }
    if(keyCode == 32 ){
        isPlummeting = true;
    }
    if(keyCode == 13 && winB || failB){
        restart = true;
    }
}
function keyReleased(){
    if(keyCode == 37){
        isLeft = false;
    }
    if(keyCode == 39){
        isRight = false;
    }
    if(keyCode == 32){
        isPlummeting = false;
    } 
    if(keyCode == 13 && !restart && !winB || !failB){
        restart = false;
    }
}
function win(){
    if(flagPole.isReached && foundItems.length == numberOfElements){
        if(!soundPlay){
            //winS.play()
            soundPlay = true;
        }
        push();
        fill(0);
        rect(0,0,width, height);
        fill(255);
        textAlign(CENTER);
        text("The end with love", width/2, height/2);
        pop();
        winB = true;
    }
}
function fail(){
    if(lives <= 0){
        if(!soundPlay){
            //KO.play();
            soundPlay=true;
        }
        push();
        failB = true;
        fill(0);
        rect(0,0,width, height);
        fill(255);
        textAlign(CENTER);
        text("The end ", width/2, height/2);
        pop();
        }
    }
// ------------------------------
// Game character render function
// ------------------------------
// Function to draw the game character.
function drawGameChar(){
    console.log(isOnPlatform)
    // draw game character
    if(!winB || !failB){
        if(isLeft && isFalling)
        {
            jumpLeft();
        }
        else if(isRight && isFalling)
        {
            jumpRight();
        }
        else if(isLeft)
        {
            walkLeft();
        }
        else if(isRight)
        {
            walkRight();
        }
        else if(isFalling || isPlummeting )
        {
            jumpForward();
        }
        else
        {
            standForward();
        }
        
        if(gameChar_y> 576 || EnemyPlayer){
            //deathS.play();
            startGame();
            //sound.stop();
        }
        
    
        if(isPlummeting && gameChar_y >= floorPos_y  &&!winB ){
            jump = true;
            if(!isFallingC){
            //jumpSound.play();
            }
        }
        
        else if(isPlummeting && isOnPlatform){
            jumpP = true;
        }
        
        else if((floorPos_y  - gameChar_y)>= 100 && !isOnPlatform && !jumpP){
            isFalling = true;
            jump = false;
        }
        
        else if(((floorPos_y -50) - gameChar_y) >= 100 && jumpP){
            isFalling = true;
            jumpP = false;
        }
        
        else if(!isOnPlatform && gameChar_y<=floorPos_y - 49){
            isFalling = true;
        }
        
        else if (gameChar_y == floorPos_y  || isOnPlatform){
            isFalling = false;
        }
        
        if(isFalling == true && isFallingC == false ){
            if((floorPos_y - gameChar_y)>=0){
                gameChar_y+=5;
                if(floorPos_y - gameChar_y < 0){
                    gameChar_y = floorPos_y;
                }
                else if(isOnPlatform){
                    gameChar_y = floorPos_y- 50;
                }
            }
        }
        if(isFalling == true && !isOnPlatform && !jumpP && isFallingC == true){
            gameChar_y++;
        }
        if(jump == true){
            if((floorPos_y  - gameChar_y)>= 0){
              gameChar_y-=10;  
            }
        }
        if(jumpP){
            if((floorPos_y- 50 - gameChar_y)>=0){
                gameChar_y-=10;
            }
        }
        
        if(gameChar_y > floorPos_y && isFalling == false){
            gameChar_y == floorPos_y;
        }
    }
}
function standForward(){
     //boots
    stroke(1);
    fill("brown");
    arc(gameChar_world_x + 8,gameChar_y - 1,8,8,PI,0);
    arc(gameChar_world_x - 7,gameChar_y - 1,8,8,PI,0);
    line(gameChar_world_x + 3.5, gameChar_y - 1, gameChar_world_x + 11.5, gameChar_y - 1);
    line(gameChar_world_x - 3.5, gameChar_y - 1, gameChar_world_x - 11.5, gameChar_y - 1);
    //legs
    line(gameChar_world_x - 3.5,gameChar_y - 1,gameChar_world_x - 3.5,gameChar_y -12 );
    line(gameChar_world_x - 3.5,gameChar_y - 12,gameChar_world_x ,gameChar_y -24 );
    line(gameChar_world_x + 3.5,gameChar_y - 1,gameChar_world_x + 3.5,gameChar_y -12 );
    line(gameChar_world_x + 3.5,gameChar_y - 12,gameChar_world_x ,gameChar_y -24 );
    //body
    line(gameChar_world_x, gameChar_y - 24, gameChar_world_x, gameChar_y - 50);
    //arms
    line(gameChar_world_x,gameChar_y - 45,gameChar_world_x - 10, gameChar_y - 30);
    line(gameChar_world_x,gameChar_y - 45,gameChar_world_x + 10, gameChar_y - 30);
    //head
    fill(255);
    ellipse(gameChar_world_x  + 0.5,gameChar_y - 50, 10,10);
    point(gameChar_world_x + 2,gameChar_y - 52);
    point(gameChar_world_x - 1, gameChar_y - 52);
    arc(gameChar_world_x + 0.5, gameChar_y-49,3,3,0,PI);
}
function walkLeft(){
    //boots
    stroke(1);
    fill("brown");
    arc(gameChar_world_x + 3,gameChar_y - 1,8,8,PI,0);
    arc(gameChar_world_x - 12,gameChar_y - 1,8,8,PI,0);
    line(gameChar_world_x -1.5, gameChar_y - 1, gameChar_world_x + 6.5, gameChar_y - 1);
    line(gameChar_world_x - 8.5, gameChar_y - 1, gameChar_world_x - 16.5, gameChar_y - 1);
    //legs
    line(gameChar_world_x - 8.5,gameChar_y - 1,gameChar_world_x - 8.5,gameChar_y -12 );
    line(gameChar_world_x - 8.5,gameChar_y - 12,gameChar_world_x ,gameChar_y -24 );
    line(gameChar_world_x + 6.5,gameChar_y - 1,gameChar_world_x ,gameChar_y -12 );
    line(gameChar_world_x ,gameChar_y - 12,gameChar_world_x ,gameChar_y -24 );
    //body
    line(gameChar_world_x, gameChar_y - 24, gameChar_world_x - 2, gameChar_y - 50);
    //arms
    line(gameChar_world_x - 2,gameChar_y - 45,gameChar_world_x - 10, gameChar_y - 30);
    line(gameChar_world_x - 2,gameChar_y - 45,gameChar_world_x + 10, gameChar_y - 30);
    //head
    fill(255);
    ellipse(gameChar_world_x  -1.5,gameChar_y - 50, 10,10);
    point(gameChar_world_x -2,gameChar_y - 52);
    point(gameChar_world_x - 4, gameChar_y - 52);
    arc(gameChar_world_x -3, gameChar_y-49,3,3,0,PI);
}
function walkRight(){
     //boots
    stroke(1);
    fill("brown");
    arc(gameChar_world_x + 13,gameChar_y - 1,8,8,PI,0);
    arc(gameChar_world_x - 2,gameChar_y - 1,8,8,PI,0);
    line(gameChar_world_x + 8.5, gameChar_y - 1, gameChar_world_x + 16.5, gameChar_y - 1);
    line(gameChar_world_x + 1.5, gameChar_y - 1, gameChar_world_x - 6.5, gameChar_y - 1);
    //legs
    line(gameChar_world_x - 6.5,gameChar_y - 1,gameChar_world_x ,gameChar_y -12 );
    line(gameChar_world_x ,gameChar_y - 12,gameChar_world_x ,gameChar_y -24 );
    line(gameChar_world_x + 8.5,gameChar_y - 1,gameChar_world_x + 8.5,gameChar_y -12 );
    line(gameChar_world_x + 8.5,gameChar_y - 12,gameChar_world_x  ,gameChar_y -24 );
    //body
    line(gameChar_world_x, gameChar_y - 24, gameChar_world_x+2, gameChar_y - 50);
    //arms
    line(gameChar_world_x + 2,gameChar_y - 45,gameChar_world_x - 10, gameChar_y - 30);
    line(gameChar_world_x + 2,gameChar_y - 45,gameChar_world_x + 10, gameChar_y - 30);
    //head
    fill(255);
    ellipse(gameChar_world_x  + 2.5,gameChar_y - 50, 10,10);
    point(gameChar_world_x + 4.5,gameChar_y - 52);
    point(gameChar_world_x +2, gameChar_y - 52);
    arc(gameChar_world_x + 3.5, gameChar_y-49,3,3,0,PI);   
}
function jumpRight(){
    //boots
    stroke(1);
    fill("brown");
    arc(gameChar_world_x + 13,gameChar_y -9,8,8,PI,0);
    arc(gameChar_world_x - 12,gameChar_y - 7,8,8,PI,0);
    line(gameChar_world_x + 8.5, gameChar_y - 9, gameChar_world_x + 16.5, gameChar_y - 9);
    line(gameChar_world_x -8.5, gameChar_y - 7, gameChar_world_x - 16.5, gameChar_y - 7);
    //legs
    line(gameChar_world_x - 8.5,gameChar_y - 7,gameChar_world_x - 6 ,gameChar_y -18 );
    line(gameChar_world_x - 6 ,gameChar_y - 18,gameChar_world_x ,gameChar_y -24 );
    line(gameChar_world_x + 8.5,gameChar_y - 10,gameChar_world_x + 6.5,gameChar_y -18 );
    line(gameChar_world_x + 6.5,gameChar_y - 18,gameChar_world_x  ,gameChar_y -24 );
    //body
    line(gameChar_world_x, gameChar_y - 24, gameChar_world_x+2, gameChar_y - 50);
    //arms
    line(gameChar_world_x + 1,gameChar_y - 35,gameChar_world_x - 10, gameChar_y - 50);
    line(gameChar_world_x + 1,gameChar_y - 35,gameChar_world_x + 10, gameChar_y - 50);
    //head
    fill(255);
    ellipse(gameChar_world_x  + 2.5,gameChar_y - 50, 10,10);
    point(gameChar_world_x + 4.5,gameChar_y - 52);
    point(gameChar_world_x +2, gameChar_y - 52);
    arc(gameChar_world_x + 3.5, gameChar_y-49,3,3,0,PI);
}
function jumpLeft(){
    stroke(1);
    fill("brown");
    arc(gameChar_world_x + 11,gameChar_y - 8,8,8,PI,0);
    arc(gameChar_world_x - 13,gameChar_y - 10,8,8,PI,0);
    line(gameChar_world_x +7.5, gameChar_y - 8, gameChar_world_x + 14.5, gameChar_y - 8);
    line(gameChar_world_x - 9.5, gameChar_y - 10, gameChar_world_x - 17.5, gameChar_y - 10);
    //legs
    line(gameChar_world_x - 9.5,gameChar_y - 10,gameChar_world_x - 7.5,gameChar_y -16 );
    line(gameChar_world_x - 7.5,gameChar_y - 16,gameChar_world_x ,gameChar_y -24 );
    line(gameChar_world_x + 7,gameChar_y - 8,gameChar_world_x +6,gameChar_y -15 );
    line(gameChar_world_x + 6,gameChar_y - 15,gameChar_world_x ,gameChar_y -24 );
    //body
    line(gameChar_world_x, gameChar_y - 24, gameChar_world_x - 2, gameChar_y - 50);
    //arms
    line(gameChar_world_x - 1,gameChar_y - 35,gameChar_world_x - 10, gameChar_y - 50);
    line(gameChar_world_x - 1,gameChar_y - 35,gameChar_world_x + 10, gameChar_y - 50);
    //head
    fill(255);
    ellipse(gameChar_world_x  -1.5,gameChar_y - 50, 10,10);
    point(gameChar_world_x -2,gameChar_y - 52);
    point(gameChar_world_x - 4, gameChar_y - 52);
    arc(gameChar_world_x -3, gameChar_y-49,3,3,0,PI);
}
function jumpForward(){
    //boots
    stroke(1);
    fill("brown");
    arc(gameChar_world_x + 14,gameChar_y - 10,8,8,PI,0);
    arc(gameChar_world_x - 13,gameChar_y - 10,8,8,PI,0);
    line(gameChar_world_x + 10, gameChar_y - 10, gameChar_world_x + 17.5, gameChar_y - 10);
    line(gameChar_world_x - 10, gameChar_y - 10, gameChar_world_x - 17.5, gameChar_y - 10);
    //legs
    line(gameChar_world_x-10,gameChar_y-10,gameChar_world_x-10,gameChar_y-17);
    line(gameChar_world_x - 10,gameChar_y - 17,gameChar_world_x ,gameChar_y -24 );
    line(gameChar_world_x+10,gameChar_y -10,gameChar_world_x+10,gameChar_y-17);
    line(gameChar_world_x + 10,gameChar_y - 17,gameChar_world_x ,gameChar_y -24 );
    //body
    line(gameChar_world_x, gameChar_y - 24, gameChar_world_x, gameChar_y - 50);
    //arms
    line(gameChar_world_x,gameChar_y - 35,gameChar_world_x - 10, gameChar_y - 50);
    line(gameChar_world_x,gameChar_y - 35,gameChar_world_x + 10, gameChar_y - 50);
    //head
    fill(255);
    ellipse(gameChar_world_x  + 0.5,gameChar_y - 50, 10,10);
    point(gameChar_world_x + 2,gameChar_y - 52);
    point(gameChar_world_x - 1, gameChar_y - 52);
    arc(gameChar_world_x + 0.5, gameChar_y-49,3,3,0,PI);
}
// ---------------------------
// Background render functions
// ---------------------------
// Function to draw cloud objects.
function drawClouds(){
    for(var i = 0; i < clouds.length;i++){
        drawCloud(clouds[i]);
    }
}
function drawCloud(cloud){
    fill(255);
    circle(cloud.x_pos,140,cloud.width + 70);
    circle(cloud.x_pos+70,100,cloud.width);
    circle(cloud.x_pos-70,100,cloud.width);
    circle(cloud.x_pos+50,170,cloud.width);
    circle(cloud.x_pos-70,150,cloud.width);
    circle(cloud.x_pos-40,180,cloud.width);
}
// Function to draw mountains objects.
function drawMountains(){
    for(var i = 0; i < mountains.length; i++){
        drawMountain(mountains[i]);
    }
}
function drawMountain(mountain){
    fill(155,75,0);
    beginShape();
    vertex(mountain.x_pos +10,432);
    vertex(mountain.x_pos + 50,200);
    vertex(mountain.x_pos + 80,200);
    vertex(mountain.x_pos + 90,250);
    vertex(mountain.x_pos + 100,260);
    vertex(mountain.x_pos + 130,250);
    vertex(mountain.x_pos + 150,100);
    vertex(mountain.x_pos + 170,110);
    vertex(mountain.x_pos + 190,250);
    vertex(mountain.x_pos + 200,200);
    vertex(mountain.x_pos + 220,220);
    vertex(mountain.x_pos + 240,250);
    vertex(mountain.x_pos + 260,300);
    vertex(mountain.x_pos + 300,350);
    vertex(mountain.x_pos + 320,300);
    vertex(mountain.x_pos + 350,400);
    vertex(mountain.x_pos + 390,432);
    endShape();
}
// Function to draw trees objects.
function drawTrees(){
    for(var i = 0; i < trees_x.length; i++){
        drawTree(trees_x[i]);
    }
}
function drawTree(treePos_x){
    fill(205,133,63);
    rect(treePos_x,treePos_y,20,100);
    fill(0,255,0);
    circle(treePos_x,treePos_y,50);
    circle(treePos_x+20,treePos_y,50);
    circle(treePos_x+10,treePos_y-12,50);
    fill(205,133,63);
    beginShape();
    vertex(treePos_x+20, treePos_y+68);
    vertex(treePos_x+40, treePos_y+58);
    vertex(treePos_x+40, treePos_y+48);
    vertex(treePos_x+20, treePos_y+58);
    endShape();
    fill(0,255,0);
    circle(treePos_x+40,treePos_y+53,25);
    
    fill(205,133,63);
    beginShape();
    vertex(treePos_x, treePos_y+48);
    vertex(treePos_x-20, treePos_y+38);
    vertex(treePos_x-20, treePos_y+28);
    vertex(treePos_x, treePos_y+38);
    endShape();
    fill(0,255,0);
    circle(treePos_x-20,treePos_y+33,25);
}
function drawScore(){
    push();
    fill(0);
    textSize(20);
    text("You need to collect ", 10, 20);
    text(numberOfElements, 190,20);
    text("elements to impress the girl)", 210, 20);
    text("You collected: ", 850, 20);
    text(game_score, 980,20);
    pop();
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.
function drawCanyon(canyon){
    fill(155,80,0);
    beginShape();
    vertex(canyon.x_pos*canyon.width,576);
    vertex(canyon.x_pos*canyon.width + 5,550);
    vertex(canyon.x_pos*canyon.width + 10,540);
    vertex(canyon.x_pos*canyon.width,510);
    vertex(canyon.x_pos*canyon.width,490);
    vertex(canyon.x_pos*canyon.width + 60,432);
    vertex(canyon.x_pos*canyon.width + 110,462);
    vertex(canyon.x_pos*canyon.width + 80,576);
    endShape();
    
    fill(155,65,0);
    quad(canyon.x_pos*canyon.width+110,462,canyon.x_pos*canyon.width +120,
         462,canyon.x_pos*canyon.width+120,576,canyon.x_pos*canyon.width+80,576);
    quad(canyon.x_pos*canyon.width + 130,462,
         canyon.x_pos*canyon.width + 140,462,canyon.x_pos*canyon.width + 160,576,canyon.x_pos*canyon.width + 140,576);
    fill(172,183,142);
    quad(canyon.x_pos*canyon.width+120,462,canyon.x_pos*canyon.width+130,462,
         canyon.x_pos*canyon.width+140,576,canyon.x_pos*canyon.width+110,576);
    fill(100,155,255);
    quad(canyon.x_pos*canyon.width+60,432,canyon.x_pos*canyon.width+150,432,
         canyon.x_pos*canyon.width+140,462,canyon.x_pos*canyon.width+110,462);
    fill(155,80,0);
    beginShape();
    vertex(canyon.x_pos*canyon.width + 140,462);
    vertex(canyon.x_pos*canyon.width + 150,432);
    vertex(canyon.x_pos*canyon.width + 160,450);
    vertex(canyon.x_pos*canyon.width + 170,460);
    vertex(canyon.x_pos*canyon.width + 170,480);
    vertex(canyon.x_pos*canyon.width + 180,500);
    vertex(canyon.x_pos*canyon.width + 170,520);
    vertex(canyon.x_pos*canyon.width + 180,540);
    vertex(canyon.x_pos*canyon.width + 180,550);
    vertex(canyon.x_pos*canyon.width + 170,576);
    vertex(canyon.x_pos*canyon.width + 160,576);
    endShape();
}
// Function to check character is over a canyon.
function checkCanyon(canyon){
    if(gameChar_world_x < canyon.x_pos*canyon.width + 150 && gameChar_world_x > canyon.x_pos*canyon.width+60 && gameChar_y>=floorPos_y){
        isFallingC = true;
        gameChar_y++; 
        //sound.play();
    }
}
function renderFlagPole(x, y){
    stroke(1);
    fill("brown");
    arc(x + 8,y - 1,8,8,PI,0);
    arc(x - 7,y - 1,8,8,PI,0);
    line(x + 3.5, y - 1, x + 11.5, y - 1);
    line(x - 3.5, y - 1, x - 11.5, y - 1);
    //legs
    line(x - 3.5,y - 1,x - 3.5,y -12 );
    line(x - 3.5,y - 12,x ,y -24 );
    line(x + 3.5,y - 1,x + 3.5,y -12 );
    line(x + 3.5,y - 12,x ,y -24 );
    //body
    line(x, y - 24, x, y - 50);
    fill(255,192,203);
    quad(x - 3, y - 30, x +3 , y - 30 , x + 5, y - 20, x - 5 , y - 20);
    //arms
    line(x,y - 45,x - 10, y - 30);
    line(x,y - 45,x + 10, y - 30);
    //head
    fill(255);
    ellipse(x  + 0.5,y - 50, 10,10);
    point(x + 2,y - 52);
    point(x - 1, y - 52);
    arc(x + 0.5, y-49,3,3,0,PI);
}
function checkFlagPole(){
    if(gameChar_world_x > flagPole.x_pos){
        flagPole.isReached = true;
    }
    if(gameChar_world_x < flagPole.x_pos && !winB){
        flagPole.isReached = false;
    }
    win();
}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
// Function to draw collectable objects.
function drawCollectable(collectable){
    fill(100,255,200);
    beginShape();
    vertex(collectable.x_pos,collectable.y_pos);
    vertex(collectable.x_pos - 10 + collectable.size,collectable.y_pos - 10);
    vertex(collectable.x_pos,collectable.y_pos-20+collectable.size);
    vertex(collectable.x_pos + 10,collectable.y_pos-20+ collectable.size);
    vertex(collectable.x_pos+20 - collectable.size,collectable.y_pos-10);
    vertex(collectable.x_pos+10,collectable.y_pos);
    vertex(collectable.x_pos,collectable.y_pos);
    endShape();
}
// Function to check character has collected an item.
function checkCollectable(t_collectable){
    if(!t_collectable.isFound){
        drawCollectable(t_collectable);
    }
    if (dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<20 || 
        dist(gameChar_world_x,gameChar_y,t_collectable.x_pos + 20,t_collectable.y_pos)<20){
        t_collectable.isFound = true;
    }
    if(t_collectable.isFound){
        if(foundItems.indexOf(t_collectable)<0){
            foundItems.push(t_collectable);
            game_score++;
            //item.play();
        }
    }
}
function checkPlayerDie(){
    if(gameChar_y > 575){
        lives--;
    }  
    else if (EnemyPlayer)
    {
        lives--;
    }
    if(lives<=0){
        fail();   
    }
}
function drawTextLives(){
    fill(0);
    textSize(20);
    text("lives", 600,20);
    for(i = 1; i <= lives; i++){
        drawLives( 650 + i*20);
    }
}
function drawLives(x){
    if(!winB){
        fill(255,0,0);
        circle(x, 15 ,10);
    }
}
function drawPlatforms(){
    for(var i = 0; i < platforms.length; i++){
        checkPlatform(platforms[i]);
        drawPlatform(platforms[i]);
    }
}
function checkPlatform(platform){
    if(gameChar_world_x>=platform.x_pos && gameChar_world_x<= platform.x_pos+platform.width && gameChar_y== platform.y_pos ){
        isOnPlatform = true;
        reachedPlatforms.push(platform);
    }
    else if(reachedPlatforms.indexOf(platform)>=0) {
        isOnPlatform = false;
        shorten(reachedPlatforms);
    }
}
function drawPlatform(platform){
    fill(platform.color);
    rect(platform.x_pos, platform.y_pos, platform.width,platform.height);
}
function drawEnemies(){
    for(var i = 0; i < enemies.length; i++){
        checkEnemy(enemies[i]);
        if(!enemies[i].IsKilled){
        updateEnemy(enemies[i], canyons[i], canyons[i+1]);
        drawEnemy(enemies[i]);
        }
    }
}
function updateEnemy(enemy, canyon1, canyon2){
    enemy.x_pos += enemy.speed;
    if(enemy.x_pos> canyon2.x_pos -80 || enemy.x_pos < canyon1.x_pos + 250){
        enemy.speed = -1*enemy.speed;
    }
}
function drawEnemy(enemy){
    if(enemy.speed>0 ){
        //boots
        stroke(1);
        fill("brown");
        arc(enemy.x_pos + 13,enemy.y_pos - 1,8,8,PI,0);
        arc(enemy.x_pos - 2,enemy.y_pos - 1,8,8,PI,0);
        line(enemy.x_pos + 8.5, enemy.y_pos - 1, enemy.x_pos + 16.5, enemy.y_pos - 1);
        line(enemy.x_pos + 1.5, enemy.y_pos - 1, enemy.x_pos - 6.5, enemy.y_pos - 1);
        //legs
        line(enemy.x_pos - 6.5,enemy.y_pos - 1,enemy.x_pos ,enemy.y_pos -12 );
        line(enemy.x_pos ,enemy.y_pos - 12,enemy.x_pos ,enemy.y_pos -14 );
        line(enemy.x_pos + 8.5,enemy.y_pos - 1,enemy.x_pos + 8.5,enemy.y_pos -12 );
        line(enemy.x_pos + 8.5,enemy.y_pos - 12,enemy.x_pos  ,enemy.y_pos -14 );
        //body
        line(enemy.x_pos, enemy.y_pos - 14, enemy.x_pos+2, enemy.y_pos - 30);
        //arms
        line(enemy.x_pos + 1,enemy.y_pos - 15,enemy.x_pos - 10, enemy.y_pos - 25);
        line(enemy.x_pos + 1,enemy.y_pos - 15,enemy.x_pos + 10, enemy.y_pos - 25);
        //head
        fill(255);
        ellipse(enemy.x_pos  + 2.5,enemy.y_pos - 30, 10,10);
        point(enemy.x_pos + 4.5,enemy.y_pos - 32);
        point(enemy.x_pos +2, enemy.y_pos - 32);
        arc(enemy.x_pos + 3.5, enemy.y_pos-29,3,3,0,PI); 
    }
    if(enemy.speed<0 ){
        stroke(1);
        fill("brown");
        arc(enemy.x_pos + 3,enemy.y_pos - 1,8,8,PI,0);
        arc(enemy.x_pos - 12,enemy.y_pos - 1,8,8,PI,0);
        line(enemy.x_pos -1.5, enemy.y_pos - 1, enemy.x_pos + 6.5, enemy.y_pos - 1);
        line(enemy.x_pos - 8.5, enemy.y_pos - 1, enemy.x_pos - 16.5, enemy.y_pos - 1);
        //legs
        line(enemy.x_pos - 8.5,enemy.y_pos - 1,enemy.x_pos - 8.5,enemy.y_pos -12 );
        line(enemy.x_pos - 8.5,enemy.y_pos - 12,enemy.x_pos ,enemy.y_pos -14 );
        line(enemy.x_pos + 6.5,enemy.y_pos - 1,enemy.x_pos ,enemy.y_pos -12 );
        line(enemy.x_pos ,enemy.y_pos - 12,enemy.x_pos ,enemy.y_pos -14 );
        //body
        line(enemy.x_pos, enemy.y_pos - 14, enemy.x_pos - 2, enemy.y_pos - 30);
        //arms
        line(enemy.x_pos - 1,enemy.y_pos - 15,enemy.x_pos - 10, enemy.y_pos - 25);
        line(enemy.x_pos - 1,enemy.y_pos - 15,enemy.x_pos + 10, enemy.y_pos - 25);
        //head
        fill(255);
        ellipse(enemy.x_pos  -1.5,enemy.y_pos - 30, 10,10);
        point(enemy.x_pos -2,enemy.y_pos - 32);
        point(enemy.x_pos - 4, enemy.y_pos - 32);
        arc(enemy.x_pos -3, enemy.y_pos-29,3,3,0,PI);
    }
}
function checkEnemy(enemy){
    if(gameChar_world_x + 4 >= enemy.x_pos && gameChar_world_x - 8 <= enemy.x_pos+10 && gameChar_y<= enemy.y_pos-32  && gameChar_y>= enemy.y_pos-45 && isFalling){
        enemy.IsKilled = true;
        enemy.y_pos+=100;
        enemyKilled.push(enemy);
        //killS.play();   
    }
    else if(gameChar_world_x >= enemy.x_pos-18 && gameChar_world_x<= enemy.x_pos+20 && gameChar_y>= enemy.y_pos && enemy.IsKilled==false){
        EnemyPlayer = true;
        //deathS.play();
    }
}