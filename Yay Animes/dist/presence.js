var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let presence = new Presence({
    clientId: "613510331066482699",
    mediaKeys: true
}), startedBrowsing = Math.floor(Date.now() / 1000), playback, video, currentTime, duration, timestamps, videoTitle, episode, paused, path = window.location.pathname, strings = presence.getStrings({
    "browsing": "presence.activity.browsing",
    "playing": "presence.playback.playing",
    "paused": "presence.playback.paused"
}), presenceData = {
    largeImageKey: "yay_lg",
    startTimestamp: startedBrowsing
};
presence.on("MediaKeys", (key) => {
    if (video) {
        if (key == "pause")
            paused ? video.play() : video.pause();
    }
});
presence.on("UpdateData", () => __awaiter(this, void 0, void 0, function* () {
    playback = document.querySelector('div#p1 > div > div > div > div > video') || document.querySelector('div#p2 > video') ? true : false;
    if (playback) {
        video = document.querySelector('div#p2 > video');
        video = video.currentTime != 0 ? video : document.querySelector('div#p1 > div > div > div > div > video');
    }
    if (playback && Math.floor(video.currentTime) != 0) {
        duration = Math.floor(document.querySelector('video').duration);
        videoTitle = document.querySelector('.color-change').textContent.split('–')[0].trim();
        episode = document.querySelector('.color-change').textContent.split('–')[1].trim();
        paused = video.paused;
        presenceData.smallImageKey = paused ? "pause" : "play";
        presenceData.smallImageText = paused ? (yield strings).paused : (yield strings).playing;
        if (!paused) {
            currentTime = Math.floor(document.querySelector('video').currentTime);
            timestamps = getTimestamps(currentTime, duration);
            presenceData.startTimestamp = timestamps[0];
            presenceData.endTimestamp = timestamps[1];
        }
        else {
            delete presenceData.startTimestamp;
            delete presenceData.endTimestamp;
        }
        presenceData.details = videoTitle;
        presenceData.state = episode;
    }
    else if (path.includes('lista-de-animes')) {
        presenceData.details = "Procurando um anime";
    }
    else if (document.querySelector("#content > div.contentBox > div > h1 > div > b > p > span")) {
        presenceData.details = "Olhando o anime " + document.querySelector("#content > div.contentBox > div > h1 > div > b > p > span").textContent;
    }
    else if (path.includes('pedidos')) {
        presenceData.details = "Pedindo um anime";
    }
    else if (path.includes('calendario')) {
        presenceData.details = "Vendo o calendário de animes";
    }
    else if (path.includes('noticia')) {
        presenceData.details = "Lendo notícias";
    }
    else if (path.includes('perfil')) {
        presenceData.details = "Vendo o perfil de " + document.querySelector('div.um-name > a').textContent;
    }
    else {
        presenceData.details = (yield strings).browsing;
    }
    presence.setActivity(presenceData, true);
}));
function getTimestamps(curr, dura) {
    let startTime = Math.floor(Date.now() / 1000), duration = startTime - curr + dura;
    return [startTime, duration];
}
