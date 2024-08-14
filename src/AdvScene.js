
import AudioManager from "./audio";
import { Container, Scene } from "./TitleScene";
import { en, ja } from "./lang";
import constants from "./constants";
import properties from "./properties";

class NextButton extends Container {
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y);

        var t = this;

        this.hitArea = new Phaser.GameObjects.Rectangle(
            this.scene,
            constants.GAME_WIDTH - 31,
            constants.GAME_HEIGHT - 12 - 20,
            31,
            12
        );

        (t.hitGra = scene.add.graphics()),
            t.hitGra.fillStyle(16711680, 0),
            t.hitGra.fillRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT),
            t.addChild(t.hitGra),
            (t.flashCover = scene.add.graphics()),
            t.flashCover.fillStyle(16777215, 1),
            t.flashCover.fillRect(
                0,
                0,
                constants.GAME_WIDTH,
                constants.GAME_HEIGHT
            ),
            (t.flashCover.alpha = 0),
            t.addChild(t.flashCover);

        var textStyle = {
            fontSize: "16px",
            fontFamily: "sans-serif",
            color: "#ffffff",
        };

        return (
            (t.actionText = scene.add.text(0, 0, "", textStyle)),
            (t.actionText.x = constants.GAME_WIDTH - t.actionText.width),
            (t.actionText.y = constants.GAME_HEIGHT - t.actionText.height - 20),
            t.addChild(t.actionText),
            t
        );
    }

    castAdded() {
        this.tl = new TimelineMax({
            repeat: -1,
            yoyo: true,
        });

        this.tl
            .to(this.actionText, 0.4, {
                delay: 0.2,
                alpha: 0,
            })
            .to(this.actionText, 0.8, {
                alpha: 1,
            });

        this.on("pointerover", this.onOver.bind(this)),
            this.on("pointerout", this.onOut.bind(this)),
            this.on("pointerdown", this.onDown.bind(this)),
            this.on("pointerupoutside", this.onOut.bind(this)),
            this.on("pointerup", this.onUp.bind(this));
    }

    removedFromScene() {
        this.tl.kill(),
            this.off("pointerover", this.onOver.bind(this)),
            this.off("pointerout", this.onOut.bind(this)),
            this.off("pointerdown", this.onDown.bind(this)),
            this.off("pointerupoutside", this.onOut.bind(this)),
            this.off("pointerup", this.onUp.bind(this));
    }

    nextPart() {
        this.actionText.text = "Next▼";
        this.actionText.x = constants.GAME_WIDTH - this.actionText.width - 10;
    }

    nextScene() {
        this.actionText.text = "LET'S GO! ▶︎";
        this.actionText.x = constants.GAME_WIDTH - this.actionText.width - 10;
    }

    onOver() { }

    onOut() { }

    onDown() { }

    onUp() { }
}

export default class AdvScene extends Scene {
    constructor() {
        super("adv-scene");

        this.senario = "ja" == constants.LANG ? ja : en;

        return this;
    }

    create() {
        AudioManager.bgmPlay("adventure_bgm", 24000, 792000),
            (this.bgSprite = this.add.sprite().setOrigin(0)),
            (this.bgSprite.visible = false);

        const textStyle = {
            fontFamily: "sans-serif",
            fontSize: "16px",
            color: "#FFFFFF",
            wordWrap: {
                width: 230,
                useAdvancedWrap: true,
            },
            padding: {
                x: 10,
                y: 10,
            },
        };

        (this.txtBg = this.add.graphics()),
            this.txtBg.lineStyle(2, 16777215, 1),
            this.txtBg.fillStyle(0),
            this.txtBg.fillRoundedRect(0, 0, constants.GAME_WIDTH - 16, 180, 6),
            (this.txtBg.x = 8),
            (this.txtBg.y = constants.GAME_MIDDLE + 7),
            (this.txt = this.add.text(15, constants.GAME_MIDDLE + 30, " ", textStyle)),
            (this.nameBg = this.add.graphics()),
            this.nameBg.lineStyle(2, 16777215, 1),
            this.nameBg.fillStyle(0),
            this.nameBg.fillRoundedRect(0, 0, 80, 24, 6),
            (this.nameBg.x = 16),
            (this.nameBg.y = constants.GAME_MIDDLE - 5),
            (this.nameTxt = this.add.text(0, 0, "G", textStyle)),
            (this.nameTxt.x = 50),
            (this.nameTxt.y = constants.GAME_MIDDLE - 4),
            (this.nextBtn = new NextButton(this)),
            (this.nextBtn.visible = false),
            this.addChild(this.nextBtn),
            (this.endingFlg = false),
            5 == properties.stageId
                ? (this.endingFlg = true)
                : 4 == properties.stageId
                    ? (AudioManager.play("voice_thankyou"),
                        properties.akebonoCnt >= 4 && 0 == properties.continueCnt
                            ? (this.endingFlg = false)
                            : (this.endingFlg = true))
                    : (this.endingFlg = false),
            (this.partNum = 0),
            (this.stageKey = "stage" + properties.stageId),
            (this.partText = this.senario[this.stageKey].part[this.partNum].text),
            (this.feedVektor = "d"),
            (this.partTextComp = false),
            (this.resourceBgKey =
                "advBg" +
                this.senario[this.stageKey].part[this.partNum].background +
                ".gif"),
            this.bgSprite.setTexture("game_ui", this.resourceBgKey),
            (this.bgSprite.visible = true),
            (this.cover = this.add.tileSprite(
                0,
                this.bgSprite.height,
                constants.STAGE_WIDTH,
                constants.STAGE_HEIGHT - this.bgSprite.height,
                "game_asset",
                "stagebgOver.gif"
            ));
    }

    update() {
        properties.frame = 59 == properties.frame ? 0 : properties.frame + 1;

        if (properties.frame % 2 == 0 && Boolean(0) == this.partTextComp) {
            var t = this.txt.text,
                o = t.length - 1;
            o <= this.partText.length - 1
                ? (this.txt.text = t + this.partText.charAt(o))
                : ((this.partTextComp = true),
                    this.partNum < this.senario[this.stageKey].part.length - 1
                        ? (this.nextBtn.nextPart(),
                            (this.nextBtn.visible = true),
                            this.nextBtn.on("pointerup", this.nextPart.bind(this)))
                        : (this.nextBtn.nextScene(),
                            (this.nextBtn.visible = true),
                            this.nextBtn.on("pointerup", this.nextScene.bind(this))));
        }
    }

    nextPart() {
        AudioManager.play("se_cursor_sub"),
            (this.txt.text = " "),
            (this.partTextComp = false),
            this.partNum++,
            (this.partText = this.senario[this.stageKey].part[this.partNum].text),
            (this.resourceBgKey =
                "advBg" +
                this.senario[this.stageKey].part[this.partNum].background +
                ".gif"),
            this.bgSprite.setTexture("game_ui", this.resourceBgKey),
            "advBgDone.gif" == this.resourceBgKey &&
            AudioManager.play("g_adbenture_voice0"),
            (this.nextBtn.visible = false),
            this.nextBtn.off("pointerup");
    }

    sceneRemoved() {
        AudioManager.play("se_correct"),
            AudioManager.stop("adventure_bgm"),
            super.sceneRemoved(),
            this.endingFlg
                ? this.scene.start("gameover-scene")
                : this.scene.start("game-scene");
    }
}