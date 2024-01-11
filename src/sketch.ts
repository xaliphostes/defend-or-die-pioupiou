let game: Game = undefined
let bankOfSounds: BankOfSounds = undefined
let canvas: p5.Renderer = undefined

function setup() {
    canvas = createCanvas(1000, 300)
    game = new Game(1000, 300)
    bankOfSounds = new BankOfSounds()
}

function draw() {
    background(0)
    game.draw()
}
