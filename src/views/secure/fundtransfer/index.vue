
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { fixDate } from '@/lib/functions';
import { validate, validateForm } from '@/lib/validation';
import { useBankaccountStore } from '@/stores/modules/Bankaccount';
import { useFundtransferStore } from '@/stores/modules/Fundtransfer';
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
    const { fundtransfers, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useFundtransferStore())
    const {  
    getFundtransfer,
    updateFundtransferValue ,
    addFundtransfer,
    updateFundtransfer,
    deleteFundtransfer
    } = useFundtransferStore()


const toast = useToast();
const { contextPath } = useLayout();
const fundtransferDialog = ref(false);
const deleteFundtransferDialog = ref(false);
const deleteFundtransfersDialog = ref(false);
const fundtransfer = ref({});
const selectedFundtransfers = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

const { bankaccounts} = storeToRefs(useBankaccountStore())
const {  
getBankaccountAll
} = useBankaccountStore()
                
// THE VALIDATION RULES
const validation=[
    {id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'bankid',type:validate.number,required:true},
{id:'reference',type:validate.text,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getFundtransfer()
             
    await getBankaccountAll({});
          

});
const selectedBank = computed(() => {
    return bankaccounts.value.find(bank => bank.bankinfo_id === fundtransfer.value.bankid);
});

const openNew = () => {
    let emptyFundtransfer = {
        amount:0,
        bankid:null,
        cardpin:"",
        reference:''
    };
    fundtransfer.value = emptyFundtransfer;
    submitted.value = false;
    fundtransferDialog.value = true;
};

const hideDialog = () => {
    fundtransferDialog.value = false;
    submitted.value = false;
};

