<script setup>
import AppConfig from '@/layout/AppConfig.vue';
import { useLayout } from '@/layout/composables/layout';
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const { layoutConfig } = useLayout();
const toast = useToast();
const { loading,error,userPreInfo} = storeToRefs(useLoginStore())
const {  
    register,getPreUserInfo,goLogin
  } = useLoginStore()

  const data=ref({
    name:"",
    email:"",
    username:"",
    introducer:"",
    password:"",
    country:"my",
    coop:true
})
  onMounted(() => {
    const route = useRoute();  
    data.value.introducer=route.params.referby
   
});

const checked = ref(false);


const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const submit=async()=>{

   await register(data.value)
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
                        
                        <div class="text-900 text-3xl font-medium mb-3">Welcome to  Alifpay Co-Op Registration!</div>
                    
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2"></label>
                    
                        <label for="introducer" class="block text-900 font-medium text-xl mb-2">Introducer(Min 4 chars)</label>
                        <InputText id="introducer" readonly type="text" placeholder="Introducers" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="data.introducer" />

                        <label for="username" class="block text-900 font-medium text-xl mb-2">Username (Min 4 chars)</label>
                        <InputText id="username" type="text" placeholder="username" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="data.username" />

                        <label for="name" class="block text-900 font-medium text-xl mb-2">Business Name  (Name as per SSM)</label>
                        <InputText id="name" type="text" placeholder="Business/co-op name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="data.name" />

                        <label for="email" class="block text-900 font-medium text-xl mb-2">Email</label>
                        <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="data.email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="data.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                       
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)" @click="goLogin">Already registered?</a>
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
