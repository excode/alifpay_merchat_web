
<script setup>
import config from '@/config/index';
import { files } from '@/lib/files';
import { useMerchantInfoStore } from '@/stores/modules/MerchantInfo';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useLoginStore } from '@/stores/modules/Login';

const { merchantInfo, error,loading} = storeToRefs(useMerchantInfoStore())
const {  
getMerchantInfoDetails
} = useMerchantInfoStore()

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
await getMerchantInfoDetails(id)

    //GET THE USER TOEKN           
    getUserInfo()
    
});

    
    const updateFileName = (newUploadedFileName,colName) => {
        let _merchantInfo = {...merchantInfo.value,[colName]:newUploadedFileName}
        merchantInfo.value=_merchantInfo     
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
        merchantInfo.value={ ...data };
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
   
<BlockViewer header="Merchant Details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="grid flex justify-content-center">
        <div v-for="(file, index) in files" :key="index" class="col-12 sm:col-6 md:col-4 lg:col-3 p-2">
            <Card>
                <template #title>{{ file.title }}</template>
                <template #content>
                    <Image v-if="merchantInfo[file.field]!='' && merchantInfo[file.field]!=undefined && merchantInfo[file.field].match(/.(jpg|jpeg|png|gif)$/i)" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + merchantInfo[file.field]">
                        <template #indicatoricon>
                            
                            <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
                        
                            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantInfo,'bankstatement','application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png')" />
                        </template>
                      </Image>
                      <Image v-else-if="merchantInfo[file.field]!='' && merchantInfo[file.field]!=undefined && !merchantInfo[file.field].match(/.(jpg|jpeg|png|gif)$/i)" preview   alt="Image" width="250"  src="/file_icon.png">
                      <template #indicatoricon>
                          
                          <Button  icon="pi pi-download" class="p-button-rounded p-button-warning mr-2" @click="$event=>downloadFile($event,merchantInfo,file.field)"  />
                      
                          <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantInfo,file.field,'application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png')" />
                      </template>
                    </Image>
                    <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
                           <template #indicatoricon>
                               <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantInfo,file.field,'application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png')" />
                           </template>
                    </Image>
                </template>
                <template #footer>{{ file.details }}</template>
            </Card>
        </div>
        
               
    </div>
    
        <ul class="list-none p-0 m-0">
            <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">Introducer</div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.introducer}}</div>
                
            </li>           
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Contact Person</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.contactperson}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Mobile no</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.mobileno}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.email}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Street</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.street}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Address</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.address}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">City</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.city}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">State</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.state}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Post code</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.postcode}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Country</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.country}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Avg Transaction</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.avgtransaction}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Avg Monthly Transaction</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantInfo.avgmonthlytransaction}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
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

