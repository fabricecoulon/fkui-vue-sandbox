<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { FMessageContext } from "..";
import { FMessageBoxWrapper } from "../../FMessageBoxWrapper";
import { MessageHandler } from "../message-context-helper";

const messageHandler = useTemplateRef<MessageHandler>("messageHandler");

const counter = ref(0);

function closeMeddelande(): void {
    messageHandler.value?.disposeMessage();
}

function showMeddelande(meddelande: {
    type: "error" | "success" | "info" | "warning";
    body: string;
}): void {
    messageHandler.value?.postMessage({
        ...meddelande,
        options: { scrollIntoView: true },
    });
}

async function visaFelmeddelande(): Promise<void> {
    counter.value++;
    showMeddelande({
        type: "error",
        body: `Detta är ett felmeddelande ${counter.value}`,
    });
}
</script>

<template>
    <h2>MessageContext & MessageBox</h2>
    <f-message-context ref="messageHandler">
        <f-message-box-wrapper></f-message-box-wrapper>
    </f-message-context>
    <div class="button-group">
        <button
            type="button"
            class="button button--primary button--small"
            @click="visaFelmeddelande()"
        >
            visa
        </button>
        <button
            type="button"
            class="button button--secondary button--small"
            @click="closeMeddelande"
        >
            close
        </button>
    </div>
</template>
