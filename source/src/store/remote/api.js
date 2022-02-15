import httpClient from "./httpClient"

export async function youtubeInfo(url) {
    const params = {
        url
    }

    return httpClient.get("https://noembed.com/embed", {params})
}
