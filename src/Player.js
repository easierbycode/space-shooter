import { AnimatedSprite } from "./LoadScene";
import { Container, Sprite } from "./TitleScene";
import AudioManager from "./audio";
import constants from "./constants";
import properties from "./properties";

class EventedContainer extends Container {
  constructor(t) {
    super(window.gameScene);

    (this.id = t),
      this.on("addedtoscene", this.atCastAdded),
      this.on("removedfromscene", this.atCastRemoved);
  }

  atCastAdded(t) {
    this.castAdded(t);
  }

  atCastRemoved(t) {
    this.castRemoved(t);
  }

  castAdded() {}

  castRemoved() {}
}

class CharacterUnit extends EventedContainer {
  constructor(frameKeys, explosionTextures) {
    super();

    var i = this;
    if (
      ((i.shadowReverse = !0),
      (i.speed = 0),
      (i.hp = 1),
      (i.deadFlg = !1),
      (i.character = new AnimatedSprite(
        window.gameScene,
        frameKeys,
        "game_asset"
      )),
      (i.character.animationSpeed = 0.1),
      (i.unit = new Container(window.gameScene)),
      (i.unit.exclusive = true),
      (i.unit.interactive = !0),
      (i.unit.name = "unit"),
      (i.unit.hitArea = new Phaser.GameObjects.Rectangle(
        window.gameScene,
        0,
        0,
        i.character.width,
        i.character.height
      )),
      (i.shadowOffsetY = 0),
      (i.shadow = new AnimatedSprite(
        window.gameScene,
        frameKeys,
        "game_asset"
      )),
      (i.shadow.animationSpeed = 0.1),
      (i.shadow.tint = 0),
      (i.shadow.alpha = 0.5),
      void 0 !== explosionTextures)
    ) {
      i.explosion = new AnimatedSprite(
        window.gameScene,
        explosionTextures,
        "game_asset",
        false,
        0
      );
      var n = (i.unit.height + 50) / i.explosion.height;
      n >= 1 && (n = 1),
        i.explosion.setScale(n + 0.2),
        (i.explosion.animationSpeed = 0.4),
        (i.explosion.loop = !1);
    }
    return (
      i.addChild(i.unit),
      i.unit.addChild(i.shadow),
      i.unit.addChild(i.character),
      i
    );
  }

  static CUSTOM_EVENT_DEAD = "customEventdead";

  static CUSTOM_EVENT_DEAD_COMPLETE = "customEventdeadComplete";

  static CUSTOM_EVENT_TAMA_ADD = "customEventtamaadd";

  castAdded(t) {
    this.scene.time.addEvent({
      callback: () => {
        if (!this.character.active) return; // DRJ
        this.character.play(),
          this.shadow.play(),
          "true" == properties.hitAreaFlg &&
            ((this.hitbox = new Phaser.GameObjects.Graphics()),
            this.hitbox.lineStyle(1, 16773120),
            this.hitbox.drawRect(
              this.unit.hitArea.x,
              this.unit.hitArea.y,
              this.unit.hitArea.width,
              this.unit.hitArea.height
            ),
            this.unit.addChild(this.hitbox)),
          this.shadowReverse
            ? ((this.shadow.scaleY = -1),
              (this.shadow.y = 2 * this.shadow.height - this.shadowOffsetY))
            : (this.shadow.y = this.shadow.height - this.shadowOffsetY);
      },
    });
  }

  castRemoved(t) {
    this.character.destroy(),
      this.shadow.destroy(),
      this.unit.removeChild(this.shadow),
      this.unit.removeChild(this.character),
      this.removeChild(this.unit);
  }
}

