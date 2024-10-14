
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { validate, validateForm } from '@/lib/validation';
import { useBankStore } from '@/stores/modules/Bank';
import { useBankaccountStore } from '@/stores/modules/Bankaccount';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';
    const { bankaccounts, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useBankaccountStore())
    const {  
    getBankaccount,
    updateBankaccountValue ,
    addBankaccount,
    updateBankaccount,
    deleteBankaccount
    } = useBankaccountStore()


const toast = useToast();
const { contextPath } = useLayout();
const bankaccountDialog = ref(false);
const deleteBankaccountDialog = ref(false);
const deleteBankaccountsDialog = ref(false);
const bankaccount = ref({});
const selectedBankaccounts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

const { banks} = storeToRefs(useBankStore())
const {  
getBankAll,getBankLogo
} = useBankStore()
                
// THE VALIDATION RULES
const validation=[
    {id:'bank_id',type:validate.int,required:true},
{id:'acc_no',type:validate.text,max:0,min:0,required:true},
{id:'acc_desc',type:validate.text,max:0,min:0,required:true},
{id:'acctype_id',type:validate.number,required:true},

]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getBankaccount()
             
    await getBankAll({});
          

});


const openNew = () => {
    let emptyBankaccount = {
        bank_id:null,
acctype_desc:'',
acc_no:'',
acc_desc:'',
doc_status_id:0,
bank_name:null,
acctype_id:null,
bankinfo_id:0,
bank_logo_url:''
    };
    bankaccount.value = emptyBankaccount;
    submitted.value = false;
    bankaccountDialog.value = true;
};

const hideDialog = () => {
    bankaccountDialog.value = false;
    submitted.value = false;
};

const saveBankaccount = async() => {
    submitted.value = true;
    const validationErrors=validateForm(bankaccount.value,validation)
    if (validationErrors.length==0) {
    
        if (bankaccount.value.id) {
            await updateBankaccount(bankaccount.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankaccount Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addBankaccount(bankaccount.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankaccount Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        bankaccountDialog.value = false;
        bankaccount.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editBankaccount = (editBankaccount) => {
    
    bankaccount.value = { ...editBankaccount };
    bankaccountDialog.value = true;
};

const confirmDeleteBankaccount = (editBankaccount) => {
    bankaccount.value = { ...editBankaccount };
    deleteBankaccountDialog.value = true;
};

const delBankaccount = async() => {
    await deleteBankaccount(bankaccount.value.id);
    deleteBankaccountDialog.value = false;
    if(error.value==undefined || error.value==null){
    bankaccount.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankaccount Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    bankaccount.value =  {...bankaccount.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < bankaccounts.value.length; i++) {
        if (bankaccounts.value[i].id === id) {
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
    deleteBankaccountsDialog.value = true;
};
const deleteSelectedBankaccounts = () => {
    bankaccounts.value = bankaccounts.value.filter((val) => !selectedBankaccounts.value.includes(val));
    deleteBankaccountsDialog.value = false;
    selectedBankaccounts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankaccounts Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        acctype_desc: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
doc_status_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
bank_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
bank_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
acc_no: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
acctype_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
bankinfo_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
acc_desc: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
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
        
        await getBankaccount(searchObj);
}     
       
   
    const acctype_ids =[
	{value:"1",name:"Saving"},
	{value:"2",name:"Current"}
]


                
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
                            :value="bankaccounts"
                            v-model:selection="selectedBankaccounts"
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
                                    <h5 class="m-0">Manage Bankaccounts</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
    <Column field="bank_logo_url"  header="Bank Logo" :showAddButton="false"  filterField="bank_logo_url"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
        <template #body="slotProps">
            <span class="p-column-title">Bank Logo</span>
           
            <img v-if="slotProps.data.bank_id!=undefined" :src="getBankLogo(slotProps.data.bank_id)" :alt="slotProps.data.bank_name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
        </template>
       
    </Column>         
    <Column field="bankinfo_id"  dataType="numeric" header="Bankinfo ID" :showAddButton="false"  filterField="bankinfo_id"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
        <template #body="slotProps">
            <span class="p-column-title">Bankinfo ID</span>
            {{slotProps.data.bankinfo_id}}
        </template>
        <template #filter="{ filterModel }">
        
             <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Bankinfo_id" />
                    
        </template>
    </Column>     
<Column field="acctype_desc"  header="Account Type" :showAddButton="false"  filterField="acctype_desc"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Account Type</span>
        {{slotProps.data.acctype_desc}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Acctype_desc" />
                
    </template>
</Column>
            
            

          
         
<Column field="doc_status_id"  dataType="numeric" header="Document status" :showAddButton="false"  filterField="doc_status_id"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Document status</span>
        {{slotProps.data.doc_status_id}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Doc_status_id" />
                
    </template>
</Column>
            
            

          
         

            
            

          
         
<Column field="bank_name"   header="Bank Name" :showAddButton="false"  filterField="bank_name"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Bank Name</span>
        {{slotProps.data.bank_name}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="banks"   optionLabel="bank_name" optionValue="bank_name" placeholder="Search by bank_name" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="acc_no"  header="Account No" :showAddButton="false"  filterField="acc_no"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Account No</span>
        {{slotProps.data.acc_no}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Acc_no" />
                
    </template>
</Column>
            
            

          
         

            
            

          
         

            
            

          
         
<Column field="acc_desc"  header="Account description" :showAddButton="false"  filterField="acc_desc"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Account description</span>
        {{slotProps.data.acc_desc}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Acc_desc" />
                
    </template>
</Column>
            
            

          
         

            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                  
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteBankaccount(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/bankaccount/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="bankaccountDialog" :style="{ width: '450px' }" header="Add Bank Account" :modal="true" class="p-fluid">
                            
                            <div class="field">
                                <label htmlFor="acctype_id">Account Type</label>
                                 <Dropdown   id="acctype_id" optionLabel="name" optionValue="value"  v-model="bankaccount.acctype_id" :options="acctype_ids"   />
                            </div>                       
    <div class="field">
        <label htmlFor="bank_id">Bank Name</label>
         <Dropdown   id="bank_id"  optionLabel="bank_name" optionValue="bank_id"  v-model="bankaccount.bank_id" :options="banks"   />
    </div>
            

   
            

    <div class="field">
        <label htmlFor="acc_no">Account No</label>
         <InputText id="acc_no" type="text" v-model="bankaccount.acc_no"  autoFocus  required :class="{ 'p-invalid': submitted && !bankaccount.acc_no }" />
    </div>
            

    <div class="field">
        <label htmlFor="acc_desc">Account description</label>
         <InputText id="acc_desc" type="text" v-model="bankaccount.acc_desc"  autoFocus  required :class="{ 'p-invalid': submitted && !bankaccount.acc_desc }" />
    </div>
            

   
            

   
            

   
            

  
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveBankaccount" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteBankaccountDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="bankaccount"
                                    >Are you sure you want to delete <b>{{ bankaccount.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteBankaccountDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delBankaccount" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteBankaccountsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="bankaccount">Are you sure you want to delete the selected bankaccounts?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteBankaccountsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedBankaccounts" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            