class Game {
    stars: Stars = undefined
    starship: Starship = undefined
    aliens: Aliens = undefined
    help: any = undefined

    constructor(width: number, height: number) {
        this.stars = new Stars(1000, width, height)
        this.starship = new Starship(this)
        this.aliens = new Aliens(10)

        this.generateHelp()
    }

    draw() {
        this.starship.draw()
        this.stars.draw()
        this.aliens.draw()
        this.displayScore()
    }

    displayScore() {
        textSize(20)
        fill(255)
        let dead = this.aliens.aliens.reduce((cur, alien) => cur + (alien.dead ? 1 : 0), 0)
        text(dead + '/' + this.aliens.length, 20, 20)

        if (dead === this.aliens.length) {
            this.stopEverything()
            textSize(50)
            fill(255)
            text('You win!', width / 2 - 100, height / 2)
        }
    }

    gameOver() {
        bankOfSounds.spaceshipExplode.play()
        setTimeout(() => {
            bankOfSounds.spaceshipExplode.stop()
        }, 2000)

        this.stopEverything()

        textSize(50)
        fill(255)
        text('Game over!', width / 2 - 100, height / 2)
    }

    stopEverything() {
        this.stars.speed = 0
        this.starship.speed = 0
        for (let i = 0; i < this.aliens.length; ++i) {
            this.aliens.getAlien(i).speed = 0
        }
    }

    generateHelp() {
        this.help = createP(`
    <table>
    <thead>
        <tr>
            <th>Key</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>→</td>
            <td>Go right</td>
        </tr>
        <tr>
            <td>←</td>
            <td>Go left</td>
        </tr>
        <tr>
            <td>↓</td>
            <td>Go down</td>
        </tr>
        <tr>
            <td>↑</td>
            <td>Go up</td>
        </tr>
        <tr>
            <td>Space</td>
            <td>Fire</td>
        </tr>
        <tr>
            <td>A</td>
            <td>Go to hyper space</td>
        </tr>
    </tbody>
    </table>`)
    this.help.position(30, height + 45)
    }
}