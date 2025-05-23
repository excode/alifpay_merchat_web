<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const { layoutConfig, onMenuToggle } = useLayout();
const { userInfo} = storeToRefs(useLoginStore())
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const {  
    logOut,getUserInfo
  } = useLoginStore()
onMounted(() => {
    getUserInfo();
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
const getUserType=(type)=>{
    let userTypeName="BU: Basic User"
    if(type==2){
        userTypeName="FP: FinTech Partner"
    }else if(type==3){
         userTypeName="FC: FinTech Community"
    }
    return userTypeName;
}
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>{{config.title}}</span>
        </router-link>
        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>
        <Tag severity="info" :value="userInfo.name" class="mr-4"> </Tag>
    
        <Tag severity="success" :value="getUserType(userInfo.userType)" image="/images/avatar/amyelsner.png" />
       
        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <span className="p-link layout-topbar-button">
              
            </span>
            <button @click="logOut()" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
           
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
