<script setup lang="ts">
import { MessageHandler, createMessageHandler } from "./message-context-helper";

/**
 Explanation:

createMessageHandler(): When an <FMessageContext> component is created, it immediately calls createMessageHandler(). This function (from message-context-helper.ts) does two crucial things:

It creates a new, unique MessageHandler object.
It uses Vue's provide feature to make this new handler available to all descendant components.
defineExpose<MessageHandler>(handler): This makes the handler instance accessible on the component's public instance. This allows a parent component to get a template ref to <FMessageContext> and call methods on it directly, like handler.postMessage(...).

<slot />: This renders any components or HTML that you place inside <FMessageContext>. For example:

html
<FMessageContext>
    <!-- These components are now inside the message context -->
    <MyForm />
    <MyMessageDisplay />
</FMessageContext>
 */

const handler = createMessageHandler();
defineExpose<MessageHandler>(handler);
</script>

<template>
    <slot />
</template>
