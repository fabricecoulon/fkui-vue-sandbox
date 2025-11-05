<script setup lang="ts">
import FTabHandler from "../FTabHandler.vue";
</script>

<template>
    <h2>FTabHandler</h2>
    <FTabHandler
        :flik-info="[
            'Flik 1',
            { heading: 'Flik 2', active: true },
            { heading: 'Flik 3', right: true },
            { heading: 'Flik 4', active: true, right: true },
            'Flik 5',
        ]"
    >
        <template #1>
            Ett ensamt epos existerar evigt, emellertid erhålls endast ekot.
            <br />
            <input placeholder="Fyll i data" />
        </template>
        <template #2>
            Två tappra troll tryggade tillvaron tilsammans.
            <br />
            <input placeholder="Fyll i data" />
        </template>
        <template #3>
            Tre tysta träd trotsade tidens tand.
            <br />
            <input placeholder="Fyll i data" />
        </template>
        <template #4>
            Fyra fina fåglar flyger fritt förbi fjärran fält.
            <br />
            <input placeholder="Fyll i data" />
        </template>
        <template #5>
            Fem flitiga fingrar formar framtidens framgång.
            <br />
            <input placeholder="Fyll i data" />
        </template>
    </FTabHandler>
</template>

<style scoped></style>
