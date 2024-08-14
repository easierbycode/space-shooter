
export default {
    resource: {
        // currently playing bgm
        bgm: null,
    },

    play: function (key) {
        if (!this.resource[key].isPlaying) {
            this.resource[key].play();
        }
    },

    stop: function (key) {
        if (this.resource[key].isPlaying) {
            this.resource[key].stop();
        }
    },

    bgmPlay: function (key, e, o) {
        if (this.resource.bgm) this.stop(this.resource.bgm);

        if (!this.resource[key].isPlaying) {
            this.resource.bgm = key;

            const soundConfig = {
                loop: true,
            };

            this.resource[key].addMarker({
                name: "default",
                start: e / 48e3,
                duration: o / 48e3 - e / 48e3,
                config: soundConfig,
            });

            this.resource[key].play("default");
        }
    },
};  