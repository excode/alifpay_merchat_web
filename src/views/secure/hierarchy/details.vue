
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useHierarchyStore } from '@/stores/modules/Hierarchy'

const { hierarchy, error,loading} = storeToRefs(useHierarchyStore())
const {  
getHierarchyDetails
} = useHierarchyStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getHierarchyDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="Hierarchy details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Walletbalance</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.walletbalance}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Rewardbalance</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.rewardbalance}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Distributor</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.distributor}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Username</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.contactNumber}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Product</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.productid}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Introducer</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.introducer}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Upline</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.upline}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Left Child</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.leftChild}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Right Child</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.rightChild}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Info Data</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.infoData}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Category</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{hierarchy.category}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

