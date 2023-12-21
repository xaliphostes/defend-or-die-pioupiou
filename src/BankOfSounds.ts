class BankOfSounds {
    laser: any = undefined
    alienExplode: any = undefined
    spaceshipExplode: any = undefined
    hyperSpace: any = undefined

    constructor() {
        this.laser = loadSound('sounds/laser.wav')
        this.alienExplode = loadSound('sounds/explode.wav')
        this.hyperSpace = loadSound('sounds/hyperSpace.wav')
        this.spaceshipExplode = loadSound('sounds/explosion.wav')

        this.laser.setVolume(0.1)
    }
}
