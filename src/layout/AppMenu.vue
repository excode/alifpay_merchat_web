<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import menus from './menuItems';
var newMenu =[
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/secure' }]
    },
    ...[menus]
    
]
const model = ref(newMenu);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        
    </ul>
</template>

<style lang="scss" scoped></style>
