
import AudioManager from "./audio";
import constants from "./constants";
import properties from "./properties";

export class Container extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children, isExclusive) {
        super(scene || window.gameScene, x, y, children);
        this.exclusive = isExclusive ? isExclusive : false;
    }

    set hitArea(rect) {
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);

        this.scene.physics.add.existing(this);

        this.body.setSize(rect.width, rect.height);
        this.body.setOffset(rect.x, rect.y);
    }

    get hitArea() {
        return {
            height: this.body?.height || 0,
            width: this.body?.width || 0,
        };
    }

    set tint(t) {
        this.character && this.character.setTint(t);
    }

    addChildAt(gameObject, index) {
        super.addAt(gameObject, index);
    }

    addChild(gameObject) {
        super.add(gameObject);
    }

    removeChild(gameObject) {
        super.remove(gameObject, true);
    }

    addedToScene(gameObject, scene) {
        this.castAdded(gameObject);
    }

    castAdded(t) { }

    addHandler(gameObject) {
        gameObject.once("destroy", this.onChildDestroyed, this);

        let isPlayerOrBulletExplosion = ["hit0.gif", "explosion00.gif"].includes(
            gameObject.frame?.name
        );

        if (this.exclusive || isPlayerOrBulletExplosion) {
            if (gameObject.parentContainer) {
                gameObject.parentContainer.remove(gameObject);
            }

            gameObject.parentContainer = this;

            if (!gameObject.scene) return;

            gameObject.removeFromDisplayList();

            gameObject.addedToScene();
        }
    }

    removeHandler(gameObject) {
        if (gameObject.displayList) gameObject.displayList.remove(gameObject);
    }
}

export class Graphics extends Phaser.GameObjects.Graphics {
    rect;

    constructor(scene) {
        super(scene);
    }

    fill(color, alpha) {
        super.fillStyle(color, alpha);
        return this;
    }

    fillRect(x, y, width, height) {
        this.rect = new Phaser.GameObjects.Rectangle(
            this.scene,
            x,
            y,
            width,
            height
        );
        super.fillRect(x, y, width, height);
        return this;
    }

    setInteractive(hitArea, callback, dropZone) {
        super.setInteractive(this.rect, Phaser.Geom.Rectangle.Contains, dropZone);
        return this;
    }
}

export class Sprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, addToScene) {
        super(scene, x, y, texture, frame);
        this.setOrigin(0);
        if (addToScene) scene.add.existing(this);
    }
}

export class Texture extends Phaser.Textures.Texture {
    constructor(manager, key, source) {
        super(manager, key, source);
    }

    get baseTexture() {
        return this.source[0];
    }
}

class StartBtn extends Container {
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y);

        const frameKey = "titleStartText.gif";
        const textureKey = "game_ui";
        const texture = scene.textures.get(textureKey);
        const frame = texture.frames[frameKey];
        const { cutX, cutY, height, width } = frame;

        var t = this;
        this.hitArea = new Phaser.GameObjects.Rectangle(
            scene,
            0,
            50,
            constants.GAME_WIDTH,
            constants.GAME_HEIGHT - 170
        );
        var o = new Texture(
            scene.textures,
            frameKey,
            texture.source[0].source
        );
        o.add("__BASE", 0, cutX, cutY, width, height);
        return (
            (o.baseTexture.scaleMode = Phaser.ScaleModes.NEAREST),
            (t.img = new Sprite(scene, 0, 0, o)),
            (t.img.x = constants.GAME_CENTER),
            (t.img.y = 330),
            t.img.setOrigin(0.5),
            (t.flashCover = new Graphics(scene)),
            t.flashCover.fillStyle(16777215, 1),
            t.flashCover.fillRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT - 120),
            (t.flashCover.alpha = 0),
            t
        );
    }

    onOver() {
        (this.img.scaleX = 1.05), (this.img.scaleY = 1.05);
    }

    onOut() {
        (this.img.scaleX = 1), (this.img.scaleY = 1);
    }

    onDown() { }

    onUp() {
        TweenMax.killTweensOf(this.flashCover),
            AudioManager.play("se_decision"),
            this.onFlash();
    }

    onFlash() {
        (this.flashCover.alpha = 0.3),
            TweenMax.to(this.flashCover, 1.5, {
                alpha: 0,
            });
    }

    addedToScene() {
        this.scene.time.addEvent({
            callback: () => {
                this.addChild(this.img),
                    this.addChild(this.flashCover),
                    (this.tl = new TimelineMax({
                        repeat: -1,
                        yoyo: !0,
                    })),
                    this.tl
                        .to(this.img, 0.3, {
                            delay: 0.1,
                            alpha: 0,
                        })
                        .to(this.img, 0.8, {
                            alpha: 1,
                        });
            },
        });
        this.on("pointerover", this.onOver.bind(this)),
            this.on("pointerout", this.onOut.bind(this)),
            this.on("pointerdown", this.onDown.bind(this)),
            this.scene.input.on("pointerupoutside", this.onOut.bind(this)),
            this.on("pointerup", this.onUp.bind(this));
    }
}

