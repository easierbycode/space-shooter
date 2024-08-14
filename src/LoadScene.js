
import AudioManager from "./audio";
import constants from "./constants";
import properties from "./properties";

const files = [
    {
        type: "image",
        key: "loading_bg.png",
        url: "assets/img/loading/loading_bg.png",
    },
    {
        type: "image",
        key: "loading0.gif",
        url: "assets/img/loading/loading0.gif",
    },
    {
        type: "image",
        key: "loading1.gif",
        url: "assets/img/loading/loading1.gif",
    },
    {
        type: "image",
        key: "loading2.gif",
        url: "assets/img/loading/loading2.gif",
    },
];

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "load-scene",
            pack: { files },
        });
    }

    init() {
        var t = this;
        var o = ["loading0.gif", "loading1.gif", "loading2.gif"];
        return (
            (t.loadingG = new AnimatedSprite(this, o, undefined, true)),
            (t.loadingG.x = constants.GAME_CENTER - 64),
            (t.loadingG.y = constants.GAME_MIDDLE - 64),
            (t.loadingG.animationSpeed = 0.15),
            (t.loadingTexture = "loading_bg.png"),
            (t.loadingBg = this.add.image(0, 0, t.loadingTexture).setOrigin(0)),
            (t.loadingBg.alpha = 0.09),
            (t.loadingBgFlipCnt = 0),
            document.cookie.split(";").forEach(function (t) {
                var e = t.split("=");
                "afc2019_highScore" == e[0] && (constants.highScore = +e[1]);
            }),
            t
        );
    }

    preload() {
        this.load.atlas(
            "game_asset",
            "/assets/game_asset.png",
            "/assets/game_asset.json"
        );

        this.load.atlas(
            "game_ui",
            "/assets/game_ui.png",
            "/assets/game_ui.json"
        );

        let fileTypes = {
            jpg: "image",
            json: "json",
            mp3: "audio",
            png: "image",
        };

        let audioFiles = [];

        for (var n in constants.RESOURCE) {
            let fileType = constants.RESOURCE[n].match(/\w+$/)[0];

            if (fileTypes[fileType] === "audio") audioFiles.push(n);

            this.load[fileTypes[fileType]](n, constants.RESOURCE[n]);
        }

        this.load.on("complete", (loader, totalComplete, totalFailed) => {

            properties.resource.recipe = {
                data: loader.cacheManager.json.get("recipe")
            };

            audioFiles.forEach(n => AudioManager.resource[n] = this.sound.add(n));

            (AudioManager.resource["voice_titlecall"].volume = 0.7),
                (AudioManager.resource["se_decision"].volume = 0.75),
                (AudioManager.resource["se_correct"].volume = 0.9),
                (AudioManager.resource["se_cursor_sub"].volume = 0.9),
                (AudioManager.resource["se_cursor"].volume = 0.9),
                (AudioManager.resource["se_over"].volume = 0.9),
                (AudioManager.resource["adventure_bgm"].volume = 0.2),
                (AudioManager.resource["g_adbenture_voice0"].volume = 0.5),
                (AudioManager.resource["voice_thankyou"].volume = 0.7),
                (AudioManager.resource["se_explosion"].volume = 0.35),
                (AudioManager.resource["se_shoot"].volume = 0.3),
                (AudioManager.resource["se_shoot_b"].volume = 0.3),
                (AudioManager.resource["se_ca"].volume = 0.8),
                (AudioManager.resource["se_ca_explosion"].volume = 0.9),
                (AudioManager.resource["se_damage"].volume = 0.15),
                (AudioManager.resource["se_guard"].volume = 0.2),
                (AudioManager.resource["se_finish_akebono"].volume = 0.9),
                (AudioManager.resource["se_barrier_start"].volume = 0.9),
                (AudioManager.resource["se_barrier_end"].volume = 0.9),
                (AudioManager.resource["voice_round0"].volume = 0.7),
                (AudioManager.resource["voice_round1"].volume = 0.7),
                (AudioManager.resource["voice_round2"].volume = 0.7),
                (AudioManager.resource["voice_round3"].volume = 0.7),
                (AudioManager.resource["voice_fight"].volume = 0.7),
                (AudioManager.resource["voice_ko"].volume = 0.7),
                (AudioManager.resource["voice_another_fighter"].volume = 0.7),
                (AudioManager.resource["g_stage_voice_0"].volume = 0.55),
                (AudioManager.resource["g_stage_voice_1"].volume = 0.7),
                (AudioManager.resource["g_stage_voice_2"].volume = 0.45),
                (AudioManager.resource["g_stage_voice_3"].volume = 0.45),
                (AudioManager.resource["g_stage_voice_4"].volume = 0.55),
                (AudioManager.resource["g_damage_voice"].volume = 0.7),
                (AudioManager.resource["g_powerup_voice"].volume = 0.55),
                (AudioManager.resource["g_ca_voice"].volume = 0.7),
                (AudioManager.resource["boss_bison_bgm"].volume = 0.4),
                (AudioManager.resource["boss_bison_voice_add"].volume = 0.65),
                (AudioManager.resource["boss_bison_voice_ko"].volume = 0.9),
                (AudioManager.resource["boss_bison_voice_faint"].volume = 0.55),
                (AudioManager.resource["boss_bison_voice_faint_punch"].volume = 0.65),
                (AudioManager.resource["boss_bison_voice_punch"].volume = 0.65),
                (AudioManager.resource["boss_barlog_bgm"].volume = 0.4),
                (AudioManager.resource["boss_barlog_voice_add"].volume = 0.7),
                (AudioManager.resource["boss_barlog_voice_ko"].volume = 0.9),
                (AudioManager.resource["boss_barlog_voice_tama"].volume = 0.6),
                (AudioManager.resource["boss_barlog_voice_barcelona"].volume = 0.7),
                (AudioManager.resource["boss_sagat_bgm"].volume = 0.4),
                (AudioManager.resource["boss_sagat_voice_add"].volume = 0.9),
                (AudioManager.resource["boss_sagat_voice_ko"].volume = 0.9),
                (AudioManager.resource["boss_sagat_voice_tama0"].volume = 0.45),
                (AudioManager.resource["boss_sagat_voice_tama1"].volume = 0.65),
                (AudioManager.resource["boss_sagat_voice_kick"].volume = 0.65),
                (AudioManager.resource["boss_vega_bgm"].volume = 0.3),
                (AudioManager.resource["boss_vega_voice_add"].volume = 0.7),
                (AudioManager.resource["boss_vega_voice_ko"].volume = 0.9),
                (AudioManager.resource["boss_vega_voice_crusher"].volume = 0.7),
                (AudioManager.resource["boss_vega_voice_warp"].volume = 0.7),
                (AudioManager.resource["boss_vega_voice_tama"].volume = 0.7),
                (AudioManager.resource["boss_vega_voice_shoot"].volume = 0.7),
                (AudioManager.resource["boss_goki_bgm"].volume = 0.4),
                (AudioManager.resource["boss_goki_voice_add"].volume = 0.7),
                (AudioManager.resource["boss_goki_voice_ko"].volume = 0.9),
                (AudioManager.resource["boss_goki_voice_tama0"].volume = 0.7),
                (AudioManager.resource["boss_goki_voice_tama1"].volume = 0.7),
                (AudioManager.resource["boss_goki_voice_ashura"].volume = 0.7),
                (AudioManager.resource["boss_goki_voice_syungokusatu0"].volume = 0.7),
                (AudioManager.resource["boss_goki_voice_syungokusatu1"].volume = 0.7),
                (AudioManager.resource["boss_fang_bgm"].volume = 0.4),
                (AudioManager.resource["boss_fang_voice_add"].volume = 0.6),
                (AudioManager.resource["boss_fang_voice_ko"].volume = 0.9),
                (AudioManager.resource["boss_fang_voice_beam0"].volume = 0.6),
                (AudioManager.resource["boss_fang_voice_beam1"].volume = 0.6),
                (AudioManager.resource["boss_fang_voice_tama"].volume = 0.6),
                (AudioManager.resource["bgm_continue"].volume = 0.25),
                (AudioManager.resource["bgm_gameover"].volume = 0.3),
                (AudioManager.resource["voice_countdown0"].volume = 0.7),
                (AudioManager.resource["voice_countdown1"].volume = 0.7),
                (AudioManager.resource["voice_countdown2"].volume = 0.7),
                (AudioManager.resource["voice_countdown3"].volume = 0.7),
                (AudioManager.resource["voice_countdown4"].volume = 0.7),
                (AudioManager.resource["voice_countdown5"].volume = 0.7),
                (AudioManager.resource["voice_countdown6"].volume = 0.7),
                (AudioManager.resource["voice_countdown7"].volume = 0.7),
                (AudioManager.resource["voice_countdown8"].volume = 0.7),
                (AudioManager.resource["voice_countdown9"].volume = 0.7),
                (AudioManager.resource["voice_gameover"].volume = 0.7),
                (AudioManager.resource["g_continue_yes_voice0"].volume = 0.7),
                (AudioManager.resource["g_continue_yes_voice1"].volume = 0.7),
                (AudioManager.resource["g_continue_yes_voice2"].volume = 0.7),
                (AudioManager.resource["g_continue_no_voice0"].volume = 0.7),
                (AudioManager.resource["g_continue_no_voice1"].volume = 0.7),
                (AudioManager.resource["voice_congra"].volume = 0.7),
                document.addEventListener(
                    "visibilitychange",
                    function () {
                        "hidden" === document.visibilityState
                            ? window.game.sound.pauseAll()
                            : "visible" === document.visibilityState &&
                            window.game.sound.resumeAll();
                    },
                    !1
                );

            this.add.timeline([{
                tween: {
                    targets: [this.loadingG, this.loadingBg],
                    duration: 200,
                    alpha: 0,
                    onComplete: () => {
                        this.scene.start("title-scene");
                    }
                }
            }]).play();
        });
    }

    create() {
        this.events.on("shutdown", this.#sceneRemoved, this);
    }

    #sceneRemoved() {
        // Dn(Bn(e.prototype), "sceneRemoved", this).call(this),
        this.loadingG.destroy(!0), this.loadingBg.destroy(!0); //,
        // B.Scene = new mn,
        // B.Manager.game.stage.addChild(B.Scene),
        // F.dlog("LoadScene.sceneRemoved() End.")
    }
}