export default class Player extends CharacterUnit {
  constructor(t) {
    super(t.texture, t.explosion);

    var o = this;

    if ("object" !== typeof t.texture[0]) {
      for (var n = 0; n < t.texture.length; n++) {
        (a = t.texture[n]), (t.texture[n] = a);
      }
      for (n = 0; n < t.shootNormal.texture.length; n++) {
        (a = t.shootNormal.texture[n]), (t.shootNormal.texture[n] = a);
      }
      for (n = 0; n < t.shootBig.texture.length; n++) {
        (a = t.shootBig.texture[n]), (t.shootBig.texture[n] = a);
      }
      for (n = 0; n < t.barrier.texture.length; n++) {
        var a;
        (a = t.barrier.texture[n]), (t.barrier.texture[n] = a);
      }
      (t.barrierEffectTexture = "barrierEffect.gif"),
        (t.hit = ["hit0.gif", "hit1.gif", "hit2.gif", "hit3.gif", "hit4.gif"]),
        (t.guard = [
          "guard0.gif",
          "guard1.gif",
          "guard2.gif",
          "guard3.gif",
          "guard4.gif",
        ]);
    }

    return (
      (o.unit.name = t.name),
      (o.hp = t.hp),
      (o.maxHp = t.maxHp),
      (o.shootNormalData = t.shootNormal),
      (o.shootNormalData.texture = t.shootNormal.texture),
      (o.shootNormalData.explosion = t.hit),
      (o.shootNormalData.guard = t.guard),
      (o.shootBigData = t.shootBig),
      (o.shootBigData.texture = t.shootBig.texture),
      (o.shootBigData.explosion = t.hit),
      (o.shootBigData.guard = t.guard),
      (o.shoot3wayData = t.shoot3way),
      (o.shoot3wayData.texture = t.shootNormal.texture),
      (o.shoot3wayData.explosion = t.hit),
      (o.shoot3wayData.guard = t.guard),
      (o.barrier = new AnimatedSprite(
        window.gameScene,
        t.barrier.texture,
        "game_asset"
      )),
      (o.barrier.animationSpeed = 0.15),
      (o.barrier.hitArea = new Phaser.GameObjects.Rectangle(
        window.gameScene,
        2,
        2,
        o.barrier.width,
        o.barrier.height
      )),
      (o.barrier.interactive = !1),
      (o.barrier.buttonMode = !1),
      (o.barrier.visible = !1),
      (o.barrierEffect = new Sprite(
        window.gameScene,
        0,
        0,
        "game_asset",
        t.barrierEffectTexture
      )),
      (o.barrierEffect.visible = !1),
      (o.barrierEffect.interactive = !1),
      (o.barrierEffect.buttonMode = !1),
      o.barrierEffect.setOrigin(0.5),
      (o.shootOn = 0),
      (o.bulletList = []),
      (o.bulletFrameCnt = 0),
      (o.bulletIdCnt = 0),
      (o.shootSpeed = 0),
      (o.shootInterval = 0),
      (o.shootData = {}),
      o.shootMode,
      (o._percent = 0),
      (o.unitX = 0),
      (o.unitY = 0),
      (o.unit.hitArea = new Phaser.GameObjects.Rectangle(
        window.gameScene,

        // since origin does not exist on Container need to manually
        // add halfWidth and halfHeight to offset
        // 7,
        // 20,
        7 + o.character.width / 2,
        20 + o.character.height / 2,

        // DRJ::TODO - fix this nastiness
        // o.unit.body.width/height incorrect till next tick
        // o.unit.width/height unset till next tick
        // o.unit.width - 14,
        // o.unit.height - 40
        o.character.width - 14,
        o.character.height - 40
      )),
      (o.character.animationSpeed = 0.35),
      (o.shadow.animationSpeed = 0.35),
      (o.shadowOffsetY = 5),
      (o.damageAnimationFlg = !1),
      (o.barrierFlg = !1),
      (o.screenDragFlg = !1),
      (o.beforeX = 0),
      (o.beforeY = 0),
      (o.keyDownFlg = !1),
      (o.keyDownCode = ""),
      (o.dragAreaRect = new Phaser.GameObjects.Graphics(window.gameScene)),
      o.dragAreaRect.fill(16777215, 0),
      o.dragAreaRect.fillRect(
        0,
        0,
        constants.GAME_WIDTH,
        constants.GAME_HEIGHT
      ),
      o.dragAreaRect.setInteractive(),
      o
    );
  }

  static SHOOT_NAME_NORMAL = "normal";

