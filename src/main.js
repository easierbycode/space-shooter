
import AdvScene from "./AdvScene"
import constants from "./constants"
import GameScene from "./GameScene"
import LoadScene from "./LoadScene"
import TitleScene from "./TitleScene"

const config = {
    type: Phaser.AUTO,
    width: constants.GAME_WIDTH,
    height: constants.GAME_HEIGHT,
    physics: {
        default: "arcade",
        arcade: {
            debug: new URL(window.location.href).searchParams.get("debug") == "1",
        },
    },
    scale: {
        autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
        mode: Phaser.Scale.ScaleModes.FIT,
    },
    render: {
        pixelArt: true,
    },
    fps: {
        target: 30,
    },
    scene: [
        LoadScene,
        TitleScene,
        AdvScene,
        GameScene
    ]
}

document.addEventListener('deviceready', onDeviceReady, false)

function onDeviceReady() {
    window.game = new Phaser.Game(config)
}


if (!window.cordova) {
    setTimeout(() => {
        const e = new Event('deviceready')
        document.dispatchEvent(e)
    }, 50)
}