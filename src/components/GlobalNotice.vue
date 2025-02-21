<script setup>
import { ref } from "vue";
import { useOtherStore } from "../store/otherStore.mjs";

const otherStore = useOtherStore();
</script>

<template>
    <div class="global-notice" v-show="otherStore.noticeShow">
        <div
            class="notice-container"
            :class="{ 'notice-container-out': otherStore.niticeOutAnimation }"
        >
            <div class="notic-text">{{ otherStore.noticeText }}</div>
            <div class="notice-border notice-border1"></div>
            <div class="notice-border notice-border2"></div>
            <div class="notice-border notice-border3"></div>
            <div class="notice-border notice-border4"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.global-notice {
    bottom: 120px;
    .notice-container {
        padding: 3px 0;
        width: 0;
        background-image: url("../assets/img/halftone.png");
        background-size: 40%;
        background-repeat: repeat;
        background-color: rgb(23, 23, 23);
        position: relative;
        overflow: hidden;
        animation: notice-in 0.18s cubic-bezier(0.3, 0.79, 0.55, 0.99) forwards;
        @keyframes notice-in {
            0% {
                width: 0;
                transform: scale(0.9);
            }
            100% {
                width: 300px;
                padding: 3px 30px;
                transform: scale(1);
            }
        }
        .notic-text {
            font: 13px SourceHanSansCN-Bold;
            color: white;
            white-space: nowrap;
        }
        .notice-border {
            width: 3px;
            height: 3px;
            background-color: white;
            position: absolute;
        }
        $borderPosition: 4px;
        .notice-border1 {
            top: $borderPosition;
            left: $borderPosition;
        }
        .notice-border2 {
            top: $borderPosition;
            right: $borderPosition;
        }
        .notice-border3 {
            bottom: $borderPosition;
            right: $borderPosition;
        }
        .notice-border4 {
            bottom: $borderPosition;
            left: $borderPosition;
        }
    }
    .notice-container-out {
        width: 300px;
        padding: 3px 30px;
        animation: notice-out 0.2s forwards;
        @keyframes notice-out {
            0% {
                opacity: 1;
            }
            8% {
                opacity: 1;
            }
            10% {
                opacity: 0;
            }
            18% {
                opacity: 0;
            }
            20% {
                opacity: 1;
            }
            28% {
                opacity: 1;
            }
            30% {
                opacity: 0;
            }
            38% {
                opacity: 0;
            }
            40% {
                opacity: 1;
            }
            100% {
                transform: scale(0.9);
                opacity: 0;
            }
        }
    }
}
</style>
