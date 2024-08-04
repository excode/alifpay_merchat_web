
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useBankStore } from '@/stores/modules/Bank'

const { bank, error,loading} = storeToRefs(useBankStore())
const {  
getBankDetails
} = useBankStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getBankDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="Bank details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank_id</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bank.bank_id}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank_name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bank.bank_name}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Bank_logo_URL</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{bank.bank_logo_url}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

