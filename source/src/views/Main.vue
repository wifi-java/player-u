<template>
    <div class="layout">
        <player ref="player" v-show="true"/>
        <list @changeMusic="changeMusic"/>
    </div>
</template>

<script>
import Player from "../components/Player"
import List from "../components/List"

export default {
    name: "Main",
    components: {
        Player,
        List
    },
    mounted() {
    },
    methods: {
        play() {
            this.$refs.player.play()
        },
        changeMusic(url) {
            this.$refs.player.changeMusic(url)
        },
        pause() {
            this.$refs.player.pause()
        }
    }
};
</script>


<style scoped lang="scss">
.layout {
    position: absolute; left: 50%; transform: translateX(-50%);
}
</style>