export class Scene extends Phaser.Scene {
    constructor(sceneKey) {
        super(sceneKey);
    }

    addChild(gameObj) {
        this.add.existing(gameObj);
    }

    removeChild(gameObj) {
        gameObj.disableInteractive();
        this.children.remove(gameObj);
    }

    addChildAt(gameObj, depth) {
        this.add.existing(gameObj);
        gameObj.setDepth(depth);
    }

    init() {
        this.events.once("shutdown", this.sceneRemoved, this);
    }

    nextScene() {
        this.scene.stop();
    }

    sceneRemoved() {
        let i = this.children.length - 1;
        while (i >= 0) {
            let child = this.children.list[i];
            if (child.type === "Image" || child.type === "Sprite") {
                child.destroy();
                this.tweens.killTweensOf(child);
            }
            i--;
        }
    }
}

class BigNum extends Container {
    constructor(t, scene) {
        super(scene, 0, 0, undefined, true);

        this.maxDigit = t;
        this.textureList = [];

        for (let i = 0; i <= 9; i++) {
            this.textureList[i] = "bigNum" + String(i) + ".gif";
        }

        this.numSpList = [];

        for (let n = 0; n < t; n++) {
            const a = new Sprite(scene, 0, 0, "game_ui", this.textureList[0]);
            a.x = (t - 1 - n) * (a.width - 1);
            this.addChild(a);
            this.numSpList[n] = a;
        }
    }

    setNum(t) {
        for (let e = String(t), o = 0; o < this.maxDigit; o++) {
            const i = e.substr(o, 1);
            i
                ? this.numSpList[e.length - 1 - o].setTexture(
                    "game_ui",
                    this.textureList[Number(i)]
                )
                : this.numSpList[o].setTexture("game_ui", this.textureList[0]);
        }
    }

    castAdded(t) { }

    castRemoved(t) { }
}

export default class TitleScene extends Scene {
    #belt;
    #bg;
    #bigNumTxt;
    #copyright;
    #fadeOutBlack;
    #logo;
    #scoreTitleTxt;
    #startBtn;
    #subTitle;
    #titleG;
    #titleGWrap;

    constructor() {
        super("title-scene");
    }

