
<script setup>
import config from '@/config/index';
import { useMerchantPhotosStore } from '@/stores/modules/MerchantPhotos';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useLoginStore } from '@/stores/modules/Login';

const { merchantPhotos, error,loading} = storeToRefs(useMerchantPhotosStore())
const {  
getMerchantPhotosDetails
} = useMerchantPhotosStore()

    const { userInfo} = storeToRefs(useLoginStore())
    const {  
        getUserInfo,
      } = useLoginStore()
    const uploadDialog = ref(false);
    const currentImage = ref('');
    const uploadInfo = ref(null);
    
    
onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getMerchantPhotosDetails(id)

    //GET THE USER TOEKN           
    getUserInfo()
    
});

    
    const updateFileName = (newUploadedFileName,colName) => {
        let _merchantPhotos = {...merchantPhotos.value,[colName]:newUploadedFileName}
        merchantPhotos.value=_merchantPhotos     
    };
    const downloadFile=(e,data,dbColName) => {
        e.stopPropagation();
        let fileLink = config.serverURIMer+"/"+data[dbColName];
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();

    }
    const showUploadDialog = (e,data,dbColName,accept="image/*") => {
        e.stopPropagation();
        merchantPhotos.value={ ...data };
        let uploadData =  {url:config.serverURIMer,dbColName:dbColName,accept:accept}
        uploadInfo.value = uploadData;
        uploadDialog.value = true;
        
    };
    const hideUploadDialog = () => {
        uploadDialog.value = false;
    
    };
        
                  
</script>
<template>
<div>
   
<BlockViewer header="MerchantPhotos details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
        <div>
        <Image v-if="merchantPhotos.uploadedPhoto!='' && merchantPhotos.uploadedPhoto!=undefined" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + merchantPhotos.uploadedPhoto">
            <template #indicatoricon>
                
                <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
            
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantPhotos,'uploadedPhoto')" />
            </template>
        </Image>
        
        <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
               <template #indicatoricon>
                   <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantPhotos,'uploadedPhoto')" />
               </template>
        </Image>
        </div>
            
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Titile</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantPhotos.titile}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Approved</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantPhotos.approved}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantPhotos" 
        :tableId="merchantPhotos.id" 
        :maxFileSize="10000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />      
    </Dialog>    
                
                
</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

