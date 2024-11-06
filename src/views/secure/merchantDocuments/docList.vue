
<script setup>
import config from '@/config/index';

import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useLoginStore } from '@/stores/modules/Login';


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


    //GET THE USER TOEKN           
   
    
});

    
    const updateFileName = (newUploadedFileName,colName) => {
        let _merchantDocuments = {...merchantDocuments.value,[colName]:newUploadedFileName}
        merchantDocuments.value=_merchantDocuments     
    };
    const downloadFile=(e,filename) => {
        e.stopPropagation();
        let fileLink = config.serverURIMer+"/"+filename;
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
const doc_list=[
    {
        "name":"Data_Flow_Chart_Full_Stack_API_Solution.pdf",
        "title":"Data Flow Chart"
    },
    {
        "name":"AlifPayMerchant.pdf",
        "title":"MPAY SPONSORED MERCHANT APPLICATION FORM"
    },
    {
        "name":"Schedule_AlifPay_210824.pdf",
        "title":"Fees and Charges"
    },
    {
        "name":"Part1.3.pdf",
        "title":"Fees and Charges 2"
    }
    ,
    {
        "name":"4_MPay_Merchant_Agreement_version_1.0_09102023.pdf",
        "title":"MPAY MERCHANT AGREEMENT"
    }
    

]    
                  
</script>
<template>
<div>
   
<BlockViewer header="MPay Merchant document list"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">

 
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
       
               
            <div v-for="(image, index) in doc_list" :key="index">
                <h3>{{image.title}}</h3>
                <img src="/file_icon.png" :alt="image.title || 'Image'" class="image-class" @click="$event=>downloadFile($event,image.name)"  />
                <Button  icon="pi pi-download" class="p-button-rounded p-button-warning mr-2" @click="$event=>downloadFile($event,image.name)"  />
            
            </div>
                    
            <Divider />
    
        <ul class="list-none p-0 m-0">
            
   
  
                
        </ul>
   
</BlockViewer>

   
                
                
</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

