window.addEventListener("deviceorientation", function(event) {
	if(event.beta != null) {
		document.querySelector("#text").innerHTML = "Anleitung:<br><br>Steuere das Raumschiff<br>durch Bewegen deines Endgerätes<br>durch die Asteroiden.";
		motion = true;
	}
	// document.querySelector("#mag").innerHTML = "alpha = " + event.alpha + "<br>" + "beta = " + event.beta + "<br>" + "gamma = " + event.gamma;
	if(gameStarted) {
		if(window.innerWidth>window.innerHeight)  {
			if(event.gamma > 1) {
				bll.speedY -= 0.2;
			} else if(event.gamma < -1) {
				bll.speedY += 0.2;
			} else {
				bll.speedY = 0;
			}
			if(event.beta > 1) {
				bll.speedX += 0.2;
			} else if(event.beta < -1) {
				bll.speedX -= 0.2;
			} else {
				bll.speedX = 0;
			}
		} else {
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
	}
}, true);

function windowResize() {
	if(gameStarted == true) {
		myGameArea.clear();
		myGameArea.stop();	
		startGame();
	}
	//myGameArea.canvas.width=window.innerWidth;
	//myGameArea.canvas.height=window.innerHeight;
};
  
window.addEventListener('resize', windowResize);

var motion = false;
var gameStarted = false;
var bll;
var meteorites = [[]];
var myScore;
var score;
var highscore;
var highscoreText = 0;
var myBackground;
var firstStart = true;

var radiusMeteorite;
var radiusShip;
var intervall = 350;

function startGame() {
	gameStarted = true;
	document.getElementById("landing").style.display = "none";
	document.getElementById("restart").style.visibility = "hidden";
	meteorites = [[]];
	myGameArea.start();
	small = Math.min(window.innerHeight, window.innerWidth);
	radiusShip = Math.floor(small/15);
	radiusMeteorite = Math.floor(small/15);
	intervall = radiusShip*6;
	bll = new ball(radiusShip, "black", 200, 200)
	myBackground = new background();
	myScore = new text(window.innerWidth-240, 40);
	highscore = new text(window.innerWidth-240, 70);
}


var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0; 
		this.interval = setInterval(updateGameArea, 20);
		if(!motion && firstStart) {
			firstStart = false;
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
    	ctx.drawImage(this.image, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
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
    	ctx.drawImage(this.image, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
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

function background() {
	this.image = new Image();
	this.image.src = "milky-way.jpg";
	if(window.innerHeight/window.innerWidth>0.5625) {
		this.width = (1920*window.innerHeight/1080);
		this.height = window.innerHeight;
	} else {
		this.height = (1080*window.innerWidth/1920);
		this.width = window.innerWidth;
	}
	//this.width = (1920*window.innerHeight/1080);
	//this.height = window.innerHeight;
	this.x = 0;
	this.y = 0;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
	this.resize = function() {
		
	}
}
function text(x, y) {
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.font = "30px Consolas";
		ctx.fillStyle = "white";
		ctx.fillText(this.text, this.x, this.y);
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
	for (i = 0; i < meteorites.length; i += 1) {
		if(meteorites[i].length>0) {
			if(bll.inRange(meteorites[i][0])) {
				for (j = 0; j < meteorites[i].length; j += 1) {					
					if (bll.crashWith(meteorites[i][j])) {
						myGameArea.stop();
						gameStarted = false;
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
  	myBackground.update();
	myGameArea.frameNo += 1;
	if (myGameArea.frameNo == 1 || everyinterval(intervall)) {
		x = myGameArea.canvas.width;
		y = myGameArea.canvas.height;
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
	for (i = 0; i < meteorites.length; i += 1) {
		for (j = 0; j < meteorites[i].length; j += 1) {
			meteorites[i][j].x += -1;
			meteorites[i][j].update();
		}
	}
	bll.newPos();
	bll.update();
	score = Math.round(myGameArea.frameNo/100);
	myScore.text = "SCORE: " + score;
  	myScore.update();
	highscore.text = "HIGHSCORE: " + highscoreText;
  	highscore.update();
}