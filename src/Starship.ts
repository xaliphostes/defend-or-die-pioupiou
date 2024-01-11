class Starship {
    color = color(255, 255, 255)
    speed = 5
    spriteLeft: any = undefined
    spriteRight: any = undefined
    w = 30
    h = 10
    isLeft = true
    game: Game = undefined
    oldX = 0
    oldY = 0

    constructor(game: Game) {
        this.game = game

        let imageLeft = loadImage('images/spaceship.png')
        this.spriteLeft = createSprite(300, 150)
        this.spriteLeft.addImage(imageLeft)
        this.spriteLeft.x = width / 1.2
        this.spriteLeft.y = height / 2
        this.spriteLeft.collider = 'none'
        this.spriteLeft.visible = true

        let imageRight = loadImage('images/spaceship-reverse.jpg')
        this.spriteRight = createSprite(300, 150)
        this.spriteRight.addImage(imageRight)
        this.spriteRight.x = width / 1.2
        this.spriteRight.y = height / 2
        this.spriteRight.collider = 'none'
        this.spriteRight.visible = false

        canvas.touchStarted(this.touchStarted);
        canvas.touchEnded(this.touchEnded);
        canvas.touchMoved(this.touchMoved);

        let button = createButton('Fire')
        button.position(width + 45, 40)
        button.mousePressed(() => {
            bankOfSounds.laser.play()
            stroke(255, 255, 255)
            if (this.isLeft) {
                line(this.spriteLeft.x, this.spriteLeft.y + 5, 0, this.spriteLeft.y + 5)
            }
            else {
                line(this.spriteRight.x, this.spriteRight.y + 5, width, this.spriteLeft.y + 5)
            }
            this.testHitLaserAlien(this.spriteRight.x, this.spriteRight.y + 5)
            this.draw()
        })
    }

    draw() {
        this.keyPressed()

        for (let i = 0; i < this.game.aliens.length; i++) {
            let alien = this.game.aliens.getAlien(i)
            if (alien.sprite.removed === false) {
                if (this.testCollapse(this.getRect(), alien.getRect())) {
                    this.game.gameOver()
                }
            }
        }
    }

    getRect(): Rect {
        if (this.isLeft) {
            return {
                x: this.spriteLeft.x,
                y: this.spriteLeft.y,
                width: this.w,
                height: this.h
            }
        }
        else {
            return {
                x: this.spriteRight.x,
                y: this.spriteRight.y,
                width: this.w,
                height: this.h
            }
        }
    }

    translate(sprite: any, tx: number, ty: number) {
        sprite.x += tx
        sprite.y += ty

        if (sprite.x < this.w) {
            sprite.x = this.w
        }
        if (sprite.x > width - this.w) {
            sprite.x = width - this.w
        }

        if (sprite.y < 0) {
            sprite.y = 0
        }
        if (sprite.y > height) {
            sprite.y = height
        }
    }

    touchStarted = () => {
        this.oldX = Number.NaN
        this.oldY = Number.NaN
    }

    touchEnded = () => {
        // console.log('touch ended')
    }

    touchMoved = (e: TouchEvent) => {
        if (Number.isNaN(this.oldX)) {
            this.oldX = mouseX
            this.oldY = mouseY
            return
        }

        const dx = mouseX - this.oldX
        const dy = mouseY - this.oldY
        if (dx < 0) {
            this.translate(this.spriteLeft, dx, 0)
            this.translate(this.spriteRight, dx, 0)
            this.oldX = mouseX
            this.oldY = mouseY
            this.spriteLeft.visible = true
            this.spriteRight.visible = false
            this.isLeft = true
            this.draw()
        }
        else if (dx > 0) {
            this.translate(this.spriteLeft, dx, 0)
            this.translate(this.spriteRight, dx, 0)
            this.oldX = mouseX
            this.oldY = mouseY
            this.spriteLeft.visible = false
            this.spriteRight.visible = true
            this.isLeft = false
            this.draw()
        }

        if (dy !== 0) {
            this.translate(this.spriteLeft, 0, dy)
            this.translate(this.spriteRight, 0, dy)
            this.oldX = mouseX
            this.oldY = mouseY
            this.draw()
        }
    }

    keyPressed() {
        if (keyIsPressed) {
            if (keyCode === DOWN_ARROW) {
                this.translate(this.spriteLeft, 0, this.speed)
                this.translate(this.spriteRight, 0, this.speed)
            }

            if (keyCode === UP_ARROW) {
                this.translate(this.spriteLeft, 0, -this.speed)
                this.translate(this.spriteRight, 0, -this.speed)
            }

            if (keyCode === LEFT_ARROW) {
                this.translate(this.spriteLeft, -this.speed, 0)
                this.translate(this.spriteRight, -this.speed, 0)
                this.spriteLeft.visible = true
                this.spriteRight.visible = false
                this.isLeft = true
            }

            if (keyCode === RIGHT_ARROW) {
                this.translate(this.spriteLeft, this.speed, 0)
                this.translate(this.spriteRight, this.speed, 0)
                this.spriteLeft.visible = false
                this.spriteRight.visible = true
                this.isLeft = false
            }

            if (keyCode === 32) { // space
                bankOfSounds.laser.play()
                stroke(255, 255, 255)

                if (this.isLeft) {
                    line(this.spriteLeft.x, this.spriteLeft.y + 5, 0, this.spriteLeft.y + 5)
                }
                else {
                    line(this.spriteRight.x, this.spriteRight.y + 5, width, this.spriteLeft.y + 5)
                }

                this.testHitLaserAlien(this.spriteRight.x, this.spriteRight.y + 5)
            }

            if (keyCode === 65) { // letter A
                this.spriteLeft.x = random(0, width)
                this.spriteLeft.y = random(0, height)
                this.spriteLeft.x = this.spriteLeft.x
                this.spriteLeft.y = this.spriteLeft.y
                bankOfSounds.hyperSpace.play()
            }
        }
    }

    testHitLaserAlien(beamX: number, beamY: number) {
        for (let i = 0; i < this.game.aliens.length; i++) {
            let alien = this.game.aliens.getAlien(i)

            if (beamY <= alien.y + alien.h && beamY >= alien.y) {
                // on tape juste en y
                if ((this.isLeft && alien.x <= beamX) || (!this.isLeft && alien.x >= beamX)) {
                    // le laser est dans la bonne direction
                    alien.sprite.visible = false
                    alien.sprite.removed = true
                    alien.dead = true
                    this.hitExplode()
                    return
                }

            }
        }
    }

    testCollapse(rect1: Rect, rect2: Rect): boolean {
        var x1 = rect2.x, y1 = rect2.y, x2 = x1 + rect2.width, y2 = y1 + rect2.height;
        if (rect1.x > x1) { x1 = rect1.x; }
        if (rect1.y > y1) { y1 = rect1.y; }
        if (rect1.x + rect1.width < x2) { x2 = rect1.x + rect1.width; }
        if (rect1.y + rect1.height < y2) { y2 = rect1.y + rect1.height; }
        return (x2 <= x1 || y2 <= y1) ? false : true
    }

    hitExplode() {
        bankOfSounds.alienExplode.play()
    }

}