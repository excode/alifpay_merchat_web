
<script setup>
import config from '@/config/index';
import { remittanceOpt } from '@/lib/remittanceOpt';
import { useLoginStore } from '@/stores/modules/Login';
import { useOwnerDetailsStore } from '@/stores/modules/OwnerDetails';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const { ownerDetails, error,loading} = storeToRefs(useOwnerDetailsStore())
const {  
getOwnerDetailsDetails
} = useOwnerDetailsStore()

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
await getOwnerDetailsDetails(id)

    //GET THE USER TOEKN           
    getUserInfo()
    
});

    
    const updateFileName = (newUploadedFileName,colName) => {
        let _ownerDetails = {...ownerDetails.value,[colName]:newUploadedFileName}
        ownerDetails.value=_ownerDetails     
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
        ownerDetails.value={ ...data };
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
   
<BlockViewer header="OwnerDetails details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
        <div>
        <Image v-if="ownerDetails.icFrontImage!='' && ownerDetails.icFrontImage!=undefined" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + ownerDetails.icFrontImage">
            <template #indicatoricon>
                
                <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
            
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,ownerDetails,'icFrontImage')" />
            </template>
        </Image>
        
        <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
               <template #indicatoricon>
                   <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,ownerDetails,'icFrontImage')" />
               </template>
        </Image>
        </div>
            
        <div>
        <Image v-if="ownerDetails.icBackImage!='' && ownerDetails.icBackImage!=undefined" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + ownerDetails.icBackImage">
            <template #indicatoricon>
                
                <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
            
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,ownerDetails,'icBackImage')" />
            </template>
        </Image>
        
        <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
               <template #indicatoricon>
                   <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,ownerDetails,'icBackImage')" />
               </template>
        </Image>
        </div>
            
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.name}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">IC No</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.icNo}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Contact Number</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.contactNumber}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Email address</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.email}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Remittance Method</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ ownerDetails.remittanceMethod }}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Alifpay Username</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.alifpayUsername}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Remittance Agreement</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{remittanceOpt.find(r=>r.id==ownerDetails.remittanceAgreement)?.value}}||{{ownerDetails.remittanceAgreement}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.bankName}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank Account</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.bankAccount}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Active</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.active}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Approved</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{ownerDetails.approved}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="ownerDetails" 
        :tableId="ownerDetails.id" 
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

