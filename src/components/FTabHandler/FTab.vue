<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { FIcon } from "@fkui/vue";
import { type TabData } from "./tab-data";

/**
 * @displayName FTab
 * @description Represents a single tab's content within the FTabHandler.
 * It handles rendering the content, and provides buttons for moving the tab or toggling fullscreen.
 * The content is teleported to a container specified by the placement prop.
 */
const props = defineProps<{
    /**
     * Data object for the tab, contains active state, fullscreen state, etc.
     */
    tabData: TabData;
    /**
     * The ID of the element where the tab content will be teleported.
     */
    placement: string;
    /**
     * If true, a fullscreen toggle button is shown.
     */
    fullscreenPossible: boolean;
    /**
     * If true, it indicates that a tab is currently in fullscreen mode.
     */
    fullscreenActive: boolean;
}>();
defineEmits<{
    /** Emitted when the user clicks the move button */
    move: [];
    /** Emitted when the user clicks the fullscreen button */
    fullscreen: [];
}>();

const mounted = ref(false);
const justMoved = ref(false);
const movedToRight = ref(false);

onMounted(() => (mounted.value = true));

watch(
    () => props.tabData.right,
    (newVal, oldVal) => {
        justMoved.value = true;
        movedToRight.value = newVal && !oldVal;
        setTimeout(() => (justMoved.value = false), 1000);
    },
);
</script>

<template>
    <div v-if="mounted">
        <Teleport :to="`#${placement}`">
            <Transition
                :name="
                    justMoved
                        ? movedToRight
                            ? 'tab-move-right'
                            : 'tab-move-left'
                        : 'tab-slide'
                "
            >
                <div
                    v-if="
                        tabData.active &&
                        (tabData.fullscreen || !fullscreenActive)
                    "
                    :key="`${tabData.id}-${tabData.right}`"
                    class="content"
                >
                    <div class="buttons">
                        <button
                            v-show="fullscreenPossible"
                            @click="$emit('fullscreen')"
                        >
                            <f-icon
                                :name="tabData.fullscreen ? 'dash' : 'new-window'"
                            />
                        </button>
                        <button @click="$emit('move')">
                            <f-icon
                                name="caret-up"
                                :rotate="tabData.right ? '270' : '90'"
                            />
                        </button>
                    </div>
                    <slot />
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
.content {
    padding: 1rem 1rem 2rem;
}
.buttons {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
}
.buttons button {
    padding: 0.2rem 0.3rem;
    border-style: none;
    background: none;
    cursor: pointer;
}

/* Tab switch transition (no highlight) */
.tab-slide-enter-active,
.tab-slide-leave-active {
    transition: opacity 0.2s ease-out;
}

.tab-slide-leave-active {
    position: absolute;
    width: 100%;
}

.tab-slide-enter-from,
.tab-slide-leave-to {
    opacity: 0;
}

/* Tab move right transition (left->right, flip like turning page forward) */
.tab-move-right-enter-active {
    transition:
        opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        background-color 0.8s ease-out;
    transform-origin: left center;
    backface-visibility: hidden;
}

.tab-move-right-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
    position: absolute;
    width: 100%;
    transform-origin: right center;
    backface-visibility: hidden;
}

.tab-move-right-enter-from {
    opacity: 0;
    transform: perspective(1000px) rotateY(-90deg);
    background-color: rgba(19, 107, 64, 0.15);
}

.tab-move-right-enter-to {
    transform: perspective(1000px) rotateY(0deg);
    background-color: transparent;
}

.tab-move-right-leave-to {
    opacity: 0;
    transform: perspective(1000px) rotateY(90deg);
}

/* Tab move left transition (right->left, flip like turning page backward) */
.tab-move-left-enter-active {
    transition:
        opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        background-color 0.8s ease-out;
    transform-origin: right center;
    backface-visibility: hidden;
}

.tab-move-left-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
    position: absolute;
    width: 100%;
    transform-origin: left center;
    backface-visibility: hidden;
}

.tab-move-left-enter-from {
    opacity: 0;
    transform: perspective(1000px) rotateY(90deg);
    background-color: rgba(19, 107, 64, 0.15);
}

.tab-move-left-enter-to {
    transform: perspective(1000px) rotateY(0deg);
    background-color: transparent;
}

.tab-move-left-leave-to {
    opacity: 0;
    transform: perspective(1000px) rotateY(-90deg);
}

/* Accessibility: respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    .tab-slide-enter-active,
    .tab-slide-leave-active,
    .tab-move-right-enter-active,
    .tab-move-right-leave-active,
    .tab-move-left-enter-active,
    .tab-move-left-leave-active {
        transition: opacity 0.15s ease-out;
        transform: none !important;
    }

    .tab-move-right-enter-from,
    .tab-move-right-leave-to,
    .tab-move-left-enter-from,
    .tab-move-left-leave-to {
        transform: none;
    }
}
</style>
