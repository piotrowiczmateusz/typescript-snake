/* 
   *---------------------------------------*
   | Project: Snake in TypeScript          |
   *---------------------------------------*
   | Version: 0.1                          |
   *---------------------------------------*
   | Author: Mateusz Piotrowicz            |
   *---------------------------------------*
 */


class Point {

	posX: number;
	posY: number;

	constructor(posX: number, posY: number) {
		this.posX = posX;
		this.posY = posY;
	}
}

class Cell extends Point {
	
	html: string;
	
	constructor(posX: number, posY: number) {
		super(posX, posY);
		this.html = "<div id='x" + this.posX + "y" + this.posY + "' class='cell'></div>";
	}	

}

class Elem extends Point {

	prevPosX: number;
	prevPosY: number;
	className: string;

	constructor(posX: number, posY: number, className: string) {
		super(posX, posY);
		this.prevPosX = 19;
		this.prevPosY = 19;
		this.className = className;
		this.draw();
	}

	draw() {
		var d = document.getElementById("x" + this.posX + "y" + this.posY);
		d.className = d.className + " " + this.className;

		if ((this.prevPosX != null) && (this.prevPosY != null)) {
			d = document.getElementById("x" + this.prevPosX + "y" + this.prevPosY);
			d.className = "cell";
		}
	}
}

class Snake {

	head: Elem;
	snakeBody: Elem[];
	len: number;

	constructor(maxLen: number) {
		this.head = new Elem(0, 3, "snake-head");
		this.snakeBody = new Array(maxLen);
		this.snakeBody[0] = new Elem(0, 2, "snake-body");
		this.snakeBody[1] = new Elem(0, 1, "snake-body");
		this.snakeBody[2] = new Elem(0, 0, "snake-body");
		this.len = 3; 
	}

	checkApple(apple: Elem) {
	
		if(this.head.posX == apple.posX && this.head.posY == apple.posY) {

			var onSnake = true;

			while(onSnake === true) {

				apple.posX = Math.floor(Math.random() * (20));
				apple.posY = Math.floor(Math.random() * (20));

				var any = false;

				for(var i = 0; i < this.len; i++) {

					if(apple.posX == this.snakeBody[i].posX && apple.posY == this.snakeBody[i].posY) {
						any = true;					
					}
					if(apple.posX == this.head.posX || apple.posY == this.head.posY) {
						any = true;
					}

				}
				onSnake = any;
			}

			if(onSnake === false) {
				apple.draw();
				
				this.snakeBody[this.len] = new Elem(this.snakeBody[this.len-1].prevPosX, this.snakeBody[this.len-1].prevPosY, "snake-body");
				this.len++;
			}	
			return true;
		}
		else {
			return false;
		}
	}

	checkCollisions() {
		if((this.head.posX < 0) || (this.head.posX > 20) || (this.head.posY < 0) || (this.head.posY > 20)) {
			return true;
		}
		else if(document.getElementById("x" + this.head.posX + "y" + this.head.posY).className.indexOf("snake-body") > -1) {
			return true;
		}
		else {
			return false;
		}
	}

	move(direction: string) {

		this.head.prevPosX = this.head.posX;	
		this.head.prevPosY = this.head.posY;
		
		var self = this;
		var continueStep = true;
				
		if(direction == "left") { this.head.posY--;	}
		else if(direction == "right") { this.head.posY++; }
		else if(direction == "up") { this.head.posX--; }
		else if(direction == "down") { this.head.posX++; }
		
		if(this.checkCollisions() === false) {
			
			this.head.draw();

			for(var i = 0; i < this.len; i++) {
				
				this.snakeBody[i].prevPosX = this.snakeBody[i].posX;
				this.snakeBody[i].prevPosY = this.snakeBody[i].posY;

				if(i === 0) {
					this.snakeBody[i].posX = this.head.prevPosX;
					this.snakeBody[i].posY = this.head.prevPosY;
				}

				else {
					this.snakeBody[i].posX = this.snakeBody[i-1].prevPosX;
					this.snakeBody[i].posY = this.snakeBody[i-1].prevPosY;
				}
				
				this.snakeBody[i].draw();
			}

		}
		else {		
			continueStep = false;
		}	
		return continueStep;
	}
}

class Grid {

	rows: number;
	cols: number;

	constructor(rows: number, cols: number) {
		this.rows = rows;
		this.cols = cols;

		for(var i = 0; i < this.rows; i++) {
			for(var j = 0; j < this.cols; j++) {
				document.getElementById("grid").innerHTML += new Cell(i, j).html;
			}
		}
	}
}

class Main {

	grid: Grid;
	maxLen: number;
	snake: Snake;
	apple: Elem;
	difficulty: string;
	direction: string;
	score: number;
	
	constructor() {
		this.score = 0;
	}
	
	init() {

		// Reset html

		document.getElementById("grid").innerHTML = "";
		document.getElementById("score").innerHTML = "0";

		var self = this;

		// Init objects

		this.grid = new Grid(20, 20);
		this.maxLen = this.grid.rows*this.grid.cols;
		this.snake = new Snake(this.maxLen);
		this.apple = new Elem(9, 9, "apple");
		this.direction = "right";
		this.score = 0;

		// On start

		document.getElementById("start").onclick = function() {

			document.getElementById("game-over").style.display = "none";

			var d = document.getElementById("difficulty");
			var difficulty = d.options[d.selectedIndex].value;		
			var difficultySpeed = 120; 
			
			if(difficulty == "Easy") { difficultySpeed = 500; }
			else if(difficulty == "Medium") { difficultySpeed = 120; }
			else if(difficulty == "Hard") { difficultySpeed = 90; }
			else if(difficulty == "Expert") { difficultySpeed = 50; }

			document.getElementById("body").onkeypress = function(event) {

			if(event.which == 97 || event.keyCode == 97) { //left
				self.direction = "left";
			}
			else if(event.which == 100 || event.keyCode == 100) {//right
				self.direction = "right";
			}
			else if(event.which == 115 || event.keyCode == 115) {//down
				self.direction = "down";
			}
			else if(event.which == 119 || event.keyCode == 119) {//up
				self.direction = "up";
			}
		
		}

		var interval = setInterval(function() {
			if(self.snake.checkApple(self.apple) === true) {
				self.score++;
				(<HTMLInputElement>document.getElementById("score")).innerHTML = self.score + "";
			}
			if(self.snake.move(self.direction) === false) {
				
				document.getElementById("game-over").innerHTML = "Game Over. Your score was: " + self.score;
				document.getElementById("game-over").style.display = "block";
				clearInterval(interval);
				
				self.init();
			}
			self.snake.checkCollisions();

		}, difficultySpeed);

		}
	}
}

var main = new Main();
main.init();