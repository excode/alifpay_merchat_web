<script setup>
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import menus from './menuItems';
const { userInfo} = storeToRefs(useLoginStore())
var newMenu =[
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/secure' }]
    },
    ...menus
    
]
const model = ref(newMenu);

const {  
    getUserInfo
  } = useLoginStore()
onMounted(() => {
    getUserInfo();
    console.log(userInfo.value.userType)
   
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator && Array.isArray(item.owner) &&  item.owner.includes(userInfo.userType) " :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        
    </ul>
</template>

<style lang="scss" scoped></style>