  static SHOOT_NAME_BIG = "big";

  static SHOOT_NAME_3WAY = "3way";

  static SHOOT_SPEED_NORMAL = "speed_normal";

  static SHOOT_SPEED_HIGH = "speed_high";

  static BARRIER = "barrier";

  onScreenDragStart(pointer, localX, localY, event) {
    (this.unitX = localX), (this.screenDragFlg = !0);
  }

  onScreenDragMove(pointer, localX, localY, event) {
    this.screenDragFlg &&
      ((this.unitX = localX),
      this.unitX <= this.unit.hitArea.width / 2 &&
        (this.unitX = this.unit.hitArea.width / 2),
      this.unitX >= constants.GAME_WIDTH - this.unit.hitArea.width / 2 &&
        (this.unitX = constants.GAME_WIDTH - this.unit.hitArea.width / 2));
  }

  onScreenDragEnd(t) {
    this.screenDragFlg = !1;
  }

  onKeyDown(t) {
    (this.keyDownFlg = !0), (this.keyDownCode = t.keyCode), t.preventDefault();
  }

  onKeyUp(t) {
    (this.keyDownFlg = !1), t.preventDefault();
  }

  update() {
    if (this.keyDownFlg) {
      switch (this.keyDownCode) {
        case 37:
          this.unitX -= 6;
          break;
        case 39:
          this.unitX += 6;
      }
      this.unitX <= this.unit.hitArea.width / 2 &&
        (this.unitX = this.unit.hitArea.width / 2),
        this.unitX >= constants.GAME_WIDTH - this.unit.hitArea.width / 2 &&
          (this.unitX = constants.GAME_WIDTH - this.unit.hitArea.width / 2);
    }
    (this.unit.x += 0.09 * (this.unitX - (this.unit.x + this.unit.width / 2))),
      (this.unit.y += 0.09 * (this.unitY - this.unit.y)),
      (this.barrier.x =
        this.unit.x + this.unit.width / 2 - this.barrier.width / 2),
      (this.barrier.y = this.unit.y - 15),
      this.bulletFrameCnt++,
      this.shootOn &&
        this.bulletFrameCnt % (this.shootInterval - this.shootSpeed) == 0 &&
        this.shoot();
    for (var t = 0; t < this.bulletList.length; t++) {
      var e = this.bulletList[t];
      (e.unit.x += 3.5 * Math.cos(e.unit.rotation)),
        (e.unit.y += 3.5 * Math.sin(e.unit.rotation)),
        (e.unit.y <= 40 ||
          e.unit.x <= -e.unit.width ||
          e.unit.x >= constants.GAME_WIDTH) &&
          (this.bulletRemove(e), this.bulletRemoveComplete(e));
    }
  }

