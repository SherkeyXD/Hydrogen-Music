import pinia from "@/store/pinia";
import { isLogin } from "@/utils/authority";
import { loadLastSong } from "./player.mjs";
import { scanMusic } from "./locaMusic.mjs";
import { getUserProfile, getLikelist } from "@/api/user.mjs";
import { useUserStore } from "@/store/userStore";
import { usePlayerStore } from "@/store/playerStore";
import { useLocalStore } from "@/store/localStore";
import { storeToRefs } from "pinia";
import { insertCustomFontStyle } from "./setFont.mjs";

const userStore = useUserStore(pinia);
const playerStore = usePlayerStore();
const { quality, lyricSize, tlyricSize, rlyricSize, lyricInterludeTime } =
    storeToRefs(playerStore);
const localSotre = useLocalStore();
const { updateUser } = userStore;

export const initSettings = () => {
    windowApi.getSettings().then((settings) => {
        quality.value = settings.music.level;
        lyricSize.value = settings.music.lyricSize;
        tlyricSize.value = settings.music.tlyricSize;
        rlyricSize.value = settings.music.rlyricSize;
        lyricInterludeTime.value = settings.music.lyricInterlude;
        localSotre.downloadedFolderSettings = settings.local.downloadFolder;
        localSotre.localFolderSettings = settings.local.localFolder;
        localSotre.quitApp = settings.other.quitApp;
        if (
            localSotre.downloadedFolderSettings &&
            !localSotre.downloadedMusicFolder
        ) {
            scanMusic({ type: "downloaded", refresh: false });
        }
        if (
            localSotre.localFolderSettings.length != 0 &&
            !localSotre.localMusicFolder
        ) {
            scanMusic({ type: "local", refresh: false });
        }
        if (
            !localSotre.downloadedFolderSettings &&
            localSotre.downloadedMusicFolder
        ) {
            localSotre.downloadedMusicFolder = null;
            localSotre.downloadedFiles = null;
            windowApi.clearLocalMusicData("downloaded");
        }
        if (
            localSotre.localFolderSettings.length == 0 &&
            localSotre.localMusicFolder
        ) {
            (localSotre.localMusicFolder = null),
                (localSotre.localMusicList = null);
            localSotre.localMusicClassify = null;
            windowApi.clearLocalMusicData("local");
        }
        insertCustomFontStyle(settings.other.customFont);
    });
};
export const getUserLikelist = () => {
    if (userStore.user.userId)
        getLikelist(userStore.user.userId).then((result) => {
            userStore.likelist = result.ids;
        });
    else {
        userStore.likelist = [];
    }
};
//初始化
export const init = () => {
    initSettings();
    loadLastSong();
    if (isLogin()) {
        getUserProfile().then((result) => {
            updateUser(result.profile);
            getUserLikelist();
        });
    } else {
        window.localStorage.clear();
    }
};
