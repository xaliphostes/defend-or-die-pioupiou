class Alien {
    sprite: any = undefined
    speed = 5
    w = 20
    h = 15
    dead = false

    constructor(x: number, y: number) {
        let imageLeft = loadImage('images/alien.png')
        this.sprite = createSprite(300, 150)
        this.sprite.addImage(imageLeft)
        this.sprite.x = x
        this.sprite.y = y
        this.sprite.visible = true
        this.sprite.collider = 'none'
        this.speed = random(2, 5)
    }

    get x() {
        return this.sprite.x - this.w/2
    }

    get y() {
        return this.sprite.y - this.h/2
    }

    getRect(): Rect {
        return {
            x: this.x,
            y: this.y,
            width: this.w,
            height: this.h
        }
    }

    changeSpeed() {
        this.sprite.x += this.speed
            if (this.sprite.x > width) {
                this.sprite.x = 0
            }
    }
}

class Aliens {
    aliens: Alien[] = []

    constructor(n: number) {
        for (let i = 0; i < n; i++) {
            this.aliens.push(new Alien(random(0, width), random(0, height)))
        }
    }

    draw() {
        // this.aliens.forEach( alien => alien.draw() )
        for (let i = 0; i < this.aliens.length; i++) {
            let alien = this.aliens[i]
            alien.changeSpeed()
            // stroke(255)
            // rect(alien.x, alien.y, alien.w, alien.h)
        }
    }

    get length() {
        return this.aliens.length
    }

    getAlien(i: number) {
        return this.aliens[i]
    }
}
