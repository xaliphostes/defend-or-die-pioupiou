class Star {
    x = 0
    y = 0
    c: any = undefined

    constructor(width: number, height: number) {
        this.x = random(0, width)
        this.y = random(0, height)
        this.c = color(random(0, 255), random(0, 255), random(0, 255))
    }

    draw() {
        stroke(this.c)
        strokeWeight(2)
        point(this.x, this.y)
    }
}

class Stars {
    stars: Star[] = []
    speed: number = 3

    constructor(n: number, width: number, height: number) {
        for (let i=0; i<n; i++) {
            this.stars.push( new Star(width, height))
        }
    }

    draw() {
        for (let i=0; i<this.stars.length; i++) {
            this.stars[i].draw()
        }

        for (let i=0; i<this.stars.length; i++) {
            this.stars[i].x += this.speed
            if (this.stars[i].x > width) {
                this.stars[i].x = 0
            }
        }
    }
}