    create() {
        this.#bg = this.add
            .tileSprite(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT, "title_bg")
            .setOrigin(0);
        const scaleY = constants.GAME_HEIGHT / this.#bg.displayTexture.source[0].height;
        this.#bg.setTileScale(1, scaleY),
            (this.#titleGWrap = this.add.container()),
            (this.#titleG = this.add
                .sprite(0, 0, "game_ui", "titleG.gif")
                .setOrigin(0)),
            this.#titleGWrap.add(this.#titleG),
            (this.#titleGWrap.x = constants.GAME_WIDTH),
            (this.#titleGWrap.y = 100),
            (this.#logo = this.add.sprite(0, 0, "game_ui", "logo.gif")),
            (this.#logo.x = this.#logo.width / 2),
            this.#logo.setScale(2),
            // (this.#logo.y = -this.#logo.height / 2);
            (this.#logo.y = -this.#logo.displayHeight / 2);

        var t = "subTitle" + ("ja" == constants.LANG ? "" : "En") + ".gif";
        (this.#subTitle = this.add.sprite(0, 0, "game_ui", t)),
            (this.#subTitle.x = this.#subTitle.width / 2),
            this.#subTitle.setScale(3),
            (this.#subTitle.y = -this.#logo.height / 2),
            (this.#belt = this.add.graphics()),
            this.#belt.fillStyle(0, 1),
            this.#belt.fillRect(0, 0, constants.GAME_WIDTH, 120),
            (this.#belt.y = constants.GAME_HEIGHT - 120);

        (this.#startBtn = new StartBtn(this)),
            this.#startBtn.on("pointerup", this.#titleStart.bind(this)),
            // this.#startBtn.interactive = !1,
            (this.#startBtn.alpha = 0),
            this.addChild(this.#startBtn),
            (this.#copyright = this.add
                .text(0, 0, `© CodeMonkey.Games ${new Date().getFullYear()}`, {
                    fontFamily: "Press Start 2P",
                    fontSize: "34px",
                    strokeThickness: 0.15,
                })
                .setOrigin(0, 1)),
            (this.#copyright.x = 32),
            (this.#copyright.y =
                constants.GAME_HEIGHT - this.#copyright.height - 6),
            (this.#scoreTitleTxt = this.add
                .sprite(0, 0, "game_ui", "hiScoreTxt.gif")
                .setOrigin(0)),
            (this.#scoreTitleTxt.x = 32),
            (this.#scoreTitleTxt.y = this.#copyright.y - 66);

        // this.#bigNumTxt = new qt(10),
        (this.#bigNumTxt = new BigNum(10, this)),
            (this.#bigNumTxt.x =
                this.#scoreTitleTxt.x + this.#scoreTitleTxt.width + 3),
            (this.#bigNumTxt.y = this.#scoreTitleTxt.y - 2),
            this.#bigNumTxt.setNum(properties.highScore),
            this.addChild(this.#bigNumTxt),
            (this.#fadeOutBlack = this.add.graphics()),
            this.#fadeOutBlack.fillStyle(0),
            this.#fadeOutBlack.fillRect(0, 0, constants.GAME_WIDTH, constants.GAME_HEIGHT),
            (this.#fadeOutBlack.alpha = 0);

        var e = this.add.timeline([
            {
                at: 0,
                tween: {
                    targets: this.#titleGWrap,
                    x: constants.GAME_WIDTH / 2 - this.#titleG.width / 2 + 5,
                    y: 20,
                    duration: 2000,
                    ease: "Quint.easeOut"
                }
            },
            {
                at: 2580 - 800,
                tween: {
                    targets: this.#logo,
                    y: 75,
                    duration: 900,
                    ease: "Quint.easeIn"
                }
            },
            {
                at: 2580 - 900,
                tween: {
                    targets: this.#logo,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 900,
                    ease: "Quint.easeIn"
                }
            },
            {
                at: 2580 - 820,
                tween: {
                    targets: this.#subTitle,
                    y: 130,
                    duration: 900,
                    ease: "Quint.easeIn"
                }
            },
            {
                at: 2580 - 900,
                tween: {
                    targets: this.#subTitle,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 900,
                    ease: "Quint.easeIn"
                }
            },
            {
                at: 2580 - 500,
                sound: "voice_titlecall"
            },
            {
                from: 0,
                tween: {
                    targets: this.#startBtn,
                    alpha: 1,
                    duration: 100
                }
            },
            {
                from: 300,
                run: function () {
                    this.#startBtn.onFlash.bind(this.#startBtn)();
                },
                target: this
            }
        ]).play();
    }

    update() {
        this.#bg.tilePositionX += 0.5;
    }

    sceneRemoved() {
        // fn(dn(e.prototype), "sceneRemoved", this).call(this),
        super.sceneRemoved();

        (properties.caDamage = properties.resource.recipe.data.playerData.caDamage),
            (properties.playerMaxHp = properties.resource.recipe.data.playerData.maxHp),
            (properties.playerHp = properties.playerMaxHp),
            (properties.shootMode = properties.resource.recipe.data.playerData.defaultShootName),
            (properties.shootSpeed = properties.resource.recipe.data.playerData.defaultShootSpeed),
            (properties.combo = 0),
            (properties.maxCombo = 0),
            (properties.score = 0),
            (properties.cagage = 0),
            (properties.stageId = 0),
            (properties.continueCnt = 0),
            (properties.akebonoCnt = 0),
            (properties.shortFlg = !1);
        this.scene.start("adv-scene");
    }

    #titleStart() {
        this.#startBtn.off("pointerup", this.#titleStart.bind(this)),
            (this.#startBtn.interactive = !1),
            (this.#startBtn.buttonMode = !1),
            this.add.timeline({
                tween: {
                    targets: this.#fadeOutBlack,
                    alpha: 1,
                    duration: 1000,
                    onComplete: this.nextScene,
                    callbackScope: this
                }
            }).play();
    }
}