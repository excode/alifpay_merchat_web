
<script setup>
import config from '@/config/index';
import { useBankaccountStore } from '@/stores/modules/Bankaccount';
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const { userInfo} = storeToRefs(useLoginStore())
const { bankaccount, error,loading} = storeToRefs(useBankaccountStore())
const {  
getBankaccountDetails
} = useBankaccountStore()
const {  
        getUserInfo,
      } = useLoginStore()

const uploadDialog = ref(false);
const currentImage = ref('');
const uploadInfo = ref(null);
onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getBankaccountDetails(id)
getUserInfo()
});

const updateFileName = (newUploadedFileName,colName) => {
        let _bankaccount = {...bankaccount.value,[colName]:newUploadedFileName}
        bankaccount.value=_bankaccount     
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
        bankaccount.value={ ...data };
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
   
<BlockViewer header="Bankaccount details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        <img v-if="bankaccount.bank_logo_url!=undefined" :src="bankaccount.bank_logo_url" :alt="bankaccount.bank_name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
    </div>

    <Image v-if="bankaccount.doc!='' && bankaccount.doc!=undefined && bankaccount.doc.match(/.(jpg|jpeg|png|gif)$/i)" preview  alt="Image" width="250"  :src="config.serverURI+'/' + bankaccount.doc">
        <template #indicatoricon>
            
            <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
        
            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,merchantInfo,'bankstatement','application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png')" />
        </template>
      </Image>
      <Image v-else-if="bankaccount.doc!='' && bankaccount.doc!=undefined && !bankaccount.doc.match(/.(jpg|jpeg|png|gif)$/i)" preview   alt="Image" width="250"  src="/file_icon.png">
      <template #indicatoricon>
          
          <Button  icon="pi pi-download" class="p-button-rounded p-button-warning mr-2" @click="$event=>downloadFile($event,bankaccount,'doc')"  />
      
          <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,bankaccount,'doc','application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png')" />
      </template>
    </Image>
    <div v-else>
        <p> Upload Bank document  </p>
     <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,bankaccount,'doc','application/pdf,.pptx,.docx,.doc,.jpg,.jpeg,.gif,.png')" />
    
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Account Type</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.acctype_desc}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Document status</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.doc_status_id}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank ID</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.bank_id}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.bank_name}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Account No</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.acc_no}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Account Type ID</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.acctype_id}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bankinfo ID</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.bankinfo_id}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Account description</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.acc_desc}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank Logo</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bankaccount.bank_logo_url}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>
<Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
    <CustomFileUpload 
    :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
    :url="uploadInfo?.url" 
    table="bankaccount" 
    :tableId="bankaccount.id" 
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

