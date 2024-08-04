
<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import {ref, onMounted } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useUsersStore } from '@/stores/modules/Users'

const { users, error,loading} = storeToRefs(useUsersStore())
const {  
getUsersDetails
} = useUsersStore()

onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getUsersDetails(id)

});


</script>
<template>
<div>
   
<BlockViewer header="Users details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
        <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">User Types</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{users.usertype}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Last Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{users.lastname}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">First Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{users.firstname}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{users.email}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Mobile</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{users.mobile}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">create By</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{users.createby}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Created At</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{moment(new Date(users.createat)).format('LL')}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Update By</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{users.updateby}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Update At</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{moment(new Date(users.updateat)).format('LL')}}</div>
        
    </li>       
  
                
        </ul>
    </div>
</BlockViewer>

</div>
</template>
<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

