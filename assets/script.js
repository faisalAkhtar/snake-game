(function() {
	var Snake = {
		init: function (speed) {
			this.game_speed = speed;
			this.canvas_border_colour = '#10151b77';
			this.canvas_background_colour = "#f1f1f1";
			this.snake_colour = 'lightgreen';
			this.snake_border_colour = 'darkgreen';
			this.food_colour = 'red';
			this.food_border_colour = 'darkred';
			this.gameCanvas = document.getElementById("gameCanvas");
			this.ctx = this.gameCanvas.getContext("2d");
			this.overlay = document.querySelector('.modal-overlay');
			this.setup();
			this.keysSetup();
		},
		setup: function () {
			this.foodX;
			this.foodY;
			this.dx = 10;
			this.dy = 0;
			this.score = 0;
			this.changingDirection = false;
			this.snake = [ {x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150} ];
			document.getElementById('score').innerHTML = `Score: 0`;
			this.main();
			this.createFood();
		},
		keysSetup: function () {
			let _ = this;
			document.addEventListener("keydown", (e) => { _.changeDirection(e.keyCode) })
			document.getElementById('upKey').onclick = function(e) {
				e.preventDefault()
				_.changeDirection(38)
			}
			document.getElementById('leftKey').onclick = function(e) {
				e.preventDefault()
				_.changeDirection(37)
			}
			document.getElementById('downKey').onclick = function(e) {
				e.preventDefault()
				_.changeDirection(40)
			}
			document.getElementById('rightKey').onclick = function(e) {
				e.preventDefault()
				_.changeDirection(39)
			}
		},
		fix_dpi: function () {
			let dpi = window.devicePixelRatio;

			let style_height = +getComputedStyle(this.gameCanvas).getPropertyValue("height").slice(0, -2);
			let style_width = +getComputedStyle(this.gameCanvas).getPropertyValue("width").slice(0, -2);

			this.gameCanvas.setAttribute('height', style_height * dpi);
			this.gameCanvas.setAttribute('width', style_width * dpi);
		},
		main: function () {
			if (this.didGameEnd()) {
				if(this.score < 50) {
					document.querySelector(".winner").innerHTML = "You suck!";
					document.querySelector("#final_score").innerHTML = `${this.score} &#x1f480;`;
				} else if(this.score >= 50 && this.score < 500) {
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
			this.ctx.strokeStyle = this.canvas_border_colour;

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
			this.ctx.strokeStyle = this.snake_border_colour;

			this.ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
			this.ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
		},
		advanceSnake: function () {
			let head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
			this.snake.unshift(head);

			let didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;
			if (didEatFood) {
				if(this.game_speed == 50) {
					this.score += 25;
				} else if(this.game_speed == 100) {
					this.score += 20;
				} else {
					this.score += 10;
				}
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

			if (keyPressed === LEFT_KEY && !goingRight)	{
				this.dx = -10;
				this.dy =   0;
				document.querySelector("#leftKey").classList.add("pressed");
				setTimeout(function() {
					document.querySelector("#leftKey").classList.remove("pressed");
				}, 50);
			}
			if (keyPressed === UP_KEY && !goingDown)	{
				this.dx =   0;
				this.dy = -10;
				document.querySelector("#upKey").classList.add("pressed");
				setTimeout(function() {
					document.querySelector("#upKey").classList.remove("pressed");
				}, 50);
			}
			if (keyPressed === RIGHT_KEY && !goingLeft)	{
				this.dx =  10;
				this.dy =   0;
				document.querySelector("#rightKey").classList.add("pressed");
				setTimeout(function() {
					document.querySelector("#rightKey").classList.remove("pressed");
				}, 50);
			}
			if (keyPressed === DOWN_KEY && !goingUp)	{
				this.dx =   0;
				this.dy =  10;
				document.querySelector("#downKey").classList.add("pressed");
				setTimeout(function() {
					document.querySelector("#downKey").classList.remove("pressed");
				}, 50);
			}
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
			this.ctx.strokeStyle = this.food_border_colour;
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
			document.querySelector(".intro-modal-overlay").style.display = "block";
		}
	}

	document.querySelector(".start").onclick = function(e) {
		e.preventDefault()
		let difficulty = document.querySelector('input[type="radio"]:checked').value;
		difficulty = parseInt(difficulty)
		Snake.init(difficulty)
		document.querySelector(".intro-modal-overlay").style.display = "none";
	}

	document.querySelector(".restart").onclick = function(e) {
		e.preventDefault()
		Snake.restart()
	}

	if( window.innerHeight < 480 ) {
		alert(`Current screen-height is not sufficient for the game play. It might affect your experience.\n\nMinimum screen-height recommended : 480px\nCurrent screen-height : ${window.innerHeight}px`)
	}

	window.onresize = function () {
		if( window.innerHeight < 480 ) {
			alert(`Current screen-height is not sufficient for the game play. It might affect your experience.\n\nMinimum screen-height recommended : 480px\nCurrent screen-height : ${window.innerHeight}px`)
		}
	}
})();
