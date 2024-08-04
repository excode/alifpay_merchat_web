<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { useBankaccountStore } from '@/stores/modules/Bankaccount';
import { useFundtransferStore } from '@/stores/modules/Fundtransfer';
import { useMerchantInfoStore } from '@/stores/modules/Merchantinfo';
import { useOwnerDetailsStore } from '@/stores/modules/OwnerDetails';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { onMounted, watch } from 'vue';
const { isDarkTheme } = useLayout();
const { bankaccounts} = storeToRefs(useBankaccountStore())
const { curdLoading,error} = storeToRefs(useMerchantInfoStore())
    const {  
        getBankaccount
   
    } = useBankaccountStore()
    const {  
        sendApplication
   
    } = useMerchantInfoStore()
    const { ownerDetailss} = storeToRefs(useOwnerDetailsStore())
    const {  
    getOwnerDetails,
    } = useOwnerDetailsStore()
    const { summary} = storeToRefs(useFundtransferStore())
    const {  
        getFundtransferSummary
   
    } = useFundtransferStore()

    const toast = useToast();
onMounted(async() => {
    await getBankaccount();
    await getOwnerDetails();
    await getFundtransferSummary()
});

const sendApplication2=async()=>{

    await sendApplication();
    console.log()
    if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Application sent', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
}

watch(
    isDarkTheme,
    (val) => {
        if (val) {
           // applyDarkTheme();
        } else {
           // applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Bank Accounts</span>
                        <div class="text-900 font-medium text-xl">{{bankaccounts.length}}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium"> </span>
                <span class="text-500"></span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Owners</span>
                        <div class="text-900 font-medium text-xl">{{ownerDetailss.length}}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium"> </span>
                <span class="text-500"></span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Transfer</span>
                        <div class="text-900 font-medium text-xl">{{summary.total?summary.total:0.00}} MYR</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-send text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium"></span>
                <span class="text-500"></span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Transfer count</span>
                        <div class="text-900 font-medium text-xl">{{summary.num}} </div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium"> </span>
                <span class="text-500"></span>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Recent Sales</h5>
                <DataTable :value="bankaccounts" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column style="width: 15%">
                        <template #header> Bank Logo </template>
                        <template #body="slotProps">
                            <img :src="slotProps.data.bank_logo_url" :alt="slotProps.data.image" width="50" class="shadow-2" />
                        </template>
                    </Column>
                    <Column field="bank_name" header="Name" :sortable="true" style="width: 35%"></Column>
                    <Column field="acc_no" header="Account" :sortable="true" style="width: 35%">
                        
                    </Column>
                    <Column style="width: 15%" field="acctype_desc"  header="Type">
                        
                    </Column>
                </DataTable>
            </div>
           
        </div>
        <div class="col-12 xl:col-6">
            
            <div class="card">
                
                   
                    <DataTable :value="ownerDetailss" :rows="5" :paginator="true" responsiveLayout="scroll">
                        <Column style="width: 15%">
                            <template #header>IC</template>
                            <template #body="slotProps">
                                <img :src="config.serverURI+'/'+slotProps.data.icfrontimage" :alt="slotProps.data.name" width="50" class="shadow-2" />
                            </template>
                        </Column>
                        <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
                        <Column field="email" header="Email" :sortable="true" style="width: 35%">
                            
                        </Column>
                        <Column style="width: 15%" field="contactnumber"  header="Mobile">
                            
                        </Column>
                    </DataTable>
                    <div v-if="curdLoading">
                       <ProgressSpinner />
                    </div>
                   <div v-else>
                    <Button label="Submit Application" icon="pi pi-check" @click="sendApplication2" />
                   </div>
            
               
            </div>
           
        </div>
    </div>
</template>
