
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useFundtransferStore } from '@/stores/modules/Fundtransfer'

const { fundtransfer, error,loading} = storeToRefs(useFundtransferStore())
const {  
getFundtransferDetails
} = useFundtransferStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getFundtransferDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="Fundtransfer details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Amount</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.amount}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Source Account</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.sourceaccount}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Transfer in Ref</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.transfer_in_reference_id}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Source Account Tokenize</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.sourceaccounttokenize}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Transfer Out Ref</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.transfer_out_reference_id}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Service charges</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.servicecharges}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">GST</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.gst}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Destination Bank Account</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.destinationbankaccount}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Trx Date</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{moment(new Date(fundtransfer.trx_date)).format('LL')}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank ID</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.bankid}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Card pin</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.cardpin}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Reference</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{fundtransfer.reference}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

