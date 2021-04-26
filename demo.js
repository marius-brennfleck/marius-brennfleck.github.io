/******************************************************/
/****************** Beschleunigungssensoren **************************/
window.ondevicemotion = function(event) { 
	var ax = event.accelerationIncludingGravity.x
	var ay = event.accelerationIncludingGravity.y
	var az = event.accelerationIncludingGravity.z

	document.querySelector("#acc").innerHTML = "X = " + ax + "<br>" + "Y = " + ay + "<br>" + "Z = " + az;
}

window.addEventListener("deviceorientation", function(event) {
	document.querySelector("#mag").innerHTML = "alpha = " + event.alpha + "<br>" + "beta = " + event.beta + "<br>" + "gamma = " + event.gamma;
	if(event.beta > 0.5) {
		bll.speedY += 1;
	}
	if(event.beta < -0.5) {
		bll.speedY -= 1;
	}
	if(event.gamma > 0.5) {
		bll.speedX += 1;
	}
	if(event.gamma < -0.5) {
		bll.speedX -= 1;
	}
}, true);


var myGamePiece;
var bll;
var myObstacle;

window.onload = function startGame() {
	myGameArea.start();
	bll = new ball(30, "black", 10, 10)
	myGamePiece = new component(30, 30, "rgba(0, 0, 0, 1.0)", 2, 2);
	myObstacle = new component(10, 200, "green", 300, 120); 
	myUpBtn = new component(30, 30, "blue", 50, 10);
	myDownBtn = new component(30, 30, "blue", 50, 70);
	myLeftBtn = new component(30, 30, "blue", 20, 40);
	myRightBtn = new component(30, 30, "blue", 80, 40); 
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
		this.interval = setInterval(updateGameArea, 20);
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
				myGamePiece.speedY = 0;
			} 
			if(e.key == 'a' || e.key == 'd') {
				myGamePiece.speedX = 0;
			} 
		})
		window.addEventListener('mousedown', function (e) {
			myGameArea.x = e.pageX;
			myGameArea.y = e.pageY;
		  })
		  window.addEventListener('mouseup', function (e) {
			myGameArea.x = false;
			myGameArea.y = false;
		  })
		  window.addEventListener('touchstart', function (e) {
			myGameArea.x = e.pageX;
			myGameArea.y = e.pageY;
		  })
		  window.addEventListener('touchend', function (e) {
			myGameArea.x = false;
			myGameArea.y = false;
		  })
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
		clearInterval(this.interval);
	}
}

function ball(radius, color, x, y) {
	this.radius = radius;
	this.speedX = 0;
 	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill(); 
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	} 
}

function component(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.speedX = 0;
  	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
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
	myGamePiece.speedY -= 1;
}
  
function movedown() {
	myGamePiece.speedY += 1;
}
  
function moveleft() {
	myGamePiece.speedX -= 1;
}
  
function moveright() {
	myGamePiece.speedX += 1;
}

function stopMove() {
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;
}
  

function updateGameArea() {
	if (myGamePiece.crashWith(myObstacle)) {
		myGameArea.stop();
	} else {
		myGameArea.clear();
		bll.update();
		if (myGameArea.x && myGameArea.y) {
			if (myUpBtn.clicked()) {
			myGamePiece.y -= 1;
			}
			if (myDownBtn.clicked()) {
			myGamePiece.y += 1;
			}
			if (myLeftBtn.clicked()) {
			myGamePiece.x += -1;
			}
			if (myRightBtn.clicked()) {
			myGamePiece.x += 1;
			}
		}
		myUpBtn.update();
		myDownBtn.update();
		myLeftBtn.update();
		myRightBtn.update(); 
		myObstacle.x += -1;
		myObstacle.update();
		myGamePiece.newPos();
		myGamePiece.update();
	}
}