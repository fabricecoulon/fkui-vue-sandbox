<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FIcon } from "@fkui/vue";
import { type TabData } from "./tab-data";

defineProps<{
    tabData: TabData;
    placement: string;
    fullscreenPossible: boolean;
    fullscreenActive: boolean;
}>();
defineEmits<{
    move: [];
    fullscreen: [];
}>();

const mounted = ref(false);
onMounted(() => (mounted.value = true));
</script>

<template>
    <div v-if="mounted">
        <Teleport :to="`#${placement}`">
            <div
                v-show="
                    tabData.active && (tabData.fullscreen || !fullscreenActive)
                "
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
</style>
