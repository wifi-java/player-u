<template>
    <div>
        <button @click.prevent="add">추가</button>
        <button @click.prevent="loop">{{ isLoop ? '반복 O' : '반복 X' }}</button>
        <div class="scroll">
            <ul>
                <draggable v-model="list"
                           item-key="index">
                    <template #item="{element, index}">
                        <li :class="{ playing: currentIndex === index }"
                            @dblclick.prevent="changeMusic(index, element.url)">

                            <img class="thumbnail" :src="element.thumbnail"/>
                            <span class="text">{{ element.title }}</span>
                            <button @click.prevent="remove(index)">삭제</button>
                        </li>
                    </template>
                </draggable>
            </ul>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
    name: "List",
    components: {
        draggable
    },
    computed: {
        list: {
            get() {
                return this.$store.getters["playList/list"]
            },
            set(data) {
                this.$store.dispatch("playList/updateList", data)
            }
        },
        currentIndex() {
            return this.$store.getters["playList/index"]
        },
        isLoop() {
            return this.$store.getters["playList/loop"]
        },
        isListEmpty() {
            return this.$store.getters["playList/list"].length === 0
        }
    },
    methods: {
        changeMusic(index, url) {
            this.$store.dispatch("playList/updateIndex", index)
            this.$emit("changeMusic", url);
        },
        add() {
            let url = prompt("추가")
            if (this.isYouTube(url)) {
                this.$store.dispatch("playList/add", url)
            }
        },
        remove(index) {
            if (confirm('삭제하시겠습니까?')) {
                this.$store.dispatch("playList/remove", index)
            }
        },
        // 다음에 재생할 목록 처리
        next() {
            if (!this.isListEmpty) {
                if (this.currentIndex < this.list.length - 1) {
                    const nextIndex = this.currentIndex + 1
                    const item = this.list[nextIndex]
                    this.$store.dispatch("playList/updateIndex", nextIndex)
                    this.$emit("changeMusic", item.url)
                } else {
                    if (this.isLoop) {
                        this.$store.dispatch("playList/updateIndex", -1)
                        this.next()
                    }
                }
            }
        },
        // 반복 여부
        loop() {
            this.$store.dispatch("playList/updateLoop", !this.isLoop)
        },
        // url에서 id를 가져온다
        isYouTube(url) {
            let id = ''
            if (url) {
                const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\\&\\?]*).*/
                const match = url.match(regExp);
                if (match) {
                    id = match[7]
                }
            }

            return id && id.length > 0
        }
    },
    created() {
        this.emitter.on("next", this.next);
    }
};
</script>

<style scoped lang="scss">
.thumbnail {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.text {
    font-size: 14px;
}

.playing {
    background-color:rgba(150, 100, 100, 0.3);
}

ul {
    padding-left: 0px;
}

li {
    display: flex;
    list-style: none;
    padding-left: 0px;
    align-items: center;
}

.scroll {
    width: 640px;
    height: 400px;
    overflow: auto;
}
</style>
