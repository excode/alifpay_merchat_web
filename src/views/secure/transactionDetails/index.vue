
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { validate, validateForm } from '@/lib/validation';
import { useBusinessCategoryStore } from '@/stores/modules/BusinessCategory';
import { useBusinessTypeStore } from '@/stores/modules/BusinessType';
import { useLoginStore } from '@/stores/modules/Login';
import { useTransactionDetailsStore } from '@/stores/modules/TransactionDetails';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';
    const { transactionDetailss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useTransactionDetailsStore())
    const {  
    getTransactionDetails,
    updateTransactionDetailsValue ,
    addTransactionDetails,
    updateTransactionDetails,
    deleteTransactionDetails
    } = useTransactionDetailsStore()

const { userInfo} = storeToRefs(useLoginStore())
const toast = useToast();
const { contextPath } = useLayout();
const transactionDetailsDialog = ref(false);
const deleteTransactionDetailsDialog = ref(false);
const deleteTransactionDetailssDialog = ref(false);
const transactionDetails = ref({});
const selectedTransactionDetailss = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);
const {  
    getUserInfo,
  } = useLoginStore()
const { businessTypes} = storeToRefs(useBusinessTypeStore())
const {  
getBusinessTypeAll
} = useBusinessTypeStore()
                
const { businessCategorys} = storeToRefs(useBusinessCategoryStore())
const {  
getBusinessCategoryAll
} = useBusinessCategoryStore()
                
// THE VALIDATION RULES
const validation=[
    {id:'averageSingleTransaction',type:validate.number,max:0,min:0,required:true},
{id:'expectedMonthlyTransaction',type:validate.number,max:0,min:0,required:true},
{id:'businessType',type:validate.text,required:true},
{id:'businessCategory',type:validate.text,required:true},
{id:'approved',type:validate.boolean,required:false}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getTransactionDetails()    
    await getBusinessTypeAll({});
    await getBusinessCategoryAll({});
    getUserInfo();     

});


const openNew = () => {
    let emptyTransactionDetails = {
        averageSingleTransaction:0,
expectedMonthlyTransaction:0,
businessType:null,
businessCategory:null,
approved:null
    };
    transactionDetails.value = emptyTransactionDetails;
    submitted.value = false;
    transactionDetailsDialog.value = true;
};

const hideDialog = () => {
    transactionDetailsDialog.value = false;
    submitted.value = false;
};

const saveTransactionDetails = async() => {
    submitted.value = true;
    const validationErrors=validateForm(transactionDetails.value,validation)
    if (validationErrors.length==0) {
    
        if (transactionDetails.value.id) {
            await updateTransactionDetails(transactionDetails.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'TransactionDetails Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addTransactionDetails(transactionDetails.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'TransactionDetails Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        transactionDetailsDialog.value = false;
        transactionDetails.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editTransactionDetails = (editTransactionDetails) => {
    
    transactionDetails.value = { ...editTransactionDetails };
    transactionDetailsDialog.value = true;
};

const confirmDeleteTransactionDetails = (editTransactionDetails) => {
    transactionDetails.value = { ...editTransactionDetails };
    deleteTransactionDetailsDialog.value = true;
};

const delTransactionDetails = async() => {
    await deleteTransactionDetails(transactionDetails.value.id);
    deleteTransactionDetailsDialog.value = false;
    if(error.value==undefined || error.value==null){
    transactionDetails.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'TransactionDetails Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    transactionDetails.value =  {...transactionDetails.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < transactionDetailss.value.length; i++) {
        if (transactionDetailss.value[i].id === id) {
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
    deleteTransactionDetailssDialog.value = true;
};
const deleteSelectedTransactionDetailss = () => {
    transactionDetailss.value = transactionDetailss.value.filter((val) => !selectedTransactionDetailss.value.includes(val));
    deleteTransactionDetailssDialog.value = false;
    selectedTransactionDetailss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'TransactionDetailss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        averageSingleTransaction: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        expectedMonthlyTransaction: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        businessType: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        businessCategory: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        approved: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
        
        await getTransactionDetails(searchObj);
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
                            :value="transactionDetailss"
                            v-model:selection="selectedTransactionDetailss"
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
                                    <h5 class="m-0">Manage Transaction Details</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="averageSingleTransaction"  dataType="numeric" header="Average Single Transaction" :showAddButton="false"  filterField="averageSingleTransaction"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Average Single Transaction</span>
        {{slotProps.data.averageSingleTransaction}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by AverageSingleTransaction" />
                
    </template>
</Column>
            
            

          
         
<Column field="expectedMonthlyTransaction"  dataType="numeric" header="Expected Monthly Transaction" :showAddButton="false"  filterField="expectedMonthlyTransaction"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Expected Monthly Transaction</span>
        {{slotProps.data.expectedMonthlyTransaction}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by ExpectedMonthlyTransaction" />
                
    </template>
</Column>
            
            

          
         
<Column field="businessType"   header="Business Type" :showAddButton="false"  filterField="businessType"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Business Type</span>
        {{slotProps.data.businessType}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="businessTypes"   optionLabel="typeName" optionValue="typeName" placeholder="Search by businessType" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="businessCategory"   header="Business Category" :showAddButton="false"  filterField="businessCategory"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Business Category</span>
        {{slotProps.data.businessCategory}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="businessCategorys"   optionLabel="categoryName" optionValue="categoryName" placeholder="Search by businessCategory" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="approved"  dataType="boolean"   header="Approved" :showAddButton="false"  filterField="approved"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Approved</span>
        {{slotProps.data.approved}}
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
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editTransactionDetails(slotProps.data)" />
                                   
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/transactionDetails/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="transactionDetailsDialog" :style="{ width: '450px' }" header="Transaction Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="averageSingleTransaction">Average Single Transaction</label>
         <InputNumber id="averageSingleTransaction" v-model="transactionDetails.averageSingleTransaction"   mode="currency" currency="MYR"  />
    </div>
            

    <div class="field">
        <label htmlFor="expectedMonthlyTransaction">Expected Monthly Transaction</label>
         <InputNumber id="expectedMonthlyTransaction" v-model="transactionDetails.expectedMonthlyTransaction"   mode="currency" currency="MYR"  />
    </div>
            

    <div class="field">
        <label htmlFor="businessType">Business Type</label>
         <Dropdown   id="businessType"  optionLabel="typeName" optionValue="typeName"  v-model="transactionDetails.businessType" :options="businessTypes"   />
    </div>
            

    <div class="field">
        <label htmlFor="businessCategory">Business Category</label>
         <Dropdown   id="businessCategory"  optionLabel="categoryName" optionValue="categoryName"  v-model="transactionDetails.businessCategory" :options="businessCategorys"   />
    </div>
            

    <div class="field" v-if="userInfo.userType<2">
        <label htmlFor="approved">Approved</label>
         <TriStateCheckbox name="approved" id="approved" v-model="transactionDetails.approved"   />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveTransactionDetails" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteTransactionDetailsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="transactionDetails"
                                    >Are you sure you want to delete <b>{{ transactionDetails.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteTransactionDetailsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delTransactionDetails" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteTransactionDetailssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="transactionDetails">Are you sure you want to delete the selected transactionDetailss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteTransactionDetailssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedTransactionDetailss" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            