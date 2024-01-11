var Alien = (function () {
    function Alien(x, y) {
        this.sprite = undefined;
        this.speed = 5;
        this.w = 20;
        this.h = 15;
        this.dead = false;
        var imageLeft = loadImage('images/alien.png');
        this.sprite = createSprite(300, 150);
        this.sprite.addImage(imageLeft);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.visible = true;
        this.sprite.collider = 'none';
        this.speed = random(2, 5);
    }
    Object.defineProperty(Alien.prototype, "x", {
        get: function () {
            return this.sprite.x - this.w / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Alien.prototype, "y", {
        get: function () {
            return this.sprite.y - this.h / 2;
        },
        enumerable: false,
        configurable: true
    });
    Alien.prototype.getRect = function () {
        return {
            x: this.x,
            y: this.y,
            width: this.w,
            height: this.h
        };
    };
    Alien.prototype.changeSpeed = function () {
        this.sprite.x += this.speed;
        if (this.sprite.x > width) {
            this.sprite.x = 0;
        }
    };
    return Alien;
}());
var Aliens = (function () {
    function Aliens(n) {
        this.aliens = [];
        for (var i = 0; i < n; i++) {
            this.aliens.push(new Alien(random(0, width), random(0, height)));
        }
    }
    Aliens.prototype.draw = function () {
        for (var i = 0; i < this.aliens.length; i++) {
            var alien = this.aliens[i];
            alien.changeSpeed();
        }
    };
    Object.defineProperty(Aliens.prototype, "length", {
        get: function () {
            return this.aliens.length;
        },
        enumerable: false,
        configurable: true
    });
    Aliens.prototype.getAlien = function (i) {
        return this.aliens[i];
    };
    return Aliens;
}());
var BankOfSounds = (function () {
    function BankOfSounds() {
        this.laser = undefined;
        this.alienExplode = undefined;
        this.spaceshipExplode = undefined;
        this.hyperSpace = undefined;
        this.laser = loadSound('sounds/laser.wav');
        this.alienExplode = loadSound('sounds/explode.wav');
        this.hyperSpace = loadSound('sounds/hyperSpace.wav');
        this.spaceshipExplode = loadSound('sounds/explosion.wav');
        this.laser.setVolume(0.1);
    }
    return BankOfSounds;
}());
var Game = (function () {
    function Game(width, height) {
        this.stars = undefined;
        this.starship = undefined;
        this.aliens = undefined;
        this.help = undefined;
        this.stars = new Stars(1000, width, height);
        this.starship = new Starship(this);
        this.aliens = new Aliens(10);
        this.generateHelp();
    }
    Game.prototype.draw = function () {
        this.starship.draw();
        this.stars.draw();
        this.aliens.draw();
        this.displayScore();
    };
    Game.prototype.displayScore = function () {
        textSize(20);
        fill(255);
        var dead = this.aliens.aliens.reduce(function (cur, alien) { return cur + (alien.dead ? 1 : 0); }, 0);
        text(dead + '/' + this.aliens.length, 20, 20);
        if (dead === this.aliens.length) {
            this.stopEverything();
            textSize(50);
            fill(255);
            text('You win!', width / 2 - 100, height / 2);
        }
    };
    Game.prototype.gameOver = function () {
        bankOfSounds.spaceshipExplode.play();
        setTimeout(function () {
            bankOfSounds.spaceshipExplode.stop();
        }, 2000);
        this.stopEverything();
        textSize(50);
        fill(255);
        text('Game over!', width / 2 - 100, height / 2);
    };
    Game.prototype.stopEverything = function () {
        this.stars.speed = 0;
        this.starship.speed = 0;
        for (var i = 0; i < this.aliens.length; ++i) {
            this.aliens.getAlien(i).speed = 0;
        }
    };
    Game.prototype.generateHelp = function () {
        this.help = createP("\n    <table>\n    <thead>\n        <tr>\n            <th>Key</th>\n            <th>Action</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>\u2192</td>\n            <td>Go right</td>\n        </tr>\n        <tr>\n            <td>\u2190</td>\n            <td>Go left</td>\n        </tr>\n        <tr>\n            <td>\u2193</td>\n            <td>Go down</td>\n        </tr>\n        <tr>\n            <td>\u2191</td>\n            <td>Go up</td>\n        </tr>\n        <tr>\n            <td>Space</td>\n            <td>Fire</td>\n        </tr>\n        <tr>\n            <td>A</td>\n            <td>Go to hyper space</td>\n        </tr>\n    </tbody>\n    </table>");
        this.help.position(30, height + 45);
    };
    return Game;
}());
var Star = (function () {
    function Star(width, height) {
        this.x = 0;
        this.y = 0;
        this.c = undefined;
        this.x = random(0, width);
        this.y = random(0, height);
        this.c = color(random(0, 255), random(0, 255), random(0, 255));
    }
    Star.prototype.draw = function () {
        stroke(this.c);
        strokeWeight(2);
        point(this.x, this.y);
    };
    return Star;
}());
var Stars = (function () {
    function Stars(n, width, height) {
        this.stars = [];
        this.speed = 3;
        for (var i = 0; i < n; i++) {
            this.stars.push(new Star(width, height));
        }
    }
    Stars.prototype.draw = function () {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].draw();
        }
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].x += this.speed;
            if (this.stars[i].x > width) {
                this.stars[i].x = 0;
            }
        }
    };
    return Stars;
}());
var Starship = (function () {
    function Starship(game) {
        var _this = this;
        this.color = color(255, 255, 255);
        this.speed = 5;
        this.spriteLeft = undefined;
        this.spriteRight = undefined;
        this.w = 30;
        this.h = 10;
        this.isLeft = true;
        this.game = undefined;
        this.oldX = 0;
        this.oldY = 0;
        this.touchStarted = function () {
            _this.oldX = Number.NaN;
            _this.oldY = Number.NaN;
        };
        this.touchEnded = function () {
        };
        this.touchMoved = function (e) {
            if (Number.isNaN(_this.oldX)) {
                _this.oldX = mouseX;
                _this.oldY = mouseY;
                return;
            }
            var dx = mouseX - _this.oldX;
            var dy = mouseY - _this.oldY;
            if (dx < 0) {
                _this.translate(_this.spriteLeft, dx, 0);
                _this.translate(_this.spriteRight, dx, 0);
                _this.oldX = mouseX;
                _this.oldY = mouseY;
                _this.spriteLeft.visible = true;
                _this.spriteRight.visible = false;
                _this.isLeft = true;
                _this.draw();
            }
            else if (dx > 0) {
                _this.translate(_this.spriteLeft, dx, 0);
                _this.translate(_this.spriteRight, dx, 0);
                _this.oldX = mouseX;
                _this.oldY = mouseY;
                _this.spriteLeft.visible = false;
                _this.spriteRight.visible = true;
                _this.isLeft = false;
                _this.draw();
            }
            if (dy !== 0) {
                _this.translate(_this.spriteLeft, 0, dy);
                _this.translate(_this.spriteRight, 0, dy);
                _this.oldX = mouseX;
                _this.oldY = mouseY;
                _this.draw();
            }
        };
        this.game = game;
        var imageLeft = loadImage('images/spaceship.png');
        this.spriteLeft = createSprite(300, 150);
        this.spriteLeft.addImage(imageLeft);
        this.spriteLeft.x = width / 1.2;
        this.spriteLeft.y = height / 2;
        this.spriteLeft.collider = 'none';
        this.spriteLeft.visible = true;
        var imageRight = loadImage('images/spaceship-reverse.jpg');
        this.spriteRight = createSprite(300, 150);
        this.spriteRight.addImage(imageRight);
        this.spriteRight.x = width / 1.2;
        this.spriteRight.y = height / 2;
        this.spriteRight.collider = 'none';
        this.spriteRight.visible = false;
        canvas.touchStarted(this.touchStarted);
        canvas.touchEnded(this.touchEnded);
        canvas.touchMoved(this.touchMoved);
        var button = createButton('Fire');
        button.position(width + 45, 40);
        button.mousePressed(function () {
            bankOfSounds.laser.play();
            stroke(255, 255, 255);
            if (_this.isLeft) {
                line(_this.spriteLeft.x, _this.spriteLeft.y + 5, 0, _this.spriteLeft.y + 5);
            }
            else {
                line(_this.spriteRight.x, _this.spriteRight.y + 5, width, _this.spriteLeft.y + 5);
            }
            _this.testHitLaserAlien(_this.spriteRight.x, _this.spriteRight.y + 5);
            _this.draw();
        });
    }
    Starship.prototype.draw = function () {
        this.keyPressed();
        for (var i = 0; i < this.game.aliens.length; i++) {
            var alien = this.game.aliens.getAlien(i);
            if (alien.sprite.removed === false) {
                if (this.testCollapse(this.getRect(), alien.getRect())) {
                    this.game.gameOver();
                }
            }
        }
    };
    Starship.prototype.getRect = function () {
        if (this.isLeft) {
            return {
                x: this.spriteLeft.x,
                y: this.spriteLeft.y,
                width: this.w,
                height: this.h
            };
        }
        else {
            return {
                x: this.spriteRight.x,
                y: this.spriteRight.y,
                width: this.w,
                height: this.h
            };
        }
    };
    Starship.prototype.translate = function (sprite, tx, ty) {
        sprite.x += tx;
        sprite.y += ty;
        if (sprite.x < this.w) {
            sprite.x = this.w;
        }
        if (sprite.x > width - this.w) {
            sprite.x = width - this.w;
        }
        if (sprite.y < 0) {
            sprite.y = 0;
        }
        if (sprite.y > height) {
            sprite.y = height;
        }
    };
    Starship.prototype.keyPressed = function () {
        if (keyIsPressed) {
            if (keyCode === DOWN_ARROW) {
                this.translate(this.spriteLeft, 0, this.speed);
                this.translate(this.spriteRight, 0, this.speed);
            }
            if (keyCode === UP_ARROW) {
                this.translate(this.spriteLeft, 0, -this.speed);
                this.translate(this.spriteRight, 0, -this.speed);
            }
            if (keyCode === LEFT_ARROW) {
                this.translate(this.spriteLeft, -this.speed, 0);
                this.translate(this.spriteRight, -this.speed, 0);
                this.spriteLeft.visible = true;
                this.spriteRight.visible = false;
                this.isLeft = true;
            }
            if (keyCode === RIGHT_ARROW) {
                this.translate(this.spriteLeft, this.speed, 0);
                this.translate(this.spriteRight, this.speed, 0);
                this.spriteLeft.visible = false;
                this.spriteRight.visible = true;
                this.isLeft = false;
            }
            if (keyCode === 32) {
                bankOfSounds.laser.play();
                stroke(255, 255, 255);
                if (this.isLeft) {
                    line(this.spriteLeft.x, this.spriteLeft.y + 5, 0, this.spriteLeft.y + 5);
                }
                else {
                    line(this.spriteRight.x, this.spriteRight.y + 5, width, this.spriteLeft.y + 5);
                }
                this.testHitLaserAlien(this.spriteRight.x, this.spriteRight.y + 5);
            }
            if (keyCode === 65) {
                this.spriteLeft.x = random(0, width);
                this.spriteLeft.y = random(0, height);
                this.spriteLeft.x = this.spriteLeft.x;
                this.spriteLeft.y = this.spriteLeft.y;
                bankOfSounds.hyperSpace.play();
            }
        }
    };
    Starship.prototype.testHitLaserAlien = function (beamX, beamY) {
        for (var i = 0; i < this.game.aliens.length; i++) {
            var alien = this.game.aliens.getAlien(i);
            if (beamY <= alien.y + alien.h && beamY >= alien.y) {
                if ((this.isLeft && alien.x <= beamX) || (!this.isLeft && alien.x >= beamX)) {
                    alien.sprite.visible = false;
                    alien.sprite.removed = true;
                    alien.dead = true;
                    this.hitExplode();
                    return;
                }
            }
        }
    };
    Starship.prototype.testCollapse = function (rect1, rect2) {
        var x1 = rect2.x, y1 = rect2.y, x2 = x1 + rect2.width, y2 = y1 + rect2.height;
        if (rect1.x > x1) {
            x1 = rect1.x;
        }
        if (rect1.y > y1) {
            y1 = rect1.y;
        }
        if (rect1.x + rect1.width < x2) {
            x2 = rect1.x + rect1.width;
        }
        if (rect1.y + rect1.height < y2) {
            y2 = rect1.y + rect1.height;
        }
        return (x2 <= x1 || y2 <= y1) ? false : true;
    };
    Starship.prototype.hitExplode = function () {
        bankOfSounds.alienExplode.play();
    };
    return Starship;
}());
var game = undefined;
var bankOfSounds = undefined;
var canvas = undefined;
function setup() {
    canvas = createCanvas(1000, 300);
    game = new Game(1000, 300);
    bankOfSounds = new BankOfSounds();
}
function draw() {
    background(0);
    game.draw();
}
