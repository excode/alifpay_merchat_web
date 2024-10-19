<script setup>
import AppConfig from '@/layout/AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
const { layoutConfig } = useLayout();
const toast = useToast();
const { loading,error} = storeToRefs(useLoginStore())
const {  
    forgetPassword,goLogin
  } = useLoginStore()

  onMounted(() => {
   // getPreUserInfo();
   
});

const checked = ref(false);
const data=ref({
    contactNumber:""

})

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const submit=async()=>{

   await forgetPassword(data.value)
    if(error.value){
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
}
</script>

<template>
    <Toast />
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        
                        <div class="text-900 text-3xl font-medium mb-3">Forgot Password!</div>
                    
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2"></label>
                    
                        
                        <label for="username" class="block text-900 font-medium text-xl mb-2">Username</label>
                        <InputText id="contactNumber" type="text" placeholder="username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="data.contactNumber" />

                        
                       
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)" @click="goLogin">Sign In</a>
                        </div>
                        <Button :loading="loading"  label="Request Password" class="w-full p-3 text-xl" @click="submit"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
