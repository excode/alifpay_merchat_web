
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useInsuranceQuotationStore } from '@/stores/modules/InsuranceQuotation'

const { insuranceQuotation, error,loading} = storeToRefs(useInsuranceQuotationStore())
const {  
getInsuranceQuotationDetails
} = useInsuranceQuotationStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getInsuranceQuotationDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="InsuranceQuotation details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">numberPlate</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{insuranceQuotation.numberPlate}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Owner IC/Passport</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{insuranceQuotation.owneric}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Company</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{insuranceQuotation.companyName}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Status</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{insuranceQuotation.status}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