const saveFundtransfer = async() => {
    submitted.value = true;
    const validationErrors=validateForm(fundtransfer.value,validation)
    if (validationErrors.length==0) {
    
        if (fundtransfer.value.id) {
            await updateFundtransfer(fundtransfer.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Fundtransfer Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addFundtransfer(fundtransfer.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Fundtransfer Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        fundtransferDialog.value = false;
        fundtransfer.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editFundtransfer = (editFundtransfer) => {
    editFundtransfer.trx_date =fixDate(editFundtransfer.trx_date)
    fundtransfer.value = { ...editFundtransfer };
    fundtransferDialog.value = true;
};

const confirmDeleteFundtransfer = (editFundtransfer) => {
    fundtransfer.value = { ...editFundtransfer };
    deleteFundtransferDialog.value = true;
};

const delFundtransfer = async() => {
    await deleteFundtransfer(fundtransfer.value.id);
    deleteFundtransferDialog.value = false;
    if(error.value==undefined || error.value==null){
    fundtransfer.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Fundtransfer Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    fundtransfer.value =  {...fundtransfer.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < fundtransfers.value.length; i++) {
        if (fundtransfers.value[i].id === id) {
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
    deleteFundtransfersDialog.value = true;
};
const deleteSelectedFundtransfers = () => {
    fundtransfers.value = fundtransfers.value.filter((val) => !selectedFundtransfers.value.includes(val));
    deleteFundtransfersDialog.value = false;
    selectedFundtransfers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Fundtransfers Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
sourceaccount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
transfer_in_reference_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
transfer_out_reference_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
servicecharges: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
gst: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
destinationbankaccount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
trx_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
sourceaccounttokenize: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
bankid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
cardpin: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
reference: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getFundtransfer(searchObj);
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
                            :value="fundtransfers"
                            v-model:selection="selectedFundtransfers"
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
                                    <h5 class="m-0">Manage Fundtransfers</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="amount"  dataType="numeric" header="Amount" :showAddButton="false"  filterField="amount"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Amount</span>
        {{slotProps.data.amount}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Amount" />
                
    </template>
</Column>
            
            

          
         
<Column field="sourceaccount"  header="Source Account" :showAddButton="false"  filterField="sourceaccount"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Source Account</span>
        {{slotProps.data.sourceaccount}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Sourceaccount" />
                
    </template>
</Column>
            
            

          
         
<Column field="transfer_in_reference_id"  header="Transfer in Ref" :showAddButton="false"  filterField="transfer_in_reference_id"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Transfer in Ref</span>
        {{slotProps.data.transfer_in_reference_id}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Transfer_in_reference_id" />
                
    </template>
</Column>
            
            

          
         
<Column field="transfer_out_reference_id"  header="Transfer Out Ref" :showAddButton="false"  filterField="transfer_out_reference_id"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Transfer Out Ref</span>
        {{slotProps.data.transfer_out_reference_id}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Transfer_out_reference_id" />
                
    </template>
</Column>
            
            

          
         
<Column field="servicecharges"  dataType="numeric" header="Service charges" :showAddButton="false"  filterField="servicecharges"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Service charges</span>
        {{slotProps.data.servicecharges}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Servicecharges" />
                
    </template>
</Column>
            
            

          
         
<Column field="gst"  dataType="numeric" header="GST" :showAddButton="false"  filterField="gst"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">GST</span>
        {{slotProps.data.gst}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Gst" />
                
    </template>
</Column>
            
            

          
         
<Column field="destinationbankaccount"  header="Destination Bank Account" :showAddButton="false"  filterField="destinationbankaccount"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Destination Bank Account</span>
        {{slotProps.data.destinationbankaccount}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Destinationbankaccount" />
                
    </template>
</Column>
            
            

          
         
<Column field="trx_date"  dataType="date" header="Trx Date" :showAddButton="false"  filterField="trx_date"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Trx Date</span>
        {{moment(new Date(slotProps.data.trx_date)).format('LL')}}
    </template>
    <template #filter="{ filterModel }">
    
<Calendar v-model="filterModel.value"  dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />

            
    </template>
</Column>
            
            

          
         
<Column field="sourceaccounttokenize"  header="Source Account Tokenize" :showAddButton="false"  filterField="sourceaccounttokenize"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Source Account Tokenize</span>
        {{slotProps.data.sourceaccounttokenize}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Sourceaccounttokenize" />
                
    </template>
</Column>
            
            

          
         
<Column field="bankid"   header="Bank ID" :showAddButton="false"  filterField="bankid"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Bank ID</span>
        {{slotProps.data.bankid}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="bankaccounts"   optionLabel="acc_no" optionValue="bankinfo_id" placeholder="Search by bankid" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="cardpin"  dataType="numeric" header="Card pin" :showAddButton="false"  filterField="cardpin"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Card pin</span>
        {{slotProps.data.cardpin}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Cardpin" />
                
    </template>
</Column>
            
            

          
         
<Column field="reference"  header="Reference" :showAddButton="false"  filterField="reference"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Reference</span>
        {{slotProps.data.reference}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Reference" />
                
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editFundtransfer(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteFundtransfer(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/fundtransfer/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="fundtransferDialog" :style="{ width: '450px' }" header="Fund Transfer Form" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" v-model="fundtransfer.amount"   mode="currency" currency="MYR"  />
    </div>
            

    <div class="field">
        <label htmlFor="bankid">Destination Bank Account</label>
        
         <Dropdown v-model="fundtransfer.bankid" :options="bankaccounts" optionValue="bankinfo_id" optionLabel="acc_no" :filter="true" placeholder="Select Bank Account" :showClear="true">
            <template #value="slotProps">
                <div class="country-item country-item-value" v-if="selectedBank">
                    <img width="100" :src="selectedBank?.bank_logo_url"  class="img" />
                    <div>{{selectedBank?.acctype_desc}} -{{selectedBank?.acc_no}}</div>
                </div>
                <span v-else>
                    {{slotProps.placeholder}}
                </span>
            </template>
            <template #option="slotProps">
                <div class="country-item">
                    <img width="100" :src="slotProps.option.bank_logo_url" class="img"  />
                    <div>{{slotProps.option.acctype_desc}} -{{slotProps.option.acc_no}}</div>
                </div>
            </template>
        </Dropdown>
        
    </div>
            

    
            

    <div class="field">
        <label htmlFor="reference">Reference</label>
         <InputText id="reference" type="text" v-model="fundtransfer.reference"  autoFocus  required :class="{ 'p-invalid': submitted && !fundtransfer.reference }" />
    </div>
    <div class="field">
        <label htmlFor="cardpin">Card pin</label>
         <Password id="cardpin" aria-placeholder="Card PIN" v-model="fundtransfer.cardpin" :toggleMask="true"    />
    </div>

   
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveFundtransfer" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteFundtransferDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="fundtransfer"
                                    >Are you sure you want to delete <b>{{ fundtransfer.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteFundtransferDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delFundtransfer" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteFundtransfersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="fundtransfer">Are you sure you want to delete the selected fundtransfers?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteFundtransfersDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedFundtransfers" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            