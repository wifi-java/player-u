<template>
    <YouTube
        ref="youtube"
        :src="url"
        @ready="onReady"
        @stateChange="onStateChange"
    />
</template>

<script>
import YouTube from "vue3-youtube";

export default {
    name: "Player",
    components: {
        YouTube
    },
    data() {
        return {
            url: "",
            volume: 100,
            State: {
                UNSTARTED: -1,
                ENDED: 0,
                PLAYING: 1,
                PAUSED: 2,
                BUFFERING: 3,
                CUED: 5
            }
        };
    },
    computed: {
        isListEmpty() {
            return this.$store.getters["playList/list"].length === 0
        },
        currentIndex() {
            return this.$store.getters["playList/index"]
        }
    },
    methods: {
        // 유튜브 플레이어가 준비가 되면 호출된다
        onReady() {
            this.$refs.youtube.setVolume(this.volume);
        },
        // 플레이어 상태가 변할때마다 호출된다
        onStateChange(state) {
            switch (state.data) {
                case this.State.PLAYING:
                    // 재생중...
                    break
                case this.State.PAUSED:
                    // 일시중지...
                    break
                case this.State.ENDED:
                    // 재생 완료...
                    this.emitter.emit("next")
                    break
                case this.State.UNSTARTED:
                    // 잘못된 url 일때...
                    if (this.isListEmpty) {
                        alert('유튜브 동영상 주소를 추가해주세요.')
                        location.reload()
                    } else {
                        if (this.currentIndex === -1) {
                            this.emitter.emit("next")
                        }
                    }
                    break
            }
        },
        play() {
            this.$refs.youtube.playVideo();
        },
        pause() {
            this.$refs.youtube.pauseVideo();
        },
        changeMusic(url) {
            this.url = url;
            this.play();
        }
    }
};
</script>

<style scoped lang="scss">

</style>