export class AnimatedSprite extends Phaser.GameObjects.Sprite {
    #frameRate = null;
    #repeat = null;

    constructor(
        scene,
        frameKeys,
        texture,
        addToScene,
        repeatNum
    ) {
        if (repeatNum === undefined) repeatNum = -1;
        if (frameKeys[0] == 'hit0.gif') repeatNum = 0;
        // DRJ::TODO - remove hack once fang bullet remove is implemented correctly
        if (frameKeys[0].includes('fang_tama')) repeatNum = 0;

        super(scene, 0, 0, frameKeys[0]);

        if (texture) this.setTexture(texture, frameKeys[0]);

        this.setOrigin(0);

        let frames = [
            ...frameKeys.map((k) => {
                return { key: k, frame: 0 };
            }),
        ];

        if (texture) {
            frames = [
                ...frameKeys.map((k) => {
                    return { key: texture, frame: k };
                }),
            ];
        }

        this.anims.create({
            key: "default",
            frames,
            frameRate: 9,
            repeat: repeatNum,
            hideOnComplete: true,
            showOnStart: true
        });

        if (addToScene) {
            scene.add.existing(this);
        }

        this.scene.time.addEvent({
            callback: () => { this.anims && this.play("default") },
        })
    }

    set loop(bool) {
        this.#repeat = bool;
    }

    set hitArea(rect) {
        this.scene.time.addEvent({
            callback: () => {
                this.body.setSize(rect.width, rect.height);
                this.body.setOffset(rect.x, rect.y);
            },
        });

        this.scene.physics.add.existing(this);
    }

    set animationSpeed(percentOfSixty) {
        this.#frameRate = 60 * percentOfSixty;
    }

    play(key = "default") {
        if (!this.anims) return;
        if (typeof key === "string") {
            if (this.#frameRate || this.#repeat !== null) {
                let animConfig = { key };
                if (this.#frameRate) animConfig.frameRate = this.#frameRate;
                if (this.#repeat !== null) animConfig.repeat = this.#repeat ? -1 : 0;

                super.play(animConfig);
            } else {
                super.play(key);
            }

            // DRJ::TODO - fix this (unreachable since key is set by default)
        } else {
            let animConfig = key;
            animConfig.key = "default";
            if (this.#frameRate) animConfig.frameRate = this.#frameRate;
            if (animConfig.repeat === undefined && this.#repeat !== null) {
                animConfig.repeat = this.#repeat ? -1 : 0;
            }
            super.play(animConfig);
        }
    }
}