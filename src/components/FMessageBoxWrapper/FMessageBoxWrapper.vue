<script setup lang="ts">
import { useAttrs, useTemplateRef, watch } from "vue";
import { FMessageBox } from "@fkui/vue";
import { scrollElementIntoView } from "../../utils/dom-util";
import { type Message, useCurrentMessages } from "../FMessageContext";

defineSlots<{
    default(props: { messages: Message[] | null }): unknown;
}>();

const attrs = useAttrs();
const currentMessages = useCurrentMessages();
const messageBoxRefs =
    useTemplateRef<Array<InstanceType<typeof FMessageBox>>>("messageBox");

watch(
    [currentMessages, messageBoxRefs],
    () => {
        if (!messageBoxRefs.value?.length || !currentMessages.value?.length) {
            return;
        }

        const lastMessage =
            currentMessages.value[currentMessages.value.length - 1];
        if (!lastMessage.options?.scrollIntoView) {
            return;
        }

        const lastMessageBoxEl =
            messageBoxRefs.value[messageBoxRefs.value.length - 1];
        if (lastMessageBoxEl) {
            scrollElementIntoView(lastMessageBoxEl.$el);
        }
    },
    { deep: true },
);
</script>

<template>
    <slot :messages="currentMessages">
        <template v-if="currentMessages && currentMessages.length > 0">
            <f-message-box
                v-for="message in currentMessages"
                :key="message.id"
                v-slot="{ headingSlotClass }"
                v-bind="attrs"
                ref="messageBox"
                :type="message.type"
                :layout="message.heading ? 'standard' : 'short'"
                aria-live="assertive"
                role="alert"
            >
                <template v-if="message.heading">
                    <h2 :class="headingSlotClass">
                        {{ message.heading }}
                    </h2>
                    <p>{{ message.body }}</p>
                </template>
                <template v-else>{{ message.body }}</template>
            </f-message-box>
        </template>
    </slot>
</template>
