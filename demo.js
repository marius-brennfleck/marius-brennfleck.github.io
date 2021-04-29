/******************************************************/
/****************** Beschleunigungssensoren **************************/
window.ondevicemotion = function(event) { 
	var ax = event.accelerationIncludingGravity.x
	var ay = event.accelerationIncludingGravity.y
	var az = event.accelerationIncludingGravity.z

	// document.querySelector("#acc").innerHTML = "X = " + ax + "<br>" + "Y = " + ay + "<br>" + "Z = " + az;
}

window.addEventListener("deviceorientation", function(event) {
	if(event.beta != null) {
		document.querySelector("#text").innerHTML = "Anleitung:<br><br>Steuere das Raumschiff<br>durch Bewegen deines Endgerätes<br>durch die Asteroiden.";
		motion = true;
	}
	// document.querySelector("#mag").innerHTML = "alpha = " + event.alpha + "<br>" + "beta = " + event.beta + "<br>" + "gamma = " + event.gamma;
	if(gameStarted) {
		if(event.beta > 1) {
			bll.speedY += 0.2;
		} else if(event.beta < -1) {
			bll.speedY -= 0.2;
		} else {
			bll.speedY = 0;
		}
		if(event.gamma > 1) {
			bll.speedX += 0.2;
		} else if(event.gamma < -1) {
			bll.speedX -= 0.2;
		} else {
			bll.speedX = 0;
		}
	}
}, true);

function windowResize() {
	//myGameArea.clear();
	//myGameArea.stop();	
	//startGame();
	myGameArea.canvas.width=window.innerWidth;
	myGameArea.canvas.height=window.innerHeight;
};
  
window.addEventListener('resize', windowResize);

var motion = false;
var gameStarted = false;
//var myGamePiece;
var bll;
var meteorites = [[]];
//var myObstacles = [];
var myScore;
var score;
var highscore;
var highscoreText = 0;
var myBackground;

var radiusMeteorite;
var radiusShip;

function startGame() {
	gameStarted = true;
	document.getElementById("landing").style.display = "none";
	document.getElementById("restart").style.visibility = "hidden";
	meteorites = [[]];
	myGameArea.start();
	//radiusMeteorite = 50;
	small = Math.min(window.innerHeight, window.innerWidth);
	radiusShip = Math.floor(small/15);
	radiusMeteorite = Math.floor(small/15);
	bll = new ball(radiusShip, "black", 200, 200)
	//meteorites = new meteorite(50, "black", 100, 100)
	//myGamePiece = new component(30, 30, "rgba(0, 0, 0, 1.0)", 2, 2);
	myBackground = new component((1920*window.innerHeight/1080), window.innerHeight, "milky-way.jpg", 0, 0, "background");
	//myObstacle = new component(10, 200, "green", 300, 120); 
	myScore = new component("30px", "Consolas", "white", window.innerWidth-240, 40, "text");
	highscore = new component("30px", "Consolas", "white", window.innerWidth-240, 70, "text");
	// myUpBtn = new component(30, 30, "blue", 50, 10);
	// myDownBtn = new component(30, 30, "blue", 50, 70);
	// myLeftBtn = new component(30, 30, "blue", 20, 40);
	// myRightBtn = new component(30, 30, "blue", 80, 40); 
}


var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		//this.canvas.width =  480;
		//this.canvas.height = 270;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0; 
		this.interval = setInterval(updateGameArea, 20);
		if(!motion) {
			window.addEventListener('keydown', function (e) {
				if(e.key=='w') {
					moveup();
				}
				if(e.key=='s') {
					movedown();
				}
				if(e.key=='a') {
					moveleft();
				}
				if(e.key=='d') {
					moveright();
				}
			})
			window.addEventListener('keyup', function (e) {
				if(e.key == 'w' || e.key == 's') {
					bll.speedY = 0;
				} 
				if(e.key == 'a' || e.key == 'd') {
					bll.speedX = 0;
				} 
			})
		}
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
		clearInterval(this.interval);
	}
}

function everyinterval(n) {
	if ((myGameArea.frameNo / n) % 1 == 0) {
		return true;
	}
	return false;
}

function meteorite(radius, x, y) {
	this.radius = radius;
	this.image = new Image();
	this.image.src = "asteorite-removebg-small.png";
	this.speedX = 0;
 	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		//ctx.strokeStyle = 'rgba(0,0,0,1)';
		//ctx.beginPath();
		//ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,true); // you can use any shape
    	ctx.drawImage(this.image, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
		//ctx.stroke();
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	} 
}

function ball(radius, color, x, y) {
	this.image = new Image();
	this.image.src = "spaceship.png";
	this.radius = radius;
	this.speedX = 0;
 	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		// ctx.fillStyle = "grey";
		// ctx.fill(); 
		// ctx.beginPath();
		// ctx.arc(this.x, this.y, this.radius/2, 0, 2 * Math.PI);
		// ctx.fillStyle = "darkgrey";
		// ctx.fill(); 
		//ctx.beginPath();
		//ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,true); // you can use any shape
    	ctx.drawImage(this.image, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
		//ctx.stroke();
	}
	this.newPos = function() {
		if(this.x + this.speedX<0+this.radius){
			this.x = this.radius;
		} else if (this.x + this.speedX>window.innerWidth-this.radius) {
			this.x = window.innerWidth-this.radius
		} else {
			this.x += this.speedX;
		}
		if(this.y + this.speedY<0+this.radius){
			this.y = this.radius;
		} else if (this.y + this.speedY>window.innerHeight-this.radius) {
			this.y = window.innerHeight-this.radius
		} else {
			this.y += this.speedY;
		}
	} 
	this.crashWith = function(otherobj) {
		var x1 = this.x;
		var y1 = this.y;
		var x2 = otherobj.x;
		var y2 = otherobj.y;
		var crash = true;
		var d = Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2)));
		if (d > this.radius + otherobj.radius) {
		  crash = false;
		}
		return crash;
	}
	this.inRange = function(otherobj) {
		var x1 = this.x;
		var x2 = otherobj.x;
		var range = true;
		if(Math.abs(x2-x1)>this.radius + otherobj.radius) {
			range = false;
		}
		return range;
	}
}

