
<script setup>
import { FilterMatchMode ,FilterOperator} from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia'
import config from '@/config/index'
import { useBankStore } from '@/stores/modules/Bank'
import moment from 'moment'
import { convertArray, fixDate } from '@/lib/functions';

import {validateForm,validate} from '@/lib/validation'
    const { banks, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useBankStore())
    const {  
    getBank,
    updateBankValue ,
    addBank,
    updateBank,
    deleteBank
    } = useBankStore()


const toast = useToast();
const { contextPath } = useLayout();
const bankDialog = ref(false);
const deleteBankDialog = ref(false);
const deleteBanksDialog = ref(false);
const bank = ref({});
const selectedBanks = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

// THE VALIDATION RULES
const validation=[
    {id:'bank_id',type:validate.int,max:0,min:0,required:true},
{id:'bank_name',type:validate.text,max:0,min:0,required:true},
{id:'bank_logo_url',type:validate.url,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getBank()
    

});


const openNew = () => {
    let emptyBank = {
        bank_id:0,
bank_name:'',
bank_logo_url:''
    };
    bank.value = emptyBank;
    submitted.value = false;
    bankDialog.value = true;
};

const hideDialog = () => {
    bankDialog.value = false;
    submitted.value = false;
};

const saveBank = async() => {
    submitted.value = true;
    const validationErrors=validateForm(bank.value,validation)
    if (validationErrors.length==0) {
    
        if (bank.value.id) {
            await updateBank(bank.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Bank Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addBank(bank.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Bank Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        bankDialog.value = false;
        bank.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editBank = (editBank) => {
    
    bank.value = { ...editBank };
    bankDialog.value = true;
};

const confirmDeleteBank = (editBank) => {
    bank.value = { ...editBank };
    deleteBankDialog.value = true;
};

const delBank = async() => {
    await deleteBank(bank.value.id);
    deleteBankDialog.value = false;
    if(error.value==undefined || error.value==null){
    bank.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Bank Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    bank.value =  {...bank.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < banks.value.length; i++) {
        if (banks.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};


const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteBanksDialog.value = true;
};
const deleteSelectedBanks = () => {
    banks.value = banks.value.filter((val) => !selectedBanks.value.includes(val));
    deleteBanksDialog.value = false;
    selectedBanks.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Banks Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        bank_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
bank_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
bank_logo_url: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    };
};
const getNewData =async(e,type=0)=>{
    loading.value = true;
    let searchObj={}
    
    for (const key in e.filters) {  

        if(e.filters[key].constraints){
         
            if(e.filters[key].constraints[0].value){
                searchObj={...searchObj,[key]:e.filters[key].constraints[0].value,[key+'_mode']:e.filters[key].constraints[0].matchMode}
            }
        }
        }
        if(type==0){ // FILTER Data and start with page 0
            searchObj={...searchObj,page:0,limit:row.value}
        }else if(type==1){ // Change page number
            searchObj={...searchObj,page:e.page,limit:row.value}
        }else if(type==2){ // Change sortOrder number
            let sort={}
            if(sortOrders){
                let currentSortOrder = sortOrders.value[e.sortField]==1?-1:1
                sort={...sortOrders.value,[e.sortField]:currentSortOrder}
            
            }else{
                sort={[e.sortField]:1}
            }
        
            sortOrders.value=sort;

            searchObj={...searchObj,page:e.page,limit:row.value,sortBy:e.sortField,sortDirection:sortOrders.value[e.sortField]}
        }
        if(e.rows!==row.value){
        row.value =e.rows
        searchObj={...searchObj,page:0,limit:e.rows}
        }
        
        await getBank(searchObj);
}     
       

        </script>
        
        <template>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Toast />
                        <Toolbar class="mb-4">
                            <template v-slot:start>
                                <div class="my-2">
                                    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                                    
                                </div>
                            </template>
        
                            <template v-slot:end>
                               
                                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                            </template>
                        </Toolbar>
        
                        <DataTable
                            ref="dt"
                            :value="banks"
                            v-model:selection="selectedBanks"
                            dataKey="id"
                            :totalRecords="totalRecords"
                            :totalPages="totalpages"
                            :loading="loading"
                            :rows="row"
                            @page="e=>getNewData(e,1)"
                            @filter="e=>getNewData(e,0)"
                            @sort="e=>getNewData(e,2)"
                            lazy 
                            paginator
                            :filters="filters"
                            responsiveLayout="scroll"
                            v-model:filters="filters"
                            :rowsPerPageOptions="[5, 10, 25,50]"
                            filterDisplay="menu"
                        >
        
                            <template #header>
                                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                    <h5 class="m-0">Manage Banks</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="bank_id"  dataType="numeric" header="Bank_id" :showAddButton="false"  filterField="bank_id"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Bank_id</span>
        {{slotProps.data.bank_id}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Bank_id" />
                
    </template>
</Column>
            
            

          
         
<Column field="bank_name"  header="Bank_name" :showAddButton="false"  filterField="bank_name"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Bank_name</span>
        {{slotProps.data.bank_name}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Bank_name" />
                
    </template>
</Column>
            
            

          
         
<Column field="bank_logo_url"  header="Bank_logo_URL" :showAddButton="false"  filterField="bank_logo_url"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Bank_logo_URL</span>
        {{slotProps.data.bank_logo_url}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Bank_logo_url" />
                
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editBank(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteBank(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/bank/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="bankDialog" :style="{ width: '450px' }" header="Bank Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="bank_id">Bank_id</label>
         <InputNumber id="bank_id" v-model="bank.bank_id"   />
    </div>
            

    <div class="field">
        <label htmlFor="bank_name">Bank_name</label>
         <InputText id="bank_name" type="text" v-model="bank.bank_name"  autoFocus  required :class="{ 'p-invalid': submitted && !bank.bank_name }" />
    </div>
            

    <div class="field">
        <label htmlFor="bank_logo_url">Bank_logo_URL</label>
         <InputText id="bank_logo_url" type="text" v-model="bank.bank_logo_url"  autoFocus  required :class="{ 'p-invalid': submitted && !bank.bank_logo_url }" />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveBank" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteBankDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="bank"
                                    >Are you sure you want to delete <b>{{ bank.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteBankDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delBank" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteBanksDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="bank">Are you sure you want to delete the selected banks?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteBanksDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedBanks" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            