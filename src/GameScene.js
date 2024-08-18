
import properties from "./properties"
import Player from "./Player"
import { Scene } from "./TitleScene"
import constants from "./constants"

export default class GameScene extends Scene {
    waveInterval = 80;
    waveCount;
    frameCnt;
    frameCntUp = 1;
    stageBgAmountMove = 0.7;
    enemyWaveFlg = !1;
    theWorldFlg = !1;
    sceneSwitch = 0;
    enemyHitTestList;
    itemHitTestList;
    explosionTextures = [];
    caExplosionTextures = [];
    itemTextureList = {};
    stageBg;
    stageEnemyPositionList = {};
    unitContainer;

    constructor() {
        super("game-scene");

        window.gameScene = this;
    }

    init() {
        for (var s = 0; s < 7; s++) {
            var r = "explosion0" + s + ".gif";
            this.explosionTextures[s] = r;
        }
        // Set up player
        var d = properties.resource.recipe.data.playerData;
        return (
            (d.explosion = this.explosionTextures),
            (this.player = new Player(d)),
            (properties.player = this.player)
        );
    }

    create() {
        this.player.setUp(properties.playerMaxHp, properties.shootMode, properties.shootSpeed),
            (this.player.unit.height = 64),
            (this.player.unit.width = 32),
            (this.player.unit.x = constants.GAME_WIDTH / 2 - this.player.unit.width / 2),
            (this.player.unit.y = constants.GAME_HEIGHT - this.player.unit.height - 30),
            (this.player.unitX = constants.GAME_WIDTH / 2),
            (this.player.unitY = this.player.unit.y),
            this.addChildAt(this.player, 2);

            (this.enemyHitTestList = []);
    }

    update() {
        if (!this.theWorldFlg) {
            this.player.update(); 

            for (var t = 0; t < this.enemyHitTestList.length; t++) {
                var o = this.enemyHitTestList[t];
        
                o.update(this.stageBgAmountMove);
            }
        }
    }
}