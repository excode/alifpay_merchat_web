
<script setup>
import config from '@/config/index';
import { useMerchantDocumentsStore } from '@/stores/modules/MerchantDocuments';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useLoginStore } from '@/stores/modules/Login';

const { merchantDocuments, error,loading} = storeToRefs(useMerchantDocumentsStore())
const {  
getMerchantDocumentsDetails
} = useMerchantDocumentsStore()

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
await getMerchantDocumentsDetails(id)

    //GET THE USER TOEKN           
    getUserInfo()
    
});

    
    const updateFileName = (newUploadedFileName,colName) => {
        let _merchantDocuments = {...merchantDocuments.value,[colName]:newUploadedFileName}
        merchantDocuments.value=_merchantDocuments     
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
        merchantDocuments.value={ ...data };
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
   
<BlockViewer header="MerchantDocuments details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
                <div>
                <Image v-if="merchantDocuments.ssm!='' && merchantDocuments.ssm!=undefined && merchantDocuments.ssm.match(/.(pdf|doc|docx)$/i)" preview   alt="Image" width="250"  src="/file_icon.png">
                <template #indicatoricon>
                    
                <Button  icon="pi pi-download" class="p-button-rounded p-button-warning mr-2" @click="$event=>downloadFile($event,merchantDocuments,'ssm')"  />
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantDocuments,'ssm','application/pdf,.pptx,.docx,.doc')" />
                </template>
              </Image>
             
            <Image v-else   alt="Image" width="250" preview  src="/file_icon_na.png">
                   <template #indicatoricon>
                       <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantDocuments,'ssm')" />
                   </template>
            </Image>
            </div>
                    
                <div>
                <Image v-if="merchantDocuments.bankStatement!='' && merchantDocuments.bankStatement!=undefined && merchantDocuments.bankStatement.match(/.(pdf|doc|docx)$/i)" preview   alt="Image" width="250"  src="/file_icon.png">
                <template #indicatoricon>
                    
                <Button  icon="pi pi-download" class="p-button-rounded p-button-warning mr-2" @click="$event=>downloadFile($event,merchantDocuments,'bankStatement')"  />
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantDocuments,'bankStatement','application/pdf,.pptx,.docx,.doc')" />
                </template>
              </Image>
             
            <Image v-else   alt="Image" width="250" preview  src="/file_icon_na.png">
                   <template #indicatoricon>
                       <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantDocuments,'bankStatement')" />
                   </template>
            </Image>
            </div>
                    
                <div>
                <Image v-if="merchantDocuments.declarationOfConsent!='' && merchantDocuments.declarationOfConsent!=undefined && merchantDocuments.declarationOfConsent.match(/.(pdf|doc|docx)$/i)" preview   alt="Image" width="250"  src="/file_icon.png">
                <template #indicatoricon>
                    
                <Button  icon="pi pi-download" class="p-button-rounded p-button-warning mr-2" @click="$event=>downloadFile($event,merchantDocuments,'declarationOfConsent')"  />
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantDocuments,'declarationOfConsent','application/pdf,.pptx,.docx,.doc')" />
                </template>
              </Image>
             
            <Image v-else   alt="Image" width="250" preview  src="/file_icon_na.png">
                   <template #indicatoricon>
                       <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantDocuments,'declarationOfConsent')" />
                   </template>
            </Image>
            </div>
                    
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Acknowledgement</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDocuments.acknowledgement}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantDocuments" 
        :tableId="merchantDocuments.id" 
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

