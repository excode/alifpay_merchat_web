
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useInsuranceCompanyStore } from '@/stores/modules/InsuranceCompany'

import { useLoginStore } from '@/stores/modules/Login'            

const { insuranceCompany, error,loading} = storeToRefs(useInsuranceCompanyStore())
const {  
getInsuranceCompanyDetails
} = useInsuranceCompanyStore()

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
await getInsuranceCompanyDetails(id)

    //GET THE USER TOEKN           
    getUserInfo()
    
});

    
    const updateFileName = (newUploadedFileName,colName) => {
        let _insuranceCompany = {...insuranceCompany.value,[colName]:newUploadedFileName}
        insuranceCompany.value=_insuranceCompany     
    };
    const downloadFile=(e,data,dbColName) => {
        e.stopPropagation();
        let fileLink = config.serverURI+"/"+data[dbColName];
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();

    }
    const showUploadDialog = (e,data,dbColName,accept="image/*") => {
        e.stopPropagation();
        insuranceCompany.value={ ...data };
        let uploadData =  {url:config.serverURI,dbColName:dbColName,accept:accept}
        uploadInfo.value = uploadData;
        uploadDialog.value = true;
        
    };
    const hideUploadDialog = () => {
        uploadDialog.value = false;
    
    };
        
                  
</script>
<template>
<div>
   
<BlockViewer header="InsuranceCompany details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
        <div>
        <Image v-if="insuranceCompany.logo!='' && insuranceCompany.logo!=undefined" preview  alt="Image" width="250"  :src="config.serverURI+'/' + insuranceCompany.logo">
            <template #indicatoricon>
                
                <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
            
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,insuranceCompany,'logo')" />
            </template>
        </Image>
        
        <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
               <template #indicatoricon>
                   <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,insuranceCompany,'logo')" />
               </template>
        </Image>
        </div>
            
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Company Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{insuranceCompany.companyName}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="insuranceCompany" 
        :tableId="insuranceCompany.id" 
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

