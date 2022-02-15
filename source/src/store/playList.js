import * as api from "./remote/api"

export default {
    namespaced: true,
    state: {
        list: [],
        index: -1,
        loop: false
    },
    mutations: {
        add(state, data) {
            state.list.push(data)
            localStorage.setItem("PLAY_LIST", JSON.stringify(state.list))
        },
        remove(state, index) {
            state.list.splice(index, 1)
            localStorage.setItem("PLAY_LIST", JSON.stringify(state.list))
        },
        updateList(state, list) {
            state.list = list
            localStorage.setItem("PLAY_LIST", JSON.stringify(state.list))

            const data = state.list.find(item => item.playing === true)

            if (data) {
                const index = state.list.indexOf(data)
                state.index = index

                state.list.forEach(function (element, index) {
                    element.playing = false

                    if (state.index === index) {
                        element.playing = true
                    }
                });

            }
        },
        updateIndex(state, index) {
            state.index = index
            state.list.forEach(function (element, index) {
                element.playing = false

                if (state.index === index) {
                    element.playing = true
                }
            })
        },
        updateLoop(state, loop) {
            state.loop = loop
        },
    },
    actions: {
        async add(context, url) {
            try {
                const response = await api.youtubeInfo(url)

                if (response.data) {
                    const data = {
                        title: response.data.title,
                        thumbnail: response.data.thumbnail_url,
                        playing: false,
                        url: url
                    }

                    context.commit('add', data)
                }
                console.log(response)
            } catch (error) {
                console.error(error)
                return Promise.reject(error)
            }

        },
        async remove(context, index) {
            context.commit('remove', index)
            if (context.state.index > index) {
                context.commit('updateIndex', context.state.index - 1)
            }
        },
        async updateIndex(context, index) {
            context.commit('updateIndex', index)
        },
        async updateList(context, data) {
            context.commit('updateList', data)
        },
        async updateLoop(context, loop) {
            context.commit('updateLoop', loop)
        },
    },
    getters: {
        list: (state) => {
            if (localStorage.getItem("PLAY_LIST")) {
                state.list = JSON.parse(localStorage.getItem("PLAY_LIST"))
            }

            return state.list
        },
        index: (state) => {
            return state.index
        },
        loop: (state) => {
            return state.loop
        },
    }
};