  shoot() {
    switch (this.shootMode) {
      case Player.SHOOT_NAME_NORMAL:
        ((o = new Bullet(this.shootNormalData)).unit.rotation =
          (270 * Math.PI) / 180),
          ((o.unit.hitArea = new Phaser.GameObjects.Rectangle(
            window.gameScene,
            0,
            ((o.unit.body.width + o.unit.input.hitArea.displayOriginY) * -1),
            o.unit.body.height,
            o.unit.body.width
          ))),
          (o.unit.x = this.unit.x + 5 * Math.sin(o.unit.rotation) + 14),
          (o.unit.y = this.unit.y + 5 * Math.sin(o.unit.rotation) + 11),
          (o.name = Player.SHOOT_NAME_NORMAL),
          (o.id = this.bulletIdCnt++),
          (o.shadowReverse = !1),
          (o.shadowOffsetY = 0),
          o.on(
            CharacterUnit.CUSTOM_EVENT_DEAD,
            this.bulletRemove.bind(this, o)
          ),
          o.on(
            CharacterUnit.CUSTOM_EVENT_DEAD_COMPLETE,
            this.bulletRemoveComplete.bind(this, o)
          ),
          this.addChild(o),
          this.bulletList.push(o),
          AudioManager.stop("se_shoot"),
          AudioManager.play("se_shoot");
        break;
      case Player.SHOOT_NAME_BIG:
        ((o = new Bullet(this.shootBigData)).unit.rotation =
          (270 * Math.PI) / 180),
          (o.unit.x = this.unit.x + 5 * Math.sin(o.unit.rotation) + 10),
          (o.unit.y = this.unit.y + 5 * Math.sin(o.unit.rotation) + 22),
          (o.name = Player.SHOOT_NAME_BIG),
          (o.id = this.bulletIdCnt++),
          (o.shadowReverse = !1),
          (o.shadowOffsetY = 0),
          o.on(
            CharacterUnit.CUSTOM_EVENT_DEAD,
            this.bulletRemove.bind(this, o)
          ),
          o.on(
            CharacterUnit.CUSTOM_EVENT_DEAD_COMPLETE,
            this.bulletRemoveComplete.bind(this, o)
          ),
          this.addChild(o),
          this.bulletList.push(o),
          AudioManager.stop("se_shoot_b"),
          AudioManager.play("se_shoot_b");
        break;
      case Player.SHOOT_NAME_3WAY:
        for (var t = 0; t < 3; t++) {
          var o = new Bullet(this.shoot3wayData);
          0 == t
            ? ((o.unit.rotation = (280 * Math.PI) / 180),
              (o.unit.x = this.unit.x + 5 * Math.cos(o.unit.rotation) + 14),
              (o.unit.y = this.unit.y + 5 * Math.sin(o.unit.rotation) + 11))
            : 1 == t
            ? ((o.unit.rotation = (270 * Math.PI) / 180),
              (o.unit.x = this.unit.x + 5 * Math.cos(o.unit.rotation) + 10),
              (o.unit.y = this.unit.y + 5 * Math.sin(o.unit.rotation) + 11))
            : 2 == t &&
              ((o.unit.rotation = (260 * Math.PI) / 180),
              (o.unit.x = this.unit.x + 5 * Math.cos(o.unit.rotation) + 6),
              (o.unit.y = this.unit.y + 5 * Math.sin(o.unit.rotation) + 11)),
            (o.id = this.bulletIdCnt++),
            (o.shadowReverse = !1),
            (o.shadowOffsetY = 0),
            o.on(
              CharacterUnit.CUSTOM_EVENT_DEAD,
              this.bulletRemove.bind(this, o)
            ),
            o.on(
              CharacterUnit.CUSTOM_EVENT_DEAD_COMPLETE,
              this.bulletRemoveComplete.bind(this, o)
            ),
            this.addChild(o),
            this.bulletList.push(o);
        }
        AudioManager.stop("se_shoot"), AudioManager.play("se_shoot");
    }
  }

  bulletRemove(t) {
    for (var e = 0; e < this.bulletList.length; e++)
      t.id == this.bulletList[e].id && this.bulletList.splice(e, 1);
  }

  bulletRemoveComplete(t) {
    t.off(CharacterUnit.CUSTOM_EVENT_DEAD, this.bulletRemove.bind(this, t)),
      t.off(
        CharacterUnit.CUSTOM_EVENT_DEAD_COMPLETE,
        this.bulletRemoveComplete.bind(this, t)
      ),
      t.explosion.destroy();
    this.removeChild(t);
    this.scene.sys.displayList.remove(t); // DRJ
  }

