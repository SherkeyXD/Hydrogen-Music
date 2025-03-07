<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import { dialogOpen, noticeOpen } from "@/utils/dialog";
import { deleteCloudSong } from "@/api/cloud.mjs";
import { addSong, setShuffledList } from "@/utils/player";
import { useCloudStore } from "@/store/cloudStore";
import { usePlayerStore } from "@/store/playerStore";
import { useLibraryStore } from "@/store/libraryStore";
import { useLocalStore } from "@/store/localStore";
import { storeToRefs } from "pinia";

const cloudStore = useCloudStore();
const { cloudSongs } = storeToRefs(cloudStore);
const playerStore = usePlayerStore();
const libraryStore = useLibraryStore();
const localStore = useLocalStore();

const selectedSongs = ref([]);

function fileEdit(song) {
    let findIndex = (selectedSongs.value || []).findIndex(
        (item) => item.id == song.id,
    );
    if (findIndex == -1) {
        selectedSongs.value.push(song);
    } else {
        selectedSongs.value.splice(findIndex, 1);
    }
}
const clearSelect = () => {
    selectedSongs.value = [];
};
const downloadFile = () => {
    localStore.updateDownloadList(selectedSongs.value);
    clearSelect();
};
const deleteFile = (flag) => {
    if (flag) {
        let ids = "";
        selectedSongs.value.forEach((song) => {
            ids += song.id + ",";
        });
        ids = ids.substring(0, ids.length - 1);
        let params = {
            id: ids,
        };
        deleteCloudSong(params).then((result) => {
            if (result.code == 200) {
                selectedSongs.value.forEach((item) => {
                    cloudSongs.value.splice(
                        (cloudSongs.value || []).findIndex(
                            (song) => song.simpleSong.id == item.id,
                        ),
                        1,
                    );
                });
                selectedSongs.value = [];
            } else {
                noticeOpen("删除失败", 2);
            }
        });
    }
};
const deleteFileConfirm = () => {
    dialogOpen("确认删除", "您确定要从云盘中删除歌曲吗？", deleteFile);
};

const addTime = (time) => {
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};
const play = (id, index) => {
    let list = [];
    cloudSongs.value.forEach((item) => {
        list.push(item.simpleSong);
    });
    playerStore.songList = list;
    addSong(id, index, true);
    if (libraryStore.playMode == 3) setShuffledList();
};
</script>

