/*
   *---------------------------------------*
   | Project: Snake in TypeScript          |
   *---------------------------------------*
   | Version: 0.1                          |
   *---------------------------------------*
   | Author: Mateusz Piotrowicz            |
   *---------------------------------------*
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
    return Point;
})();
var Cell = (function (_super) {
    __extends(Cell, _super);
    function Cell(posX, posY) {
        _super.call(this, posX, posY);
        this.html = "<div id='x" + this.posX + "y" + this.posY + "' class='cell'></div>";
    }
    return Cell;
})(Point);
var Elem = (function (_super) {
    __extends(Elem, _super);
    function Elem(posX, posY, className) {
        _super.call(this, posX, posY);
        this.prevPosX = 19;
        this.prevPosY = 19;
        this.className = className;
        this.draw();
    }
    Elem.prototype.draw = function () {
        var d = document.getElementById("x" + this.posX + "y" + this.posY);
        d.className = d.className + " " + this.className;
        if ((this.prevPosX != null) && (this.prevPosY != null)) {
            d = document.getElementById("x" + this.prevPosX + "y" + this.prevPosY);
            d.className = "cell";
        }
    };
    return Elem;
})(Point);
var Snake = (function () {
    function Snake(maxLen) {
        this.head = new Elem(0, 3, "snake-head");
        this.snakeBody = new Array(maxLen);
        this.snakeBody[0] = new Elem(0, 2, "snake-body");
        this.snakeBody[1] = new Elem(0, 1, "snake-body");
        this.snakeBody[2] = new Elem(0, 0, "snake-body");
        this.len = 3;
    }
    Snake.prototype.checkApple = function (apple) {
        if (this.head.posX == apple.posX && this.head.posY == apple.posY) {
            var onSnake = true;
            while (onSnake === true) {
                apple.posX = Math.floor(Math.random() * (20));
                apple.posY = Math.floor(Math.random() * (20));
                var any = false;
                for (var i = 0; i < this.len; i++) {
                    if (apple.posX == this.snakeBody[i].posX && apple.posY == this.snakeBody[i].posY) {
                        any = true;
                    }
                    if (apple.posX == this.head.posX || apple.posY == this.head.posY) {
                        any = true;
                    }
                }
                onSnake = any;
            }
            if (onSnake === false) {
                apple.draw();
                this.snakeBody[this.len] = new Elem(this.snakeBody[this.len - 1].prevPosX, this.snakeBody[this.len - 1].prevPosY, "snake-body");
                this.len++;
            }
            return true;
        }
        else {
            return false;
        }
    };
    Snake.prototype.checkCollisions = function () {
        if ((this.head.posX < 0) || (this.head.posX > 20) || (this.head.posY < 0) || (this.head.posY > 20)) {
            return true;
        }
        else if (document.getElementById("x" + this.head.posX + "y" + this.head.posY).className.indexOf("snake-body") > -1) {
            return true;
        }
        else {
            return false;
        }
    };
    Snake.prototype.move = function (direction) {
        this.head.prevPosX = this.head.posX;
        this.head.prevPosY = this.head.posY;
        var self = this;
        var continueStep = true;
        if (direction == "left") {
            this.head.posY--;
        }
        else if (direction == "right") {
            this.head.posY++;
        }
        else if (direction == "up") {
            this.head.posX--;
        }
        else if (direction == "down") {
            this.head.posX++;
        }
        if (this.checkCollisions() === false) {
            this.head.draw();
            for (var i = 0; i < this.len; i++) {
                this.snakeBody[i].prevPosX = this.snakeBody[i].posX;
                this.snakeBody[i].prevPosY = this.snakeBody[i].posY;
                if (i === 0) {
                    this.snakeBody[i].posX = this.head.prevPosX;
                    this.snakeBody[i].posY = this.head.prevPosY;
                }
                else {
                    this.snakeBody[i].posX = this.snakeBody[i - 1].prevPosX;
                    this.snakeBody[i].posY = this.snakeBody[i - 1].prevPosY;
                }
                this.snakeBody[i].draw();
            }
        }
        else {
            continueStep = false;
        }
        return continueStep;
    };
    return Snake;
})();
var Grid = (function () {
    function Grid(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                document.getElementById("grid").innerHTML += new Cell(i, j).html;
            }
        }
    }
    return Grid;
})();
var Main = (function () {
    function Main() {
        this.score = 0;
    }
    Main.prototype.init = function () {
        // Reset html
        document.getElementById("grid").innerHTML = "";
        document.getElementById("score").innerHTML = "0";
        var self = this;
        // Init objects
        this.grid = new Grid(20, 20);
        this.maxLen = this.grid.rows * this.grid.cols;
        this.snake = new Snake(this.maxLen);
        this.apple = new Elem(9, 9, "apple");
        this.direction = "right";
        this.score = 0;
        // On start
        document.getElementById("start").onclick = function () {
            document.getElementById("game-over").style.display = "none";
            var d = document.getElementById("difficulty");
            var difficulty = d.options[d.selectedIndex].value;
            var difficultySpeed = 120;
            if (difficulty == "Easy") {
                difficultySpeed = 500;
            }
            else if (difficulty == "Medium") {
                difficultySpeed = 120;
            }
            else if (difficulty == "Hard") {
                difficultySpeed = 90;
            }
            else if (difficulty == "Expert") {
                difficultySpeed = 50;
            }
            document.getElementById("body").onkeypress = function (event) {
                if (event.which == 97 || event.keyCode == 97) {
                    self.direction = "left";
                }
                else if (event.which == 100 || event.keyCode == 100) {
                    self.direction = "right";
                }
                else if (event.which == 115 || event.keyCode == 115) {
                    self.direction = "down";
                }
                else if (event.which == 119 || event.keyCode == 119) {
                    self.direction = "up";
                }
            };
            var interval = setInterval(function () {
                if (self.snake.checkApple(self.apple) === true) {
                    self.score++;
                    document.getElementById("score").innerHTML = self.score + "";
                }
                if (self.snake.move(self.direction) === false) {
                    document.getElementById("game-over").innerHTML = "Game Over. Your score was: " + self.score;
                    document.getElementById("game-over").style.display = "block";
                    clearInterval(interval);
                    self.init();
                }
                self.snake.checkCollisions();
            }, difficultySpeed);
        };
    };
    return Main;
})();
var main = new Main();
main.init();
