
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useTransactionsStore } from '@/stores/modules/Transactions';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';

import { validate, validateForm } from '@/lib/validation';
    const { transactionss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useTransactionsStore())
    const {  
    getTransactions,
    updateTransactionsValue ,
    addTransactions,
    updateTransactions,
    deleteTransactions
    } = useTransactionsStore()


const toast = useToast();
const { contextPath } = useLayout();
const transactionsDialog = ref(false);
const deleteTransactionsDialog = ref(false);
const deleteTransactionssDialog = ref(false);
const transactions = ref({});
const selectedTransactionss = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

// THE VALIDATION RULES
const validation=[
    {id:'merchantID',type:validate.text,max:0,min:0,required:true},
{id:'storesId',type:validate.text,max:0,min:0,required:true},
{id:'sender',type:validate.text,max:0,min:0,required:true},
{id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'sharingValue',type:validate.number,max:0,min:0,required:true},
{id:'refNumber',type:validate.text,max:0,min:0,required:true},
{id:'sharingValueDistributed',type:validate.boolean,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getTransactions()
    

});


const openNew = () => {
    let emptyTransactions = {
        merchantID:'',
storesId:'',
sender:'',
amount:0,
sharingValue:0,
refNumber:'',
sharingValueDistributed:null
    };
    transactions.value = emptyTransactions;
    submitted.value = false;
    transactionsDialog.value = true;
};

const hideDialog = () => {
    transactionsDialog.value = false;
    submitted.value = false;
};

const saveTransactions = async() => {
    submitted.value = true;
    const validationErrors=validateForm(transactions.value,validation)
    if (validationErrors.length==0) {
    
        if (transactions.value.id) {
            await updateTransactions(transactions.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Transactions Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addTransactions(transactions.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Transactions Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        transactionsDialog.value = false;
        transactions.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editTransactions = (editTransactions) => {
    
    transactions.value = { ...editTransactions };
    transactionsDialog.value = true;
};

const confirmDeleteTransactions = (editTransactions) => {
    transactions.value = { ...editTransactions };
    deleteTransactionsDialog.value = true;
};

const delTransactions = async() => {
    await deleteTransactions(transactions.value.id);
    deleteTransactionsDialog.value = false;
    if(error.value==undefined || error.value==null){
    transactions.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Transactions Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    transactions.value =  {...transactions.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < transactionss.value.length; i++) {
        if (transactionss.value[i].id === id) {
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
    deleteTransactionssDialog.value = true;
};
const deleteSelectedTransactionss = () => {
    transactionss.value = transactionss.value.filter((val) => !selectedTransactionss.value.includes(val));
    deleteTransactionssDialog.value = false;
    selectedTransactionss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Transactionss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        merchantID: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        storesId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        sender: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        sharingValue: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        refNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        sharingValueDistributed: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        dispatched: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
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
        
        await getTransactions(searchObj);
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
                                   
                                    
                                </div>
                            </template>
        
                            <template v-slot:end>
                               
                                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                            </template>
                        </Toolbar>
        
                        <DataTable
                            ref="dt"
                            :value="transactionss"
                            v-model:selection="selectedTransactionss"
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
                                    <h5 class="m-0">Transactions History</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="merchantID"  header="Merchant ID" :showAddButton="false"  filterField="merchantID"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Merchant ID</span>
        {{slotProps.data.merchantID}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by MerchantID" />
                
    </template>
</Column>
            
            

          
         
<Column field="storesId"  header="Stores Id" :showAddButton="false"  filterField="storesId"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Stores Id</span>
        {{slotProps.data.storesId?.businessName}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by StoresId" />
                
    </template>
</Column>
            
            

          
         
<Column field="sender"  header="Sender" :showAddButton="false"  filterField="sender"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Sender</span>
        {{slotProps.data.sender}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Sender" />
                
    </template>
</Column>
            
            

          
         
<Column field="amount"  dataType="numeric" header="Amount" :showAddButton="false"  filterField="amount"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Amount</span>
        {{slotProps.data.amount}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Amount" />
                
    </template>
</Column>
            
            

          
         
<Column field="sharingValue"  dataType="numeric" header="Sharing Value" :showAddButton="false"  filterField="sharingValue"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Sharing Value</span>
        {{slotProps.data.sharingValue}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by SharingValue" />
                
    </template>
</Column>
            
            

          
         
<Column field="refNumber"  header="Reference" :showAddButton="false"  filterField="refNumber"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Reference</span>
        {{slotProps.data.refNumber}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by RefNumber" />
                
    </template>
</Column>
            
            
<Column field="dispatched"  dataType="boolean"   header="Dispatched" :showAddButton="false"  filterField="dispatched"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Dispatched</span>
        {{slotProps.data.dispatched}}
    </template>
    <template #filter="{ filterModel }">
    
        <TriStateCheckbox v-model="filterModel.value"   />
            
    </template>
</Column>
          
         
<Column field="sharingValueDistributed"  dataType="boolean"   header="Sharing Value Distributed" :showAddButton="false"  filterField="sharingValueDistributed"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Sharing Value Distributed</span>
        {{slotProps.data.sharingValueDistributed}}
    </template>
    <template #filter="{ filterModel }">
    
        <TriStateCheckbox v-model="filterModel.value"   />
            
    </template>
</Column>
            
            

          
         
<Column field="createAt"  dataType="date" header="Created At" :showAddButton="false"  filterField="createAt"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Created At</span>
        {{slotProps.data.createAt}}
    </template>
    <template #filter="{ filterModel }">
    
<Calendar v-model="filterModel.value"  showTime hourFormat="12" />

            
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editTransactions(slotProps.data)" />
                                  
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/transactions/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="transactionsDialog" :style="{ width: '450px' }" header="Transactions Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="merchantID">Merchant ID</label>
         <InputText id="merchantID" type="text" v-model="transactions.merchantID"  autoFocus  required :class="{ 'p-invalid': submitted && !transactions.merchantID }" />
    </div>
            


            

    <div class="field">
        <label htmlFor="sender">Sender</label>
         <InputText id="sender" type="text" v-model="transactions.sender"  autoFocus  required :class="{ 'p-invalid': submitted && !transactions.sender }" />
    </div>
            

    <div class="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" v-model="transactions.amount"   mode="currency" currency="USD"  />
    </div>
            

    <div class="field">
        <label htmlFor="sharingValue">Sharing Value</label>
         <InputNumber id="sharingValue" v-model="transactions.sharingValue"   mode="currency" currency="USD"  />
    </div>
            

    <div class="field">
        <label htmlFor="refNumber">Reference</label>
         <InputText id="refNumber" type="text" v-model="transactions.refNumber"  autoFocus  required :class="{ 'p-invalid': submitted && !transactions.refNumber }" />
    </div>
            

    <div class="field">
        <label htmlFor="sharingValueDistributed">Sharing Value Distributed</label>
         <TriStateCheckbox name="sharingValueDistributed" id="sharingValueDistributed" v-model="transactions.sharingValueDistributed"   />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveTransactions" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteTransactionsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="transactions"
                                    >Are you sure you want to delete <b>{{ transactions.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteTransactionsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delTransactions" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteTransactionssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="transactions">Are you sure you want to delete the selected transactionss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteTransactionssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedTransactionss" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            