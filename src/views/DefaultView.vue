<script setup lang="ts">
import { ref } from "vue";
//import { FTextField } from "@fkui/vue";
import FTabExample from "../components/FTabHandler/examples/FTabExample.vue";

//const awesomeModel = ref("");
const tabHandler = ref(true);
</script>

<template>
    <div class="sandbox-root">
        <h1>FKUI Sandbox</h1>
        <div class="button-group">
            <button
                type="button"
                class="button button--primary button--small"
                @click="tabHandler = !tabHandler"
            >
                FTabHandler {{ tabHandler ? "off" : "on" }}
            </button>
            <button type="button" class="button button--primary button--small">
                button2
            </button>
        </div>
        <hr />
        <!-- <f-text-field
            id="awesome-field"
            v-model="awesomeModel"
            v-validation.required.maxLength="{ maxLength: { length: 10 } }"
        >
            <template #default> Inmatningsfält. </template>
            <template #description="{ descriptionClass }">
                <span :class="descriptionClass">
                    Lorem ipsum dolor sit amet.
                </span>
            </template>
        </f-text-field>
        <hr></hr> -->
        <f-tab-example v-if="tabHandler"></f-tab-example>
    </div>
</template>

<style>
.sandbox-root {
    width: min(100% - 2rem, 80ch);
    margin: auto;
}

h1 {
    margin-top: 2rem;
}

hr {
    margin-bottom: 2rem;
}
</style>
