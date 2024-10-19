
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useMerchantDetailsStore } from '@/stores/modules/MerchantDetails'

const { merchantDetails, error,loading} = storeToRefs(useMerchantDetailsStore())
const {  
getMerchantDetailsDetails
} = useMerchantDetailsStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getMerchantDetailsDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="MerchantDetails details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.name}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.email}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Registered Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.registeredName}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Company Registered No</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.companyRegisteredNo}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Trading Name/ Doing Business as</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.tradingName}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Company Type</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.companyType}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Date Established</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{moment(new Date(merchantDetails.dateEstablished)).format('LL')}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Organization Size</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.organizationSize}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Tel (Office)</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.telOffice}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Fax (Office)</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.faxOffice}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Contact Person</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.contactPerson}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Mobile</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.mobile}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Contact Email</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.contactEmail}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Company Address</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.companyAddress}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Address</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.address}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Country</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.country}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">State</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.state}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">City</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.city}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Postcode</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.postcode}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Active</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.active}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Approved By MPay</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.approvedByMPay}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Approved By AlifPay</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.approvedByAlifPay}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Username</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.username}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Introducer</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{merchantDetails.introducer}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

