let game: Game = undefined
let bankOfSounds: BankOfSounds = undefined

function setup() {
    createCanvas(1000, 300)
    game = new Game(1000, 300)
    bankOfSounds = new BankOfSounds()
}

function draw() {
    background(0)
    game.draw()
}
