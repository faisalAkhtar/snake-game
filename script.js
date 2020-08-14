(function() {
	var Snake = {
		init: function () {
			this.game_speed = 100,
			this.canvas_border_colour = '#10151b77',
			this.canvas_background_colour = "#f1f1f1",
			this.snake_colour = 'lightgreen',
			this.snake_border_colour = 'darkgreen',
			this.food_colour = 'red',
			this.food_border_colour = 'darkred',
			this.gameCanvas = document.getElementById("gameCanvas"),
			this.ctx = this.gameCanvas.getContext("2d"),
			this.overlay = document.querySelector('.modal-overlay');
			this.setup(),
			document.addEventListener("keydown", (e) => { this.changeDirection(e.keyCode) })
		},
		setup: function () {
			this.foodX,
			this.foodY,
			this.dx = 10,
			this.dy = 0,
			this.score = 0,
			this.changingDirection = false,
			this.snake = [ {x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150} ],
			this.main(),
			this.createFood()
		},
		main: function () {
			if (this.didGameEnd()) {
				if(this.score < 100) {
					document.querySelector(".winner").innerHTML = "You suck!";
					document.querySelector("#final_score").innerHTML = `${this.score} &#x1f480;`;
				} else if(this.score >= 100 && this.score < 500) {
					document.querySelector(".winner").innerHTML = "You rock!";
					document.querySelector("#final_score").innerHTML = `${this.score} &#x1F38A;`;
				} else {
					document.querySelector(".winner").innerHTML = "Woah!";
					document.querySelector("#final_score").innerHTML = `${this.score} &#128562;`;
				}
				setTimeout(function () {
					Snake.showModal();
				}, 500);
				return;
			}

			let _ = this;
			setTimeout(function onTick() {
				_.changingDirection = false;
				_.clearCanvas();
				_.drawFood();
				_.advanceSnake();
				_.drawSnake();

				_.main();
			}, this.game_speed)
		},
		clearCanvas: function () {
			this.ctx.fillStyle = this.canvas_background_colour;
			this.ctx.strokestyle = this.canvas_border_colour;

			this.ctx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
			this.ctx.strokeRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
		},
		drawSnake: function () {
			this.snake.forEach((e)=> {
				this.drawSnakePart(e)
			})
		},
		drawSnakePart: function (snakePart) {
			this.ctx.fillStyle = this.snake_colour;
			this.ctx.strokestyle = this.snake_border_colour;

			this.ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
			this.ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
		},
		advanceSnake: function () {
			let head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
			this.snake.unshift(head);

			let didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;
			if (didEatFood) {
				this.score += 10;
				document.getElementById('score').innerHTML = `Score: ${this.score}`;
				this.createFood();
			} else {
				this.snake.pop();
			}
		},
		changeDirection: function (keyPressed) {
			if (this.changingDirection) return;
			this.changingDirection = true;

			let LEFT_KEY = 37,
				RIGHT_KEY = 39,
				UP_KEY = 38,
				DOWN_KEY = 40;

			let goingUp = this.dy === -10,
				goingDown = this.dy === 10,
				goingRight = this.dx === 10,
				goingLeft = this.dx === -10;

			if (keyPressed === LEFT_KEY && !goingRight)	{ this.dx = -10; this.dy =   0; }
			if (keyPressed === UP_KEY && !goingDown)	{ this.dx =   0; this.dy = -10; }
			if (keyPressed === RIGHT_KEY && !goingLeft)	{ this.dx =  10; this.dy =   0; }
			if (keyPressed === DOWN_KEY && !goingUp)	{ this.dx =   0; this.dy =  10; }
		},
		randomTen: function (min, max) {
			return Math.round((Math.random() * (max-min) + min) / 10) * 10;
		},
		createFood: function () {
			this.foodX = this.randomTen(0, this.gameCanvas.width - 10);
			this.foodY = this.randomTen(0, this.gameCanvas.height - 10);

			this.snake.forEach(function isFoodOnSnake(part) {
				let foodIsoNsnake = part.x == this.foodX && part.y == this.foodY;
				if (foodIsoNsnake) createFood();
			});
		},
		drawFood: function () {
			this.ctx.fillStyle = this.food_colour;
			this.ctx.strokestyle = this.food_border_colour;
			this.ctx.fillRect(this.foodX, this.foodY, 10, 10);
			this.ctx.strokeRect(this.foodX, this.foodY, 10, 10);
		},
		didGameEnd: function () {
			for (let i = 4; i < this.snake.length; i++) {
				if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) return true
			}

			let hitLeftWall = this.snake[0].x < 0;
			let hitRightWall = this.snake[0].x > gameCanvas.width - 10;
			let hitToptWall = this.snake[0].y < 0;
			let hitBottomWall = this.snake[0].y > gameCanvas.height - 10;

			return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
		},
		showModal: function () {
			this.overlay.style.display = "block";
		},
		restart: function () {
			this.overlay.style.display = "none";
			this.setup();
		}
	}

	document.querySelector(".start").onclick = function(e) {
		e.preventDefault()
		Snake.init()
		this.parentElement.parentElement.remove()
	}

	document.querySelector(".restart").onclick = function(e) {
		e.preventDefault()
		Snake.restart()
	}
})();