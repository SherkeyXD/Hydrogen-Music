<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { useOtherStore } from "@/store/otherStore";
const otherStore = useOtherStore();

const props = defineProps(["mvlist"]);
//MV日期
const publishTime = computed(() => (time) => {
    return dayjs(time).format("YYYY-MM-DD");
});
const playMV = (item) => {
    otherStore.getMvData(item.id);
};
</script>

<template>
    <div class="library-content">
        <div class="library-mv-list">
            <div
                class="list-item"
                :class="{
                    'list-item-selected': otherStore.currentVideoId == item.id,
                }"
                @dblclick="playMV(item)"
                v-for="(item, index) in props.mvlist"
            >
                <div class="item-title">
                    <div class="item-img">
                        <img
                            v-lazy
                            :src="item.imgurl + '?param=176y99'"
                            alt=""
                        />
                    </div>
                    <span class="item-name">{{ item.name }}</span>
                </div>
                <span class="item-time">{{
                    publishTime(item.publishTime)
                }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.library-content {
    width: 100%;
    .library-mv-list {
        width: 100%;
        height: 100%;
        .list-item {
            width: 100%;
            padding: 12px 8px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            transition: 0.2s;
            user-select: text;
            &:hover {
                cursor: pointer;
                background-color: rgba(0, 0, 0, 0.047);
            }
            .item-title {
                width: 80%;
                display: flex;
                flex-direction: row;
                align-items: center;
                .item-img {
                    width: 96px;
                    height: 54px;
                    border: 0.5px solid rgba(0, 0, 0, 0.1);
                    position: relative;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .item-name {
                    margin-left: 14px;
                    width: calc(100% - 55px - 14px);
                    font: 14px SourceHanSansCN-Bold;
                    font-weight: bold;
                    color: black;
                    text-align: left;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    word-break: break-all;
                }
            }
            .item-time {
                font: 12px SourceHanSansCN-Bold;
                color: rgb(122, 122, 122);
            }
        }
        .list-item-selected {
            background-color: rgba(0, 0, 0, 0.047);
        }
    }
}
</style>