  shootModeChange(t) {
    switch (((this.shootMode = t), this.shootMode)) {
      case Player.SHOOT_NAME_NORMAL:
        (this.shootData = this.shootNormalData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_BIG:
        (this.shootData = this.shootBigData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_3WAY:
        (this.shootData = this.shoot3wayData),
          (this.shootInterval = this.shootData.interval);
    }
    AudioManager.play("g_powerup_voice");
  }

  shootSpeedChange(t) {
    switch (t) {
      case Player.SHOOT_SPEED_NORMAL:
        this.shootSpeed = 0;
        break;
      case Player.SHOOT_SPEED_HIGH:
        this.shootSpeed = 15;
    }
    AudioManager.play("g_powerup_voice");
  }

  setUp(t, o, i) {
    let controllerIds = window.controllers
      ? Object.keys(window.controllers)
      : [];
    if (controllerIds.length) {
      this.gamepad = window.controllers[controllerIds[0]];
      this.gamepadVibration = this.gamepad?.vibrationActuator;
    }

    switch (
      ((this.hp = t),
      (this._percent = this.hp / this.maxHp),
      (this.shootMode = o),
      this.shootMode)
    ) {
      case Player.SHOOT_NAME_NORMAL:
        (this.shootData = this.shootNormalData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_BIG:
        (this.shootData = this.shootBigData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_3WAY:
        (this.shootData = this.shoot3wayData),
          (this.shootInterval = this.shootData.interval);
    }
    switch (i) {
      case Player.SHOOT_SPEED_NORMAL:
        this.shootSpeed = 0;
        break;
      case Player.SHOOT_SPEED_HIGH:
        this.shootSpeed = 15;
    }
  }

  shootStop() {
    this.shootOn = 0;
  }

  shootStart() {
    this.shootOn = 1;
  }

  barrierStart() {
    AudioManager.play("se_barrier_start"),
      (this.barrierFlg = !0),
      (this.barrier.alpha = 0),
      (this.barrier.visible = !0),
      (this.barrierEffect.x = this.unit.x + this.unit.width / 2),
      (this.barrierEffect.y = this.unit.y - 15 + this.barrier.height / 2),
      (this.barrierEffect.alpha = 1),
      (this.barrierEffect.visible = !0),
      this.barrierEffect.setScale(0.5),
      TweenMax.to(this.barrierEffect, 0.4, {
        scaleX: 1,
        scaleY: 1,
        ease: Quint.easeOut,
      }),
      TweenMax.to(this.barrierEffect, 0.5, {
        alpha: 0,
      }),
      this.tl && (this.tl.kill(), (this.tl = null)),
      (this.tl = new TimelineMax({
        onComplete: function () {
          (this.barrier.visible = !1),
            (this.barrierFlg = !1),
            (this.barrierEffect.visible = !1),
            AudioManager.play("se_barrier_end");
        },
        onCompleteScope: this,
      })),
      this.tl
        .to(
          this.barrier,
          0.3,
          {
            alpha: 1,
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=4.0"
        )
        .to(
          this.barrier,
          1,
          {
            alpha: 1,
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=1"
        )
        .to(
          this.barrier,
          1,
          {
            alpha: 1,
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.5"
        )
        .to(
          this.barrier,
          0.5,
          {
            alpha: 1,
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.5"
        )
        .to(
          this.barrier,
          0.5,
          {
            alpha: 1,
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 1;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 1;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 1;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 1;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.1"
        );
  }

  barrierHitEffect() {
    if (this.gamepadVibration) {
      let weakMagnitude = this.unit.x / constants.GAME_WIDTH;
      let strongMagnitude = 1 - weakMagnitude;

      this.gamepadVibration.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 40,
        weakMagnitude,
        strongMagnitude,
      });
    } else {
      navigator.vibrate(30);
    }
    (this.barrier.tint = 16711680),
      TweenMax.to(this.barrier, 0.2, {
        tint: 16777215,
      }),
      AudioManager.play("se_guard");
  }

  caFire() {}

  onDamage(t) {
    if (this.barrierFlg);
    else if (!0 !== this.damageAnimationFlg) {
      let weakMagnitude = this.unit.x / constants.GAME_WIDTH;
      let strongMagnitude = 1 - weakMagnitude;
      if (
        ((this.hp -= t),
        this.hp <= 0 && (this.hp = 0),
        (this._percent = this.hp / this.maxHp),
        this.hp <= 0)
      )
        if (this.gamepadVibration) {
          this.gamepadVibration.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 777,
            weakMagnitude,
            strongMagnitude,
          });

          this.dead();
        } else {
          navigator.vibrate?.(777), this.dead();
        }
      else {
        if (this.gamepadVibration) {
          this.gamepadVibration.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 150,
            weakMagnitude,
            strongMagnitude,
          });
        } else {
          navigator.vibrate?.(150);
        }

        var tl = this.scene.add
          .timeline([
            {
              at: 0,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0,
                tint: 16711680,
              },
            },
            {
              at: 0,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0,
                y: this.unit.y + 2,
                alpha: 0.2,
              },
            },
            {
              at: 0.15 * 1000,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0,
                tint: Phaser.Display.Color.IntegerToColor(16777215),
              },
            },
            {
              at: 0.15 * 1000,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0,
                y: this.unit.y - 2,
                alpha: 1,
              },
            },
            {
              at: 0.3 * 1000,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0.05,
                tint: 16711680,
              },
            },
            {
              at: 0.3 * 1000,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0.05,
                y: this.unit.y + 2,
                alpha: 0.2,
              },
            },
            {
              at: 0.5 * 1000,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0,
                tint: Phaser.Display.Color.IntegerToColor(16777215),
              },
            },
            {
              at: 0.5 * 1000,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0,
                y: this.unit.y - 2,
                alpha: 1,
              },
            },
            {
              at: 0.65 * 1000,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0.05,
                tint: 16711680,
              },
            },
            {
              at: 0.65 * 1000,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0.05,
                y: this.unit.y + 2,
                alpha: 0.2,
              },
            },
            {
              at: 0.85 * 1000,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0,
                tint: Phaser.Display.Color.IntegerToColor(16777215),
              },
            },
            {
              at: 0.85 * 1000,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0,
                y: this.unit.y + 0,
                alpha: 1,
              },
            },
            {
              at: 1 * 1000,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0.05,
                tint: 16711680,
              },
            },
            {
              at: 1 * 1000,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0.05,
                y: this.unit.y + 2,
                alpha: 0.2,
              },
            },
            {
              at: 1.2 * 1000,
              tween: {
                targets: this,
                duration: 0.15,
                delay: 0,
                tint: Phaser.Display.Color.IntegerToColor(16777215),
              },
            },
            {
              at: 1.2 * 1000,
              tween: {
                targets: this.unit,
                duration: 0.15,
                delay: 0,
                y: this.unit.y + 0,
                alpha: 1,
              },
            },
          ])
          .on("complete", () => {
            this.damageAnimationFlg = !1;
          })
          .play();

        AudioManager.play("g_damage_voice"), AudioManager.play("se_damage");
      }
      this.damageAnimationFlg = !0;
    }
  }

  dead() {
    this.emit(CharacterUnit.CUSTOM_EVENT_DEAD),
      this.shootStop(),
      this.explosion.on("animationcomplete", this.explosionComplete.bind(this)),
      (this.explosion.x =
        this.unit.x + this.unit.width / 2 - this.explosion.displayWidth / 2),
      (this.explosion.y =
        this.unit.y + this.unit.height / 2 - this.explosion.displayHeight / 2),
      this.addChild(this.explosion),
      this.explosion.play(),
      this.removeChild(this.unit),
      this.removeChild(this.shadow);
    for (var t = 0; t < this.bulletList.length; t++) {
      var e = this.bulletList[t];
      // DRJ - is bulletList item child of Player?
      this.removeChild(e);
    }
    AudioManager.play("se_explosion"),
      AudioManager.play("g_continue_no_voice0");
  }

  explosionComplete() {
    this.emit(CharacterUnit.CUSTOM_EVENT_DEAD_COMPLETE),
      this.removeChild(this.explosion);
  }

  addedToScene(gameObject, scene) {
    // Reflect.get(
    //     Object.getPrototypeOf(e.prototype),
    //     "castAdded",
    //     this
    // ).call(this),
    super.castAdded();
    scene.time.addEvent({
      callback: () => {
        gameObject.addChild(gameObject.barrier),
          gameObject.addChild(gameObject.barrierEffect),
          gameObject.addChild(gameObject.dragAreaRect),
          gameObject.dragAreaRect.on(
            "pointerdown",
            gameObject.onScreenDragStart.bind(this)
          ),
          gameObject.dragAreaRect.on(
            "pointerup",
            gameObject.onScreenDragEnd.bind(this)
          ),
          gameObject.dragAreaRect.on(
            "pointerupoutside",
            gameObject.onScreenDragEnd.bind(this)
          ),
          gameObject.dragAreaRect.on(
            "pointermove",
            gameObject.onScreenDragMove.bind(this)
          );
      },
    }),
      (gameObject.keyDownListener = gameObject.onKeyDown.bind(this)),
      (gameObject.keyUpListener = gameObject.onKeyUp.bind(this)),
      document.addEventListener("keydown", gameObject.keyDownListener),
      document.addEventListener("keyup", gameObject.keyUpListener),
      (gameObject.damageAnimationFlg = !1);
  }

  removedFromScene(gameObject, scene) {
    console.log("[M] removedFromScene", gameObject);
    document.removeEventListener("keydown", this.keyDownListener),
      document.removeEventListener("keyup", this.keyUpListener),
      (this.keyDownListener = null),
      (this.keyUpListener = null);
  }

  get percent() {
    return this._percent;
  }

  set percent(t) {
    this._percent = t;
  }
}

