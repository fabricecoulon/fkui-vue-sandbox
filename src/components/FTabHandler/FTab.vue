<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FIcon } from "@fkui/vue";
import { Motion } from "motion-v";
import { type TabData } from "./tab-data";

/**
 * @displayName FTab
 * @description Represents a single tab's content within the FTabHandler.
 * It handles rendering the content, and provides buttons for moving the tab or toggling fullscreen.
 * The content is teleported to a container specified by the placement prop.
 */
defineProps<{
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
    /**
     * If true animate the tab teleport
     */
    animateTeleport: boolean;
}>();
defineEmits<{
    /** Emitted when the user clicks the move button */
    move: [];
    /** Emitted when the user clicks the fullscreen button */
    fullscreen: [];
}>();

const mounted = ref(false);

onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <div v-if="mounted">
        <Teleport :to="`#${placement}`">
            <Motion
                :key="placement"
                :initial="
                    animateTeleport
                        ? {
                              opacity: 0,
                              x: tabData.right ? -100 : 100,
                          }
                        : {
                              opacity: 1,
                          }
                "
                :animate="
                    animateTeleport
                        ? {
                              opacity: 1,
                              x: 0,
                              transition: {
                                  duration: 0.3,
                                  delay: 0.05,
                              },
                          }
                        : {}
                "
            >
                <div
                    v-show="
                        tabData.active &&
                        (tabData.fullscreen || !fullscreenActive)
                    "
                    class="content"
                >
                    <div class="content-header">
                        <h3 class="tab-heading-text">
                            {{ tabData.heading }}
                        </h3>
                        <div class="buttons">
                            <button
                                v-show="fullscreenPossible"
                                @click="$emit('fullscreen')"
                            >
                                <f-icon
                                    :name="
                                        tabData.fullscreen
                                            ? 'dash'
                                            : 'new-window'
                                    "
                                />
                            </button>
                            <button @click="$emit('move')">
                                <f-icon
                                    name="caret-up"
                                    :rotate="tabData.right ? '270' : '90'"
                                />
                            </button>
                        </div>
                    </div>
                    <slot />
                </div>
            </Motion>
        </Teleport>
    </div>
</template>

<style scoped>
.content {
    padding: 1rem 1rem 2rem;
}
.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
.tab-heading-text {
    margin: 0;
    font-size: 1.2rem;
}
.buttons {
    display: flex;
    flex-wrap: nowrap;
}
.buttons button {
    padding: 0.2rem 0.3rem;
    border-style: none;
    background: none;
    cursor: pointer;
}
</style>
