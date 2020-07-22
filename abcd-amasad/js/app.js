    /**
     * @file Arcade game similar to frogger.
     * @author Cynthia Teeters <me@cynthiateeters.com>
     * @copyright Cynthia Teeters © 2015
     *
     *
     * @see Images used to make this game's characters Evil Chompers
     * were originally made [Bevouliin - Imaginary Perception]{@link http://bevouliin.com} ,
     * and obtained from [OpenGameArt]{@link opengameart.org} under [CC0 license]{@link http://creativecommons.org/publicdomain/zero/1.0/}.
     *
     * @see Images to make litlle monkey were originally made by [fikri]{@link http://graphicriver.net/user/fikri} and
     * purchased under [Envato Standard License]{@link http://graphicriver.net/licenses/standard?license=regular}.
     *
     * @see pacmanwakka.wav (created by remaxim) was obtained from [OpenGameArt]{@link http://opengameart.org/content/pacman-clone-wakka-sound}
     * under a [CC-BY-SA 3.0 license]{@link http://creativecommons.org/licenses/by-sa/3.0/}.
     *
     * @see round_end.wac (created by sauer2) was obtained from [OpenGameArt]{@link http://opengameart.org/content/oldschool-win-and-die-jump-and-run-soundscreated}
     * under [CC0 license]{@link http://creativecommons.org/publicdomain/zero/1.0/}.
     */

    /**
     * Represents a game enemy, a thing the must hero.
     * @constructor
     */
    var Enemy = function () {
        /*
          There are two images for each enemy to make it
          animated by chomping its teeth.
          */
        this.enemyArr = ['images/evil-red-flower-2.png',
            'images/evil-red-flower-1.png'
        ];
        Resources.load(this.enemyArr);
        this.sprite = this.enemyArr[0];
        /*
         * Basic game physics: speed and acceleration
         */
        this.x = -101;
        this.y = -200;
        this.maxSpeed = createRandom(300, 400);
        this.speed = createRandom(60, 140);
        this.startSpeed = this.speed;
        this.accel = createRandom(10001, 10005) / 10000;
        this.speeding = false;
        this.timeSpeeding = 0;
        /*
         * Make enemy randomly chomp its teeth
         */
        this.chomp = createRandom(0, 1); // used to load chomp sprite, must toggle between 0 and 1
        this.chompSpeed = createRandom(4, 33);
        this.chompCount = 0;
    };

    /**
     * Initialize pixel position of an enemy based on
     * the game grid's column and row.
     *
     * @param {number} col - a gameboard grid column.
     * @param {number} row - a gameboard grid column.
     */
    Enemy.prototype.init = function (col, row) {
        this.x = config.xDimensions.xInterval * col;
        this.y = config.yDimensions.yInterval * row;
    };

    /**
     * Update the enemy's position, a required method for the game
     *
     * @param {number} dt - a time delta between ticks.
     *
     */
    Enemy.prototype.update = function (dt) {
        // Multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.

        // Animate enemy's mouth
        this.chompCount++;
        if (this.chompCount % this.chompSpeed === 0) {
            this.chomp = 1 - this.chomp;
            this.sprite = this.enemyArr[this.chomp];
        }

        // Check for a possible collision with hero
        this.collision();

        // Game physics
        if (this.speed < this.maxSpeed) {
            this.speed = this.speed * this.accel;
        } else {
            if (!this.speeding) {
                this.speeding = true;
            }
        }
        var newX = this.x + this.speed * dt;
        if (newX > config.xDimensions.xMax) {
            this.x = -202;
            this.chompSpeed = createRandom(2, 33);
            if (this.speeding) {
                this.timeSpeeding += 1;
                if (this.timeSpeeding > 6) {
                    this.speed = this.startSpeed;
                    this.speeding = false;
                    this.timeSpeeding = 0;
                    var change = -1 + Math.round(Math.random()) * 2;
                    this.maxSpeed = this.maxSpeed + change * 150 * Math.random();
                    this.accel = createRandom(10001, 10005) / 10000;
                }
            }
        } else {
            this.x = newX;
        }
    };

    /**
     * Allow enemy to share its position
     * @returns {object} the enemy's (x,y) coordinates
     */
    Enemy.prototype.report = function () {
        return {
            xPos: this.x,
            yPos: this.y
        };
    };

    /**
     * Enemy checks if it has hit the hero. It has
     * the ability to tell the player to reset.
     */
    Enemy.prototype.collision = function () {
        var playerPos = player.report();
        var diffX = Math.abs(this.x - playerPos.xPos);
        var diffY = Math.abs(this.y - playerPos.yPos);

        if (diffX < (config.xDimensions.xInterval - 40) && diffY < config.yDimensions.yInterval) {
            player.reset(true);
            soundEfx.play();
        }
    };

    /**
     * Draw the enemy on the screen, a required method for game.
     */
    Enemy.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    /**
     * Represents a game hero.
     * @constructor
     */
    var Player = function () {
        this.enemyArr = [
            'images/wu-idle.png',
            'images/wu-rr.png',
            'images/wu-rl.png',
            'images/wu-up.png',
            'images/wu-down.png',
            'images/wu-hit2.png',
            'images/wu-joy-r.png',
            'images/wu-joy-l.png'
        ];
        Resources.load(this.enemyArr);
        this.sprite = this.enemyArr[0];
        this.x = Math.floor((config.canvasDimensions.canvasCols - 1) / 2) * config.xDimensions.xInterval;
        this.y = 5 * config.yDimensions.yInterval;
        this.startX = this.x;
        this.startY = this.y;
        this.victory = 0;
        this.victoryCelebration = false;
        this.victoryCount = 0;

    };

    /**
     * Draw the player on the screen, a required method for game.
     */
    Player.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    /**
     * Update the player's status.
     * A win needs a celebration dance.
     */
    Player.prototype.update = function () {
        // If player wins, have it jump for joy
        // and let that jumping go for 75 loop cycles,
        // then update score, and reset back to start pos.
        if (this.y === 0 && this.victoryCount < 75) {
            soundWin.play();
            this.victoryCelebration = true;
            this.victoryCount++;
            if (this.victoryCount % 14 === 0) {
                // toggle between up and down jump enemyArr
                this.victory = 1 - this.victory;
                this.sprite = this.enemyArr[this.victory + 6];
            }
            if (this.victoryCount >= 75) {
                player.reset(false);
                this.victoryCount = 0;
                this.victoryCelebration = false;
                scoreboard.update(1);
            }
        }
    };

    /**
     * Allow player to share its position
     * @returns {object} - the player's (x,y) coordinates
     */
    Player.prototype.report = function () {
        return {
            xPos: this.x,
            yPos: this.y
        };
    };

    /**
     * Reset the player back to his starting position.
     * If it was hit, use image to show it as hurt.
     *
     * @param {boolean} isHit -
     */
    Player.prototype.reset = function (isHit) {
        if (isHit) {
            this.sprite = this.enemyArr[5];
        } else {
            this.sprite = this.enemyArr[0];
        }
        this.x = this.startX;
        this.y = this.startY;
    };

    /**
     * Logically move player along as user presses arrow keys.
     *
     * @param {string} key - user pressed this arrow key
     */
    Player.prototype.handleInput = function (key) {
        if (this.victoryCelebration) {
            return;
        }

        if (key == 'space') {
            isRunning = !isRunning;
        }
        if (isRunning) {
            if (key == 'up') {
                if (this.y > config.yDimensions.yInterval) {
                    this.y -= config.yDimensions.yInterval;
                    this.sprite = this.enemyArr[3];
                } else {
                    this.y = 0;
                }
            } else if (key == 'down' && (this.y < config.yDimensions.yMax)) {
                this.y += config.yDimensions.yInterval;
                this.sprite = this.enemyArr[4];
            } else if (key == 'right' && (this.x < config.xDimensions.xMax - config.xDimensions.xInterval)) {
                this.x += config.xDimensions.xInterval;
                this.sprite = this.enemyArr[1];
            } else if (key == 'left') {
                if (this.x > config.xDimensions.xInterval) {
                    this.x -= config.xDimensions.xInterval;
                    this.sprite = this.enemyArr[2];
                } else {
                    this.x = 0;
                }
            }
            if (this.x == this.startX && this.y == this.startY) {
                this.sprite = this.enemyArr[0];
            }
        }
    };

    /**
     * Represents the game's scoreboard.
     * @constructor
     */
    var Scoreboard = function () {
        this.numberWins = 0;
    };

    /**
     * Update the player's score.
     */
    Scoreboard.prototype.update = function (wins) {

        isScoreboardUp = true;
        if (typeof wins === 'number') {
            this.numberWins += wins;
            ctx.drawImage(Resources.get(sky), 0, 0);
            var winText = 'Your Score: ' + this.numberWins;
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            //ctx.fillStyle = "#4e4e4e";
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = config.textStyles.h3;
            ctx.fillStyle = config.textStyles.black;
            ctx.fillStyle = "#4e4e4e";
            ctx.fillText(winText, 65, 44);

        }

    };

    // Now instantiate objects.
    // Place all enemy objects in an array called allEnemies
    var allEnemies = [];
    var i;
    //Make an enemy - one on each of the grass rows
    for (i = 0; i < 4; i++) {
        allEnemies.push(new Enemy());
        allEnemies[i].init(createRandom(-2, 5), i + 1);
    }
    //Make some more enemies that are more randomly placed
    var max = createRandom(5, 8);
    for (i; i < max; i++) {
        allEnemies.push(new Enemy());
        allEnemies[i].init(createRandom(-2, config.canvasDimensions.canvasCols), createRandom(1, 4));
    }

    // Place the player object in a variable called player
    var player = new Player(); // CLT

    // Place the scoreboard object in a variable called scoreboard
    var scoreboard = new Scoreboard();

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function (e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            32: 'space'
        };
        player.handleInput(allowedKeys[e.keyCode]);
    });