<template>
    <div class="file-container">
        <div
            class="file-list"
            :class="{ 'file-list-selected': selectedSongs.length != 0 }"
        >
            <div
                class="list-item"
                @dblclick="play(item.simpleSong.id, index)"
                v-for="(item, index) in cloudSongs"
            >
                <div class="item-info">
                    <div class="item-img" @click="fileEdit(item.simpleSong)">
                        <img
                            v-lazy
                            :src="item.simpleSong.al.picUrl + '?param=90y90'"
                            alt=""
                        />
                    </div>
                    <div class="info">
                        <div class="item-name">
                            {{ item.songName }}
                            <span class="item-name2"
                                >&nbsp;({{ item.fileName }})</span
                            >
                        </div>
                        <div class="item-other">
                            <span class="item-time">{{
                                addTime(item.addTime)
                            }}</span>
                            <span class="item-size"
                                >{{
                                    (item.fileSize / 1024 / 1024).toFixed(1)
                                }}MB</span
                            >
                        </div>
                    </div>
                </div>
                <div
                    class="item-check"
                    :class="{
                        'item-check-selected':
                            (selectedSongs || []).findIndex(
                                (song) => song.id == item.simpleSong.id,
                            ) != -1,
                    }"
                    @click="fileEdit(item.simpleSong)"
                >
                    <svg
                        t="1671452723182"
                        class="icon"
                        viewBox="0 0 1498 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="1965"
                        width="200"
                        height="200"
                    >
                        <path
                            d="M618.396098 1024L0 403.605854l140.862439-141.861464 477.533659 479.531708L1357.674146 0 1498.536585 140.862439l-880.140487 883.137561z"
                            p-id="1966"
                            fill="#ffffff"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
        <div
            class="file-edit"
            :class="{ 'file-edit-selected': selectedSongs.length != 0 }"
        >
            <div class="edit-item" @click="clearSelect()">
                <svg
                    t="1669029682779"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="6239"
                    width="200"
                    height="200"
                >
                    <path
                        d="M837.665426 907.48291 139.516188 907.48291c-12.852708 0-23.272495-10.419786-23.272495-23.272495L116.243694 186.062201c0-12.852708 10.419786-23.272495 23.272495-23.272495l442.156917 0c12.852708 0 23.272495 10.419786 23.272495 23.272495s-10.419786 23.272495-23.272495 23.272495L162.788683 209.334696l0 651.605273 651.605273 0L814.393955 442.043258c0-12.852708 10.419786-23.272495 23.272495-23.272495s23.272495 10.418762 23.272495 23.272495l0 442.168181C860.937921 897.064147 850.518134 907.48291 837.665426 907.48291z"
                        p-id="6240"
                    ></path>
                    <path
                        d="M395.758354 651.80904c-5.955334 0-11.911692-2.272161-16.456013-6.815458-9.087618-9.088642-9.087618-23.824407 0-32.91305l488.745937-488.745937c9.089666-9.088642 23.824407-9.088642 32.912026 0 9.088642 9.087618 9.088642 23.823383 0.001024 32.912026L412.214367 644.993582C407.670046 649.536879 401.714712 651.80904 395.758354 651.80904z"
                        p-id="6241"
                    ></path>
                </svg>
                <span class="item-name">全部取消</span>
            </div>
            <div class="edit-item" @click="downloadFile()">
                <svg
                    t="1669030443895"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="10347"
                    width="200"
                    height="200"
                >
                    <path
                        d="M921.6 563.2c-9.6-9.6-25.6-9.6-35.2 0L544 896l0-822.4c0-12.8-9.6-22.4-25.6-22.4s-25.6 9.6-25.6 22.4L492.8 896l-342.4-339.2c-9.6-9.6-25.6-9.6-35.2 0-9.6 9.6-9.6 22.4 0 32l384 377.6c6.4 6.4 12.8 6.4 19.2 6.4 0 0 0 0 0 0 3.2 0 3.2 0 6.4 0 0 0 0 0 3.2 0 3.2 0 6.4-3.2 9.6-6.4l380.8-371.2C931.2 588.8 931.2 572.8 921.6 563.2z"
                        p-id="10348"
                    ></path>
                </svg>
                <span class="item-name">下载</span>
            </div>
            <div class="edit-item" @click="deleteFileConfirm()">
                <svg
                    t="1669033713486"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="11464"
                    width="200"
                    height="200"
                >
                    <path
                        d="M851.416 217.84l-45.256-45.248L512 466.744l-294.152-294.16-45.256 45.256L466.744 512l-294.152 294.16 45.248 45.256L512 557.256l294.16 294.16 45.256-45.256L557.256 512z"
                        fill="#272536"
                        p-id="11465"
                    ></path>
                </svg>
                <span class="item-name">删除</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.file-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    .file-list {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        transition: 0.3s;
        &::-webkit-scrollbar {
            display: none;
        }
        .list-item {
            width: 100%;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid black;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            &:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }
            .item-info {
                width: 95%;
                display: flex;
                flex-direction: row;
                align-items: center;
                .item-img {
                    margin-right: 10px;
                    width: 40px;
                    height: 40px;
                    border: 0.5px solid rgba(0, 0, 0, 0.1);
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .info {
                    width: calc(100% - 40px - 10px);
                    text-align: left;
                    .item-name {
                        font: 15px SourceHanSansCN-Bold;
                        color: black;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 1;
                        word-break: break-all;
                        .item-name2 {
                            font: 12px SourceHanSansCN-Bold;
                            color: rgb(110, 110, 110);
                        }
                    }
                    .item-other {
                        font: 10px Geometos;
                        color: rgb(123, 123, 123);
                        .item-time {
                            margin-right: 10px;
                        }
                    }
                }
            }
            .item-check {
                width: 10px;
                height: 10px;
                border: 1px solid black;
                position: relative;
                &:hover {
                    cursor: pointer;
                }
                svg {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0;
                }
            }
            .item-check-selected {
                background-color: black;
                svg {
                    opacity: 1;
                }
            }
        }
    }
    .file-list-selected {
        width: calc(100% - 110px);
        transition: 0.3s;
    }
    .file-edit {
        padding-top: 10px;
        position: absolute;
        right: -140px;
        transition: 0.3s;
        .edit-item {
            margin-bottom: 15px;
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            transition: 0.2s;
            &:hover {
                cursor: pointer;
                opacity: 0.5;
            }
            .icon {
                margin-right: 8px;
                width: 22px;
                height: 22px;
            }
            .item-name {
                font: 16px SourceHanSansCN-Bold;
                color: black;
                white-space: nowrap;
            }
        }
    }
    .file-edit-selected {
        right: -10px;
    }
}
</style>
