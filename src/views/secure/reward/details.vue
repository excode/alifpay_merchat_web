
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useRewardStore } from '@/stores/modules/Reward'

const { reward, error,loading} = storeToRefs(useRewardStore())
const {  
getRewardDetails
} = useRewardStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getRewardDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="Reward details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Level</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.level}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Amount</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.amount}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Status</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.status}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Product</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.productid}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Redeem Product</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.redeemProductId}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">username</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.contactNumber}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Ref</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.ref}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Source username</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.sourceContactNumber}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Particular</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.particular}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Type</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{reward.type}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