function component(width, height, color, x, y, type) {
	if (type == "image" || type == "background") {
		this.image = new Image();
		this.image.src = color;
	}
	this.type = type
	this.width = width;
	this.height = height;
	this.speedX = 0;
  	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		if (this.type == "image" || this.type == "background") {
			ctx.drawImage(this.image,
			  this.x,
			  this.y,
			  this.width, this.height);
			  if (type == "background") {
				ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
			  }
		  } else if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		  } else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.type == "background") {
			if (this.x == -(this.width)) {
			  this.x = 0;
			}
		}
	} 
	this.clicked = function() {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var clicked = true;
		if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
		  clicked = false;
		}
		return clicked;
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) ||
		(mytop > otherbottom) ||
		(myright < otherleft) ||
		(myleft > otherright)) {
		  crash = false;
		}
		return crash;
	}
}

function moveup() {
	bll.speedY -= 1;
}
  
function movedown() {
	bll.speedY += 1;
}
  
function moveleft() {
	bll.speedX -= 1;
}
  
function moveright() {
	bll.speedX += 1;
}

function stopMove() {
	bll.speedX = 0;
	bll.speedY = 0;
}
  

function updateGameArea() {
	var x, y;
	// for (i = 0; i < myObstacles.length; i += 1) {
	// 	if (myGamePiece.crashWith(myObstacles[i])) {
	// 	myGameArea.stop();
	// 	return;
	// 	}
	// }
	for (i = 0; i < meteorites.length; i += 1) {
		if(meteorites[i].length>0) {
			if(bll.inRange(meteorites[i][0])) {
				for (j = 0; j < meteorites[i].length; j += 1) {					
					if (bll.crashWith(meteorites[i][j])) {
						myGameArea.stop();
						document.querySelector("#restartText").innerHTML = "Du hast " + score + " Punkte erreicht!";
						if(highscoreText < score) {
							highscoreText = score;
							document.querySelector("#restartText").innerHTML = "Du hast " + score + " Punkte erreicht!<br>Neuer Highscore!";
						}
						
						document.getElementById("restart").style.visibility = "visible";
						return;
					}
				}
			}
		}
	}
	myGameArea.clear();
	myBackground.newPos();
  	myBackground.update();
	myGameArea.frameNo += 1;
	/* if (myGameArea.frameNo == 1 || everyinterval(150)) {
		x = myGameArea.canvas.width;
		y = myGameArea.canvas.height;
		minHeight = 50;
		maxHeight = y;
		height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
		minGap = 50;
		maxGap = 200;
		gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
		myObstacles.push(new component(10, height-gap, "green", x, 0));
		myObstacles.push(new component(10, y - height, "green", x, height));
	} */
	if (myGameArea.frameNo == 1 || everyinterval(350)) {
		x = myGameArea.canvas.width;
		y = myGameArea.canvas.height;
		//y = myGameArea.canvas.innerHeight;
		maxMeteorites = y / (2*radiusMeteorite) - 1;
		nextMeteorite = radiusMeteorite;
		meteoriteNumber = Math.max(3, Math.floor(Math.random()*maxMeteorites));
		gapNumber = Math.floor(Math.random()*meteoriteNumber);
		newMeteorites = [];
		for(i=0; i<meteoriteNumber+1; i+=1) {
			if(i==gapNumber) {
				nextMeteorite = nextMeteorite +2*radiusMeteorite + 2*radiusMeteorite*(maxMeteorites-meteoriteNumber);
			} else {
				newMeteorites.push(new meteorite(radiusMeteorite, x, nextMeteorite));
				nextMeteorite = nextMeteorite + 2*radiusMeteorite;
			}
		}
		meteorites.push(newMeteorites);
	}
	/* for (i = 0; i < myObstacles.length; i += 1) {
		myObstacles[i].x += -1;
		myObstacles[i].update();
	} */
	for (i = 0; i < meteorites.length; i += 1) {
		for (j = 0; j < meteorites[i].length; j += 1) {
			meteorites[i][j].x += -1;
			meteorites[i][j].update();
		}
	}
	bll.newPos();
	bll.update();
	//meteorites.newPos();
	//meteorites.update();
	// if (myGameArea.x && myGameArea.y) {
	// 	if (myUpBtn.clicked()) {
	// 	myGamePiece.y -= 1;
	// 	}
	// 	if (myDownBtn.clicked()) {
	// 	myGamePiece.y += 1;
	// 	}
	// 	if (myLeftBtn.clicked()) {
	// 	myGamePiece.x += -1;
	// 	}
	// 	if (myRightBtn.clicked()) {
	// 	myGamePiece.x += 1;
	// 	}
	// }
	score = Math.round(myGameArea.frameNo/100);
	myScore.text = "SCORE: " + score;
  	myScore.update();
	highscore.text = "HIGHSCORE: " + highscoreText;
  	highscore.update();
	// myUpBtn.update();
	// myDownBtn.update();
	// myLeftBtn.update();
	// myRightBtn.update();
	//myGamePiece.newPos();
	//myGamePiece.update();
}