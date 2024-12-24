
<script setup>
import config from '@/config/index';
import { useLoginStore } from '@/stores/modules/Login';
import { useStoresStore } from '@/stores/modules/Stores';
import { storeToRefs } from 'pinia';
import QRCodeVue3 from "qrcode-vue3";
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { stores,loading,logo_image} = storeToRefs(useStoresStore())
const {  
getStoresDetails,convertImageToBase64
} = useStoresStore()
const qrCode=ref("");
const logoURL=ref("")
    const { userInfo} = storeToRefs(useLoginStore())
    const {  
        getUserInfo,
      } = useLoginStore()

    const enableSave = ref(false);
   
    
 
  
const options = ref({});
onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getStoresDetails(id)
logoURL.value = config.serverURIMer+'/' + stores.value.logo
await convertImageToBase64(logoURL.value)

          
    getUserInfo()
    qrCode.value="alifpay_payment_"+stores.value.id+"_"+userInfo.value.userId
    logoURL.value = config.serverURIMer+'/' + stores.value.logo
   
    
});

    


// Watch center and trigger resize when it changes
//watch(center, triggerMapResize);
                  
</script>
<template>
<div>
   
<BlockViewer header="QR details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
   <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
        <div>
        
<center><h3>{{stores.businessName}}</h3></center>
{{ logoURL }}
        <QRCodeVue3 v-if="qrCode"
        :width="300"
        :height="300"
        :value="qrCode"
        :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
        :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
        :dotsOptions="{
          type: 'square',
          color: '#0a8047',
          
        }"
        :backgroundOptions="{ color: '#ffffff' }"
        :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
        :cornersDotOptions="{ type: undefined, color: '#000000' }"
        fileExt="png"
        :download="true"
        :image="logo_image"
        myclass="my-qur"
        imgclass="img-qr"
        downloadButton="my-button"
        :downloadOptions="{ name: 'vqr', extension: 'png' }"
      />
        </div>
            
    </div>
    
       
    </div>
</BlockViewer>

   
                
</div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

