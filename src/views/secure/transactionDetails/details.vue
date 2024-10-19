
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useTransactionDetailsStore } from '@/stores/modules/TransactionDetails'

const { transactionDetails, error,loading} = storeToRefs(useTransactionDetailsStore())
const {  
getTransactionDetailsDetails
} = useTransactionDetailsStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getTransactionDetailsDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="TransactionDetails details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Average Single Transaction</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{transactionDetails.averageSingleTransaction}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Expected Monthly Transaction</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{transactionDetails.expectedMonthlyTransaction}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Business Type</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{transactionDetails.businessType}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Business Category</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{transactionDetails.businessCategory}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Approved</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{transactionDetails.approved}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

