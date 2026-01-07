<script lang="ts">
// Module-level counter to ensure unique IDs for each FTabHandler instance.
let idCounter = 0;
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FIcon } from "@fkui/vue";
import FTab from "./FTab.vue";
import { type TabData, type TabInfo } from "./tab-data";

/**
 * @displayName FTabHandler
 * @description A component for managing and displaying content in a two-column tabbed interface.
 * It supports moving tabs between columns, drag-and-drop reordering, and a fullscreen mode for individual tabs.
 * The content for each tab is provided via named slots.
 */
const props = defineProps<{
    /**
     * An array of tab information objects or strings.
     * A string will be treated as a tab heading.
     * A `TabInfo` object can provide more details like initial position and active state.
     */
    flikInfo: Array<TabInfo | string>;
}>();

const uuid = `flikhanterare-${idCounter++}`;
const leftId = `${uuid}_leftLower`;
const rightId = `${uuid}_rightLower`;

const flikar = ref(
    props.flikInfo.map((info: TabInfo | string, index: number): TabData => {
        const isString = typeof info === "string";
        return {
            id: index + 1,
            heading: isString ? info : info.heading,
            active: !isString && !!info.active,
            right: !isString && !!info.right,
            fullscreen: false,
        };
    }),
);

// Computed properties for easy filtering and state checking
const leftFlikar = computed(() => flikar.value.filter((flik) => !flik.right));
const rightFlikar = computed(() => flikar.value.filter((flik) => flik.right));
const fullscreenPossible = computed(
    () => !!leftFlikar.value.length && !!rightFlikar.value.length,
);

/** The tab that is currently in fullscreen mode, if any. */
const fullscreenFlik = computed(
    () =>
        (fullscreenPossible.value &&
            flikar.value.find((flik) => flik.fullscreen)) ||
        undefined,
);

/**
 * Reorganizes tabs, typically after a move operation.
 * It ensures that there is always one active tab per column if tabs exist in it.
 * It also resets any fullscreen state.
 * @param {TabData} [movingFlik] - The tab that is being moved to the other column.
 */
function reorganize(movingFlik?: TabData): void {
    if (flikar.value.length === 0) {
        return;
    }
    const first = new Map<boolean, TabData>();
    const active = new Map<boolean, TabData>();
    if (movingFlik) {
        movingFlik.right = !movingFlik.right;
        if (movingFlik.active) {
            active.set(movingFlik.right, movingFlik);
        }
    }
    for (const flik of flikar.value) {
        flik.fullscreen = false;
        const right = flik.right;
        if (!first.has(right)) {
            first.set(right, flik);
        }
        const activeOne = active.get(right);
        if (activeOne) {
            if (flik.id !== activeOne.id) {
                flik.active = false;
            }
        } else if (flik.active) {
            active.set(right, flik);
        }
    }
    first.forEach((flik, right) => {
        if (!active.has(right)) {
            flik.active = true;
        }
    });
}

reorganize();

/**
 * Activates a specific tab, making its content visible.
 * Deactivates other tabs in the same column.
 * @param {number} flikId - The ID of the tab to activate.
 */
function activate(flikId: number): void {
    const valdFlik = flikar.value.find((flik) => flik.id === flikId);
    if (valdFlik) {
        if (!valdFlik.active) {
            for (const flik of flikar.value) {
                flik.fullscreen = false;
                if (flik.active && flik.right === valdFlik.right) {
                    flik.active = false;
                }
            }
            valdFlik.active = true;
        } else if (!valdFlik.fullscreen && fullscreenFlik.value) {
            fullscreenFlik.value.fullscreen = false;
        }
    }
}

/**
 * Handles the move event from a child FTab component.
 * @param {TabData} flik - The tab to move.
 */
function onMove(flik: TabData): void {
    animateTeleport.value = true;
    reorganize(flik);
}

/**
 * Toggles the fullscreen state for a given tab.
 * @param {TabData} flik - The tab to toggle fullscreen for.
 */
function onFullscreenChange(flik: TabData): void {
    if (flik.fullscreen) {
        flik.fullscreen = false;
    } else {
        // Ensure only one tab can be fullscreen at a time
        flikar.value.forEach((flik) => (flik.fullscreen = false));
        flik.fullscreen = true;
    }
}

/** Sets the drag data when a tab heading drag operation starts. */
function onStartDragFlik(event: DragEvent, flikId: number): void {
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("FlikId", `${flikId}`);
    }
}

/** Handles a tab being dropped into a new column. */
function onDropFlik(event: DragEvent, right: boolean): void {
    const flikId = parseInt(event.dataTransfer?.getData("FlikId") || "", 10);
    const flik = flikar.value.find((flik) => flik.id === flikId);
    if (flik && flik.right !== right) {
        onMove(flik);
    }
}