class Bullet extends CharacterUnit {
  constructor(t) {
    super(t.texture, t.explosion),
      (this.name = t.name),
      (this.unit.name = t.name),
      (this.damage = t.damage),
      (this.speed = t.speed),
      (this.hp = t.hp),
      (this.score = t.score),
      (this.cagage = t.cagage),
      (this.guardTexture = t.guard),
      (this.deadFlg = !1),
      (this.shadow.visible = !1),
      (this.unit.hitArea = new Phaser.GameObjects.Rectangle(
        window.gameScene,
        0,
        0,

        // DRJ - should this implementation exist elsewhere?
        // this.unit.width,
        // this.unit.height
        this.character.width,
        this.character.height
      ));
  }

  update() {
    this.rotX
      ? ((this.unit.x += this.rotX * this.speed),
        (this.unit.y += this.rotY * this.speed))
      : "meka" == this.name
      ? (this.cont++,
        this.cont >= this.start &&
          (this.targetX || (this.targetX = this.player.x),
          (this.unit.x += 0.009 * (this.targetX - this.unit.x)),
          (this.unit.y += Math.cos(this.cont / 5) + 2.5 * this.speed)))
      : (this.unit.y += this.speed);
  }

  onDamage(t, e) {
    this.deadFlg ||
      ((this.hp -= t),
      this.hp <= 0
        ? (this.dead.bind(this)(e), (this.deadFlg = !0))
        : (TweenMax.to(this.character, 0.1, {
            tint: 16711680,
          }),
          TweenMax.to(this.character, 0.1, {
            delay: 0.1,
            tint: 16777215,
          }))),
      "infinity" == e
        ? (AudioManager.stop("se_guard"), AudioManager.play("se_guard"))
        : this.name == Player.SHOOT_NAME_NORMAL ||
          this.name == Player.SHOOT_NAME_3WAY
        ? (AudioManager.stop("se_damage"), AudioManager.play("se_damage"))
        : this.name == Player.SHOOT_NAME_BIG &&
          (AudioManager.stop("se_damage"), AudioManager.play("se_damage"));
  }

  dead(t) {
    this.emit(CharacterUnit.CUSTOM_EVENT_DEAD),
      this.unit.removeChild(this.character),
      this.unit.removeChild(this.shadow),
      this.removeChild(this.unit),
      void 0 !== this.explosion &&
        (this.explosion.on(
          "animationcomplete",
          this.explosionComplete.bind(this)
        ),
        (this.explosion.x =
          this.unit.x +
          this.character.width / 2 -
          this.explosion.displayWidth / 2),
        (this.explosion.y =
          this.unit.y +
          this.character.height / 2 -
          this.explosion.displayHeight / 2 -
          10),
        this.addChild(this.explosion),
        this.explosion.play());
  }

  explosionComplete() {
    this.removeChild(this.explosion),
      this.explosion.destroy(),
      this.emit(CharacterUnit.CUSTOM_EVENT_DEAD_COMPLETE);
  }

  // DRJ - required for shadow
  addedToScene(gameObject, scene) {
    super.castAdded(gameObject);
  }
}
