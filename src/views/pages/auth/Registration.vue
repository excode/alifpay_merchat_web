<script setup>
import AppConfig from '@/layout/AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
const { layoutConfig } = useLayout();
const toast = useToast();
const { loading,error,userPreInfo} = storeToRefs(useLoginStore())
const {  
    verifyOTP,getPreUserInfo
  } = useLoginStore()

  onMounted(() => {
    getPreUserInfo();
   
});
const email = ref('');
const password = ref('');
const checked = ref(false);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const submit=async()=>{

   await verifyOTP({email:userPreInfo.value.email,otp:password.value})
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
                        
                        <div class="text-900 text-3xl font-medium mb-3">Welcome   {{userPreInfo.name}}!</div>
                        <span class="text-600 font-medium">Please verify your OTP</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2"></label>
                        <p>OTP has been sent to {{userPreInfo.masked}}</p>
                        <label for="introducer" class="block text-900 font-medium text-xl mb-2">Introducer</label>
                        <InputText id="introducer"  type="text" placeholder="introducers" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="introducer" />

                        <label for="username" class="block text-900 font-medium text-xl mb-2">Username</label>
                        <InputText id="username" type="text" placeholder="username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" />

                        <label for="name" class="block text-900 font-medium text-xl mb-2">Name (Name as per IC/Passport)</label>
                        <InputText id="name" type="text" placeholder="full name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="name" />

                        <label for="email" class="block text-900 font-medium text-xl mb-2">Email</label>
                        <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button :loading="loading"  label="Register" class="w-full p-3 text-xl" @click="submit"></Button>
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