const animateTeleport = ref(false);
</script>

<template>
    <div class="mytable">
        <div class="myrow heading">
            <div
                v-show="leftFlikar.length"
                class="mycol"
                @drop="onDropFlik($event, false)"
                @dragover.prevent
                @dragenter.prevent
            >
                <TransitionGroup
                    name="slide-left"
                    tag="div"
                    class="headings-wrapper"
                >
                    <div
                        v-for="flik in leftFlikar"
                        :key="flik.id"
                        class="heading2"
                        :class="{
                            active: flik.active,
                            shrouded:
                                fullscreenFlik && fullscreenFlik.id !== flik.id,
                        }"
                        draggable="true"
                        @click="activate(flik.id)"
                        @dragstart="onStartDragFlik($event, flik.id)"
                    >
                        {{ flik.heading }}
                        <button class="move-button" @click.stop="onMove(flik)">
                            <f-icon
                                name="caret-up"
                                :rotate="flik.right ? '270' : '90'"
                            />
                        </button>
                    </div>
                </TransitionGroup>
            </div>
            <div
                v-show="rightFlikar.length"
                class="mycol"
                @drop="onDropFlik($event, true)"
                @dragover.prevent
                @dragenter.prevent
            >
                <TransitionGroup
                    name="slide-right"
                    tag="div"
                    class="headings-wrapper"
                >
                    <div
                        v-for="flik in rightFlikar"
                        :key="flik.id"
                        class="heading2"
                        :class="{
                            active: flik.active,
                            shrouded:
                                fullscreenFlik && fullscreenFlik.id !== flik.id,
                        }"
                        draggable="true"
                        @click="activate(flik.id)"
                        @dragstart="onStartDragFlik($event, flik.id)"
                    >
                        {{ flik.heading }}
                        <button class="move-button" @click.stop="onMove(flik)">
                            <f-icon
                                name="caret-up"
                                :rotate="flik.right ? '270' : '90'"
                            />
                        </button>
                    </div>
                </TransitionGroup>
            </div>
        </div>
        <div class="myrow content">
            <div
                :id="leftId"
                class="mycol"
                :class="{
                    'col-hidden': !leftFlikar.length || fullscreenFlik?.right,
                }"
            />
            <div
                :id="rightId"
                class="mycol"
                :class="{
                    'col-hidden':
                        !rightFlikar.length ||
                        (fullscreenFlik && !fullscreenFlik.right),
                }"
            />
        </div>
    </div>

    <f-tab
        v-for="flik in flikar"
        :key="flik.id"
        :tab-data="flik"
        :placement="flik.right ? rightId : leftId"
        :fullscreen-possible
        :fullscreen-active="!!fullscreenFlik"
        :animate-teleport
        @move="onMove(flik)"
        @fullscreen="onFullscreenChange(flik)"
    >
        <slot :name="flik.id" />
    </f-tab>
</template>

<style scoped>
.mytable {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    margin: 2rem 0;
}
.myrow {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
}
.mycol {
    flex-basis: 0;
    flex-grow: 1;
    transition: flex-grow 0.4s ease-out;
}
.mycol.col-hidden {
    flex-grow: 0;
    border: 0;
    padding: 0;
}
.myrow.heading .mycol {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
}
.myrow.heading .mycol:last-child {
    justify-content: flex-end;
}
.headings-wrapper {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    width: 100%;
}
.mycol:first-child .headings-wrapper {
    justify-content: flex-start;
}
.mycol:last-child .headings-wrapper {
    justify-content: flex-end;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.5s ease;
}
.slide-left-move,
.slide-right-move {
    transition: transform 0.5s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.slide-right-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.heading2,
.myrow.content .mycol {
    border: 1px solid #7f7f7f;
}
.myrow.content {
    border-left: 1px solid #7f7f7f;
}
.myrow.content .mycol {
    border-left-width: 0;
}
.heading2 {
    border-bottom-width: 0;
    padding: 0.2rem 0.5rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition:
        opacity 0.4s ease-out,
        border-bottom-color 0.4s ease-out;
}
.heading2.shrouded {
    opacity: 0.6;
}
.heading2:not(:first-child) {
    margin-left: 0.1rem;
}
.heading2.active {
    border-bottom: 5px solid #136b40;
    cursor: default;
}
.heading2.active.shrouded {
    border-bottom-color: rgba(21, 108, 65, 0.5);
    cursor: pointer;
}
.move-button {
    padding: 0.1rem 0.2rem 0;
    border-style: none;
    background: none;
    cursor: pointer;
}
</style>
